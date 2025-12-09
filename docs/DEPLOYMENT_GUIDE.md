# Deployment Guide - Vercel + Supabase
## Step-by-Step Deployment Instructions

---

## Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- Supabase account (free)

---

## Part 1: Setup Supabase Database

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
CREATE TABLE properties (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  price_label TEXT,
  size TEXT,
  status TEXT NOT NULL,
  highlights JSONB,
  lat DECIMAL(10, 8),
  lon DECIMAL(11, 8),
  images TEXT[],
  description TEXT NOT NULL,
  posted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_properties_type ON properties(type);
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_area ON properties(area);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_posted_at ON properties(posted_at DESC);

-- Enable Row Level Security (optional, for future auth)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);
```

### 1.3 Setup Storage for Images
1. Go to Storage in Supabase dashboard
2. Create bucket: `property-images`
3. Set to public
4. Enable file size limit (5MB recommended)

---

## Part 2: Deploy to Vercel

### 2.1 Install Vercel CLI
```bash
npm install -g vercel
```

### 2.2 Deploy Frontend Website
```bash
# In project root
vercel login
vercel
```

Follow prompts:
- Set up and deploy? **Yes**
- Which scope? **Your account**
- Link to existing project? **No**
- Project name? **gani-properties**
- Directory? **./** (current directory)
- Override settings? **No**

### 2.3 Deploy Admin Dashboard
```bash
# In pipeline/dashboard folder
cd pipeline/dashboard
vercel
```

Follow prompts:
- Project name? **gani-properties-dashboard**
- Directory? **./** (current directory)

### 2.4 Setup Environment Variables

In Vercel dashboard for each project:

**Frontend Website:**
```
VITE_SITE_URL=https://your-domain.vercel.app
VITE_API_URL=https://your-api.vercel.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Dashboard:**
```
VITE_API_URL=https://your-api.vercel.app/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-key
```

---

## Part 3: Convert Backend to Serverless Functions

### 3.1 Create API Folder Structure
```
api/
├── properties/
│   ├── [id].ts
│   └── index.ts
├── auth/
│   ├── login.ts
│   └── verify.ts
└── upload.ts
```

### 3.2 Example: Properties API
Create `api/properties/index.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('posted_at', { ascending: false });
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.json(data);
  }
  
  // POST requires authentication
  if (req.method === 'POST') {
    // Add auth check here
    const { data, error } = await supabase
      .from('properties')
      .insert(req.body);
    
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    return res.json(data);
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

---

## Part 4: Update Frontend to Use Supabase

### 4.1 Install Supabase Client
```bash
npm install @supabase/supabase-js
```

### 4.2 Update propertiesApi.ts
```typescript
import { createClient } from '@supabase/supabase-js';
import { Property } from '@/types/property';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const propertiesApi = {
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('posted_at', { ascending: false });
    
    if (error) throw error;
    return data as Property[];
  },
  
  getById: async (id: string): Promise<Property | null> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data as Property;
  },
  
  // ... other methods
};
```

---

## Part 5: Custom Domain (Optional)

### 5.1 Add Domain in Vercel
1. Go to project settings
2. Click "Domains"
3. Add your domain
4. Follow DNS setup instructions

### 5.2 Update Environment Variables
Update `VITE_SITE_URL` to your custom domain

---

## Part 6: Monitoring & Analytics

### 6.1 Vercel Analytics
- Built-in analytics in Vercel dashboard
- Track page views, performance
- Free tier includes basic analytics

### 6.2 Supabase Dashboard
- Monitor database usage
- Track storage usage
- View API logs

---

## 🎉 You're Live!

Your site is now:
- ✅ Hosted on Vercel (global CDN)
- ✅ Database on Supabase (free tier)
- ✅ Automatic deployments from Git
- ✅ Zero maintenance required
- ✅ Cost: $0/month (free tier)

---

## 📊 Cost Monitoring

### Vercel Free Tier Limits:
- Bandwidth: 100GB/month
- Function invocations: Unlimited
- Build minutes: 6,000/month

### Supabase Free Tier Limits:
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB/month
- API requests: Unlimited

### When to Upgrade:
- Vercel Pro ($20/mo): Need team features or more bandwidth
- Supabase Pro ($25/mo): Database > 500MB or need more storage

---

## 🔄 Continuous Deployment

Once connected to Git:
- Every push to `main` = Production deployment
- Every PR = Preview deployment
- Automatic rollback on errors

No manual deployment needed! 🚀








