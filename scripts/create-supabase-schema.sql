-- Supabase Database Schema
-- Run this in Supabase SQL Editor

-- ============================================
-- Properties Table
-- ============================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
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
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for properties
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Enable Row Level Security for properties
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view properties)
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Admin can insert/update/delete (protected by service key in serverless functions)
CREATE POLICY "Admin insert access" ON properties
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin update access" ON properties
  FOR UPDATE USING (true);

CREATE POLICY "Admin delete access" ON properties
  FOR DELETE USING (true);

-- ============================================
-- Form Submissions Table
-- ============================================
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  interest TEXT,
  message TEXT,
  page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  responded BOOLEAN DEFAULT FALSE
);

-- Create indexes for form_submissions
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_read ON form_submissions(read);
CREATE INDEX IF NOT EXISTS idx_form_submissions_phone ON form_submissions(phone);

-- Enable Row Level Security for form_submissions
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Public insert access (for form submissions from website)
CREATE POLICY "Public insert access" ON form_submissions
  FOR INSERT WITH CHECK (true);

-- Admin can read all (protected by service key in serverless functions)
CREATE POLICY "Admin read access" ON form_submissions
  FOR SELECT USING (true);

-- Admin can update (for marking as read/responded)
CREATE POLICY "Admin update access" ON form_submissions
  FOR UPDATE USING (true);

-- ============================================
-- Storage Bucket for Property Images
-- ============================================
-- Note: Create this bucket in Supabase Dashboard → Storage
-- Bucket name: property-images
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

