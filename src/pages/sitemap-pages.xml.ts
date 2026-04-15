// src/pages/sitemap-pages.xml.ts
// Core / utility pages — home, services hub, locations hub, about, contact, FAQ, legal
// Dates staggered from build time (these pages have no individual publish dates)

import type { APIRoute } from 'astro';
import { BRAND } from '../data/brand';

export const prerender = true;

const now = new Date();
function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
}

interface PageDef {
  path: string;
  priority: string;
  daysAgo: number;
}

const CORE_PAGES: PageDef[] = [
  { path: '/',                              priority: '1.0', daysAgo: 0  },
  { path: '/services/',                     priority: '0.9', daysAgo: 1  },
  { path: '/locations/',                    priority: '0.9', daysAgo: 1  },
  { path: '/about/',                        priority: '0.8', daysAgo: 3  },
  { path: '/contact/',                      priority: '0.8', daysAgo: 3  },
  { path: '/frequently-asked-questions/',   priority: '0.7', daysAgo: 4  },
  { path: '/blog/',                         priority: '0.7', daysAgo: 0  }, // blog index freshness tied to newest post
  { path: '/privacy/',                      priority: '0.3', daysAgo: 14 },
  { path: '/terms/',                        priority: '0.3', daysAgo: 14 },
  { path: '/cookies/',                      priority: '0.3', daysAgo: 14 },
];

export const GET: APIRoute = () => {
  const base = `https://${BRAND.domain}`;

  const urls = CORE_PAGES.map(({ path, priority, daysAgo: n }) => `  <url>
    <loc>${base}${path}</loc>
    <lastmod>${daysAgo(n)}</lastmod>
    <priority>${priority}</priority>
  </url>`).join('\n');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
