// src/pages/llms.txt.ts
// Generates /llms.txt — AI discovery file (llmstxt.org standard)
// Read by Perplexity, ChatGPT Search, Claude web, Bing Copilot
// Concise overview: key pages, services, locations, recent blog posts

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { SERVICES } from '../data/services';
import { INDEXED_LOCATIONS } from '../data/locations';
import { BLOG_POSTS } from '../data/blog';

export const prerender = true;

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;

  // 8 most recent posts
  const recentPosts = [...BLOG_POSTS]
    .sort((a, b) =>
      new Date(b.updatedDate ?? b.publishDate ?? 0).getTime() -
      new Date(a.updatedDate ?? a.publishDate ?? 0).getTime()
    )
    .slice(0, 8);

  const lines: string[] = [];

  // ── Header ──────────────────────────────────────────────────────────────
  lines.push(`# ${BRAND.brandName}`);
  lines.push(`> ${BRAND.tagline} — ${BRAND.serviceAreaLabel}`);
  lines.push('');

  // ── About ────────────────────────────────────────────────────────────────
  lines.push(
    `${BRAND.brandName} provides professional drain and plumbing services across ${BRAND.primaryLocation} and the surrounding area. ` +
    `Available 24/7 for emergency callouts. Call ${BRAND.phoneFormatted} for immediate assistance.`
  );
  lines.push('');

  // ── Core pages ───────────────────────────────────────────────────────────
  lines.push('## Core Pages');
  lines.push(`- [Home](${base}/): Overview of all services and coverage area`);
  lines.push(`- [Services](${base}/services/): Full list of drain and plumbing services`);
  lines.push(`- [Locations](${base}/locations/): All towns and areas covered`);
  lines.push(`- [Blog](${base}/blog/): Drain guides, tips, and local advice`);
  lines.push(`- [Contact](${base}/contact/): Phone, email, and enquiry form`);
  lines.push(`- [FAQ](${base}/frequently-asked-questions/): Common questions about blocked drains and costs`);
  lines.push('');

  // ── Services ─────────────────────────────────────────────────────────────
  lines.push('## Services');
  for (const svc of SERVICES) {
    lines.push(`- [${svc.name}](${base}/services/${svc.slug}/): ${svc.shortLabel}`);
  }
  lines.push('');

  // ── Coverage area ────────────────────────────────────────────────────────
  lines.push('## Coverage Area');
  for (const loc of INDEXED_LOCATIONS) {
    lines.push(`- [${loc.name}](${base}/locations/${loc.slug}/)`);
  }
  lines.push('');

  // ── Recent blog posts ─────────────────────────────────────────────────────
  if (recentPosts.length > 0) {
    lines.push('## Recent Blog Posts');
    for (const post of recentPosts) {
      const date = post.publishDate ? ` (${post.publishDate.slice(0, 10)})` : '';
      lines.push(`- [${post.title}](${base}/blog/${post.slug}/)${date}: ${post.excerpt.slice(0, 120).trimEnd()}…`);
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
