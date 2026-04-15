// src/pages/llms-full.txt.ts
// Generates /llms-full.txt — extended AI reference file
// Full service descriptions, location summaries, all blog excerpts
// Intended for AI systems that want deep content context without crawling every page

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { SERVICES } from '../data/services';
import { INDEXED_LOCATIONS } from '../data/locations';
import { BLOG_POSTS } from '../data/blog';

export const prerender = true;

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;

  const sortedPosts = [...BLOG_POSTS].sort((a, b) =>
    new Date(b.updatedDate ?? b.publishDate ?? 0).getTime() -
    new Date(a.updatedDate ?? a.publishDate ?? 0).getTime()
  );

  const lines: string[] = [];

  // ── Header ────────────────────────────────────────────────────────────────
  lines.push(`# ${BRAND.brandName} — Full Content Reference`);
  lines.push(`> ${BRAND.tagline} — ${BRAND.serviceAreaLabel}`);
  lines.push('');
  lines.push(`For a concise overview see [llms.txt](${base}/llms.txt)`);
  lines.push('');

  // ── Business details ──────────────────────────────────────────────────────
  lines.push('## Business');
  lines.push(`- **Name:** ${BRAND.brandName}`);
  lines.push(`- **Location:** ${BRAND.primaryLocation}`);
  lines.push(`- **Coverage:** ${BRAND.serviceAreaLabel}`);
  lines.push(`- **Phone:** ${BRAND.phoneFormatted}`);
  lines.push(`- **Email:** ${BRAND.email}`);
  lines.push(`- **Website:** ${base}/`);
  if (BRAND.emergencyAvailable) {
    lines.push(`- **Emergency service:** Available 24/7`);
  }
  lines.push('');

  // ── Core pages ────────────────────────────────────────────────────────────
  lines.push('## Core Pages');
  lines.push('');
  lines.push(`### Home (${base}/)`);
  lines.push(`${BRAND.brandName} offers professional drain unblocking, CCTV surveys, drain jetting and emergency plumbing services across ${BRAND.primaryLocation} and ${BRAND.serviceAreaLabel}. Fast response, competitive pricing, and 24/7 emergency availability.`);
  lines.push('');
  lines.push(`### Services (${base}/services/)`);
  lines.push(`Hub page listing all ${SERVICES.length} services offered. Each service has its own dedicated page with full descriptions, pricing guidance, and local area context.`);
  lines.push('');
  lines.push(`### Locations (${base}/locations/)`);
  lines.push(`Coverage hub for ${INDEXED_LOCATIONS.length} service areas across ${BRAND.primaryLocation} and surrounding towns. Each location page lists services available in that area with local context.`);
  lines.push('');
  lines.push(`### Contact (${base}/contact/)`);
  lines.push(`Contact form, phone number (${BRAND.phoneFormatted}), email, and address. Emergency callout requests handled immediately.`);
  lines.push('');
  lines.push(`### FAQ (${base}/frequently-asked-questions/)`);
  lines.push(`Common questions covering costs, response times, what to do in a drainage emergency, and how CCTV surveys work.`);
  lines.push('');

  // ── Services (full descriptions) ──────────────────────────────────────────
  lines.push('## Services');
  lines.push('');
  for (const svc of SERVICES) {
    lines.push(`### ${svc.name} (${base}/services/${svc.slug}/)`);
    lines.push(svc.description);
    if (svc.subServices && svc.subServices.length > 0) {
      lines.push('');
      lines.push('**Sub-services:**');
      for (const sub of svc.subServices) {
        lines.push(`- [${sub.name}](${base}/services/${svc.slug}/${sub.slug}/): ${sub.description}`);
      }
    }
    lines.push('');
  }

  // ── Locations ─────────────────────────────────────────────────────────────
  lines.push('## Coverage Area');
  lines.push('');
  for (const loc of INDEXED_LOCATIONS) {
    lines.push(`### ${loc.name} (${base}/locations/${loc.slug}/)`);
    if (loc.description) lines.push(loc.description);
    if (loc.responseTime) lines.push(`Response time: ${loc.responseTime}`);
    if (loc.countyOrRegion) lines.push(`County/Region: ${loc.countyOrRegion}`);
    lines.push('');
  }

  // ── Blog posts (all, with full excerpt) ───────────────────────────────────
  lines.push('## Blog Posts');
  lines.push('');
  for (const post of sortedPosts) {
    const date = post.publishDate?.slice(0, 10) ?? '';
    const updated = post.updatedDate ? ` (updated ${post.updatedDate.slice(0, 10)})` : '';
    lines.push(`### ${post.title} (${base}/blog/${post.slug}/)`);
    lines.push(`**Published:** ${date}${updated} | **Category:** ${post.category}`);
    lines.push('');
    lines.push(post.excerpt);
    lines.push('');
  }

  return new Response(lines.join('\n') + '\n', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
