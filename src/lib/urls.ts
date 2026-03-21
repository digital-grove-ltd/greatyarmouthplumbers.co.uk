// ──────────────────────────────────────────────
//  Great Yarmouth Plumbers – URL builder helpers
// ──────────────────────────────────────────────
//
// Every function returns an absolute path with a trailing slash so that
// Astro's trailingSlash: 'always' config and <a href> values stay
// consistent across the whole site.

/** Single-service page, e.g. /services/leak-repair/ */
export function serviceUrl(serviceSlug: string): string {
  return `/services/${serviceSlug}/`;
}

/** Single-area page, e.g. /locations/great-yarmouth/ */
export function areaUrl(areaSlug: string): string {
  return `/locations/${areaSlug}/`;
}

/** Combo (area + service) page, e.g. /services/great-yarmouth/leak-repair/ */
export function comboUrl(areaSlug: string, serviceSlug: string): string {
  return `/services/${areaSlug}/${serviceSlug}/`;
}

/** Contact page */
export function contactUrl(): string {
  return '/contact/';
}

/** About page */
export function aboutUrl(): string {
  return '/about/';
}

/** Blog listing or individual post */
export function blogUrl(slug?: string): string {
  if (slug) {
    return `/plumbing-tips/${slug}/`;
  }
  return '/plumbing-tips/';
}
