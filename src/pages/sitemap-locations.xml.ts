// src/pages/sitemap-locations.xml.ts
// All indexed /locations/ pages — city hub pages and city+service combinations
// Uses INDEXED_LOCATIONS which already filters out noindex locations
// Dates staggered from build time (location pages have no individual publish dates)

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { INDEXED_LOCATIONS, PRIMARY_LOCATION } from '../data/locations';
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

  for (const [i, location] of INDEXED_LOCATIONS.entries()) {
    const isPrimary = location.slug === PRIMARY_LOCATION.slug;

    // City hub page — primary city gets highest priority and freshest date
    urls.push(`  <url>
    <loc>${base}/locations/${location.slug}/</loc>
    <lastmod>${daysAgo(isPrimary ? 1 : 2 + i)}</lastmod>
    <priority>${isPrimary ? '0.9' : '0.8'}</priority>
  </url>`);

    // City + service combination pages
    for (const [j, service] of SERVICES.entries()) {
      urls.push(`  <url>
    <loc>${base}/locations/${location.slug}/${service.slug}/</loc>
    <lastmod>${daysAgo(3 + i + j * 2)}</lastmod>
    <priority>${isPrimary ? '0.8' : '0.7'}</priority>
  </url>`);
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
