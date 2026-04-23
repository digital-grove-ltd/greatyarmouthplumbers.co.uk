// src/pages/llms-full.txt.ts
// Generates /llms-full.txt — extended AI reference file
// Full service descriptions, location summaries, all blog excerpts
// Intended for AI systems that want deep content context without crawling every page

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { serviceTypes } from '../data/serviceTypes';
import { serviceAreas } from '../data/serviceAreas';
import { getCollection } from 'astro:content';

export const prerender = true;

export const GET: APIRoute = async () => {
  const base = `https://${BRAND.domain}`;

  const allPosts = await getCollection('blog');
  const sortedPosts = allPosts.sort((a, b) =>
    new Date(b.data.publishDate ?? 0).getTime() -
    new Date(a.data.publishDate ?? 0).getTime()
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
  lines.push(`${BRAND.brandName} offers professional plumbing services across ${BRAND.primaryLocation} and ${BRAND.serviceAreaLabel}. Fast response, competitive pricing, and 24/7 emergency availability.`);
  lines.push('');
  lines.push(`### Services (${base}/services/)`);
  lines.push(`Hub page listing all ${serviceTypes.length} services offered. Each service has its own dedicated page with full descriptions and pricing guidance.`);
  lines.push('');
  lines.push(`### Locations (${base}/locations/)`);
  lines.push(`Coverage hub for ${serviceAreas.length} service areas across ${BRAND.primaryLocation} and surrounding towns.`);
  lines.push('');
  lines.push(`### Contact (${base}/contact/)`);
  lines.push(`Contact form, phone number (${BRAND.phoneFormatted}), email, and address. Emergency callout requests handled immediately.`);
  lines.push('');
  lines.push(`### FAQ (${base}/faq/)`);
  lines.push(`Common questions covering costs, response times, and what to expect from our plumbing services.`);
  lines.push('');

  // ── Services (full descriptions) ──────────────────────────────────────────
  lines.push('## Services');
  lines.push('');
  for (const svc of serviceTypes) {
    lines.push(`### ${svc.name} (${base}/services/${svc.slug}/)`);
    lines.push(svc.description);
    if (svc.priceRange) {
      lines.push(`Price range: £${svc.priceRange.min}–£${svc.priceRange.max}`);
    }
    lines.push('');
  }

  // ── Locations ─────────────────────────────────────────────────────────────
  lines.push('## Coverage Area');
  lines.push('');
  for (const area of serviceAreas) {
    lines.push(`### ${area.name} (${base}/locations/${area.slug}/)`);
    if (area.description) lines.push(area.description);
    if (area.responseTime) lines.push(`Response time: ${area.responseTime}`);
    if (area.county) lines.push(`County: ${area.county}`);
    lines.push('');
  }

  // ── Blog posts (all, with full excerpt) ───────────────────────────────────
  lines.push('## Blog Posts');
  lines.push('');
  for (const post of sortedPosts) {
    const date = post.data.publishDate?.slice(0, 10) ?? '';
    lines.push(`### ${post.data.title} (${base}/plumbing-tips/${post.slug}/)`);
    lines.push(`**Published:** ${date} | **Category:** ${post.data.category}`);
    lines.push('');
    if (post.data.description) lines.push(post.data.description);
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
