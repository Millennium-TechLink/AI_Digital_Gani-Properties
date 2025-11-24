import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { Property } from '../types/property.js';

const DATA_DIR = join(process.cwd(), 'data');
const PROPERTIES_FILE = join(DATA_DIR, 'properties.json');

// Ensure data directory exists
if (!existsSync(DATA_DIR)) {
  mkdirSync(DATA_DIR, { recursive: true });
}

export function loadProperties(): Property[] {
  try {
    if (!existsSync(PROPERTIES_FILE)) {
      // Initialize with empty array if file doesn't exist
      writeFileSync(PROPERTIES_FILE, JSON.stringify([], null, 2), 'utf-8');
      return [];
    }
    const data = readFileSync(PROPERTIES_FILE, 'utf-8');
    return JSON.parse(data) as Property[];
  } catch (error) {
    console.error('Error loading properties:', error);
    return [];
  }
}

export function saveProperties(properties: Property[]): void {
  try {
    writeFileSync(PROPERTIES_FILE, JSON.stringify(properties, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving properties:', error);
    throw new Error('Failed to save properties');
  }
}

export function getPropertyById(id: string): Property | undefined {
  const properties = loadProperties();
  return properties.find(p => p.id === id);
}

export function createProperty(property: Omit<Property, 'id' | 'slug' | 'postedAt'>): Property {
  const properties = loadProperties();
  const id = generatePropertyId(property.type, property.area);
  const slug = generateSlug(property.title, id);
  
  const newProperty: Property = {
    ...property,
    id,
    slug,
    postedAt: new Date().toISOString(),
  };
  
  properties.push(newProperty);
  saveProperties(properties);
  return newProperty;
}

export function updateProperty(id: string, updates: Partial<Property>): Property | null {
  const properties = loadProperties();
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    return null;
  }
  
  const updatedProperty: Property = {
    ...properties[index],
    ...updates,
    id, // Ensure ID doesn't change
  };
  
  // Regenerate slug if title changed
  if (updates.title && updates.title !== properties[index].title) {
    updatedProperty.slug = generateSlug(updates.title, id);
  }
  
  properties[index] = updatedProperty;
  saveProperties(properties);
  return updatedProperty;
}

export function deleteProperty(id: string): boolean {
  const properties = loadProperties();
  const index = properties.findIndex(p => p.id === id);
  
  if (index === -1) {
    return false;
  }
  
  properties.splice(index, 1);
  saveProperties(properties);
  return true;
}

function generatePropertyId(type: string, area: string): string {
  const typePrefix = type.split('-')[0].substring(0, 4);
  const areaPrefix = area.toLowerCase().substring(0, 4).replace(/\s+/g, '');
  const timestamp = Date.now().toString().slice(-6);
  return `${typePrefix}-${areaPrefix}-${timestamp}`;
}

function generateSlug(title: string, id: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug}-${id.split('-').pop()}`;
}

