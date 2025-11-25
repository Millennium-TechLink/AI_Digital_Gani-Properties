# 🚀 Go Live Checklist - Step by Step
## Complete Guide to Deploy Your Website

---

## ✅ Current Status

You've completed:
- ✅ Supabase project created
- ✅ Database credentials obtained
- ✅ Website URL configured (`https://ourganiproperties.com`)
- ✅ Email addresses updated
- ✅ Sitemap and robots.txt updated

---

## 📋 Step-by-Step Deployment Process

### **STEP 1: Complete Supabase Setup** (15 minutes)

#### 1.1 Run Remaining SQL Script
1. Open Supabase Dashboard → **SQL Editor**
2. Open `scripts/complete-supabase-setup.sql` in your project
3. Copy the entire contents
4. Paste into SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. Verify success message

#### 1.2 Create Storage Bucket
1. In Supabase Dashboard → Click **Storage** (left sidebar)
2. Click **New bucket**
3. Fill in:
   - **Name**: `property-images`
   - **Public bucket**: ✅ **Enable** (check the box)
   - **File size limit**: `5 MB`
4. Click **Create bucket**

#### 1.3 Verify Setup
1. Go to **Table Editor** → Verify you see:
   - ✅ `properties` table
   - ✅ `form_submissions` table
2. Go to **Storage** → Verify you see:
   - ✅ `property-images` bucket (Public)

---

### **STEP 2: Setup Contact Form (Google Sheets)** (5 minutes)

#### 2.1 Google Sheets Web App URL
Your Google Apps Script is already deployed! ✅

**Your Web App URL:**
```
https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec
```

#### 2.2 Add to Vercel Environment Variables
1. Go to Vercel Dashboard → Your **Website Project** → **Settings** → **Environment Variables**
2. Add new variable:
   - **Name**: `VITE_GOOGLE_SHEETS_WEB_APP_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec`
   - **Environments**: Select all (Production, Preview, Development)
3. Click **Save**
4. **Redeploy** your website (Deployments → 3 dots → Redeploy)

#### 2.3 Verify Setup
- ✅ Web App URL is working (tested)
- ✅ Environment variable added to Vercel
- ✅ Website redeployed

**Note:** Contact form now saves to Google Sheets and sends email to `info@ganiproperties.com` automatically.

---

### **STEP 2 (OLD): Setup Email Service (Resend)** (10 minutes) - ⚠️ SKIP THIS

#### 2.1 Create Resend Account
1. Go to https://resend.com
2. Sign up (free - 3,000 emails/month)
3. Verify your email

#### 2.2 Get API Key
1. In Resend Dashboard → Click **API Keys**
2. Click **Create API Key**
3. Name it: `Gani Properties Production`
4. Copy the API key (starts with `re_`)
5. ⚠️ **Save it securely** - you'll need it for Vercel

#### 2.3 (Optional) Verify Domain
- For now, you can use `noreply@resend.dev` for testing
- Later, verify `ourganiproperties.com` to use `noreply@ourganiproperties.com`

---

### **STEP 3: Create Local .env File** (5 minutes)

Create a file named `.env` in your project root with:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://oacpemdmeemulfkgxhui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU

# Site Configuration
VITE_SITE_URL=https://ourganiproperties.com

# API URL (will be set after Vercel deployment)
# VITE_API_URL=https://your-app.vercel.app/api
```

**Important**: The `.env` file is already in `.gitignore`, so it won't be committed to Git.

---

### **STEP 4: Test Locally** (10 minutes)

#### 4.1 Install Dependencies
```bash
npm install
```

#### 4.2 Start Development Server
```bash
npm run dev
```

#### 4.3 Test Features
- [ ] Website loads at `http://localhost:5173`
- [ ] No console errors
- [ ] Properties page loads (may be empty if no data)
- [ ] Contact form displays correctly

#### 4.4 (Optional) Migrate Existing Properties
If you have properties in `src/data/properties.json`:

1. Add to `.env`:
   ```env
   SUPABASE_URL=https://oacpemdmeemulfkgxhui.supabase.co
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU
   ```

2. Run migration:
   ```bash
   node scripts/migrate-properties-to-supabase.js
   ```

3. Verify in Supabase → Table Editor → `properties`

---

### **STEP 5: Push Code to GitHub** (5 minutes)

#### 5.1 Initialize Git (if not done)
```bash
git init
git add .
git commit -m "Initial commit - Ready for deployment"
```

#### 5.2 Create GitHub Repository
1. Go to https://github.com/new
2. Repository name: `gani-properties` (or your choice)
3. Set to **Private** (recommended)
4. Click **Create repository**

