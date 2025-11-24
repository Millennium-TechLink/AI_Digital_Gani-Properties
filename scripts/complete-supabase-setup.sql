-- Complete Supabase Setup - Run this after creating properties table
-- This includes indexes, RLS policies, and form_submissions table

-- ============================================
-- Create indexes for properties table
-- ============================================
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- ============================================
-- Enable Row Level Security for properties
-- ============================================
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public read access" ON properties;
DROP POLICY IF EXISTS "Admin insert access" ON properties;
DROP POLICY IF EXISTS "Admin update access" ON properties;
DROP POLICY IF EXISTS "Admin delete access" ON properties;

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

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public insert access" ON form_submissions;
DROP POLICY IF EXISTS "Admin read access" ON form_submissions;
DROP POLICY IF EXISTS "Admin update access" ON form_submissions;

-- Public insert access (for form submissions from website)
CREATE POLICY "Public insert access" ON form_submissions
  FOR INSERT WITH CHECK (true);

-- Admin can read all (protected by service key in serverless functions)
CREATE POLICY "Admin read access" ON form_submissions
  FOR SELECT USING (true);

-- Admin can update (for marking as read/responded)
CREATE POLICY "Admin update access" ON form_submissions
  FOR UPDATE USING (true);

