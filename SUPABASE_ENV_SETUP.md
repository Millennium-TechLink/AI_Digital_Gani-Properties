# Supabase Environment Variables Setup

## ✅ Your Supabase Credentials

I've captured your Supabase credentials. Here's how to set them up:

## 📝 Step 1: Create `.env` File

Create a file named `.env` in the **root directory** of your project (same level as `package.json`).

## 📝 Step 2: Add These Variables

Copy and paste this into your `.env` file:

```env
# Supabase Configuration (REQUIRED)
VITE_SUPABASE_URL=https://oacpemdmeemulfkgxhui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU

# Site URL (for sitemap and SEO)
VITE_SITE_URL=https://ourganiproperties.com

# API URL (for serverless functions - set this when deploying to Vercel)
# VITE_API_URL=https://your-app.vercel.app/api
```

## 📝 Step 3: For Serverless Functions (Vercel)

When you deploy to Vercel, add these environment variables in **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

```env
# Supabase (for serverless functions)
SUPABASE_URL=https://oacpemdmeemulfkgxhui.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk3ODUyNywiZXhwIjoyMDc5NTU0NTI3fQ.HQUpUfMCcCExztNDnTqHsDfUqBZOS3PRovKRvzGyEMU

# Authentication (for admin login)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# Email (Resend - if using)
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=info@ourganiproperties.com
FROM_EMAIL=noreply@resend.dev

# Site
SITE_URL=https://ourganiproperties.com
```

## ⚠️ Important Security Notes

1. **Never commit `.env` to Git** - It's already in `.gitignore`
2. **Service Key is Secret** - The `VITE_SUPABASE_SERVICE_KEY` should ideally NOT be in frontend code, but it's currently in your codebase. Consider moving admin operations to serverless functions only.
3. **Anon Key is Public** - Safe to use in frontend code

## ✅ Verify Setup

After creating the `.env` file:

1. Restart your dev server if it's running:
   ```bash
   # Stop the server (Ctrl+C)
   npm run dev
   ```

2. Check browser console - you should NOT see the warning:
   ```
   Supabase environment variables not set. Some features may not work.
   ```

## 🎯 Next Steps

1. ✅ Create `.env` file with the variables above
2. ✅ Run the remaining SQL setup (`scripts/complete-supabase-setup.sql`)
3. ✅ Create storage bucket in Supabase Dashboard
4. ✅ Test the connection

---

**Your Supabase Project URL:** `https://oacpemdmeemulfkgxhui.supabase.co`

