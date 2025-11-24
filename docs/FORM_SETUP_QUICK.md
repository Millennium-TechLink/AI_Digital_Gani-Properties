# Quick Setup: Contact Form with Email + Database
## 5-Minute Setup Guide

---

## 🎯 Solution: Supabase + Resend

**Cost**: $0/month (free tiers)  
**Email**: 3,000/month (free)  
**Storage**: 500MB (free)

---

## ✅ Step-by-Step Setup

### 1. Create Supabase Table (2 minutes)

1. Go to your Supabase project
2. Open SQL Editor
3. Run the SQL from `scripts/create-form-submissions-table.sql`
4. ✅ Done!

---

### 2. Setup Resend (2 minutes)

1. Go to https://resend.com
2. Sign up (free)
3. Go to API Keys
4. Create new key
5. Copy the key
6. ✅ Done!

---

### 3. Add Environment Variables (1 minute)

In Vercel project settings, add:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@resend.dev
```

**Frontend** (`.env` or Vercel):
```
VITE_API_URL=https://your-api.vercel.app/api
```

---

### 4. Install Dependencies

```bash
npm install @supabase/supabase-js @vercel/node
```

---

### 5. Deploy

The `api/contact.ts` file is already created! Just:

1. Push to GitHub
2. Vercel will auto-deploy
3. ✅ Done!

---

## 🧪 Test

1. Submit a test form on your website
2. Check Supabase → `form_submissions` table (should see entry)
3. Check admin email (should receive email)
4. ✅ Working!

---

## 📊 View Submissions

You can query submissions in Supabase:

```sql
SELECT * FROM form_submissions 
ORDER BY created_at DESC;
```

Or build a dashboard page to view them!

---

## 🎉 That's It!

- ✅ Admin gets email for every submission
- ✅ All submissions stored in database
- ✅ Cost: $0/month
- ✅ Ready to scale

---

## 📚 Full Documentation

- **Comparison**: `docs/FORM_SOLUTIONS.md`
- **Detailed Guide**: `docs/FORM_IMPLEMENTATION.md`

