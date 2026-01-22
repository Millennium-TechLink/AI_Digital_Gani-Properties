/**
 * Sitemap generation utilities
 * Generates XML sitemaps for SEO
 */

import { siteConfig } from './seo';
import { Property } from '@/types/property';

export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(urls: SitemapUrl[]): string {
  const urlEntries = urls.map(url => {
    let entry = `  <url>\n    <loc>${url.loc}</loc>`;
    if (url.lastmod) entry += `\n    <lastmod>${url.lastmod}</lastmod>`;
    if (url.changefreq) entry += `\n    <changefreq>${url.changefreq}</changefreq>`;
    if (url.priority !== undefined) entry += `\n    <priority>${url.priority}</priority>`;
    entry += '\n  </url>';
    return entry;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries}
</urlset>`;
}

export function getMainSitemapUrls(): SitemapUrl[] {
  const baseUrl = siteConfig.url;
  const now = new Date().toISOString().split('T')[0];

  return [
    {
      loc: `${baseUrl}/`,
      lastmod: now,
      changefreq: 'daily',
      priority: 1.0,
    },
    {
      loc: `${baseUrl}/properties`,
      lastmod: now,
      changefreq: 'daily',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/about`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/contact`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.8,
    },
    {
      loc: `${baseUrl}/franchise`,
      lastmod: now,
      changefreq: 'monthly',
      priority: 0.7,
    },
    // Property type pages
    {
      loc: `${baseUrl}/property-type/residential-plots`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/property-type/commercial`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/property-type/retail`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/property-type/hospitality`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/property-type/industrial`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
    {
      loc: `${baseUrl}/property-type/farm-plots`,
      lastmod: now,
      changefreq: 'weekly',
      priority: 0.9,
    },
  ];
}

export function getPropertySitemapUrls(properties: Property[]): SitemapUrl[] {
  const baseUrl = siteConfig.url;
  const now = new Date().toISOString().split('T')[0];

  return properties.map(property => ({
    loc: `${baseUrl}/property/${property.slug}`,
    lastmod: property.postedAt ? new Date(property.postedAt).toISOString().split('T')[0] : now,
    changefreq: 'weekly' as const,
    priority: 0.8,
  }));
}
