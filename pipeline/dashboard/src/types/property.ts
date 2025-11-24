export type PropertyType =
  | 'residential-plots'
  | 'residential-apartments'
  | 'residential-villas'
  | 'commercial'
  | 'commercial-offices'
  | 'retail'
  | 'retail-shops'
  | 'retail-malls'
  | 'hospitality'
  | 'hospitality-hotels'
  | 'hospitality-restaurants'
  | 'industrial'
  | 'industrial-warehouses'
  | 'industrial-logistics'
  | 'farm-plots'
  | 'agricultural-lands';

export interface Property {
  id: string;
  slug: string;
  title: string;
  type: PropertyType;
  city: string;
  area: string;
  priceLabel?: string;
  size?: string;
  status: 'available' | 'sold' | 'new';
  highlights: string[];
  lat?: number;
  lon?: number;
  images: string[];
  description: string;
  postedAt: string;
}

export interface CreatePropertyDto {
  title: string;
  type: PropertyType;
  city: string;
  area: string;
  priceLabel?: string;
  size?: string;
  status: 'available' | 'sold' | 'new';
  highlights: string[];
  lat?: number;
  lon?: number;
  images: string[];
  description: string;
}

