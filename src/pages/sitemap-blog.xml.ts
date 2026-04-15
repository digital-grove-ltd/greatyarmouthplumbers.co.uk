// src/pages/sitemap-blog.xml.ts
// Blog index + all blog posts
// Uses real publish/updated dates from blog post data — the only sitemap
// with accurate per-URL lastmod rather than staggered build-time dates

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { BLOG_POSTS } from '../data/blog';

export const prerender = true;

function toDateString(date: string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;

  // Sort newest first
  const sorted = [...BLOG_POSTS].sort((a, b) =>
    new Date(b.updatedDate ?? b.publishDate ?? 0).getTime() -
    new Date(a.updatedDate ?? a.publishDate ?? 0).getTime()
  );

  // Blog index lastmod = most recent post's date
  const newestDate = sorted[0]
    ? toDateString(sorted[0].updatedDate ?? sorted[0].publishDate)
    : new Date().toISOString().split('T')[0];

  const urls: string[] = [
    `  <url>
    <loc>${base}/blog/</loc>
    <lastmod>${newestDate}</lastmod>
    <priority>0.7</priority>
  </url>`,
  ];

  for (const post of sorted) {
    const lastmod = toDateString(post.updatedDate ?? post.publishDate);
    urls.push(`  <url>
    <loc>${base}/blog/${post.slug}/</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.6</priority>
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
