# Deployment Checklist

## ✅ Ready for Deployment

Your project is configured for Vercel deployment with serverless functions. Here's what you need to do:

## 🔧 Required Environment Variables

Set these in your Vercel project settings (Settings → Environment Variables):

### **Backend/API Variables** (for serverless functions):
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
JWT_SECRET=your_secure_random_secret_key
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_secure_admin_password
```

### **Frontend Variables** (optional, but recommended):
```
VITE_SITE_URL=https://yourdomain.com
VITE_GOOGLE_SHEETS_WEB_APP_URL=your_google_script_url
```

**Note:** `VITE_API_URL` is NOT needed in production - the app uses `/api` automatically.

## 📋 Pre-Deployment Checklist

- [ ] **Supabase Setup**
  - [ ] Create/verify Supabase project
  - [ ] Create `properties` table with required columns
  - [ ] Get Supabase URL and Service Key
  - [ ] Test database connection

- [ ] **Environment Variables**
  - [ ] Set all required environment variables in Vercel
  - [ ] Use strong, unique values for `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`
  - [ ] Verify `VITE_SITE_URL` matches your domain

- [ ] **Build Test**
  - [ ] Run `npm run build` locally to ensure no build errors
  - [ ] Test the build output with `npm run preview`

- [ ] **Database Schema**
  - [ ] Ensure `properties` table exists with columns:
    - `id` (text/uuid, primary key)
    - `slug` (text, unique)
    - `title` (text)
    - `type` (text)
    - `city` (text)
    - `area` (text)
    - `price_label` (text, nullable)
    - `size` (text, nullable)
    - `status` (text)
    - `highlights` (json/text)
    - `lat` (numeric, nullable)
    - `lon` (numeric, nullable)
    - `images` (json/text array)
    - `description` (text)
    - `posted_at` (timestamp)
    - `updated_at` (timestamp, nullable)

## 🚀 Deployment Steps

1. **Push to GitHub/GitLab/Bitbucket**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Vercel**
   - Connect your repository to Vercel
   - Vercel will auto-detect the framework (Vite)
   - Add environment variables in Vercel dashboard
   - Deploy!

3. **Verify Deployment**
   - Test the homepage loads
   - Test `/properties` page loads properties
   - Test `/dashboard` login works
   - Test creating/editing/deleting properties

## ⚠️ Important Notes

1. **Local Development Server**: The `server.js` file is ONLY for local development. Vercel uses the serverless functions in the `api/` folder.

2. **Database**: You MUST use Supabase for production. The file-based storage (`server.js`) won't work on Vercel serverless functions.

3. **API Routes**: All API routes are configured at `/api/*` and will be handled by Vercel serverless functions.

4. **Build Command**: `npm run build` (already configured in `vercel.json`)

5. **Output Directory**: `dist` (already configured)

## 🔍 Troubleshooting

### Build Fails
- Check TypeScript errors: `npm run lint`
- Verify all dependencies are in `package.json`
- Check Node version (requires Node 22.x)

### API Errors
- Verify environment variables are set in Vercel
- Check Supabase connection and table schema
- Check Vercel function logs for errors

### Dashboard Login Not Working
- Verify `ADMIN_USERNAME` and `ADMIN_PASSWORD` are set
- Check `JWT_SECRET` is set
- Verify API route `/api/auth/login` is accessible

## 📝 Production Checklist

After deployment:

- [ ] Test all public pages load correctly
- [ ] Test property listing and filtering
- [ ] Test property detail pages
- [ ] Test dashboard login
- [ ] Test creating a property
- [ ] Test editing a property
- [ ] Test deleting a property
- [ ] Test contact forms
- [ ] Verify SEO meta tags
- [ ] Check mobile responsiveness
- [ ] Test image loading
- [ ] Verify Google Maps integration (if used)

## 🔐 Security Reminders

- ✅ Use strong, unique passwords for `ADMIN_PASSWORD`
- ✅ Use a secure, random `JWT_SECRET`
- ✅ Never commit `.env` files (already in `.gitignore`)
- ✅ Keep Supabase Service Key secure
- ✅ Regularly rotate credentials


