/**
 * Migration script to move properties from JSON to Supabase
 * Run: node scripts/migrate-properties-to-supabase.js
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  console.error('Please set these in your .env file or environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProperties() {
  try {
    console.log('🔄 Starting migration...\n');

    // Read properties from JSON file
    const propertiesPath = path.join(__dirname, '../src/data/properties.json');
    
    if (!fs.existsSync(propertiesPath)) {
      console.error(`❌ Properties file not found: ${propertiesPath}`);
      process.exit(1);
    }

    const propertiesData = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
    console.log(`📦 Found ${propertiesData.length} properties to migrate\n`);

    // Check if properties already exist
    const { data: existingProperties } = await supabase
      .from('properties')
      .select('id');

    if (existingProperties && existingProperties.length > 0) {
      console.log(`⚠️  Found ${existingProperties.length} existing properties in database`);
      console.log('   Skipping migration. Delete existing properties first if you want to re-migrate.\n');
      process.exit(0);
    }

    // Transform properties for Supabase
    const propertiesToInsert = propertiesData.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      type: p.type,
      city: p.city,
      area: p.area,
      price_label: p.priceLabel || null,
      size: p.size || null,
      status: p.status,
      highlights: JSON.stringify(p.highlights || []),
      lat: p.lat || null,
      lon: p.lon || null,
      images: p.images || [],
      description: p.description,
      posted_at: p.postedAt || new Date().toISOString(),
    }));

    // Insert properties in batches of 100
    const batchSize = 100;
    let inserted = 0;

    for (let i = 0; i < propertiesToInsert.length; i += batchSize) {
      const batch = propertiesToInsert.slice(i, i + batchSize);
      const { data, error } = await supabase
        .from('properties')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      inserted += batch.length;
      console.log(`✅ Inserted ${inserted}/${propertiesToInsert.length} properties...`);
    }

    console.log(`\n🎉 Migration complete! ${inserted} properties migrated successfully.`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrateProperties();

