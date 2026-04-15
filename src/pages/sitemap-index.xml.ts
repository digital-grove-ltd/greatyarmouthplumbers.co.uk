// src/pages/sitemap-index.xml.ts
// Replaces the single sitemap.xml — this is now the entry point declared in robots.txt
// Four child sitemaps split by content type for better crawl prioritisation

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';

export const prerender = true;

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;
  const now  = new Date().toISOString();

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${base}/sitemap-pages.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-services.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-locations.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${base}/sitemap-blog.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
