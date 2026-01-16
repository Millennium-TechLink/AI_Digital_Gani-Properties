# Supabase Setup Guide
## Complete Step-by-Step Instructions for Database & Storage

---

## 🎯 What You'll Set Up

1. **Supabase Account & Project**
2. **Database Tables** (properties, form_submissions)
3. **Storage Bucket** (property images)
4. **API Keys** (for website and serverless functions)
5. **Row Level Security** (RLS policies)

---

## 📋 Step 1: Create Supabase Account

### 1.1 Sign Up
1. Go to **https://supabase.com**
2. Click **"Start your project"** or **"Sign Up"**
3. Choose sign-up method:
   - **GitHub** (recommended - easiest)
   - **Email** (alternative)
4. Complete sign-up process
5. Verify your email if required

### 1.2 Access Dashboard
- After sign-up, you'll be redirected to the Supabase dashboard
- You should see "Create a new project" or your projects list

---

## 📋 Step 2: Create New Project

### 2.1 Create Project
1. Click **"New Project"** button (top right)
2. Fill in project details:

   **Project Name:**
   ```
   gani-properties
   ```

   **Database Password:**
   - Create a strong password (save it!)
   - Must be at least 8 characters
   - Example: `GaniProps2024!Secure`
   - ⚠️ **Save this password** - you'll need it for database connections

   **Region:**
   - Choose closest to your users
   - **Recommended**: `Asia Pacific (Mumbai)` or `Asia Pacific (Singapore)`
   - This affects database latency

   **Pricing Plan:**
   - Select **"Free"** (perfect for starting)

### 2.2 Wait for Setup
- Click **"Create new project"**
- Wait 2-3 minutes for project to initialize
- You'll see a progress indicator
- ⏳ **Don't close the tab!**

### 2.3 Project Ready
- When ready, you'll see the project dashboard
- You're now in your project!

---

## 📋 Step 3: Setup Database Schema

### 3.1 Open SQL Editor
1. In the left sidebar, click **"SQL Editor"**
2. Click **"New query"** button (top right)

### 3.2 Run Schema Script
1. Open the file: `scripts/create-supabase-schema.sql`
2. **Copy the entire contents** of the file
3. **Paste** into the SQL Editor
4. Click **"Run"** button (or press `Ctrl+Enter` / `Cmd+Enter`)

### 3.3 Verify Tables Created
1. In left sidebar, click **"Table Editor"**
2. You should see two tables:
   - ✅ `properties`
   - ✅ `form_submissions`

### 3.4 Check Table Structure
1. Click on `properties` table
2. Verify columns:
   - `id`, `slug`, `title`, `type`, `city`, `area`, etc.
3. Click on `form_submissions` table
4. Verify columns:
   - `id`, `name`, `phone`, `email`, `message`, etc.

---

## 📋 Step 4: Setup Storage Bucket

### 4.1 Open Storage
1. In left sidebar, click **"Storage"**
2. You should see an empty storage list

### 4.2 Create Bucket
1. Click **"New bucket"** button
2. Fill in details:

   **Name:**
   ```
   property-images
   ```

   **Public bucket:**
   - ✅ **Enable** (check the box)
   - This allows public access to images

   **File size limit:**
   - Set to **5 MB** (or leave default)

   **Allowed MIME types:**
   - Leave empty (allows all image types)
   - Or specify: `image/jpeg,image/png,image/webp`

3. Click **"Create bucket"**

### 4.3 Verify Bucket
- You should see `property-images` in the storage list
- Status should show as **"Public"**

### 4.4 Setup Bucket Policies (Optional)
1. Click on `property-images` bucket
2. Go to **"Policies"** tab
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Policy name: `Public read access`
6. Policy definition:
   ```sql
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'property-images');
   ```
7. Click **"Review"** then **"Save policy"**

---

## 📋 Step 5: Get API Keys

### 5.1 Open Project Settings
1. Click **gear icon** (⚙️) in bottom left sidebar
2. Click **"API"** in settings menu

### 5.2 Copy API Keys
You'll see several keys. Copy these:

#### **Project URL:**
```
https://xxxxxxxxxxxxx.supabase.co
```
- Copy this entire URL
- This is your `SUPABASE_URL`

#### **anon public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk5OTk5OSwiZXhwIjoxOTYxNTc1OTk5fQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- This is your `VITE_SUPABASE_ANON_KEY` (for frontend)
- This is your `SUPABASE_ANON_KEY` (for serverless functions)

#### **service_role key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjQ1OTk5OTk5LCJleHAiOjE5NjE1NzU5OTl9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- ⚠️ **KEEP THIS SECRET!** Never expose in frontend code
- This is your `SUPABASE_SERVICE_KEY` (for serverless functions only)
- This key bypasses Row Level Security

### 5.3 Save Keys Securely
- Save all keys in a secure password manager
- Or in a `.env` file (never commit to Git!)

---

## 📋 Step 6: Test Database Connection

### 6.1 Test in SQL Editor
1. Go to **SQL Editor**
2. Click **"New query"**
3. Run this test query:
   ```sql
   SELECT COUNT(*) FROM properties;
   ```
