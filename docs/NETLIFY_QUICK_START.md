# Netlify Deployment Quick Start
## Get Your Site Live on Netlify in 30 Minutes

---

## Prerequisites Checklist

- [ ] GitHub/GitLab/Bitbucket repository
- [ ] Netlify account (free at netlify.com)
- [ ] Supabase account (free at supabase.com)
- [ ] Node.js 22.x installed locally

---

## Step 1: Setup Supabase (10 minutes)

### 1.1 Create Project
1. Go to https://supabase.com → Sign up
2. Create new project → Choose region
3. Wait for setup (2-3 minutes)

### 1.2 Create Database
1. Go to SQL Editor
2. Run this SQL:

```sql
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

CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);

ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public read access" ON properties;
CREATE POLICY "Public read access" ON properties FOR SELECT USING (true);
```

### 1.3 Setup Storage
1. Go to Storage → Create bucket
2. Name: `property-images`
3. Set to **Public**
4. Max file size: 5MB

### 1.4 Get API Keys
1. Go to Settings → API
2. Copy:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

---

## Step 2: Deploy Main Website (10 minutes)

### 2.1 Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2.2 Login & Initialize
```bash
netlify login
netlify init
```

Follow prompts:
- Create new site? **Yes**
- Site name: **gani-properties** (or your choice)
- Build command: **npm run build**
- Publish directory: **dist**
- Functions directory: **api**

### 2.3 Set Environment Variables
```bash
# Frontend variables (VITE_ prefix)
netlify env:set VITE_SITE_URL "https://your-site.netlify.app"
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"

# Backend variables (no VITE_ prefix)
netlify env:set SUPABASE_URL "https://your-project.supabase.co"
netlify env:set SUPABASE_ANON_KEY "your-anon-key"
netlify env:set SUPABASE_SERVICE_KEY "your-service-key"
netlify env:set JWT_SECRET "your-secret-jwt-key"
netlify env:set ADMIN_USERNAME "admin"
netlify env:set ADMIN_PASSWORD "your-secure-password"
```

### 2.4 Deploy
```bash
netlify deploy --prod
```

**OR** connect to Git for auto-deploy:
1. Go to Netlify dashboard
2. Add new site → Import from Git
3. Select repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `api`
5. Add environment variables (same as above)
6. Deploy!

---

## Step 3: Deploy Dashboard (10 minutes)

### 3.1 Create Separate Site
1. Go to Netlify dashboard
2. Add new site → Import from Git
3. Select **same repository**
4. Build settings:
   - **Base directory**: `pipeline/dashboard`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: (leave empty)

### 3.2 Set Dashboard Environment Variables
```bash
cd pipeline/dashboard
netlify init
# Follow prompts, then:
```

```bash
netlify env:set VITE_API_URL "https://your-main-site.netlify.app/.netlify/functions"
netlify env:set VITE_SUPABASE_URL "https://your-project.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-key"
netlify env:set VITE_SUPABASE_SERVICE_KEY "your-service-key"
```

### 3.3 Deploy Dashboard
```bash
netlify deploy --prod
```

---

## Step 4: Test Everything

### 4.1 Test Main Website
- Visit your Netlify URL
- Check property listings load
- Test property details page
- Test search/filters

### 4.2 Test API
```bash
# Test properties endpoint
curl https://your-site.netlify.app/.netlify/functions/properties

# Test auth
curl -X POST https://your-site.netlify.app/.netlify/functions/auth-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"your-password"}'
```

### 4.3 Test Dashboard
- Visit dashboard URL
- Login with admin credentials
- Test creating/editing properties
- Test image uploads (to Supabase Storage)

---

## ✅ You're Live!

Your deployment is complete:
- ✅ Main website: `https://your-site.netlify.app`
- ✅ Dashboard: `https://your-dashboard.netlify.app`
- ✅ API Functions: Working at `/.netlify/functions/*`
- ✅ Database: Supabase
- ✅ Auto-deploy: Enabled (if connected to Git)

---

## Troubleshooting

### Functions Not Working?
- Check function logs in Netlify dashboard
- Verify `functions = "api"` in `netlify.toml`
- Check environment variables are set correctly

### Build Failing?
- Check Node version is 22
- Verify all dependencies in `package.json`
- Check build logs in Netlify dashboard

### CORS Errors?
- Functions include CORS headers automatically
- Check browser console for specific errors

### Environment Variables Not Working?
- Functions need server-side vars (no `VITE_` prefix)
- Frontend needs `VITE_` prefixed vars
- Redeploy after adding env vars

---

## Next Steps

1. **Custom Domain**
   - Go to Site settings → Domain management
   - Add your domain
   - Update DNS records

2. **Monitor Usage**
   - Check Netlify analytics
   - Monitor Supabase usage
   - Watch function invocations

3. **Optimize**
   - Enable Netlify Edge Functions
   - Optimize images
   - Use CDN caching

---

## Need Help?

- Full guide: `docs/NETLIFY_DEPLOYMENT_GUIDE.md`
- Netlify Docs: https://docs.netlify.com
- Supabase Docs: https://supabase.com/docs

---

**🎉 Congratulations! Your site is live!**
