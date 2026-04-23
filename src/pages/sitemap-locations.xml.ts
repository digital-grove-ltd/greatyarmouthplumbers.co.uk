// src/pages/sitemap-locations.xml.ts
// All /locations/ pages — one hub page per service area
// Dates staggered from build time (location pages have no individual publish dates)

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { serviceAreas } from '../data/serviceAreas';

export const prerender = true;

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;
  const urls: string[] = [];

  for (const [i, area] of serviceAreas.entries()) {
    const isPrimary = area.priority === 'primary';
    urls.push(`  <url>
    <loc>${base}/locations/${area.slug}/</loc>
    <lastmod>${daysAgo(isPrimary ? 1 : 2 + i)}</lastmod>
    <priority>${isPrimary ? '0.9' : '0.8'}</priority>
  </url>`);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
