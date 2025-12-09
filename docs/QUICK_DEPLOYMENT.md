# Quick Deployment Guide
## Get Live in 2-3 Days

---

## 🎯 Goal
Deploy website and dashboard to production in the fastest way possible.

---

## Day 1: Setup & Migration (4-6 hours)

### Morning: Supabase Setup (2 hours)
1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up (free)
   - Create new project
   - Choose region: `Asia Pacific (Mumbai)` or closest
   - Wait for setup (2-3 minutes)

2. **Create Database Schema**
   - Go to SQL Editor
   - Run this SQL:

```sql
-- Create properties table
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
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

-- Create indexes
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_posted_at ON properties(posted_at DESC);

-- Enable public read access
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
```

3. **Setup Storage**
   - Go to Storage
   - Create bucket: `property-images`
   - Set to **Public**
   - Max file size: 5MB

4. **Get API Keys**
   - Go to Settings > API
   - Copy:
     - Project URL
     - `anon` `public` key
     - `service_role` `secret` key (keep secret!)

---

### Afternoon: Code Updates (2-4 hours)

1. **Install Dependencies**
```bash
npm install @supabase/supabase-js
```

2. **Create Supabase Client**
   - Create `src/lib/supabase.ts` (see DEPLOYMENT_ROADMAP.md)

3. **Update Properties API**
   - Update `src/lib/propertiesApi.ts` to use Supabase
   - Test locally

4. **Create Migration Script**
   - Create `scripts/migrate-to-supabase.js`
   - Run migration: `node scripts/migrate-to-supabase.js`

---

## Day 2: API Conversion (4-6 hours)

### Morning: Serverless Functions (3 hours)
1. **Create API Folder**
```bash
mkdir api
mkdir api/properties
mkdir api/auth
```

2. **Convert Routes**
   - Convert `pipeline/backend/src/routes/properties.ts` → `api/properties/index.ts`
   - Convert `pipeline/backend/src/routes/auth.ts` → `api/auth/login.ts`
   - Convert `pipeline/backend/src/routes/upload.ts` → `api/upload.ts`

3. **Update Authentication**
   - Update JWT handling for serverless
   - Test authentication

### Afternoon: Testing (1-3 hours)
1. **Test Locally**
   - Test all API endpoints
   - Test property CRUD
   - Test image upload
   - Fix any issues

---

## Day 3: Deployment (2-3 hours)

### Morning: Vercel Setup (1 hour)
1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Connect repository

2. **Deploy Frontend**
   - Click "Add New Project"
   - Import repository
   - Settings:
     - Framework: Vite
     - Root: `./`
     - Build: `npm run build`
     - Output: `dist`
   - Add environment variables
   - Deploy

3. **Deploy Dashboard**
   - Click "Add New Project"
   - Same repository
   - Settings:
     - Framework: Vite
     - Root: `pipeline/dashboard`
     - Build: `npm run build`
     - Output: `dist`
   - Add environment variables
   - Deploy

### Afternoon: Final Testing (1-2 hours)
1. **Test Live Site**
   - Test all features
   - Fix any issues
   - Verify everything works

---

## ✅ You're Live!

**Total Time: 10-15 hours over 2-3 days**

---

## 🚨 If You Get Stuck

1. Check error logs in Vercel dashboard
2. Check Supabase logs
3. Verify environment variables
4. Test database connection
5. Review `docs/DEPLOYMENT_GUIDE.md` for detailed steps

---

## 📊 Post-Deployment

1. **Update SEO**
   - Update site URL in code
   - Generate sitemap
   - Submit to search engines

2. **Monitor**
   - Check Vercel analytics
   - Monitor Supabase usage
   - Watch for errors

3. **Optimize**
   - Fix any performance issues
   - Optimize images
   - Improve load times

---

**Good luck! 🚀**