4. Should return `0` (no properties yet - that's correct!)

### 6.2 Test Form Submissions Table
```sql
SELECT COUNT(*) FROM form_submissions;
```
- Should return `0` (correct!)

---

## 📋 Step 7: Migrate Existing Properties (Optional)

### 7.1 If You Have Existing Properties
If you have properties in `src/data/properties.json`:

1. **Set Environment Variables:**
   Create `.env` file in project root:
   ```env
   SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   SUPABASE_SERVICE_KEY=your-service-role-key
   ```

2. **Run Migration Script:**
   ```bash
   node scripts/migrate-properties-to-supabase.js
   ```

3. **Verify Migration:**
   - Go to **Table Editor** → `properties`
   - You should see your properties!

### 7.2 If No Existing Properties
- Skip this step
- Properties will be added through the admin dashboard

---

## 📋 Step 8: Setup for Email (Resend Integration)

### 8.1 Note About Email
- **Supabase doesn't send emails directly**
- We use **Resend** for email delivery
- Supabase stores form submissions in database
- Resend sends the actual emails

### 8.2 What Supabase Does for Email
- Stores form submissions in `form_submissions` table
- Serverless function reads from Supabase
- Serverless function sends email via Resend API

### 8.3 Setup Resend (Separate Service)
1. Go to **https://resend.com**
2. Sign up (free)
3. Get API key
4. Add to Vercel environment variables:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   ADMIN_EMAIL=info@ganiproperties.com
   FROM_EMAIL=noreply@resend.dev
   ```

---

## 📋 Step 9: Configure Environment Variables

### 9.1 Frontend Environment Variables
Create `.env` file in project root:
```env
VITE_SITE_URL=https://ganiproperties.com
VITE_API_URL=https://your-app.vercel.app/api
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 9.2 Vercel Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```env
# Supabase
SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# Authentication
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
JWT_SECRET=your-very-secure-jwt-secret-key-min-32-chars
JWT_EXPIRES_IN=24h

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@resend.dev

# Site
SITE_URL=https://ganiproperties.com
```

---

## 📋 Step 10: Verify Setup

### 10.1 Database Check
- [ ] Tables created (`properties`, `form_submissions`)
- [ ] Tables have correct columns
- [ ] Row Level Security enabled

### 10.2 Storage Check
- [ ] `property-images` bucket created
- [ ] Bucket is public
- [ ] Can upload test image (optional)

### 10.3 API Keys Check
- [ ] Project URL copied
- [ ] Anon key copied
- [ ] Service role key copied (and kept secret)

### 10.4 Environment Variables Check
- [ ] Frontend `.env` file created
- [ ] Vercel environment variables added
- [ ] All keys match Supabase dashboard

---

## 🎯 Quick Reference

### Supabase Dashboard Links
- **Dashboard**: https://app.supabase.com
- **Your Project**: https://app.supabase.com/project/your-project-id
- **SQL Editor**: Dashboard → SQL Editor
- **Table Editor**: Dashboard → Table Editor
- **Storage**: Dashboard → Storage
- **API Settings**: Dashboard → Settings → API

### Important URLs
- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **API Endpoint**: `https://xxxxxxxxxxxxx.supabase.co/rest/v1/`
- **Storage Endpoint**: `https://xxxxxxxxxxxxx.supabase.co/storage/v1/`

---

## 🚨 Common Issues & Solutions

### Issue: "Table not found"
**Solution**: Make sure you ran the SQL schema script in Step 3

### Issue: "Permission denied"
**Solution**: Check Row Level Security policies are set correctly

### Issue: "Invalid API key"
**Solution**: 
- Verify you copied the entire key (they're long!)
- Make sure you're using the right key (anon vs service_role)
- Check for extra spaces or line breaks

### Issue: "Bucket not found"
**Solution**: 
- Verify bucket name is exactly `property-images`
- Check bucket is created and public

### Issue: "Cannot connect to database"
**Solution**:
- Verify `SUPABASE_URL` is correct
- Check database password is correct
- Ensure project is not paused (free tier pauses after inactivity)

---

## 📊 What's Configured

### Database Tables
✅ `properties` - Stores all property listings
✅ `form_submissions` - Stores contact form submissions

### Storage
✅ `property-images` - Public bucket for property images

### Security
✅ Row Level Security (RLS) enabled
✅ Public read access for properties
✅ Public insert for form submissions
✅ Admin-only access for updates/deletes

### API Access
✅ Anon key for frontend (read-only)
✅ Service key for serverless functions (full access)

---

## ✅ Setup Complete!

Your Supabase is now ready for:
- ✅ Storing properties
- ✅ Storing form submissions
- ✅ Storing property images
- ✅ API access from website
- ✅ API access from serverless functions

**Next Steps:**
1. Setup Resend for email (see `docs/FORM_IMPLEMENTATION.md`)
2. Deploy to Vercel (see `docs/DEPLOYMENT_READY.md`)
3. Test everything!

---

## 📚 Related Documentation

- **Form Setup**: `docs/FORM_IMPLEMENTATION.md`
- **Deployment**: `docs/DEPLOYMENT_READY.md`
- **Cost Breakdown**: `docs/MONTHLY_COST_BREAKDOWN.md`

---

## 🆘 Need Help?

1. **Supabase Docs**: https://supabase.com/docs
2. **Supabase Discord**: https://discord.supabase.com
3. **Check SQL Script**: `scripts/create-supabase-schema.sql`
4. **Check Migration Script**: `scripts/migrate-properties-to-supabase.js`

---

**You're all set! 🎉**















