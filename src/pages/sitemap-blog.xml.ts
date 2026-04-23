// src/pages/sitemap-blog.xml.ts
// Blog index + all blog posts from Astro content collections
// Uses real publish dates from blog post front matter

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';
import { getCollection } from 'astro:content';

export const prerender = true;

function toDateString(date: string | undefined): string {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    return new Date(date).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

export const GET: APIRoute = async () => {
  const base = `https://${BRAND.domain}`;

  const allPosts = await getCollection('blog');
  const sorted = allPosts.sort((a, b) =>
    new Date(b.data.publishDate ?? 0).getTime() -
    new Date(a.data.publishDate ?? 0).getTime()
  );

  // Blog index lastmod = most recent post's date
  const newestDate = sorted[0]
    ? toDateString(sorted[0].data.publishDate)
    : new Date().toISOString().split('T')[0];

  const urls: string[] = [
    `  <url>
    <loc>${base}/plumbing-tips/</loc>
    <lastmod>${newestDate}</lastmod>
    <priority>0.7</priority>
  </url>`,
  ];

  for (const post of sorted) {
    const lastmod = toDateString(post.data.publishDate);
    urls.push(`  <url>
    <loc>${base}/plumbing-tips/${post.slug}/</loc>
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
