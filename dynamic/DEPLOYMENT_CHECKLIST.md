# Netlify Deployment Checklist - Dynamic Version

## ✅ Pre-Deployment Checks

### Code Quality
- [x] Error boundary added
- [x] Error handling in all API calls
- [x] Null/undefined checks throughout
- [x] Image fallback handling
- [x] Loading states for async operations
- [x] Empty state handling

### Configuration Files
- [x] `netlify.toml` created with redirects
- [x] `public/_redirects` created
- [x] `vite.config.ts` optimized for production
- [x] `package.json` dependencies correct

### Environment Variables Required
Set these in Netlify Dashboard → Site Settings → Environment Variables:

**Required:**
```
VITE_API_URL=https://your-api.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

**Optional:**
```
VITE_SITE_URL=https://your-site.netlify.app
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/...
```

## 🚀 Deployment Steps

### 1. Build Locally First
```bash
cd dynamic
npm install
npm run build
npm run preview
# Test that preview works on http://localhost:4173
```

### 2. Push to GitHub
```bash
git add dynamic/
git commit -m "Add dynamic version with Netlify config"
git push
```

### 3. Deploy on Netlify

**Option A: Via Dashboard**
1. Go to https://app.netlify.com
2. Add new site → Import from Git
3. Select repository
4. Configure:
   - **Base directory:** `dynamic` (if repo root) or leave blank (if dynamic is repo root)
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Add environment variables
6. Deploy

**Option B: Via CLI**
```bash
cd dynamic
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

### 4. Verify Deployment

After deployment, check:
- [ ] Homepage loads
- [ ] All routes work (no 404s)
- [ ] Properties page loads
- [ ] Property detail pages work
- [ ] Images load correctly
- [ ] No console errors
- [ ] API calls work
- [ ] Forms submit (if applicable)

## 🐛 Common Issues & Fixes

### Blank Page
**Cause:** Missing redirects or environment variables
**Fix:** 
- Verify `netlify.toml` and `_redirects` are committed
- Check environment variables are set
- Clear Netlify cache and redeploy

### API Not Working
**Cause:** Missing or incorrect `VITE_API_URL`
**Fix:**
- Set `VITE_API_URL` in Netlify environment variables
- Ensure API is deployed and accessible
- Check CORS settings on API

### Images Not Loading
**Cause:** Broken image URLs or missing fallbacks
**Fix:**
- Check image URLs in database
- Verify fallback image exists in `public/images/`
- Check browser console for 404s

### Build Fails
**Cause:** TypeScript errors or missing dependencies
**Fix:**
- Run `npm run build` locally first
- Check build logs in Netlify
- Fix TypeScript errors
- Ensure all dependencies are in `package.json`

### Properties Not Showing
**Cause:** Database empty or API connection issues
**Fix:**
- Verify Supabase database has properties
- Check `VITE_API_URL` is correct
- Verify API endpoints work
- Check browser console for errors

## 📊 Post-Deployment Monitoring

1. **Check Netlify Analytics:**
   - Site visits
   - Page load times
   - Error rates

2. **Monitor Console Errors:**
   - Check browser console regularly
   - Set up error tracking (optional)

3. **Test User Flows:**
   - Browse properties
   - View property details
   - Use filters
   - Submit contact form

4. **Performance:**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Optimize images if needed

## 🔒 Security Checklist

- [x] Environment variables not exposed in client code
- [x] API endpoints protected with authentication
- [x] CORS configured correctly
- [x] Headers added in `netlify.toml`
- [x] Input validation on all forms

## 📝 Notes

- The dynamic version requires a working API
- If API is unavailable, pages will show empty states gracefully
- All errors are caught and handled gracefully
- Production builds have sourcemaps disabled for smaller bundle size

---

**Ready to deploy? Follow the steps above!** 🚀

