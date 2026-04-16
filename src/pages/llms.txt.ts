// src/pages/llms.txt.ts
// Generates /llms.txt — AI discovery file (llmstxt.org standard)
// Read by Perplexity, ChatGPT Search, Claude web, Bing Copilot
// Concise overview: key pages, services, locations, recent blog posts

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { serviceTypes } from '../data/serviceTypes';
import { serviceAreas } from '../data/serviceAreas';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const base = `https://${BRAND.domain}`;

  // 8 most recent blog posts
  const allPosts = await getCollection('blog');
  const recentPosts = allPosts
    .sort((a, b) =>
      new Date(b.data.publishDate ?? 0).getTime() -
      new Date(a.data.publishDate ?? 0).getTime()
    )
    .slice(0, 8);

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push(`# ${BRAND.brandName}`);
  lines.push(`> ${BRAND.tagline} — ${BRAND.serviceAreaLabel}`);
  lines.push('');

  // ── About ────────────────────────────────────────────────────────────────
  lines.push(
    `${BRAND.brandName} provides professional plumbing services across ${BRAND.primaryLocation} and the surrounding area. ` +
    `Available 24/7 for emergency callouts. Call ${BRAND.phoneFormatted} for immediate assistance.`
  );
  lines.push('');

  // ── Core pages ───────────────────────────────────────────────────────────
  lines.push('## Core Pages');
  lines.push(`- [Home](${base}/): Overview of all services and coverage area`);
  lines.push(`- [Services](${base}/services/): Full list of plumbing services`);
  lines.push(`- [Locations](${base}/locations/): All towns and areas covered`);
  lines.push(`- [Blog](${base}/plumbing-tips/): Plumbing guides, tips, and local advice`);
  lines.push(`- [Contact](${base}/contact/): Phone, email, and enquiry form`);
  lines.push(`- [FAQ](${base}/faq/): Common questions about plumbing costs and services`);
  lines.push('');

  // ── Services ─────────────────────────────────────────────────────────────
  lines.push('## Services');
  for (const svc of serviceTypes) {
    lines.push(`- [${svc.name}](${base}/services/${svc.slug}/): ${svc.shortDescription}`);
  }
  lines.push('');

  // ── Coverage area ────────────────────────────────────────────────────────
  lines.push('## Coverage Area');
  for (const area of serviceAreas) {
    lines.push(`- [${area.name}](${base}/locations/${area.slug}/)`);
  }
  lines.push('');

  // ── Recent blog posts ─────────────────────────────────────────────────────
  if (recentPosts.length > 0) {
    lines.push('## Recent Blog Posts');
    for (const post of recentPosts) {
      const date = post.data.publishDate ? ` (${post.data.publishDate.slice(0, 10)})` : '';
      const excerpt = post.data.description?.slice(0, 120).trimEnd() ?? '';
      lines.push(`- [${post.data.title}](${base}/plumbing-tips/${post.slug}/)${date}: ${excerpt}…`);
    }
    lines.push('');
  }

  // ── Contact ───────────────────────────────────────────────────────────────
  lines.push('## Contact');
  lines.push(`- Phone: ${BRAND.phoneFormatted}`);
  lines.push(`- Email: ${BRAND.email}`);
  lines.push(`- Enquiry form: ${base}/contact/`);
  lines.push('');

  // ── Pointer to full version ───────────────────────────────────────────────
  lines.push('## Full Reference');
  lines.push(`- [llms-full.txt](${base}/llms-full.txt): Full page summaries and all blog posts`);

  return new Response(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
