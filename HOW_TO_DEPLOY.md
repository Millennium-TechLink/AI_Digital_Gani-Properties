# How to Deploy - Quick Summary

## 🚀 Deployment Overview

You have **3 components** to deploy:
1. **Main Website** (React/Vite) - Root directory
2. **Admin Dashboard** (React/Vite) - `pipeline/dashboard` directory  
3. **API Routes** (Serverless Functions) - `api/` folder (deploys with main website)

---

## 📋 Quick Steps

### 1. Setup Supabase (15 minutes)
- Create account at https://supabase.com
- Create new project
- Run SQL schema (see `DEPLOYMENT_STEPS.md`)
- Create storage bucket: `property-images`
- Copy API keys

### 2. Deploy Website (10 minutes)
- Go to https://vercel.com
- Click "Add New Project"
- Import your GitHub repo
- Settings:
  - Framework: **Vite**
  - Root: `./` (default)
  - Build: `npm run build`
  - Output: `dist`
- Add environment variables (see below)
- Deploy!

### 3. Deploy Dashboard (10 minutes)
- In Vercel, click "Add New Project" again
- Import **same** GitHub repo
- Settings:
  - Framework: **Vite**
  - Root: **`pipeline/dashboard`** ⚠️ **IMPORTANT!**
  - Build: `npm run build`
  - Output: `dist`
- Add environment variables (see below)
- Deploy!

---

## 🔑 Environment Variables

### Website Project (Vercel)
```
VITE_SITE_URL=https://your-website.vercel.app
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_GOOGLE_SHEETS_WEB_APP_URL=your-google-sheets-url
```

### Dashboard Project (Vercel)
```
VITE_API_URL=https://your-website.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=generate-random-string-here
```

### API (Same as Website Project - add these too)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
JWT_SECRET=same-as-dashboard
```

**⚠️ Important**: After adding environment variables, **redeploy** both projects!

---

## 📚 Detailed Guides

- **Full Step-by-Step**: See `DEPLOYMENT_STEPS.md`
- **Checklist**: See `DEPLOYMENT_CHECKLIST.md`
- **Troubleshooting**: Check Vercel deployment logs

---

## ✅ After Deployment

1. Test website: Visit your website URL
2. Test dashboard: Visit your dashboard URL and login
3. Test API: Visit `https://your-website.vercel.app/api/properties`
4. Update sitemap: Run `npm run generate-sitemap`

---

## 🆘 Common Issues

**Build fails?**
- Check Vercel build logs
- Run `npm run build` locally to see errors

**Dashboard can't connect to API?**
- Verify `VITE_API_URL` points to website URL + `/api`
- Check both projects are deployed

**Can't login to dashboard?**
- Verify `JWT_SECRET` is same in dashboard and API env vars
- Check API URL is correct

**Images not uploading?**
- Verify Supabase storage bucket is public
- Check service role key is correct

---

## 💰 Cost

**Free tier is sufficient for most use cases:**
- Vercel: Free (100GB bandwidth/month)
- Supabase: Free (500MB database, 1GB storage)

---

**Need more help?** Check the detailed guides or Vercel/Supabase documentation.

Good luck! 🎉


