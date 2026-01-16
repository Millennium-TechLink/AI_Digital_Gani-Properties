# Netlify Deployment Guide
## Deploy Website and Pipeline on Netlify

---

## Overview

This guide covers deploying:
1. **Main Website** - React/Vite frontend (root directory)
2. **Pipeline Dashboard** - Admin dashboard (pipeline/dashboard)
3. **Backend API** - Converted to Netlify Functions (api/ folder)

---

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Netlify account (free tier available)
- Supabase account (for database)
- Node.js 22.x installed locally

---

## Part 1: Setup Supabase (If Not Already Done)

### 1.1 Create Supabase Project
1. Go to https://supabase.com
2. Sign up (free)
3. Create new project
4. Choose region closest to your users
5. Set database password (save it!)

### 1.2 Create Database Schema
Run this SQL in Supabase SQL Editor:

```sql
-- Properties table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
```

### 1.3 Setup Storage for Images
1. Go to Storage in Supabase dashboard
2. Create bucket: `property-images`
3. Set to **Public**
4. Enable file size limit (5MB recommended)

### 1.4 Get API Keys
1. Go to Settings > API
2. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (keep secret!)

---

## Part 2: Convert Backend to Netlify Functions

The backend Express server needs to be converted to Netlify Functions. The functions are already created in the `api/` folder but may need updates for Netlify format.

### 2.1 Netlify Functions Format

Netlify Functions use this handler signature:
```typescript
import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Hello' }),
  };
};
```

### 2.2 Function Structure

Netlify Functions are organized as:
```
netlify/functions/
  ├── properties.ts (handles /api/properties)
  ├── properties-[id].ts (handles /api/properties/:id)
  ├── auth-login.ts (handles /api/auth/login)
  ├── auth-verify.ts (handles /api/auth/verify)
  └── upload.ts (handles /api/upload)
```

**OR** using the `api/` folder (recommended):
```
api/
  ├── properties/
  │   ├── index.ts
  │   └── [id].ts
  ├── auth/
  │   ├── login.ts
  │   └── verify.ts
  └── upload.ts
```

---

## Part 3: Deploy Main Website

### 3.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 3.2 Login to Netlify
```bash
netlify login
```

### 3.3 Initialize Site
```bash
# In project root
netlify init
```

Follow prompts:
- Create & configure a new site? **Yes**
- Team: **Your team**
- Site name: **gani-properties** (or your choice)
- Build command: **npm run build**
- Directory to deploy: **dist**
- Netlify functions folder: **netlify/functions** (or **api** if using that)

### 3.4 Set Environment Variables

In Netlify dashboard or via CLI:

```bash
netlify env:set VITE_SITE_URL "https://your-site.netlify.app"
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set JWT_SECRET "your-jwt-secret"
netlify env:set ADMIN_USERNAME "your-admin-username"
netlify env:set ADMIN_PASSWORD "your-admin-password"
```

**For Functions (server-side):**
```bash
netlify env:set SUPABASE_URL "https://your-project.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your-anon-key"
netlify env:set SUPABASE_SERVICE_KEY "your-service-key"
```

### 3.5 Deploy
```bash
netlify deploy --prod
```

Or connect to Git for automatic deployments:
1. Go to Netlify dashboard
2. Add new site from Git
3. Connect repository
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions` (or `api`)

---

## Part 4: Deploy Pipeline Dashboard

The dashboard needs to be deployed as a **separate Netlify site**.

### 4.1 Create Dashboard Site

**Option A: Via Netlify Dashboard**
1. Go to Netlify dashboard
2. Click "Add new site" > "Import an existing project"
3. Select your repository
4. Configure:
   - **Base directory**: `pipeline/dashboard`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: Leave empty (dashboard doesn't need functions)

**Option B: Via CLI**
```bash
cd pipeline/dashboard
netlify init
```

Follow prompts:
- Site name: **gani-properties-dashboard**
- Build command: **npm run build**
- Directory to deploy: **dist**

### 4.2 Set Dashboard Environment Variables

```bash
netlify env:set VITE_API_URL "https://your-main-site.netlify.app/.netlify/functions"
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_SUPABASE_SERVICE_KEY "your-service-key"
```

### 4.3 Deploy Dashboard
```bash
netlify deploy --prod
```

---

## Part 5: Update netlify.toml Configuration

The main `netlify.toml` is already configured. Verify it includes:

```toml
[build]
  command = "npm run build"
  publish = "dist"
  functions = "netlify/functions"  # or "api" if using that folder

