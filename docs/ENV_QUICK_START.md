# Environment Variables Quick Start

## Create and Use `.env` File for Netlify Deployment

### Step 1: Create `.env` File

```bash
# Copy the example template
cp ENV_EXAMPLE.txt .env
```

### Step 2: Fill in Your Values

Edit `.env` file and replace placeholder values:

```env
# Required for Frontend
VITE_SITE_URL=https://your-site.netlify.app
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Required for Backend Functions
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key
JWT_SECRET=your-secret-key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-password
```

### Step 3: Set Variables in Netlify

**Easy Way (Using Script):**
```bash
# Login to Netlify first
netlify login

# Set all variables from .env file
npm run netlify:env:set
```

**Manual Way:**
1. Go to Netlify dashboard
2. Site settings → Environment variables
3. Add each variable from your `.env` file

### Step 4: Deploy

```bash
netlify deploy --prod
```

---

## That's It! 🎉

Your environment variables are now set and you can deploy directly.

---

## Tips

- ✅ `.env` is already in `.gitignore` - safe to use
- ✅ Use `npm run netlify:env:set:dry` to preview what will be set
- ✅ Frontend vars need `VITE_` prefix
- ✅ Backend vars should NOT have `VITE_` prefix

For more details, see `docs/ENV_SETUP.md`
