# How to Get Environment Variable Values

## Lines 32-34: JWT Authentication

### JWT_SECRET (Line 33)
**What it is:** A secret key used to sign and verify JWT tokens for admin authentication.

**How to get it:**
1. **Generate a secure random string** (recommended):
   ```bash
   # On Windows (PowerShell)
   [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
   
   # On Mac/Linux
   openssl rand -base64 32
   
   # Or use an online generator
   # Visit: https://randomkeygen.com/ (use "CodeIgniter Encryption Keys")
   ```

2. **Or create your own:**
   - Use a long random string (at least 32 characters)
   - Mix of letters, numbers, and symbols
   - Example: `my-super-secret-jwt-key-2024-gani-properties-xyz123`

**Example:**
```
JWT_SECRET=a7f3b9c2d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### JWT_EXPIRES_IN (Line 34)
**What it is:** How long the JWT token remains valid.

**Options:**
- `24h` - 24 hours (recommended for admin dashboard)
- `7d` - 7 days
- `30d` - 30 days
- `1h` - 1 hour (more secure, requires frequent login)

**Example:**
```
JWT_EXPIRES_IN=24h
```

---

## Lines 45-46: Dashboard API URL

### VITE_API_URL (Line 46)
**What it is:** The URL where your Netlify Functions (API) are hosted. This is used by the dashboard to communicate with the backend.

**How to get it:**

#### Option 1: After Deploying Main Website
1. Deploy your main website to Netlify first
2. Your site will get a URL like: `https://gani-properties.netlify.app`
3. Add `/.netlify/functions` to the end

**Example:**
```
VITE_API_URL=https://gani-properties.netlify.app/.netlify/functions
```

#### Option 2: Before Deploying (Use Placeholder)
If you haven't deployed yet, use a placeholder and update it later:
```
VITE_API_URL=https://your-site-name.netlify.app/.netlify/functions
```

#### Option 3: Custom Domain
If you have a custom domain:
```
VITE_API_URL=https://api.yourdomain.com/.netlify/functions
```

**Steps to find your exact URL:**
1. Go to Netlify dashboard
2. Select your main website site
3. Copy the site URL (e.g., `https://gani-properties.netlify.app`)
4. Add `/.netlify/functions` to it

**Example:**
- Site URL: `https://gani-properties.netlify.app`
- API URL: `https://gani-properties.netlify.app/.netlify/functions`

---

## Quick Reference: All Values

### From Supabase Dashboard
1. Go to https://supabase.com
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL` and `SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY` and `SUPABASE_ANON_KEY`
   - **service_role secret** key → `SUPABASE_SERVICE_KEY` and `VITE_SUPABASE_SERVICE_KEY`

### From Netlify
1. Deploy your site to Netlify
2. Get your site URL (e.g., `https://your-site.netlify.app`)
3. Use it for:
   - `VITE_SITE_URL=https://your-site.netlify.app`
   - `VITE_API_URL=https://your-site.netlify.app/.netlify/functions`

### Generate Yourself
- **JWT_SECRET**: Use `openssl rand -base64 32` or online generator
- **ADMIN_PASSWORD**: Choose a strong password
- **ADMIN_USERNAME**: Usually `admin` (you can change it)

---

## Step-by-Step: Getting All Values

### 1. Supabase Values (5 minutes)
```
1. Go to supabase.com → Login
2. Select your project (or create one)
3. Settings → API
4. Copy:
   - Project URL
   - anon public key
   - service_role secret key
```

### 2. Netlify Site URL (after deployment)
```
1. Deploy site to Netlify
2. Copy the site URL from Netlify dashboard
3. Use: https://your-site.netlify.app
```

### 3. Generate JWT Secret (1 minute)
```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

### 4. Set Admin Password
- Choose any secure password you want
- This is for logging into the dashboard

---

## Example Complete .env File

```env
# Frontend
VITE_SITE_URL=https://gani-properties.netlify.app
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example

# Backend
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.example
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example
JWT_SECRET=a7f3b9c2d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRES_IN=24h
ADMIN_USERNAME=admin
ADMIN_PASSWORD=MySecurePassword123!

# Dashboard
VITE_API_URL=https://gani-properties.netlify.app/.netlify/functions
VITE_SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjE2MjM5MDIyLCJleHAiOjE5MzE4MTUwMjJ9.example
```

---

## Still Need Help?

- **Supabase Setup**: See `docs/SUPABASE_SETUP_GUIDE.md`
- **Netlify Deployment**: See `docs/NETLIFY_QUICK_START.md`
- **Full Environment Setup**: See `docs/ENV_SETUP.md`
