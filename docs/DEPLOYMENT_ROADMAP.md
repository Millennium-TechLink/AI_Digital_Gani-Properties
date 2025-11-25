# Deployment Roadmap
## Complete Guide to Go Live with Website & Dashboard

---

## 📋 Current Status

### ✅ Completed:
- Frontend website (React + Vite)
- Admin dashboard (React + Vite)
- Backend API (Express.js)
- Authentication system
- Property management
- SEO optimization
- Image upload system
- All pages and components

### ⚠️ Pending:
- Database migration (JSON → Supabase)
- Backend API conversion (Express → Serverless)
- Environment configuration
- Image storage setup
- Deployment configuration
- Testing & validation

---

## 🗺️ Deployment Roadmap

### Phase 1: Pre-Deployment Setup (Week 1)

#### 1.1 Database Migration
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 2-3 hours

**Tasks:**
- [ ] Create Supabase account
- [ ] Create new project
- [ ] Design database schema
- [ ] Create migration script
- [ ] Migrate existing properties from JSON
- [ ] Test data integrity
- [ ] Setup database indexes
- [ ] Configure Row Level Security (RLS)

**Files to Create:**
- `scripts/migrate-to-supabase.js` - Migration script
- `src/lib/supabase.ts` - Supabase client setup

---

#### 1.2 Backend API Conversion
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 4-6 hours

**Tasks:**
- [ ] Convert Express routes to Vercel serverless functions
- [ ] Update authentication for serverless
- [ ] Convert file upload to Supabase Storage
- [ ] Update API endpoints
- [ ] Test all API routes
- [ ] Handle CORS properly
- [ ] Add error handling

**Files to Create/Modify:**
- `api/properties/index.ts` - GET/POST properties
- `api/properties/[id].ts` - GET/PUT/DELETE single property
- `api/auth/login.ts` - Login endpoint
- `api/auth/verify.ts` - Token verification
- `api/upload.ts` - Image upload handler

**Files to Remove:**
- `pipeline/backend/src/server.ts` (Express server)
- `pipeline/backend/src/routes/*` (Convert to serverless)

---

#### 1.3 Image Storage Setup
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 1-2 hours

**Tasks:**
- [ ] Setup Supabase Storage bucket
- [ ] Configure public access
- [ ] Update image upload logic
- [ ] Migrate existing images
- [ ] Update image URLs in database
- [ ] Test image upload/delete

**Storage Options:**
1. **Supabase Storage** (Recommended - Free tier: 1GB)
2. **Cloudinary** (Alternative - Free tier: 25GB)
3. **Vercel Blob** (Alternative - $0.15/GB)

---

#### 1.4 Environment Configuration
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 1 hour

**Tasks:**
- [ ] Create `.env.example` files
- [ ] Document all environment variables
- [ ] Setup Vercel environment variables
- [ ] Setup Supabase environment variables
- [ ] Test environment loading

**Environment Variables Needed:**

**Frontend:**
```
VITE_SITE_URL=https://your-domain.vercel.app
VITE_API_URL=https://your-api.vercel.app/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Dashboard:**
```
VITE_API_URL=https://your-api.vercel.app/api
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-key
```

**Backend (Serverless Functions):**
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-jwt-secret
ADMIN_USERNAME=your-admin-username
ADMIN_PASSWORD=your-admin-password
```

---

### Phase 2: Code Updates (Week 1-2)

#### 2.1 Update Frontend API Calls
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 2-3 hours

**Tasks:**
- [ ] Install Supabase client library
- [ ] Update `src/lib/propertiesApi.ts` to use Supabase
- [ ] Update all API calls
- [ ] Handle authentication properly
- [ ] Update error handling
- [ ] Test all property operations

**Changes:**
```typescript
// Before: Fetch from Express API
const response = await fetch('/api/properties');

// After: Direct Supabase query
const { data } = await supabase.from('properties').select('*');
```

---

