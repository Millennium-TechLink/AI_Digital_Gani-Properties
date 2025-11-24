import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Property } from '../types/property.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Initialize backend data from main app's properties.json if it exists
 * This is a one-time migration helper
 */
export function initializeFromMainApp(): void {
  const mainAppPropertiesPath = join(__dirname, '../../../src/data/properties.json');
  const backendPropertiesPath = join(__dirname, '../data/properties.json');

  // If backend already has data, skip
  if (existsSync(backendPropertiesPath)) {
    const existing = readFileSync(backendPropertiesPath, 'utf-8');
    const existingData = JSON.parse(existing);
    if (existingData.length > 0) {
      console.log('Backend already has properties data. Skipping initialization.');
      return;
    }
  }

  // Try to load from main app
  if (existsSync(mainAppPropertiesPath)) {
    try {
      const mainAppData = readFileSync(mainAppPropertiesPath, 'utf-8');
      const properties: Property[] = JSON.parse(mainAppData);
      
      // Ensure data directory exists
      const dataDir = join(__dirname, '../data');
      if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
      }

      writeFileSync(backendPropertiesPath, JSON.stringify(properties, null, 2), 'utf-8');
      console.log(`✅ Initialized backend with ${properties.length} properties from main app`);
    } catch (error) {
      console.error('Failed to initialize from main app:', error);
    }
  } else {
    console.log('Main app properties.json not found. Starting with empty data.');
  }
}

