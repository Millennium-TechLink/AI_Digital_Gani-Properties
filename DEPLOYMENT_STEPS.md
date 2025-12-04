# Deployment Guide - Website & Admin Panel

This guide will help you deploy both the main website and admin dashboard to production.

## Prerequisites

- [ ] GitHub account (or GitLab/Bitbucket)
- [ ] Vercel account (free tier is sufficient)
- [ ] Supabase account (free tier is sufficient)
- [ ] All code pushed to a Git repository

---

## Step 1: Setup Supabase Database

### 1.1 Create Supabase Project
1. Go to https://supabase.com and sign up/login
2. Click "New Project"
3. Fill in:
   - **Name**: `gani-properties`
   - **Database Password**: Create a strong password (save it!)
   - **Region**: Choose closest to your users (e.g., `Asia Pacific (Mumbai)`)
4. Click "Create new project" and wait 2-3 minutes

### 1.2 Create Database Schema
1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Paste and run this SQL:

```sql
-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
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

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);
```

4. Click "Run" (or press Ctrl+Enter)

### 1.3 Setup Storage for Images
1. Go to **Storage** in Supabase dashboard
2. Click "Create bucket"
3. Name: `property-images`
4. Set to **Public bucket** (toggle ON)
5. Click "Create bucket"
6. Go to bucket settings → Set max file size to 5MB (optional)

### 1.4 Get API Keys
1. Go to **Settings** → **API**
2. Copy these values (you'll need them later):
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role secret** key (keep this secret!)

---

## Step 2: Push Code to GitHub

If you haven't already:

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for deployment"

# Create repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3: Deploy Main Website to Vercel

### 3.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (recommended)
3. Authorize Vercel to access your repositories

### 3.2 Deploy Website
1. In Vercel dashboard, click **"Add New Project"**
2. Import your repository
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **"Deploy"**

### 3.3 Add Environment Variables (Website)
After deployment, go to **Settings** → **Environment Variables** and add:

```
VITE_SITE_URL=https://your-project.vercel.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_GOOGLE_SHEETS_WEB_APP_URL=your-google-sheets-url (if using)
```

**Important**: After adding variables, go to **Deployments** → Click the three dots on latest deployment → **Redeploy**

### 3.4 Get Website URL
After deployment, Vercel will give you a URL like:
`https://your-project.vercel.app`

---

## Step 4: Deploy Admin Dashboard to Vercel

### 4.1 Create New Vercel Project for Dashboard
1. In Vercel dashboard, click **"Add New Project"** again
2. Import the **same repository**
3. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `pipeline/dashboard` ⚠️ **IMPORTANT: Change this!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Click **"Deploy"**

### 4.2 Add Environment Variables (Dashboard)
Go to **Settings** → **Environment Variables** and add:

```
VITE_API_URL=https://your-website-url.vercel.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_KEY=your-service-role-key-here
JWT_SECRET=your-secret-key-here (generate a random string)
```

**Important**: 
- Replace `your-website-url.vercel.app` with your actual website URL from Step 3.4
- The `JWT_SECRET` should be a long random string (you can generate one at https://randomkeygen.com)
- After adding variables, **Redeploy** the dashboard

### 4.3 Get Dashboard URL
After deployment, you'll get a URL like:
`https://your-dashboard-project.vercel.app`

---

## Step 5: Update API Routes (if needed)

The API routes in the `api/` folder should automatically work with Vercel. Make sure:

1. **Check Supabase connection** in `api/lib/supabase.ts`
2. **Verify authentication** in `api/lib/auth.ts` uses the same `JWT_SECRET` as dashboard

---

## Step 6: Test Everything

### 6.1 Test Website
- [ ] Visit your website URL
- [ ] Check if properties load
- [ ] Test contact form
- [ ] Verify all pages work

### 6.2 Test Admin Dashboard
- [ ] Visit your dashboard URL
- [ ] Try logging in
- [ ] Create a test property
- [ ] Upload an image
- [ ] Verify property appears on website

### 6.3 Test API
- [ ] Visit `https://your-website-url.vercel.app/api/properties`
- [ ] Should see JSON array of properties (or empty array)

---

## Step 7: Setup Custom Domain (Optional)

### 7.1 For Website
1. In Vercel project settings → **Domains**
2. Add your domain (e.g., `ourganiproperties.com`)
3. Follow DNS setup instructions
4. Update `VITE_SITE_URL` environment variable

### 7.2 For Dashboard
1. Add a subdomain (e.g., `admin.ourganiproperties.com`)
2. Follow DNS setup instructions
3. Update `VITE_API_URL` in dashboard environment variables

---

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies are in `package.json`
- Check for TypeScript errors: `npm run build` locally

### API Not Working
- Verify environment variables are set correctly
- Check Supabase connection in API logs
- Ensure Supabase RLS policies allow public read

### Dashboard Can't Login
- Verify `JWT_SECRET` matches in both dashboard and API
- Check API URL is correct in dashboard environment variables
- Check browser console for errors

### Images Not Uploading
- Verify Supabase storage bucket is public
- Check file size limits
- Verify service role key is correct

---

## Post-Deployment Checklist

- [ ] Update sitemap with production URL
- [ ] Submit sitemap to Google Search Console
- [ ] Test all forms and features
- [ ] Setup monitoring (Vercel Analytics is free)
- [ ] Backup database (Supabase has automatic backups)
- [ ] Document admin login credentials securely

---

## Cost Estimate

**Free Tier (Sufficient for most use cases):**
- Vercel: Free (100GB bandwidth/month)
- Supabase: Free (500MB database, 1GB storage)

**If you need more:**
- Vercel Pro: $20/month
- Supabase Pro: $25/month

---

## Quick Reference

**Website URL**: `https://your-project.vercel.app`  
**Dashboard URL**: `https://your-dashboard-project.vercel.app`  
**API Base**: `https://your-project.vercel.app/api`

**Supabase Dashboard**: https://app.supabase.com  
**Vercel Dashboard**: https://vercel.com/dashboard

---

## Need Help?

1. Check Vercel deployment logs
2. Check Supabase logs (Settings → Logs)
3. Review error messages in browser console
4. Check the detailed guides in `docs/` folder

Good luck! 🚀