#### 2.2 Update Dashboard API Calls
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 2-3 hours

**Tasks:**
- [ ] Update dashboard API client
- [ ] Update property CRUD operations
- [ ] Update image upload component
- [ ] Update authentication flow
- [ ] Test all dashboard features

---

#### 2.3 Update Image Components
**Status**: ⚠️ Required  
**Priority**: 🟡 Medium  
**Time**: 1-2 hours

**Tasks:**
- [ ] Update Image component to use Supabase URLs
- [ ] Update image upload to Supabase Storage
- [ ] Update image deletion
- [ ] Handle image optimization
- [ ] Test image loading

---

### Phase 3: Testing (Week 2)

#### 3.1 Local Testing
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 4-6 hours

**Tasks:**
- [ ] Test database connection
- [ ] Test all API endpoints locally
- [ ] Test property CRUD operations
- [ ] Test image upload/download
- [ ] Test authentication flow
- [ ] Test dashboard functionality
- [ ] Test frontend website
- [ ] Fix any bugs found

**Testing Checklist:**
- [ ] Create property (dashboard)
- [ ] Update property (dashboard)
- [ ] Delete property (dashboard)
- [ ] Upload images (dashboard)
- [ ] View properties (website)
- [ ] Filter properties (website)
- [ ] Search properties (website)
- [ ] View property details (website)
- [ ] Login/Logout (dashboard)
- [ ] Form submissions (website)

---

#### 3.2 Performance Testing
**Status**: ⚠️ Recommended  
**Priority**: 🟡 Medium  
**Time**: 2-3 hours

**Tasks:**
- [ ] Test page load times
- [ ] Test image loading
- [ ] Test API response times
- [ ] Check Core Web Vitals
- [ ] Optimize slow queries
- [ ] Test on mobile devices

---

### Phase 4: Deployment (Week 2)

#### 4.1 Supabase Setup
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 1-2 hours

**Tasks:**
- [ ] Create Supabase account
- [ ] Create new project
- [ ] Run database migrations
- [ ] Setup storage buckets
- [ ] Configure RLS policies
- [ ] Get API keys
- [ ] Test connection

**Steps:**
1. Go to https://supabase.com
2. Sign up (free)
3. Create project (choose closest region)
4. Wait for project setup (2-3 minutes)
5. Go to SQL Editor
6. Run migration script
7. Go to Storage
8. Create `property-images` bucket (public)
9. Copy API keys

---

#### 4.2 Vercel Setup - Frontend
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 30 minutes

**Tasks:**
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Import project
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test deployment

**Steps:**
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "Add New Project"
4. Import your repository
5. Configure:
   - Framework Preset: Vite
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add environment variables
7. Deploy

---

#### 4.3 Vercel Setup - Dashboard
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 30 minutes

**Tasks:**
- [ ] Create new Vercel project for dashboard
- [ ] Configure build settings
- [ ] Add environment variables
- [ ] Deploy
- [ ] Test deployment

**Steps:**
1. In Vercel dashboard
2. Click "Add New Project"
3. Import same repository
4. Configure:
   - Framework Preset: Vite
   - Root Directory: `pipeline/dashboard`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variables
6. Deploy

---

#### 4.4 Vercel Setup - API (Serverless Functions)
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 1-2 hours

**Tasks:**
- [ ] Create `api/` folder in root
- [ ] Convert Express routes to serverless functions
- [ ] Deploy API functions
- [ ] Test all endpoints
- [ ] Update CORS settings

**API Structure:**
```
api/
├── properties/
│   ├── index.ts (GET, POST)
│   └── [id].ts (GET, PUT, DELETE)
├── auth/
│   ├── login.ts
│   └── verify.ts
└── upload.ts
```

---

### Phase 5: Post-Deployment (Week 2-3)

#### 5.1 Domain Setup (Optional)
**Status**: ⚠️ Optional  
**Priority**: 🟢 Low  
**Time**: 1 hour

