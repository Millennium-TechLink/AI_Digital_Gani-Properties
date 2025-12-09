-- Gani Properties Database Setup
-- Run this SQL in Supabase SQL Editor

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'residential-plots', 'residential-apartments', 'residential-villas',
    'commercial', 'retail', 'hospitality', 'industrial', 'land'
  )),
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  price_label TEXT,
  size TEXT,
  status TEXT NOT NULL CHECK (status IN ('available', 'sold', 'new')),
  highlights JSONB DEFAULT '[]'::jsonb,
  lat DECIMAL(10, 8),
  lon DECIMAL(11, 8),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT NOT NULL,
  posted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT REFERENCES auth.users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON properties;
DROP POLICY IF EXISTS "Admin insert access" ON properties;
DROP POLICY IF EXISTS "Admin update access" ON properties;
DROP POLICY IF EXISTS "Admin delete access" ON properties;

-- Public read access (anyone can view properties)
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Admin insert access (only authenticated users can create)
CREATE POLICY "Admin insert access" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admin update access (only authenticated users can update)
CREATE POLICY "Admin update access" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Admin delete access (only authenticated users can delete)
CREATE POLICY "Admin delete access" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- Storage policies for property-images bucket
-- Note: These should be created after the bucket is created in Supabase Storage UI

-- Allow public read access to images
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
DROP POLICY IF EXISTS "Authenticated upload access" ON storage.objects;
CREATE POLICY "Authenticated upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
DROP POLICY IF EXISTS "Authenticated update access" ON storage.objects;
CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
DROP POLICY IF EXISTS "Authenticated delete access" ON storage.objects;
CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