#### 5.3 Push Code
```bash
git remote add origin https://github.com/YOUR_USERNAME/gani-properties.git
git branch -M main
git push -u origin main
```

---

### **STEP 6: Deploy to Vercel** (30 minutes)

You need to create **2 separate Vercel projects** from the same GitHub repository:
1. **Website Project** (main site - root directory)
2. **Dashboard Project** (admin dashboard - `pipeline/dashboard` directory)

---

#### 6.1 Create Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub (easiest)
3. Authorize Vercel to access your GitHub

---

#### 6.2 Create PROJECT 1: Website (Main Site)

##### 6.2.1 Import Repository
1. In Vercel Dashboard → Click **Add New** → **Project**
2. Click **Import Git Repository**
3. Select: `aidigitalteam25/gani-properties` (or your repository name)
4. Click **Import**

##### 6.2.2 Configure Project Settings
**Before clicking Deploy, click "Configure Project":**

- **Project Name**: `gani-properties` (or `gani-properties-website`)
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `./` (leave as default - this is the root)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

##### 6.2.3 Add Environment Variables (Website)
Click **Environment Variables** and add these:

**Frontend Variables (VITE_ prefix):**
```
VITE_SUPABASE_URL = https://oacpemdmeemulfkgxhui.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU
VITE_SITE_URL = https://ourganiproperties.com
```

**Serverless Functions Variables (no VITE_ prefix):**
```
SUPABASE_URL = https://oacpemdmeemulfkgxhui.supabase.co
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU

ADMIN_USERNAME = admin
ADMIN_PASSWORD = [CREATE_A_STRONG_PASSWORD_HERE]
JWT_SECRET = [GENERATE_A_RANDOM_32_CHAR_STRING]
JWT_EXPIRES_IN = 24h

RESEND_API_KEY = [YOUR_RESEND_API_KEY_FROM_STEP_2]
ADMIN_EMAIL = info@ourganiproperties.com
FROM_EMAIL = noreply@resend.dev
SITE_URL = https://ourganiproperties.com
```

**Important Notes:**
- Replace `[CREATE_A_STRONG_PASSWORD_HERE]` with a strong password for admin login
- Replace `[GENERATE_A_RANDOM_32_CHAR_STRING]` with a random 32+ character string (you can use: `openssl rand -hex 32` or an online generator)
- Replace `[YOUR_RESEND_API_KEY_FROM_STEP_2]` with your Resend API key

##### 6.2.4 Deploy Website
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. **Note the deployment URL** (e.g., `https://gani-properties.vercel.app`)

##### 6.2.5 Add API URL (After First Deployment)
After the website deploys, you need to add the API URL:
1. Go to **Settings** → **Environment Variables**
2. Add: `VITE_API_URL = https://gani-properties.vercel.app/api` (use your actual URL)
3. Click **Save**
4. Go to **Deployments** tab → Click the **3 dots** on latest deployment → **Redeploy**

---

#### 6.3 Create PROJECT 2: Dashboard (Admin Panel)

##### 6.3.1 Import Same Repository Again
1. In Vercel Dashboard → Click **Add New** → **Project** (again)
2. Click **Import Git Repository**
3. Select: `aidigitalteam25/gani-properties` (same repository!)
4. Click **Import**

##### 6.3.2 Configure Project Settings (IMPORTANT!)
**Before clicking Deploy, click "Configure Project":**

- **Project Name**: `gani-properties-dashboard`
- **Framework Preset**: `Vite` (should auto-detect)
- **Root Directory**: `pipeline/dashboard` ⚠️ **CHANGE THIS!** (Click "Edit" and type: `pipeline/dashboard`)
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

**⚠️ CRITICAL:** Make sure the Root Directory is set to `pipeline/dashboard` - this tells Vercel to build from the dashboard folder, not the root!

##### 6.3.3 Add Environment Variables (Dashboard)
Click **Environment Variables** and add:

```
VITE_API_URL = https://gani-properties.vercel.app/api
VITE_SUPABASE_URL = https://oacpemdmeemulfkgxhui.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU
VITE_SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU
```

**Note:** Replace `https://gani-properties.vercel.app` with your actual website URL from Step 6.2.4

##### 6.3.4 Deploy Dashboard
1. Click **Deploy**
2. Wait 2-3 minutes for build to complete
3. **Note the dashboard URL** (e.g., `https://gani-properties-dashboard.vercel.app`)

---

#### 6.4 Verify Both Deployments

You should now have:
- ✅ **Website**: `https://gani-properties.vercel.app` (or similar)
- ✅ **Dashboard**: `https://gani-properties-dashboard.vercel.app` (or similar)

**Test:**
- Visit the website URL - should show your main site
- Visit the dashboard URL - should show the admin login page

---

### **STEP 7: Connect Custom Domain** (10 minutes)

