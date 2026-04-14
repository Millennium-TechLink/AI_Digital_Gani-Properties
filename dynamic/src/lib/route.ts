import { CategoryKey, CATEGORY_MAP } from '@/config/categories';
import { PropertyType } from '@/types/property';

/**
 * Extract the active category from a pathname
 * Returns null if no valid category is found
 */
export function getActiveCategoryFromPath(pathname: string): CategoryKey | null {
  // Check for top-level category routes
  const topLevelMatch = pathname.match(/^\/(residential|commercial|retail|hospitality|industrial|layout)(?:\/|$)/);
  if (topLevelMatch && topLevelMatch[1] in CATEGORY_MAP) {
    return topLevelMatch[1] as CategoryKey;
  }

  // Check for property-type routes and map them to categories
  const propertyTypeMatch = pathname.match(/^\/property-type\/([^/]+)/);
  if (propertyTypeMatch) {
    const propertyType = propertyTypeMatch[1] as PropertyType;
    return getCategoryFromPropertyType(propertyType);
  }

  return null;
}

/**
 * Extract the active subcategory ID from a pathname
 * Returns null if no valid subcategory is found
 */
export function getActiveSubcategoryFromPath(pathname: string): string | null {
  // Check property-type routes
  const propertyTypeMatch = pathname.match(/^\/property-type\/([^/]+)/);
  if (propertyTypeMatch) {
    const propertyType = propertyTypeMatch[1] as PropertyType;
    const category = getCategoryFromPropertyType(propertyType);
    if (category) {
      const subcategories = CATEGORY_MAP[category];
      const subcategory = subcategories.find(sub => sub.type === propertyType);
      return subcategory?.id || null;
    }
  }

  return null;
}

/**
 * Map a PropertyType to its CategoryKey
 */
export function getCategoryFromPropertyType(type: PropertyType): CategoryKey | null {
  if (type.startsWith('residential')) {
    return 'residential';
  }
  if (type.startsWith('commercial')) {
    return 'commercial';
  }
  if (type.startsWith('retail')) {
    return 'retail';
  }
  if (type.startsWith('hospitality')) {
    return 'hospitality';
  }
  if (type.startsWith('industrial')) {
    return 'industrial';
  }
  if (type === 'farm-plots' || type === 'agricultural-lands') {
    return 'layout';
  }
  return null;
}

/**
 * Get the page title for a category
 */
export function getCategoryTitle(category: CategoryKey): string {
  const titles: Record<CategoryKey, string> = {
    residential: 'Residential',
    commercial: 'Commercial',
    retail: 'Retail',
    hospitality: 'Hospitality',
    industrial: 'Industrial',
    layout: 'Layout',
  };
  return titles[category] || category;
}
