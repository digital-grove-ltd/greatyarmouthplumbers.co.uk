// src/pages/sitemap-services.xml.ts
// All /services/ pages — top-level services and sub-service pages
// Dates staggered from build time (service pages have no individual publish dates)

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { SERVICES } from '../data/services';

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

  for (const [i, service] of SERVICES.entries()) {
    // Top-level service page
    urls.push(`  <url>
    <loc>${base}/services/${service.slug}/</loc>
    <lastmod>${daysAgo(1 + i)}</lastmod>
    <priority>0.9</priority>
  </url>`);

    // Sub-service pages
    if (service.subServices) {
      for (const [j, sub] of service.subServices.entries()) {
        urls.push(`  <url>
    <loc>${base}/services/${service.slug}/${sub.slug}/</loc>
    <lastmod>${daysAgo(3 + i + j)}</lastmod>
    <priority>0.8</priority>
  </url>`);
      }
    }
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
