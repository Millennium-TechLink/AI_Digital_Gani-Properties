# Environment Variables Setup Guide

This guide explains how to set up environment variables for Netlify deployment using a `.env` file.

---

## Quick Start

### 1. Create `.env` File

Create a `.env` file in the project root (copy from template below):

```bash
# Copy the template
cp ENV_EXAMPLE.txt .env
```

### 2. Fill in Your Values

Edit `.env` and replace all placeholder values with your actual credentials:

```env
# Frontend Variables (VITE_ prefix)
VITE_SITE_URL=https://your-site.netlify.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Backend Variables (No VITE_ prefix)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-secret-jwt-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
```

### 3. Set Variables in Netlify

**Option A: Using Script (Recommended)**
```bash
# Make sure you're logged in to Netlify
netlify login

# Set all variables from .env file
npm run netlify:env:set

# Or for a specific site
npm run netlify:env:set -- --site=your-site-name

# Dry run (see what would be set without actually setting)
npm run netlify:env:set:dry
```

**Option B: Manual Setup**
1. Go to Netlify dashboard
2. Select your site
3. Go to Site settings → Environment variables
4. Add each variable from your `.env` file

---

## Complete `.env` Template

```env
# ============================================
# Frontend Variables (VITE_ prefix)
# ============================================
VITE_SITE_URL=https://your-site.netlify.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec

# ============================================
# Backend Variables (No VITE_ prefix)
# ============================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_KEY=your-supabase-service-key
JWT_SECRET=your-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-admin-password

# ============================================
# Dashboard Variables (for pipeline/dashboard)
# ============================================
VITE_API_URL=https://your-main-site.netlify.app/.netlify/functions
VITE_SUPABASE_SERVICE_KEY=your-supabase-service-key

# ============================================
# Optional: CAPTCHA
# ============================================
GP_HCAPTCHA_SITEKEY=your-hcaptcha-site-key
GP_HCAPTCHA_SECRET=your-hcaptcha-secret
```

---

## Important Notes

### Variable Prefixes

- **Frontend variables** MUST have `VITE_` prefix
  - These are bundled into your frontend code
  - Example: `VITE_SUPABASE_URL`

- **Backend variables** should NOT have `VITE_` prefix
  - These are only available to Netlify Functions (server-side)
  - Example: `SUPABASE_SERVICE_KEY`

### Security

- ✅ `.env` is already in `.gitignore` - it won't be committed
- ✅ Never commit `.env` file to git
- ✅ Use `.env.example` or `ENV_EXAMPLE.txt` as a template
- ✅ Keep your `.env` file secure and local

### Where to Get Values

1. **Supabase Keys**:
   - Go to Supabase dashboard → Settings → API
   - Copy Project URL, `anon` key, and `service_role` key

2. **Site URL**:
   - Your Netlify site URL (e.g., `https://your-site.netlify.app`)

3. **JWT Secret**:
   - Generate a secure random string
   - Use: `openssl rand -base64 32` or any password generator

4. **Admin Password**:
   - Choose a strong password for dashboard access

---

## Setting Variables for Multiple Sites

### Main Website
```bash
# Set variables for main site
npm run netlify:env:set -- --site=gani-properties
```

### Dashboard
```bash
# Set variables for dashboard site
npm run netlify:env:set -- --site=gani-properties-dashboard
```

Or manually set in Netlify dashboard for each site.

---

## Verifying Variables

### Check in Netlify Dashboard
1. Go to Site settings → Environment variables
2. Verify all variables are set correctly

### Test Locally
```bash
# Load .env and run dev server
npm run dev
```

The dev server will use variables from `.env` file.

---

## Troubleshooting

### Variables Not Working in Production
- Make sure variables are set in Netlify dashboard
- Redeploy after setting variables: `netlify deploy --prod`
- Check variable names match exactly (case-sensitive)

### Frontend Can't Access Variables
- Ensure variables have `VITE_` prefix
- Rebuild after changing variables: `npm run build`

### Backend Functions Can't Access Variables
- Ensure variables do NOT have `VITE_` prefix
- Check Netlify function logs for errors

### Script Fails
- Make sure you're logged in: `netlify login`
- Check `.env` file exists and has correct format
- Verify Netlify CLI is installed: `npm install -g netlify-cli`

---

## Example Workflow

```bash
# 1. Create .env file
cp ENV_EXAMPLE.txt .env

# 2. Edit .env with your values
# (use your editor)

# 3. Login to Netlify
netlify login

# 4. Set variables for main site
npm run netlify:env:set -- --site=gani-properties

# 5. Deploy
netlify deploy --prod
```

---

## Next Steps

After setting environment variables:
1. Deploy your site: `netlify deploy --prod`
2. Test your site to verify everything works
3. Set up dashboard site with its own variables
4. Enable continuous deployment from Git

For more details, see:
- `docs/NETLIFY_QUICK_START.md` - Quick deployment guide
- `docs/NETLIFY_DEPLOYMENT_GUIDE.md` - Complete deployment guide
