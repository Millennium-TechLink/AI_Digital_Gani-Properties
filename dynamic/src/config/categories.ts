export type Subcategory = { 
  id: string; 
  label: string; 
  path: string;
  type: string; // PropertyType for filtering
};

export type CategoryKey = 'residential' | 'commercial' | 'retail' | 'hospitality' | 'industrial' | 'land';

export const CATEGORY_MAP: Record<CategoryKey, Subcategory[]> = {
  residential: [
    { id: 'res-plots', label: 'Residential Plots', path: '/property-type/residential-plots', type: 'residential-plots' },
    { id: 'res-apartments', label: 'Apartments', path: '/property-type/residential-apartments', type: 'residential-apartments' },
    { id: 'res-villas', label: 'Villas', path: '/property-type/residential-villas', type: 'residential-villas' },
  ],
  commercial: [
    { id: 'com-props', label: 'Commercial Properties', path: '/property-type/commercial', type: 'commercial' },
    { id: 'com-offices', label: 'Office Spaces', path: '/property-type/commercial-offices', type: 'commercial-offices' },
  ],
  retail: [
    { id: 'ret-props', label: 'Retail Properties', path: '/property-type/retail', type: 'retail' },
    { id: 'ret-shops', label: 'Shops', path: '/property-type/retail-shops', type: 'retail-shops' },
    { id: 'ret-malls', label: 'Malls & Arcades', path: '/property-type/retail-malls', type: 'retail-malls' },
  ],
  hospitality: [
    { id: 'hos-props', label: 'Hospitality Properties', path: '/property-type/hospitality', type: 'hospitality' },
    { id: 'hos-hotels', label: 'Hotels', path: '/property-type/hospitality-hotels', type: 'hospitality-hotels' },
    { id: 'hos-rest-clubs', label: 'Restaurants & Clubs', path: '/property-type/hospitality-restaurants', type: 'hospitality-restaurants' },
  ],
  industrial: [
    { id: 'ind-props', label: 'Industrial Properties', path: '/property-type/industrial', type: 'industrial' },
    { id: 'ind-warehouses', label: 'Warehouses', path: '/property-type/industrial-warehouses', type: 'industrial-warehouses' },
    { id: 'ind-logistics', label: 'Logistics Parks', path: '/property-type/industrial-logistics', type: 'industrial-logistics' },
  ],
  land: [
    { id: 'land-agri', label: 'Agricultural Land', path: '/property-type/agricultural-lands', type: 'agricultural-lands' },
    { id: 'land-res', label: 'Residential Land', path: '/property-type/residential-plots', type: 'residential-plots' },
    { id: 'land-com', label: 'Commercial Land', path: '/property-type/commercial', type: 'commercial' },
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
