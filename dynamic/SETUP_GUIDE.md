# Dynamic Website Setup Guide

This guide will help you set up the dynamic version of the Gani Properties website.

## 📋 Prerequisites

1. **Supabase Account**: Sign up at https://supabase.com
2. **Node.js 22+**: Installed on your machine
3. **Git**: For version control

## 🚀 Quick Setup

### Step 1: Copy Frontend Files

The dynamic version needs all frontend files from the parent directory. Run this command from the project root:

```bash
# Copy source files
cp -r src dynamic/ 2>/dev/null || xcopy /E /I src dynamic\src
cp -r public dynamic/ 2>/dev/null || xcopy /E /I public dynamic\public

# Copy scripts
cp -r scripts dynamic/ 2>/dev/null || xcopy /E /I scripts dynamic\scripts
```

Or manually copy:
- `src/` → `dynamic/src/`
- `public/` → `dynamic/public/`
- `scripts/` → `dynamic/scripts/`

### Step 2: Setup Supabase

1. **Create Supabase Project:**
   - Go to https://supabase.com
   - Create new project
   - Choose region closest to your users
   - Wait for setup to complete (2-3 minutes)

2. **Create Database Schema:**
   - Go to SQL Editor in Supabase
   - Run the SQL from `DATABASE_SETUP.sql` (create this file, see below)

3. **Create Storage Bucket:**
   - Go to Storage → Create bucket
   - Name: `property-images`
   - Make it **Public**
   - File size limit: 5MB

4. **Create Admin User:**
   - Go to Authentication → Users → Add User
   - Email: `admin@ganiproperties.com` (or your email)
   - Password: (create strong password)
   - Auto Confirm: `true`

5. **Get API Keys:**
   - Go to Settings → API
   - Copy:
     - Project URL
     - `anon` public key
     - `service_role` secret key (keep secret!)

### Step 3: Install Dependencies

```bash
cd dynamic
npm install
```

### Step 4: Configure Environment Variables

Create `.env` file in `dynamic/` directory:

```env
# Supabase Configuration (for API)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...

# Frontend Configuration
VITE_SITE_URL=http://localhost:5173
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### Step 5: Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## 🗄️ Database Setup SQL

Create `dynamic/DATABASE_SETUP.sql` with:

```sql
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Admin write access
DROP POLICY IF EXISTS "Admin insert access" ON properties;
CREATE POLICY "Admin insert access" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin update access" ON properties;
CREATE POLICY "Admin update access" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin delete access" ON properties;
CREATE POLICY "Admin delete access" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');

-- Storage policies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

CREATE POLICY "Authenticated upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

## 📤 Migration from Static Data

If you have existing properties in `src/data/properties.json`, you can migrate them:

1. Create migration script: `dynamic/scripts/migrate-to-supabase.js`
2. Run: `node scripts/migrate-to-supabase.js`

## 🚀 Deployment

See parent folder's `DEPLOYMENT_STEPS.md` for detailed deployment instructions.

Quick deploy:
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## ✅ Verification Checklist

- [ ] Supabase project created
- [ ] Database schema created
- [ ] Storage bucket created
- [ ] Admin user created
- [ ] Environment variables configured
- [ ] Frontend files copied
- [ ] Dependencies installed
- [ ] Development server running
- [ ] Can view properties (even if empty)
- [ ] Can login to admin dashboard

## 🆘 Troubleshooting

**Issue: "Missing Supabase environment variables"**
- Check `.env` file exists
- Verify all SUPABASE_* variables are set

**Issue: "Authentication failed"**
- Verify admin user exists in Supabase
- Check email/password are correct
- Ensure user is auto-confirmed

**Issue: "No properties showing"**
- Check database has data
- Verify RLS policies allow public SELECT
- Check API is calling Supabase correctly

**Issue: "Cannot upload images"**
- Verify storage bucket is public
- Check storage policies allow authenticated uploads
- Verify file size < 5MB

---

**Need help?** Check the main roadmap: `DYNAMIC_WEBSITE_ROADMAP.md`

