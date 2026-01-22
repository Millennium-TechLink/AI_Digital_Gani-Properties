/**
 * SEO Configuration and Utilities
 * Optimized for Bangalore property providers ranking
 */

export const siteConfig = {
  name: 'Gani Properties',
  title: 'Gani Properties - Premium Property Providers in Bangalore | Residential Plots, Farmland & More',
  description: 'Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur. Trusted real estate dealer with transparent pricing.',
  url: 'https://ourganiproperties.com',
  ogImage: '/images/og-image.jpg',
  twitterHandle: '@GaniProperties',
  phone: '+91 99005 70799',
  email: 'info@ourganiproperties.com',
  address: {
    street: 'Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    postalCode: '',
  },
  geo: {
    latitude: 13.0827,
    longitude: 77.5946,
  },
  areas: [
    'Kattigenahalli',
    'Yelahanka',
    'Hunasamaranahalli',
    'Chikkaballapur',
    'Bengaluru',
  ],
  keywords: [
    'property providers in Bangalore',
    'real estate Bangalore',
    'residential plots Bangalore',
    'farmland Bangalore',
    'property dealers Bangalore',
    'Gani Properties Bangalore',
    'plots in Kattigenahalli',
    'land in Yelahanka',
    'farmland in Chikkaballapur',
    'BBMP approved plots',
    'verified property dealers',
    'affordable plots Bangalore',
  ],
};

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    '@id': `${siteConfig.url}#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/Logo.webp`,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    description: siteConfig.description,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    areaServed: siteConfig.areas.map(area => ({
      '@type': 'City',
      name: area,
    })),
    sameAs: [],
    priceRange: '₹₹',
  };
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}#localbusiness`,
    name: siteConfig.name,
    image: `${siteConfig.url}${siteConfig.ogImage}`,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    priceRange: '₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.street,
      addressLocality: siteConfig.address.city,
      addressRegion: siteConfig.address.state,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: siteConfig.geo.latitude,
      longitude: siteConfig.geo.longitude,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    areaServed: {
      '@type': 'City',
      name: 'Bengaluru',
    },
  };
}

export function generatePropertySchema(property: {
  id: string;
  title: string;
  description: string;
  type: string;
  city: string;
  area: string;
  priceLabel?: string;
  size?: string;
  images: string[];
  lat?: number;
  lon?: number;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${siteConfig.url}/property/${property.id}`,
    name: property.title,
    description: property.description,
    image: property.images.map(img => 
      img.startsWith('http') ? img : `${siteConfig.url}${img}`
    ),
    category: property.type,
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: property.priceLabel || 'Contact for price',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'RealEstateAgent',
        name: siteConfig.name,
      },
    },
    ...(property.lat && property.lon ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: property.lat,
        longitude: property.lon,
      },
    } : {}),
    address: {
      '@type': 'PostalAddress',
      addressLocality: property.area,
      addressRegion: property.city,
      addressCountry: 'IN',
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    publisher: {
      '@id': `${siteConfig.url}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/properties?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
