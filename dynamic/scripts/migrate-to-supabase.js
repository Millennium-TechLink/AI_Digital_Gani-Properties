/**
 * Migration script to move properties from static JSON to Supabase
 * 
 * Usage:
 * 1. Ensure you have properties.json in the parent src/data/ folder
 * 2. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env
 * 3. Run: node scripts/migrate-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Try to read from parent directory or current directory
const propertiesPath = join(__dirname, '../../src/data/properties.json');

let propertiesData;
try {
  const fileContent = readFileSync(propertiesPath, 'utf-8');
  propertiesData = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ Failed to read properties.json:', error.message);
  console.error('Expected path:', propertiesPath);
  process.exit(1);
}

async function migrateProperties() {
  console.log(`📦 Starting migration of ${propertiesData.length} properties...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const property of propertiesData) {
    try {
      // Check if property already exists
      const { data: existing } = await supabase
        .from('properties')
        .select('id')
        .eq('id', property.id)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped (exists): ${property.title}`);
        continue;
      }

      // Transform data for Supabase
      const insertData = {
        id: property.id,
        slug: property.slug,
        title: property.title,
        type: property.type,
        city: property.city,
        area: property.area,
        price_label: property.priceLabel || null,
        size: property.size || null,
        status: property.status,
        highlights: property.highlights || [],
        lat: property.lat || null,
        lon: property.lon || null,
        images: property.images || [],
        description: property.description,
        posted_at: property.postedAt || new Date().toISOString(),
      };

      const { error } = await supabase
        .from('properties')
        .insert(insertData);

      if (error) {
        if (error.code === '23505') {
          // Duplicate key error
          console.log(`⏭️  Skipped (duplicate): ${property.title}`);
        } else {
          console.error(`❌ Error migrating ${property.id}:`, error.message);
          errorCount++;
        }
      } else {
        console.log(`✅ Migrated: ${property.title}`);
        successCount++;
      }
    } catch (error) {
      console.error(`❌ Error migrating ${property.id}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📦 Total: ${propertiesData.length}`);

  if (errorCount > 0) {
    console.log('\n⚠️  Some properties failed to migrate. Check errors above.');
    process.exit(1);
  } else {
    console.log('\n🎉 Migration completed successfully!');
  }
}

migrateProperties();

