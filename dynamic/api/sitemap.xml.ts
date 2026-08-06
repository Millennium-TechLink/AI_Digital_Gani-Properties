import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from './_lib/supabase.js';

const SITE_URL = 'https://ourganiproperties.com';

// Static routes that don't come from the database. Keep this in sync with the
// routes registered in src/App.tsx.
const STATIC_ROUTES: { path: string; changefreq: string; priority: string }[] = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/properties', changefreq: 'daily', priority: '0.9' },
  { path: '/about', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/franchise', changefreq: 'monthly', priority: '0.7' },
  { path: '/developers', changefreq: 'monthly', priority: '0.7' },
  { path: '/careers', changefreq: 'weekly', priority: '0.6' },
  { path: '/privacy', changefreq: 'yearly', priority: '0.3' },
  { path: '/terms', changefreq: 'yearly', priority: '0.3' },
  { path: '/property-type/residential-plots', changefreq: 'weekly', priority: '0.9' },
  { path: '/property-type/commercial', changefreq: 'weekly', priority: '0.9' },
  { path: '/property-type/retail', changefreq: 'weekly', priority: '0.9' },
  { path: '/property-type/hospitality', changefreq: 'weekly', priority: '0.9' },
  { path: '/property-type/industrial', changefreq: 'weekly', priority: '0.9' },
  { path: '/property-type/farm-plots', changefreq: 'weekly', priority: '0.9' },
];

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry(loc: string, lastmod: string, changefreq: string, priority: string): string {
  return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const today = new Date().toISOString().split('T')[0];

  const entries: string[] = STATIC_ROUTES.map((route) =>
    urlEntry(`${SITE_URL}${route.path}`, today, route.changefreq, route.priority)
  );

  // Individual property pages come from Supabase - these are the actual long-tail
  // SEO surface for a property site, so they need to be discoverable via sitemap,
  // not just found by crawling links from /properties.
  try {
    const { data, error } = await supabase
      .from('properties')
      .select('slug, updated_at, posted_at')
      .order('posted_at', { ascending: false });

    if (error) {
      console.error('sitemap: failed to fetch properties', error);
    } else {
      for (const property of data || []) {
        if (!property.slug) continue;
        const lastmod = (property.updated_at || property.posted_at || today).toString().split('T')[0];
        entries.push(urlEntry(`${SITE_URL}/property/${property.slug}`, lastmod, 'weekly', '0.8'));
      }
    }
  } catch (err) {
    // A broken Supabase connection shouldn't take the whole sitemap down -
    // crawlers still get the static routes instead of a 500.
    console.error('sitemap: unexpected error fetching properties', err);
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  // Cached at the CDN for an hour so crawler traffic doesn't hit Supabase on every
  // request; stale-while-revalidate keeps it fast while a fresh copy is fetched.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(xml);
}
