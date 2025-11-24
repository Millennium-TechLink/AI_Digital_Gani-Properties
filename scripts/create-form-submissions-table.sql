-- Create form_submissions table for Supabase
-- Run this in Supabase SQL Editor

-- Create form_submissions table
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

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_read ON form_submissions(read);
CREATE INDEX IF NOT EXISTS idx_form_submissions_phone ON form_submissions(phone);

-- Enable Row Level Security
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for form submissions from website)
CREATE POLICY "Public insert access" ON form_submissions
  FOR INSERT WITH CHECK (true);

-- Admin can read all (protected by service key in serverless functions)
CREATE POLICY "Admin read access" ON form_submissions
  FOR SELECT USING (true);

-- Admin can update (for marking as read/responded)
CREATE POLICY "Admin update access" ON form_submissions
  FOR UPDATE USING (true);

