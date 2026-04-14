export type Subcategory = { 
  id: string; 
  label: string; 
  path: string;
  type: string; // PropertyType for filtering
};

export type CategoryKey = 'residential' | 'commercial' | 'retail' | 'hospitality' | 'industrial' | 'layout';

export const CATEGORY_MAP: Record<CategoryKey, Subcategory[]> = {
  residential: [
    { id: 'res-plots', label: 'Residential Plots', path: '/properties?type=residential-plots', type: 'residential-plots' },
    { id: 'res-apartments', label: 'Apartments', path: '/properties?type=residential-apartments', type: 'residential-apartments' },
    { id: 'res-villas', label: 'Villas', path: '/properties?type=residential-villas', type: 'residential-villas' },
  ],
  commercial: [
    { id: 'com-props', label: 'Commercial Properties', path: '/properties?type=commercial', type: 'commercial' },
    { id: 'com-offices', label: 'Office Spaces', path: '/properties?type=commercial-offices', type: 'commercial-offices' },
  ],
  retail: [
    { id: 'ret-props', label: 'Retail Properties', path: '/properties?type=retail', type: 'retail' },
    { id: 'ret-shops', label: 'Shops', path: '/properties?type=retail-shops', type: 'retail-shops' },
    { id: 'ret-malls', label: 'Malls & Arcades', path: '/properties?type=retail-malls', type: 'retail-malls' },
  ],
  hospitality: [
    { id: 'hos-props', label: 'Hospitality Properties', path: '/properties?type=hospitality', type: 'hospitality' },
    { id: 'hos-hotels', label: 'Hotels', path: '/properties?type=hospitality-hotels', type: 'hospitality-hotels' },
    { id: 'hos-rest-clubs', label: 'Restaurants & Clubs', path: '/properties?type=hospitality-restaurants', type: 'hospitality-restaurants' },
  ],
  industrial: [
    { id: 'ind-props', label: 'Industrial Properties', path: '/properties?type=industrial', type: 'industrial' },
    { id: 'ind-warehouses', label: 'Warehouses', path: '/properties?type=industrial-warehouses', type: 'industrial-warehouses' },
    { id: 'ind-logistics', label: 'Logistics Parks', path: '/properties?type=industrial-logistics', type: 'industrial-logistics' },
  ],
  layout: [
    { id: 'land-agri', label: 'Agricultural Land', path: '/properties?type=agricultural-lands', type: 'agricultural-lands' },
    { id: 'land-res', label: 'Residential Land', path: '/properties?type=residential-plots', type: 'residential-plots' },
    { id: 'land-com', label: 'Commercial Land', path: '/properties?type=commercial', type: 'commercial' },
  ],
};

/**
 * Get subcategories for a given category key
 */
export function getSubcategories(category: CategoryKey): Subcategory[] {
  return CATEGORY_MAP[category] || [];
}

/**
 * Check if a category key is valid
 */
export function isValidCategory(category: string): category is CategoryKey {
  return category in CATEGORY_MAP;
}
