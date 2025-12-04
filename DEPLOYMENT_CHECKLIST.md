# Quick Deployment Checklist

Use this checklist to ensure everything is ready for deployment.

## Pre-Deployment

### Code Preparation
- [ ] All code is committed to Git
- [ ] Code is pushed to GitHub/GitLab
- [ ] No `.env` files are committed (use `.env.example` instead)
- [ ] All dependencies are in `package.json`
- [ ] Build works locally: `npm run build` (in root)
- [ ] Dashboard build works: `cd pipeline/dashboard && npm run build`

### Supabase Setup
- [ ] Supabase project created
- [ ] Database schema created (properties table)
- [ ] Storage bucket created (`property-images`)
- [ ] API keys copied:
  - [ ] Project URL
  - [ ] Anon key
  - [ ] Service role key

### Accounts Ready
- [ ] Vercel account created
- [ ] GitHub repository ready
- [ ] Supabase project ready

---

## Deployment Steps

### Website Deployment
- [ ] Vercel project created for main website
- [ ] Root directory: `./` (default)
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_SITE_URL`
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_GOOGLE_SHEETS_WEB_APP_URL` (if using)
- [ ] Deployment successful
- [ ] Website URL saved: `_________________`

### Dashboard Deployment
- [ ] Vercel project created for dashboard
- [ ] Root directory: `pipeline/dashboard` ⚠️
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Environment variables added:
  - [ ] `VITE_API_URL` (website URL + `/api`)
  - [ ] `VITE_SUPABASE_URL`
  - [ ] `VITE_SUPABASE_ANON_KEY`
  - [ ] `VITE_SUPABASE_SERVICE_KEY`
  - [ ] `JWT_SECRET` (random secure string)
- [ ] Deployment successful
- [ ] Dashboard URL saved: `_________________`

### API Configuration
- [ ] API routes in `api/` folder are correct
- [ ] Environment variables in Vercel (for API):
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_SERVICE_KEY`
  - [ ] `JWT_SECRET` (same as dashboard)

---

## Post-Deployment Testing

### Website Tests
- [ ] Homepage loads
- [ ] Properties page loads
- [ ] Property details page works
- [ ] Contact form works
- [ ] All navigation links work
- [ ] Images load correctly
- [ ] Mobile responsive

### Dashboard Tests
- [ ] Login page loads
- [ ] Can log in with credentials
- [ ] Dashboard home loads
- [ ] Can view properties list
- [ ] Can create new property
- [ ] Can upload images
- [ ] Can edit property
- [ ] Can delete property

### API Tests
- [ ] `GET /api/properties` returns data
- [ ] `GET /api/properties/[id]` works
- [ ] `POST /api/properties` requires auth
- [ ] Authentication works

---

## Environment Variables Reference

### Website (Main Project)
```
VITE_SITE_URL=https://your-website.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/...
```

### Dashboard (Separate Project)
```
VITE_API_URL=https://your-website.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_SUPABASE_SERVICE_KEY=eyJhbGc... (service_role key)
JWT_SECRET=your-random-secret-string-here
```

### API (Same as Website Project)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGc... (service_role key)
JWT_SECRET=your-random-secret-string-here (same as dashboard)
```

---

## Important Notes

1. **Root Directory**: Dashboard MUST have root directory set to `pipeline/dashboard` in Vercel
2. **JWT_SECRET**: Must be the same in both dashboard and API environment variables
3. **API_URL**: Dashboard's `VITE_API_URL` should point to your website URL + `/api`
4. **Redeploy**: After adding environment variables, always redeploy

---

## Quick Commands

```bash
# Test website build
npm run build

# Test dashboard build
cd pipeline/dashboard
npm run build

# Check for TypeScript errors
npm run lint

# Generate sitemap (after deployment)
npm run generate-sitemap
```

---

## Support Resources

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Project Deployment Guide: `DEPLOYMENT_STEPS.md`

---

**Status**: ⬜ Not Started | 🟡 In Progress | ✅ Complete