**Tasks:**
- [ ] Purchase domain (if needed)
- [ ] Add domain to Vercel
- [ ] Configure DNS
- [ ] Setup SSL (automatic)
- [ ] Update environment variables
- [ ] Test custom domain

---

#### 5.2 SEO Setup
**Status**: ⚠️ Required  
**Priority**: 🟡 Medium  
**Time**: 2-3 hours

**Tasks:**
- [ ] Update site URL in `src/lib/seo.ts`
- [ ] Generate sitemap (`npm run generate-sitemap`)
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Create Google Business Profile
- [ ] Verify structured data
- [ ] Test meta tags

---

#### 5.3 Monitoring Setup
**Status**: ⚠️ Recommended  
**Priority**: 🟡 Medium  
**Time**: 1 hour

**Tasks:**
- [ ] Setup Vercel Analytics
- [ ] Setup error tracking (Sentry - optional)
- [ ] Monitor database usage
- [ ] Monitor storage usage
- [ ] Setup alerts (if needed)

---

#### 5.4 Final Testing
**Status**: ⚠️ Required  
**Priority**: 🔴 High  
**Time**: 2-3 hours

**Tasks:**
- [ ] Test all features on live site
- [ ] Test on different devices
- [ ] Test on different browsers
- [ ] Test form submissions
- [ ] Test property management
- [ ] Test image uploads
- [ ] Fix any issues

---

## 📝 Detailed Task Breakdown

### Task 1: Database Migration Script

**File**: `scripts/migrate-to-supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateProperties() {
  // Read existing properties
  const propertiesPath = path.join(__dirname, '../src/data/properties.json');
  const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf8'));
  
  console.log(`Migrating ${properties.length} properties...`);
  
  // Insert properties
  const { data, error } = await supabase
    .from('properties')
    .insert(properties.map(p => ({
      ...p,
      highlights: JSON.stringify(p.highlights),
      posted_at: p.postedAt,
    })));
  
  if (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
  
  console.log('✅ Migration complete!');
}

migrateProperties();
```

---

### Task 2: Supabase Client Setup

**File**: `src/lib/supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to get service client (for admin operations)
export function getSupabaseServiceClient() {
  const serviceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY;
  if (!serviceKey) {
    throw new Error('Missing Supabase service key');
  }
  return createClient(supabaseUrl, serviceKey);
}
```

---

### Task 3: Update Properties API

**File**: `src/lib/propertiesApi.ts` (Updated)

```typescript
import { supabase } from './supabase';
import { Property } from '@/types/property';

export const propertiesApi = {
  getAll: async (): Promise<Property[]> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .order('posted_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
    
    // Transform data to match Property type
    return (data || []).map(p => ({
      ...p,
      postedAt: p.posted_at,
      highlights: Array.isArray(p.highlights) 
        ? p.highlights 
        : JSON.parse(p.highlights || '[]'),
    })) as Property[];
  },
  
  getById: async (id: string): Promise<Property | null> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    
    return {
      ...data,
      postedAt: data.posted_at,
      highlights: Array.isArray(data.highlights) 
        ? data.highlights 
        : JSON.parse(data.highlights || '[]'),
    } as Property;
  },
  
  getBySlug: async (slug: string): Promise<Property | null> => {
    const { data, error } = await supabase
      .from('properties')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error || !data) return null;
    
    return {
      ...data,
      postedAt: data.posted_at,
      highlights: Array.isArray(data.highlights) 
        ? data.highlights 
        : JSON.parse(data.highlights || '[]'),
    } as Property;
  },
};
```

---

### Task 4: Serverless Function Example

**File**: `api/properties/index.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticateToken } from '../../lib/auth';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - Public access
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      return res.json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  // POST - Requires authentication
  if (req.method === 'POST') {
    try {
      // Verify authentication
      const authError = await authenticateToken(req);
      if (authError) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const property = req.body;
      
      // Insert property
      const { data, error } = await supabase
        .from('properties')
        .insert({
          ...property,
          highlights: JSON.stringify(property.highlights || []),
          posted_at: property.postedAt || new Date().toISOString(),
        })
        .select()
        .single();
      
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      
      return res.status(201).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}
```

