#!/usr/bin/env node
// Post-build: convert Astro-emitted render-blocking <link rel="stylesheet" href="/_astro/*.css">
// into non-blocking preload + onload swap, with a <noscript> fallback.
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve(process.cwd(), 'dist');
const LINK_RE = /<link rel="stylesheet" href="(\/_astro\/[^"]+\.css)"\s*\/?>/g;

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(p)));
    else if (entry.isFile() && p.endsWith('.html')) out.push(p);
  }
  return out;
}

function transform(html) {
  let changed = false;
  const out = html.replace(LINK_RE, (_m, href) => {
    changed = true;
    return (
      `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'">` +
      `<noscript><link rel="stylesheet" href="${href}"></noscript>`
    );
  });
  return { out, changed };
}

const files = await walk(DIST);
let n = 0;
for (const f of files) {
  const html = await fs.readFile(f, 'utf8');
  const { out, changed } = transform(html);
  if (changed) {
    await fs.writeFile(f, out);
    n++;
  }
}
console.log(`[non-blocking-css] updated ${n} HTML files`);