#### 7.1 Add Domain in Vercel
1. In Vercel Dashboard → Your Project → **Settings** → **Domains**
2. Enter: `ourganiproperties.com`
3. Click **Add**
4. Vercel will show DNS records to add

#### 7.2 Update DNS Records
1. Go to your domain registrar (where you bought `ourganiproperties.com`)
2. Add the DNS records Vercel provided:
   - Usually an **A record** or **CNAME**
   - Example: `CNAME ourganiproperties.com → cname.vercel-dns.com`

#### 7.3 Wait for Propagation
- DNS changes take 5 minutes to 48 hours
- Usually works within 1-2 hours
- Vercel will show "Valid Configuration" when ready

#### 7.4 Update Environment Variables
Once domain is connected:
1. Update `VITE_SITE_URL` to `https://ourganiproperties.com`
2. Update `SITE_URL` to `https://ourganiproperties.com`
3. Redeploy

---

### **STEP 8: Final Testing** (15 minutes)

Test on your live website:

#### 8.1 Website Tests
- [ ] Homepage loads
- [ ] Properties page loads
- [ ] Property filters work
- [ ] Individual property pages load
- [ ] Contact form displays
- [ ] All images load correctly

#### 8.2 Form Tests
- [ ] Submit contact form
- [ ] Check email received (to `ADMIN_EMAIL`)
- [ ] Check Supabase → `form_submissions` table has the entry

#### 8.3 API Tests
Visit these URLs (replace with your domain):
- [ ] `https://ourganiproperties.com/api/properties` - Should return properties JSON
- [ ] `https://ourganiproperties.com/api/properties/[id]` - Should return single property

#### 8.4 Dashboard Tests (Optional)
If you set up the admin dashboard:
- [ ] Visit dashboard URL
- [ ] Login works
- [ ] Can view properties
- [ ] Can create/edit/delete properties

---

### **STEP 9: SEO & Final Touches** (10 minutes)

#### 9.1 Regenerate Sitemap
```bash
npm run generate-sitemap
```

#### 9.2 Verify SEO
- [ ] Visit `https://ourganiproperties.com/sitemap.xml`
- [ ] Visit `https://ourganiproperties.com/robots.txt`
- [ ] Check meta tags in page source

#### 9.3 Submit to Search Engines
1. **Google Search Console**: https://search.google.com/search-console
   - Add property: `https://ourganiproperties.com`
   - Submit sitemap: `https://ourganiproperties.com/sitemap.xml`

2. **Bing Webmaster Tools**: https://www.bing.com/webmasters
   - Add site and submit sitemap

---

## 🎉 You're Live!

Your website should now be accessible at:
- **Main Site**: `https://ourganiproperties.com`
- **Vercel URL**: `https://your-app.vercel.app` (backup)

---

## 📊 Monitoring & Maintenance

### Daily Checks
- Check Vercel dashboard for errors
- Check Supabase dashboard for database health
- Monitor form submissions in Supabase

### Weekly Checks
- Review form submissions
- Check website performance
- Review error logs

### Monthly Checks
- Review usage (Supabase, Vercel, Resend)
- Check costs (should be $0 on free tiers)
- Update properties as needed

---

## 🆘 Troubleshooting

### Issue: Website shows blank page
**Solution**: Check browser console for errors. Verify environment variables in Vercel.

### Issue: Forms not submitting
**Solution**: 
- Check Resend API key is correct
- Check `ADMIN_EMAIL` is correct
- Verify Supabase `form_submissions` table exists

### Issue: Properties not loading
**Solution**:
- Check Supabase connection
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check Supabase dashboard → Table Editor → `properties` table has data

### Issue: Images not loading
**Solution**:
- Verify `property-images` bucket exists in Supabase
- Check bucket is set to **Public**
- Verify image URLs in database

---

## 📚 Quick Reference

### Important URLs
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Supabase Dashboard**: https://app.supabase.com
- **Resend Dashboard**: https://resend.com/dashboard
- **Your Website**: https://ourganiproperties.com

### Support
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Resend Docs**: https://resend.com/docs

---

## ✅ Deployment Checklist Summary

- [ ] Step 1: Complete Supabase setup (SQL + Storage)
- [ ] Step 2: Setup Resend (Email service)
- [ ] Step 3: Create local .env file
- [ ] Step 4: Test locally
- [ ] Step 5: Push to GitHub
- [ ] Step 6: Deploy to Vercel
- [ ] Step 7: Connect custom domain
- [ ] Step 8: Final testing
- [ ] Step 9: SEO & final touches

**Total Time**: ~90 minutes  
**Cost**: $0/month (free tiers)

---

**Ready to go live? Start with Step 1! 🚀**

