# Netlify Deployment Guide

## ✅ Configuration Files Created

I've created:
- `netlify.toml` - Netlify build configuration
- `public/_redirects` - SPA redirect rules

## 🚀 Deployment Steps

### Option 1: Deploy via Netlify Dashboard

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add Netlify configuration"
   git push
   ```

2. **Connect to Netlify:**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Set build settings:
     - **Base directory:** `dynamic` (if deploying from root, or leave blank if deploying from dynamic folder)
     - **Build command:** `npm run build`
     - **Publish directory:** `dist`
   - Click "Deploy"

### Option 2: Deploy via Netlify CLI

1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login:**
   ```bash
   netlify login
   ```

3. **Deploy:**
   ```bash
   cd dynamic
   npm run build
   netlify deploy --prod
   ```

## ⚙️ Environment Variables

In Netlify dashboard, go to **Site settings** → **Environment variables** and add:

```
VITE_SITE_URL=https://your-site.netlify.app
VITE_API_URL=https://your-api-url.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Important:** 
- Add these **before** building
- Redeploy after adding environment variables

## 🔍 Troubleshooting Blank Page

### 1. Check Browser Console
Open DevTools (F12) and check for errors:
- JavaScript errors?
- 404 errors for assets?
- CORS errors?
- Missing environment variables?

### 2. Verify Build Output
After build, check that `dist/index.html` exists and has correct asset paths.

### 3. Check Netlify Build Logs
In Netlify dashboard → **Deploys** → Click on latest deploy → Check build logs for errors.

### 4. Verify Redirects
The `_redirects` file should be in `public/_redirects` and will be copied to `dist/_redirects` during build.

### 5. Base Path Issues
If deploying to a subdirectory (e.g., `/dynamic`), you need to set base in `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/dynamic/',
  // ... rest of config
});
```

### 6. Check API Endpoints
If your API is not working:
- Verify `VITE_API_URL` is set correctly
- Check API is deployed and accessible
- Verify CORS settings on API

### 7. Common Issues

**Issue: White screen, no errors**
- Check if `dist/index.html` exists
- Verify script paths in HTML are correct
- Check network tab for failed asset loads

**Issue: 404 on routes**
- Verify `_redirects` file is in `public/` folder
- Check `netlify.toml` redirects are correct

**Issue: API calls failing**
- Check environment variables are set
- Verify API URL is correct
- Check browser console for CORS errors

## 📋 Verification Checklist

- [ ] `netlify.toml` exists in dynamic folder
- [ ] `public/_redirects` exists with `/*    /index.html   200`
- [ ] Build command is `npm run build`
- [ ] Publish directory is `dist`
- [ ] Environment variables are set in Netlify
- [ ] Build completes successfully
- [ ] `dist/index.html` exists after build
- [ ] Assets load correctly (check Network tab)

## 🔧 Quick Fixes

### Fix 1: Clear Cache and Redeploy
1. In Netlify dashboard → **Site settings** → **Build & deploy**
2. Click "Clear cache and deploy site"

### Fix 2: Verify Build Output
```bash
cd dynamic
npm run build
# Check dist folder has index.html and assets
```

### Fix 3: Test Locally
```bash
npm run build
npm run preview
# Visit http://localhost:4173
# If it works locally, issue is with Netlify config
```

## 🆘 Still Not Working?

1. **Check Netlify build logs** for specific errors
2. **Check browser console** for runtime errors
3. **Verify all environment variables** are set
4. **Test API endpoints** manually
5. **Check if base path** needs to be configured

---

**Most Common Issue:** Missing environment variables or incorrect API URL. Double-check these first!

