# Dynamic Website Transformation - Quick Start Guide

## 🎯 What We're Building

Transform your static website into a dynamic one where:
- ✅ Properties are stored in Supabase database
- ✅ Admin dashboard uses strong Supabase Authentication
- ✅ Images upload to Supabase Storage
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Real-time updates on website

---

## ⚡ Quick Start (Priority Order)

### 1️⃣ **Database Setup** (Day 1 - 3-4 hours)
```sql
-- Run in Supabase SQL Editor
-- See DYNAMIC_WEBSITE_ROADMAP.md Phase 1 for full SQL
```

**What to do:**
- [ ] Create properties table with schema
- [ ] Setup indexes for performance
- [ ] Configure Row Level Security (RLS)
- [ ] Create storage bucket for images
- [ ] Setup storage policies

---

### 2️⃣ **Authentication** (Day 2-3 - 6-8 hours)

**Steps:**
1. Create admin user in Supabase Dashboard
   - Go to Authentication → Users → Add User
   - Email: `admin@ganiproperties.com`
   - Generate strong password

2. Update API files:
   - [ ] `api/lib/supabase.ts` - Add Supabase Auth clients
   - [ ] `api/auth/login.ts` - Use Supabase Auth
   - [ ] `api/lib/auth.ts` - Verify Supabase tokens
   - [ ] `api/auth/refresh.ts` - Create token refresh endpoint

3. Update Dashboard:
   - [ ] `pipeline/dashboard/src/contexts/AuthContext.tsx` - Use new auth
   - [ ] `pipeline/dashboard/src/pages/Login.tsx` - Update to use email

**Key Changes:**
- Replace environment variable auth with Supabase Auth
- Use email + password instead of username
- Store access_token + refresh_token

---

### 3️⃣ **Image Upload** (Day 4 - 4-5 hours)

**Steps:**
1. Update `api/upload.ts`:
   - [ ] Upload to Supabase Storage
   - [ ] Return public URL
   - [ ] Require authentication

2. Update Dashboard:
   - [ ] `pipeline/dashboard/src/components/ImageUpload.tsx`
   - [ ] Convert File to base64
   - [ ] Call upload API

---

### 4️⃣ **CRUD Operations** (Day 5-6 - 8-10 hours)

**API Endpoints to Update/Create:**
- [ ] `api/properties/index.ts` - GET, POST
- [ ] `api/properties/[id].ts` - GET, PUT, DELETE

**Dashboard Updates:**
- [ ] `pipeline/dashboard/src/pages/PropertiesList.tsx` - Add delete
- [ ] `pipeline/dashboard/src/pages/PropertyForm.tsx` - Add edit mode
- [ ] `pipeline/dashboard/src/api/properties.ts` - All CRUD methods

---

### 5️⃣ **Data Migration** (Day 7 - 3-4 hours)

**Steps:**
1. Create migration script: `scripts/migrate-to-supabase.js`
2. Run migration to move properties from JSON to database
3. Update `src/lib/propertiesApi.ts` - Remove static fallback

---

### 6️⃣ **Security & Polish** (Day 8-10 - 8-10 hours)

- [ ] Add input validation (Zod schemas)
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Add loading states
- [ ] Add error handling
- [ ] Test everything

---

## 🔑 Key Files to Modify

### Backend/API Files
```
api/
├── lib/
│   ├── supabase.ts          ← Add Supabase Auth clients
│   ├── auth.ts              ← Update to verify Supabase tokens
│   └── validation.ts        ← NEW: Add Zod schemas
├── auth/
│   ├── login.ts             ← Use Supabase Auth
│   └── refresh.ts           ← NEW: Token refresh
├── properties/
│   ├── index.ts             ← GET, POST
│   └── [id].ts              ← GET, PUT, DELETE
└── upload.ts                ← Upload to Supabase Storage
```

### Frontend Files
```
src/
└── lib/
    └── propertiesApi.ts     ← Remove static fallback

pipeline/dashboard/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx  ← Update for Supabase Auth
│   ├── pages/
│   │   ├── Login.tsx        ← Use email instead of username
│   │   ├── PropertiesList.tsx ← Add delete button
│   │   └── PropertyForm.tsx ← Add edit mode
│   ├── components/
│   │   └── ImageUpload.tsx  ← Upload to API
│   └── api/
│       └── properties.ts    ← Add all CRUD methods
```

---

## 🔐 Environment Variables Needed

### Vercel (API Project)
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...  (service_role key)
```

### Dashboard Project
```
VITE_API_URL=https://your-site.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 📝 Important Notes

### Authentication Flow
1. User logs in with email + password
2. API authenticates with Supabase
3. Returns `access_token` + `refresh_token`
4. Store tokens in localStorage
5. Use `access_token` for API calls
6. Refresh token when it expires

### Security Best Practices
- ✅ Always verify tokens on server side
- ✅ Use RLS policies in Supabase
- ✅ Validate all inputs with Zod
- ✅ Use service role key only server-side
- ✅ Never expose service role key to client

### Image Handling
- Upload as base64 → API converts to buffer
- Store in Supabase Storage bucket
- Return public URL
- Store URLs in database

---

## 🚨 Common Issues & Solutions

### Issue: "Authentication required" error
**Solution:** Check token is sent in Authorization header:
```typescript
headers: {
  'Authorization': `Bearer ${token}`
}
```

### Issue: Images not uploading
**Solution:** 
- Verify storage bucket is public
- Check storage policies allow authenticated uploads
- Verify file size < 5MB

### Issue: Properties not showing
**Solution:**
- Check RLS policies allow public SELECT
- Verify API is calling Supabase correctly
- Check browser console for errors

### Issue: Token expired
**Solution:**
- Implement token refresh before expiry
- Store expires_at timestamp
- Refresh automatically when needed

---

## ✅ Testing Checklist

After each phase, test:

**Phase 1: Database**
- [ ] Can view properties in Supabase dashboard
- [ ] RLS allows public reads
- [ ] Storage bucket accessible

**Phase 2: Authentication**
- [ ] Can login with email/password
- [ ] Token stored correctly
- [ ] Protected routes require auth
- [ ] Token refresh works

**Phase 3: Image Upload**
- [ ] Can upload image from dashboard
- [ ] Image appears in Supabase Storage
- [ ] Public URL works
- [ ] Image displays on website

**Phase 4: CRUD**
- [ ] Can create property
- [ ] Can read properties
- [ ] Can update property
- [ ] Can delete property
- [ ] Changes reflect on website immediately

**Phase 5: Migration**
- [ ] All properties migrated
- [ ] Website shows database properties
- [ ] No static JSON fallback

---

## 📚 Full Documentation

See `DYNAMIC_WEBSITE_ROADMAP.md` for:
- Detailed step-by-step instructions
- Complete code examples
- All SQL queries
- Full API implementations
- Timeline and estimates

---

## 🆘 Need Help?

1. Check Supabase logs (Dashboard → Logs)
2. Check Vercel deployment logs
3. Check browser console for errors
4. Review RLS policies
5. Verify environment variables

---

**Start with Phase 1 and work through systematically!** 🚀

