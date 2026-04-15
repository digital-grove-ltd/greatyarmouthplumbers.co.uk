// @ts-check
import { defineConfig } from 'astro/config';
// @astrojs/sitemap removed — replaced by custom split sitemaps
// See src/pages/sitemap-index.xml.ts, sitemap-pages.xml.ts,
// sitemap-services.xml.ts, sitemap-locations.xml.ts, sitemap-blog.xml.ts
import tailwindcss from '@tailwindcss/vite';

import icon from 'astro-icon';

export default defineConfig({
  site: 'https://greatyarmouthplumbers.co.uk',
  output: 'static',
  compressHTML: true,
  trailingSlash: 'always',

  integrations: [
    icon(),
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});
