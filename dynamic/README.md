# Gani Properties - Dynamic Version

This is the **dynamic version** of the Gani Properties website, built with Supabase for database, authentication, and storage.

## 🚀 Key Features

- ✅ **Database-Driven**: All properties stored in Supabase
- ✅ **Strong Authentication**: Supabase Auth with token refresh
- ✅ **Image Storage**: Supabase Storage for property images
- ✅ **Full CRUD**: Create, Read, Update, Delete properties
- ✅ **Admin Dashboard**: Secure admin panel with authentication
- ✅ **Real-time Updates**: Changes reflect immediately on website

## 📋 Prerequisites

1. **Supabase Account**: Create account at https://supabase.com
2. **Supabase Project**: Create a new project
3. **Node.js 22+**: Required for development

## 🗄️ Database Setup

### 1. Create Database Schema

Run this SQL in Supabase SQL Editor:

```sql
-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN (
    'residential-plots', 'residential-apartments', 'residential-villas',
    'commercial', 'retail', 'hospitality', 'industrial', 'land'
  )),
  city TEXT NOT NULL,
  area TEXT NOT NULL,
  price_label TEXT,
  size TEXT,
  status TEXT NOT NULL CHECK (status IN ('available', 'sold', 'new')),
  highlights JSONB DEFAULT '[]'::jsonb,
  lat DECIMAL(10, 8),
  lon DECIMAL(11, 8),
  images TEXT[] DEFAULT ARRAY[]::TEXT[],
  description TEXT NOT NULL,
  posted_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Admin write access (only authenticated users)
CREATE POLICY "Admin insert access" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 2. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create bucket: `property-images`
3. Set to **Public**
4. Add storage policies (see setup guide)

### 3. Create Admin User

1. Go to Authentication → Users → Add User
2. Create user with email/password
3. Auto Confirm: `true`

## 🔧 Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Configure Environment Variables:**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
```

3. **Development:**
```bash
npm run dev
```

4. **Build:**
```bash
npm run build
```

## 📁 Project Structure

```
dynamic/
├── api/                    # Vercel serverless functions
│   ├── auth/              # Authentication endpoints
│   ├── properties/        # Property CRUD endpoints
│   ├── upload.ts          # Image upload endpoint
│   └── lib/               # Shared utilities
├── src/                    # Frontend React app
│   ├── components/        # React components
│   ├── pages/             # Page components
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript types
└── dashboard/              # Admin dashboard
    └── src/               # Dashboard React app
```

## 🔐 Authentication

The dynamic version uses **Supabase Authentication**:
- Email/password authentication
- JWT tokens with refresh
- Secure API endpoints
- Protected admin routes

## 📤 API Endpoints

- `GET /api/properties` - Get all properties (public)
- `GET /api/properties/[id]` - Get single property (public)
- `POST /api/properties` - Create property (protected)
- `PUT /api/properties/[id]` - Update property (protected)
- `DELETE /api/properties/[id]` - Delete property (protected)
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token
- `POST /api/upload` - Upload image (protected)

## 🚀 Deployment

See `DEPLOYMENT_STEPS.md` in parent folder for detailed deployment instructions.

**Quick Deploy:**
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy!

## 📚 Documentation

- See `DYNAMIC_WEBSITE_ROADMAP.md` for complete implementation guide
- See `DYNAMIC_WEBSITE_QUICK_START.md` for quick reference

## 🔄 Migration from Static Version

To migrate existing properties from static JSON:

1. Use the migration script in `scripts/migrate-to-supabase.js`
2. Run: `node scripts/migrate-to-supabase.js`

## 🆘 Support

- Check Supabase logs for database issues
- Check Vercel logs for API issues
- Review environment variables
- Check RLS policies in Supabase

---

**Built with ❤️ using Supabase + Vercel**