[build.environment]
  NODE_VERSION = "22"

# SPA redirect
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

# API proxy (if functions are in api/ folder)
[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# Headers for security
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

---

## Part 6: Update API Functions for Netlify

The existing API functions in `api/` folder need to be converted from Vercel format to Netlify format.

### 6.1 Install Netlify Functions Types
```bash
npm install --save-dev @netlify/functions
```

### 6.2 Example: Convert Properties API

**Before (Vercel):**
```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ...
}
```

**After (Netlify):**
```typescript
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const method = event.httpMethod;
  const path = event.path;
  
  if (method === 'GET') {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ data: '...' }),
    };
  }
  
  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' }),
  };
};
```

---

## Part 7: Handle File Uploads

Netlify Functions have a 6MB payload limit. For larger uploads:

### Option 1: Use Supabase Storage (Recommended)
- Upload directly to Supabase Storage from frontend
- Functions only handle metadata

### Option 2: Use Netlify Large Media
- Configure Netlify Large Media
- Handle uploads through functions

### Option 3: Use External Service
- Cloudinary, AWS S3, etc.

---

## Part 8: Testing Deployment

### 8.1 Test Main Website
1. Visit your Netlify site URL
2. Test property listings
3. Test property details
4. Test search/filters

### 8.2 Test API Functions
```bash
# Test properties endpoint
curl https://your-site.netlify.app/.netlify/functions/properties

# Test auth
curl -X POST https://your-site.netlify.app/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 8.3 Test Dashboard
1. Visit dashboard URL
2. Login
3. Test property CRUD operations
4. Test image uploads

---

## Part 9: Custom Domain (Optional)

### 9.1 Add Domain in Netlify
1. Go to Site settings > Domain management
2. Click "Add custom domain"
3. Enter your domain
4. Follow DNS setup instructions

### 9.2 Update Environment Variables
Update `VITE_SITE_URL` to your custom domain

---

## Part 10: Continuous Deployment

Once connected to Git:
- Every push to `main` = Production deployment
- Every PR = Preview deployment
- Automatic rollback on errors

---

## Troubleshooting

### Functions Not Working
- Check function logs in Netlify dashboard
- Verify function directory in `netlify.toml`
- Check environment variables

### CORS Issues
- Add CORS headers in function responses
- Check allowed origins

### Build Failures
- Check Node version (should be 22)
- Verify all dependencies installed
- Check build logs in Netlify dashboard

### Environment Variables Not Working
- Functions need server-side env vars (without `VITE_` prefix)
- Frontend needs `VITE_` prefixed vars
- Redeploy after adding env vars

---

## Cost Overview

### Netlify Free Tier:
- Bandwidth: 100GB/month
- Function invocations: 125,000/month
- Build minutes: 300/month
- Concurrent builds: 1

### When to Upgrade:
- Netlify Pro ($19/mo): Need team features, more bandwidth, or concurrent builds
- Supabase Pro ($25/mo): Database > 500MB or need more storage

---

## 🎉 You're Live!

Your deployment is complete:
- ✅ Main website on Netlify
- ✅ Dashboard on separate Netlify site
- ✅ API as Netlify Functions
- ✅ Database on Supabase
- ✅ Automatic deployments from Git

---

## Next Steps

1. **Monitor Usage**
   - Check Netlify analytics
   - Monitor Supabase usage
   - Watch function invocations

2. **Optimize Performance**
   - Enable Netlify Edge Functions for faster responses
   - Optimize images
   - Use CDN caching

3. **Security**
   - Review environment variables
   - Enable 2FA on Netlify account
   - Review Supabase RLS policies

---

## Support

- Netlify Docs: https://docs.netlify.com
- Netlify Functions: https://docs.netlify.com/functions/overview/
- Supabase Docs: https://supabase.com/docs
