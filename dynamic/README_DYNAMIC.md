# Dynamic Version - Overview

## ✅ What's Included

This dynamic version includes:

### Backend API (`api/`)
- ✅ **Enhanced Supabase integration** with admin and client clients
- ✅ **Supabase Authentication** (replaces env-based auth)
- ✅ **Complete CRUD operations** for properties
- ✅ **Image upload** to Supabase Storage
- ✅ **Token refresh** endpoint
- ✅ **Input validation** with Zod schemas
- ✅ **Error handling** and proper status codes

### Frontend (`src/`)
- ✅ **Database-only properties API** (no static fallback)
- ✅ All existing components and pages (need to copy from parent)
- ✅ Same UI/UX as static version

### Setup Tools
- ✅ Database setup SQL script
- ✅ Migration script for existing properties
- ✅ Comprehensive setup guide

## 🚀 Quick Start

1. **Copy frontend files** (see `COPY_FILES.md`)
2. **Setup Supabase** (see `SETUP_GUIDE.md`)
3. **Install dependencies:** `npm install`
4. **Configure .env** with Supabase credentials
5. **Run:** `npm run dev`

## 📋 Key Differences from Static Version

| Feature | Static Version | Dynamic Version |
|---------|---------------|-----------------|
| Properties Storage | JSON file | Supabase Database |
| Authentication | Env variables | Supabase Auth |
| Image Storage | Local/public | Supabase Storage |
| CRUD Operations | Limited | Full (Create, Read, Update, Delete) |
| Data Source | Static JSON + API fallback | Database only |
| Admin Security | Basic JWT | Supabase Auth + RLS |

## 🔐 Security Features

- ✅ Row Level Security (RLS) in Supabase
- ✅ Token-based authentication
- ✅ Input validation on all endpoints
- ✅ File size/type validation for uploads
- ✅ Protected API routes

## 📁 File Structure

```
dynamic/
├── api/                    # Backend API (Vercel serverless)
│   ├── auth/
│   │   ├── login.ts       # Supabase Auth login
│   │   └── refresh.ts     # Token refresh
│   ├── properties/
│   │   ├── index.ts       # GET all, POST create
│   │   └── [id].ts        # GET, PUT, DELETE single
│   ├── upload.ts          # Image upload to Supabase
│   └── lib/
│       ├── supabase.ts    # Supabase clients
│       ├── auth.ts        # Auth middleware
│       ├── validation.ts  # Zod schemas
│       └── googleMaps.ts  # Coordinate extraction
├── src/                    # Frontend (copy from parent)
├── scripts/
│   └── migrate-to-supabase.js
├── DATABASE_SETUP.sql      # Database schema
├── SETUP_GUIDE.md          # Setup instructions
└── README.md               # This file
```

## 🎯 Next Steps

1. Follow `SETUP_GUIDE.md` for complete setup
2. Copy frontend files (see `COPY_FILES.md`)
3. Setup Supabase database
4. Run migration if needed
5. Deploy to Vercel

## 📚 Documentation

- `SETUP_GUIDE.md` - Complete setup instructions
- `COPY_FILES.md` - What files to copy
- `DATABASE_SETUP.sql` - Database schema
- Parent folder `DYNAMIC_WEBSITE_ROADMAP.md` - Full roadmap

## 🔄 Migration Path

If you want to migrate from static to dynamic:

1. Set up Supabase
2. Run database setup SQL
3. Copy frontend files
4. Run migration script
5. Update environment variables
6. Deploy!

---

**The dynamic version is ready! Follow the setup guide to get started.** 🚀