---

## ✅ Pre-Deployment Checklist

### Database
- [ ] Supabase project created
- [ ] Database schema created
- [ ] Migration script ready
- [ ] Test data migrated
- [ ] Storage bucket created
- [ ] RLS policies configured

### Code
- [ ] Supabase client installed
- [ ] API calls updated
- [ ] Serverless functions created
- [ ] Image upload updated
- [ ] Authentication updated
- [ ] Error handling added

### Configuration
- [ ] Environment variables documented
- [ ] `.env.example` files created
- [ ] Build scripts verified
- [ ] Dependencies updated

### Testing
- [ ] Local testing complete
- [ ] All features working
- [ ] No console errors
- [ ] Performance acceptable

---

## 🚀 Deployment Checklist

### Vercel - Frontend
- [ ] Account created
- [ ] Project imported
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Tested on live URL

### Vercel - Dashboard
- [ ] Project created
- [ ] Build settings configured
- [ ] Environment variables added
- [ ] Deployed successfully
- [ ] Login tested

### Vercel - API
- [ ] API folder created
- [ ] Functions deployed
- [ ] Endpoints tested
- [ ] CORS configured

### Supabase
- [ ] Project created
- [ ] Database migrated
- [ ] Storage configured
- [ ] API keys saved
- [ ] Connection tested

---

## 📊 Timeline Estimate

| Phase | Tasks | Time Estimate |
|-------|-------|---------------|
| **Phase 1: Setup** | Database, API conversion, Storage | 8-12 hours |
| **Phase 2: Code Updates** | Frontend, Dashboard, Images | 5-8 hours |
| **Phase 3: Testing** | Local testing, Performance | 6-9 hours |
| **Phase 4: Deployment** | Vercel setup, Supabase setup | 3-5 hours |
| **Phase 5: Post-Deployment** | Domain, SEO, Monitoring | 4-6 hours |
| **Total** | | **26-40 hours** (1-2 weeks) |

---

## 🎯 Quick Start (Fastest Path)

### Option 1: Minimal Setup (2-3 days)
1. Setup Supabase (1 hour)
2. Create migration script (2 hours)
3. Convert API to serverless (4 hours)
4. Update frontend API calls (2 hours)
5. Deploy to Vercel (1 hour)
6. Test everything (2 hours)

**Total: ~12 hours**

### Option 2: Complete Setup (1-2 weeks)
- Follow full roadmap above
- Complete all testing
- Setup monitoring
- Optimize performance

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Migration Help**: Check `docs/DEPLOYMENT_GUIDE.md`
- **Hosting Comparison**: Check `docs/HOSTING_COMPARISON.md`

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ Website loads on live URL
- ✅ Dashboard accessible and functional
- ✅ Properties display correctly
- ✅ Can add/edit/delete properties from dashboard
- ✅ Images upload and display
- ✅ Forms submit successfully
- ✅ Authentication works
- ✅ No console errors
- ✅ Fast page load times (<3 seconds)

---

## 🚨 Common Issues & Solutions

### Issue: Database connection fails
**Solution**: Check environment variables, verify Supabase URL and keys

### Issue: Images not loading
**Solution**: Verify storage bucket is public, check image URLs

### Issue: API returns 401
**Solution**: Check authentication token, verify JWT secret

### Issue: Build fails on Vercel
**Solution**: Check build logs, verify Node version, check dependencies

---

## 📝 Next Steps

1. **Start with Phase 1** - Database migration
2. **Follow the checklist** - Check off items as you complete
3. **Test thoroughly** - Don't skip testing phase
4. **Deploy incrementally** - Test each component before moving on
5. **Monitor after launch** - Watch for errors and performance

**You're ready to go live! 🚀**


