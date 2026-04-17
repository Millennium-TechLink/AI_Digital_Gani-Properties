import { Helmet } from 'react-helmet-async';
import { siteConfig, generateOrganizationSchema, generateLocalBusinessSchema, generateWebSiteSchema } from '@/lib/seo';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  noindex?: boolean;
  canonical?: string;
  structuredData?: object | object[];
}

export default function SEOHead({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  noindex = false,
  canonical,
  structuredData,
}: SEOHeadProps) {
  const pageTitle = title 
    ? `${title} | ${siteConfig.name}`
    : siteConfig.title;
  
  const pageDescription = description || siteConfig.description;
  const pageImage = image || `${siteConfig.url}${siteConfig.ogImage}`;
  const pageUrl = url || siteConfig.url;
  const canonicalUrl = canonical || pageUrl;
  
  const allKeywords = [...siteConfig.keywords, ...keywords].join(', ');

  // Combine structured data
  const schemas = [
    generateOrganizationSchema(),
    generateLocalBusinessSchema(),
    generateWebSiteSchema(),
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : []),
  ];

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <meta name="keywords" content={allKeywords} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content={siteConfig.name} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={pageUrl} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      {siteConfig.twitterHandle && (
        <meta name="twitter:creator" content={siteConfig.twitterHandle} />
      )}

      {/* Geo Tags */}
      <meta name="geo.region" content="IN-KA" />
      <meta name="geo.placename" content="Ballari" />
      <meta name="geo.position" content={`${siteConfig.geo.latitude};${siteConfig.geo.longitude}`} />
      <meta name="ICBM" content={`${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`} />

      {/* Local Business Tags */}
      <meta name="contact" content={siteConfig.phone} />
      <meta name="email" content={siteConfig.email} />
      <meta name="locality" content="Ballari" />
      <meta name="region" content="Karnataka" />
      <meta name="country" content="India" />

      {/* Structured Data - JSON-LD */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Helmet>
  );
}

