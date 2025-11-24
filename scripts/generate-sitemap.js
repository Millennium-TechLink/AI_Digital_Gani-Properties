/**
 * Generate sitemap.xml for SEO
 * Run: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const siteUrl = process.env.VITE_SITE_URL || 'https://ourganiproperties.com';
const now = new Date().toISOString().split('T')[0];

// Static pages
const staticPages = [
  { url: '/', priority: 1.0, changefreq: 'daily' },
  { url: '/properties', priority: 0.9, changefreq: 'daily' },
  { url: '/about', priority: 0.8, changefreq: 'monthly' },
  { url: '/contact', priority: 0.8, changefreq: 'monthly' },
  { url: '/franchise', priority: 0.7, changefreq: 'monthly' },
  { url: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { url: '/terms', priority: 0.3, changefreq: 'yearly' },
];

// Property type pages
const propertyTypes = [
  'residential-plots',
  'commercial',
  'retail',
  'hospitality',
  'industrial',
  'farm-plots',
];

propertyTypes.forEach(type => {
  staticPages.push({
    url: `/property-type/${type}`,
    priority: 0.9,
    changefreq: 'weekly',
  });
});

// Generate sitemap XML
function generateSitemap() {
  const urls = staticPages.map(page => {
    return `  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
  }).join('\n');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;

  return sitemap;
}

// Write sitemap to public directory
const sitemap = generateSitemap();
const outputPath = path.join(__dirname, '../public/sitemap.xml');

fs.writeFileSync(outputPath, sitemap, 'utf8');
console.log('✅ Sitemap generated successfully at:', outputPath);
console.log(`📄 Total URLs: ${staticPages.length}`);

