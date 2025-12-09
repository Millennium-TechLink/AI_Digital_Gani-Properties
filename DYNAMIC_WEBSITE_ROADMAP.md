# Dynamic Website Transformation Roadmap

## 🎯 Goal
Transform the static website into a fully dynamic one with:
- Properties stored in Supabase database
- Strong authentication system for admin dashboard
- Image uploads to Supabase Storage
- Real-time CRUD operations
- Secure API endpoints

---

## 📊 Current State Assessment

### ✅ What's Already in Place
- ✅ Supabase client setup in `api/lib/supabase.ts`
- ✅ Basic API routes structure (`api/properties/`, `api/auth/`)
- ✅ Admin dashboard exists (`pipeline/dashboard`)
- ✅ JWT authentication skeleton
- ✅ Property types and interfaces defined
- ✅ Frontend API client (`src/lib/propertiesApi.ts`)

### ❌ What Needs to Be Built
- ❌ Complete Supabase database schema
- ❌ Strong authentication (Supabase Auth)
- ❌ Image upload to Supabase Storage
- ❌ Migrate static JSON to database
- ❌ Enhanced API endpoints (PUT, DELETE)
- ❌ Admin dashboard CRUD operations
- ❌ Token refresh mechanism
- ❌ Role-based access control

---

## 🗺️ Phase 1: Database Setup (Week 1)

### Step 1.1: Complete Supabase Database Schema
**Time: 2-3 hours**

Create comprehensive database schema in Supabase SQL Editor:

```sql
-- Properties table (enhanced)
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

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_area ON properties(area);
CREATE INDEX IF NOT EXISTS idx_properties_status ON properties(status);
CREATE INDEX IF NOT EXISTS idx_properties_posted_at ON properties(posted_at DESC);
CREATE INDEX IF NOT EXISTS idx_properties_slug ON properties(slug);

-- Enable Row Level Security
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view properties)
CREATE POLICY "Public read access" ON properties
  FOR SELECT USING (true);

-- Admin write access (only authenticated admins can create/update/delete)
CREATE POLICY "Admin insert access" ON properties
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin update access" ON properties
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Admin delete access" ON properties
  FOR DELETE USING (auth.role() = 'authenticated');
```

**Tasks:**
- [ ] Run SQL in Supabase SQL Editor
- [ ] Verify table creation
- [ ] Test RLS policies

---

### Step 1.2: Setup Supabase Storage
**Time: 1 hour**

1. **Create Storage Bucket:**
   - Name: `property-images`
   - Public: `true`
   - File size limit: 5MB
   - Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

2. **Setup Storage Policies:**

```sql
-- Allow public read access to images
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated upload access"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated update access"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'property-images' 
  AND auth.role() = 'authenticated'
);
```

**Tasks:**
- [ ] Create bucket in Supabase Storage
- [ ] Run storage policies SQL
- [ ] Test image upload manually

---

## 🔐 Phase 2: Strong Authentication System (Week 1-2)

### Step 2.1: Setup Supabase Authentication
**Time: 3-4 hours**

Replace environment variable-based auth with Supabase Auth.

**Create Admin User:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Email: `admin@ganiproperties.com`
4. Password: (generate strong password)
5. Auto Confirm: `true`

**Update API Authentication:**

**File: `api/lib/supabase.ts`** (enhance existing)
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Service role client (for server-side operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Anon client (for client-side operations)
export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Verify Supabase JWT token
export async function verifySupabaseToken(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error) throw error;
    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
}
```

**Tasks:**
- [ ] Create admin user in Supabase
- [ ] Update `api/lib/supabase.ts`
- [ ] Test Supabase Auth connection

---

### Step 2.2: Update Login API
**Time: 2-3 hours**

**File: `api/auth/login.ts`** (rewrite)

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabase';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Authenticate with Supabase
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Get user details
    const { data: { user } } = await supabaseAdmin.auth.getUser(data.session.access_token);

    // Check if user is admin (you can add role checking here)
    // For now, any authenticated user is considered admin

    return res.json({
      success: true,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
      user: {
        id: user?.id,
        email: user?.email,
      },
      message: 'Login successful',
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
```

**Tasks:**
- [ ] Rewrite `api/auth/login.ts`
- [ ] Test login endpoint
- [ ] Verify token generation

---

### Step 2.3: Update Auth Middleware
**Time: 2 hours**

**File: `api/lib/auth.ts`** (update)

```typescript
import { verifySupabaseToken } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export async function authenticateToken(
  req: { headers: { authorization?: string } }
): Promise<{ error?: string; user?: AuthUser }> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required. Please log in.' };
  }

  const token = authHeader.substring(7);

  try {
    const { user, error } = await verifySupabaseToken(token);
    
    if (error || !user) {
      return { error: 'Invalid or expired token. Please log in again.' };
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'user',
      },
    };
  } catch (error: any) {
    return { error: 'Authentication error' };
  }
}
```

**Tasks:**
- [ ] Update `api/lib/auth.ts`
- [ ] Test token verification
- [ ] Update all protected endpoints

---

### Step 2.4: Add Token Refresh Endpoint
**Time: 1-2 hours**

**File: `api/auth/refresh.ts`** (new)

```typescript
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabaseAdmin } from '../lib/supabase';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        success: false,
        message: 'Refresh token is required',
      });
    }

    const { data, error } = await supabaseAdmin.auth.refreshSession({
      refresh_token,
    });

    if (error || !data.session) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token',
      });
    }

    return res.json({
      success: true,
      token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    });
  } catch (error: any) {
    console.error('Refresh error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
}
```

**Tasks:**
- [ ] Create `api/auth/refresh.ts`
- [ ] Test refresh endpoint

---

### Step 2.5: Update Dashboard Auth Context
**Time: 2-3 hours**

**File: `pipeline/dashboard/src/contexts/AuthContext.tsx`** (update)

Update to use Supabase Auth and handle token refresh:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: { id: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (token && refreshToken) {
      // Verify token is still valid
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Try to verify by making a test request
        // Or check token expiry
        const expiresAt = localStorage.getItem('token_expires_at');
        if (expiresAt && Date.now() < parseInt(expiresAt)) {
          setIsAuthenticated(true);
          const userEmail = localStorage.getItem('user_email') || '';
          const userId = localStorage.getItem('user_id') || '';
          setUser({ id: userId, email: userEmail });
        } else {
          // Token expired, try to refresh
          await refreshToken();
        }
      } catch (error) {
        // Token invalid, clear auth
        clearAuth();
      }
    }
    setLoading(false);
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      clearAuth();
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      const { token, refresh_token, expires_at } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('token_expires_at', expires_at.toString());
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    } catch (error) {
      clearAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, refresh_token, expires_at, user } = response.data;
      
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refresh_token);
        localStorage.setItem('token_expires_at', expires_at.toString());
        localStorage.setItem('user_email', user.email);
        localStorage.setItem('user_id', user.id);
        
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setIsAuthenticated(true);
        setUser(user);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Login failed. Please try again.');
      }
    }
  };

  const logout = () => {
    clearAuth();
  };

  const clearAuth = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token_expires_at');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_id');
    delete axios.defaults.headers.common['Authorization'];
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

**Tasks:**
- [ ] Update AuthContext
- [ ] Update Login page to use email instead of username
- [ ] Test authentication flow

---

## 📤 Phase 3: Image Upload System (Week 2)

### Step 3.1: Create Image Upload API
**Time: 3-4 hours**

**File: `api/upload.ts`** (update existing)

```typescript
import { supabaseAdmin } from './lib/supabase';
import { authenticateToken } from './lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }

    // Get image data from request
    const { image, fileName } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: 'Image and fileName are required' });
    }

    // Convert base64 to buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Generate unique filename
    const fileExt = fileName.split('.').pop();
    const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('property-images')
      .upload(uniqueFileName, buffer, {
        contentType: `image/${fileExt}`,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image' });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('property-images')
      .getPublicUrl(uniqueFileName);

    return res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Tasks:**
- [ ] Update `api/upload.ts`
- [ ] Test image upload
- [ ] Verify images in Supabase Storage

---

### Step 3.2: Update Admin Dashboard Image Upload
**Time: 2-3 hours**

Update the ImageUpload component in dashboard to use the new API.

**File: `pipeline/dashboard/src/components/ImageUpload.tsx`** (update)

```typescript
// Add function to convert File to base64
const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// Update upload function
const uploadImage = async (file: File) => {
  try {
    const base64Image = await convertToBase64(file);
    const response = await axios.post(`${API_BASE_URL}/upload`, {
      image: base64Image,
      fileName: file.name,
    }, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });

    return response.data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};
```

**Tasks:**
- [ ] Update ImageUpload component
- [ ] Test image upload from dashboard
- [ ] Verify image display

---

## 🗄️ Phase 4: Complete CRUD Operations (Week 2-3)

### Step 4.1: Update Properties API - GET
**Time: 1 hour**

**File: `api/properties/index.ts`** (already exists, verify it works)

Ensure it fetches from Supabase correctly.

**Tasks:**
- [ ] Verify GET endpoint works with Supabase
- [ ] Test property listing

---

### Step 4.2: Update Properties API - POST
**Time: 2 hours**

**File: `api/properties/index.ts`** (update POST handler)

Ensure it:
- Requires authentication
- Validates input
- Creates property in Supabase
- Handles images array

**Tasks:**
- [ ] Update POST endpoint
- [ ] Add validation
- [ ] Test property creation

---

### Step 4.3: Create Properties API - PUT
**Time: 2 hours**

**File: `api/properties/[id].ts`** (update)

Add PUT handler for updates:

```typescript
// PUT /api/properties/[id] - Update property
if (req.method === 'PUT') {
  try {
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }

    const propertyData = { ...req.body };
    const { id } = req.query;

    // Update property in Supabase
    const { data, error } = await supabase
      .from('properties')
      .update({
        ...propertyData,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: 'Failed to update property' });
    }

    return res.json(data);
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Tasks:**
- [ ] Add PUT handler
- [ ] Test property update

---

### Step 4.4: Create Properties API - DELETE
**Time: 1-2 hours**

**File: `api/properties/[id].ts`** (add DELETE handler)

```typescript
// DELETE /api/properties/[id] - Delete property
if (req.method === 'DELETE') {
  try {
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }

    const { id } = req.query;

    // Delete property from Supabase
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(500).json({ error: 'Failed to delete property' });
    }

    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

**Tasks:**
- [ ] Add DELETE handler
- [ ] Test property deletion

---

### Step 4.5: Update Admin Dashboard CRUD
**Time: 4-5 hours**

Update dashboard pages to use new API:

**Files to update:**
- `pipeline/dashboard/src/pages/PropertiesList.tsx` - Add delete functionality
- `pipeline/dashboard/src/pages/PropertyForm.tsx` - Add edit functionality
- `pipeline/dashboard/src/api/properties.ts` - Add all CRUD methods

**Tasks:**
- [ ] Update PropertiesList with delete button
- [ ] Update PropertyForm to handle edit mode
- [ ] Create API client methods (create, update, delete)
- [ ] Test all CRUD operations

---

## 📥 Phase 5: Data Migration (Week 3)

### Step 5.1: Create Migration Script
**Time: 3-4 hours**

**File: `scripts/migrate-to-supabase.js`** (new)

```javascript
import { createClient } from '@supabase/supabase-js';
import propertiesData from '../src/data/properties.json' assert { type: 'json' };
import 'dotenv/config';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateProperties() {
  console.log(`Starting migration of ${propertiesData.length} properties...`);

  for (const property of propertiesData) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          id: property.id,
          slug: property.slug,
          title: property.title,
          type: property.type,
          city: property.city,
          area: property.area,
          price_label: property.priceLabel,
          size: property.size,
          status: property.status,
          highlights: property.highlights || [],
          lat: property.lat || null,
          lon: property.lon || null,
          images: property.images || [],
          description: property.description,
          posted_at: property.postedAt || new Date().toISOString(),
        });

      if (error) {
        console.error(`Error migrating ${property.id}:`, error.message);
      } else {
        console.log(`✓ Migrated: ${property.title}`);
      }
    } catch (error) {
      console.error(`Error migrating ${property.id}:`, error);
    }
  }

  console.log('Migration complete!');
}

migrateProperties();
```

**Tasks:**
- [ ] Create migration script
- [ ] Run migration
- [ ] Verify data in Supabase
- [ ] Test website with database data

---

### Step 5.2: Update Frontend to Use Database Only
**Time: 1-2 hours**

**File: `src/lib/propertiesApi.ts`** (remove fallback to static data)

Update to only use API, remove static JSON fallback.

**Tasks:**
- [ ] Remove static data fallback
- [ ] Update error handling
- [ ] Test website with database

---

## 🔒 Phase 6: Security Enhancements (Week 3-4)

### Step 6.1: Add Rate Limiting
**Time: 2-3 hours**

Add rate limiting to API endpoints to prevent abuse.

**Options:**
- Use Vercel Edge Config + Middleware
- Or use Upstash Redis (free tier available)

**Tasks:**
- [ ] Implement rate limiting
- [ ] Test rate limiting

---

### Step 6.2: Add Input Validation
**Time: 2 hours**

Add Zod schemas for all API endpoints.

**File: `api/lib/validation.ts`** (new)

```typescript
import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(1).max(200),
  type: z.enum([
    'residential-plots', 'residential-apartments', 'residential-villas',
    'commercial', 'retail', 'hospitality', 'industrial', 'land'
  ]),
  city: z.string().min(1).max(100),
  area: z.string().min(1).max(100),
  price_label: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(['available', 'sold', 'new']),
  highlights: z.array(z.string()).default([]),
  lat: z.number().optional(),
  lon: z.number().optional(),
  images: z.array(z.string().url()).default([]),
  description: z.string().min(10).max(5000),
});

export type PropertyInput = z.infer<typeof propertySchema>;
```

**Tasks:**
- [ ] Create validation schemas
- [ ] Add validation to all endpoints
- [ ] Test validation

---

### Step 6.3: Add CORS Configuration
**Time: 1 hour**

Configure CORS properly for production.

**Tasks:**
- [ ] Update CORS headers
- [ ] Test CORS

---

## 📱 Phase 7: Frontend Enhancements (Week 4)

### Step 7.1: Add Loading States
**Time: 2 hours**

Add proper loading indicators throughout the website.

**Tasks:**
- [ ] Add loading states to property pages
- [ ] Add skeleton loaders
- [ ] Improve UX

---

### Step 7.2: Add Error Handling
**Time: 2 hours**

Add comprehensive error handling and user-friendly error messages.

**Tasks:**
- [ ] Add error boundaries
- [ ] Add error messages
- [ ] Test error scenarios

---

### Step 7.3: Optimize Images
**Time: 2-3 hours**

- Add image optimization
- Lazy loading
- Responsive images

**Tasks:**
- [ ] Implement image optimization
- [ ] Add lazy loading
- [ ] Test performance

---

## ✅ Phase 8: Testing & Deployment (Week 4)

### Step 8.1: Comprehensive Testing
**Time: 4-5 hours**

Test all functionality:
- [ ] Authentication flow
- [ ] Property CRUD operations
- [ ] Image uploads
- [ ] Dashboard functionality
- [ ] Website property display
- [ ] Search and filters
- [ ] Mobile responsiveness

---

### Step 8.2: Environment Variables Setup
**Time: 1 hour**

Document and set all environment variables:

**Vercel Environment Variables:**
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_KEY=eyJhbGc...
JWT_SECRET=your-random-secret (if still using JWT)
```

**Dashboard Environment Variables:**
```
VITE_API_URL=https://your-site.vercel.app/api
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

---

### Step 8.3: Final Deployment
**Time: 2-3 hours**

- [ ] Deploy API to Vercel
- [ ] Deploy website to Vercel
- [ ] Deploy dashboard to Vercel
- [ ] Test production deployment
- [ ] Monitor for errors

---

## 📋 Complete Checklist

### Database & Storage
- [ ] Supabase database schema created
- [ ] RLS policies configured
- [ ] Storage bucket created
- [ ] Storage policies configured

### Authentication
- [ ] Supabase Auth setup
- [ ] Admin user created
- [ ] Login API updated
- [ ] Auth middleware updated
- [ ] Token refresh implemented
- [ ] Dashboard auth updated

### API Endpoints
- [ ] GET /api/properties (public)
- [ ] GET /api/properties/[id] (public)
- [ ] POST /api/properties (protected)
- [ ] PUT /api/properties/[id] (protected)
- [ ] DELETE /api/properties/[id] (protected)
- [ ] POST /api/auth/login
- [ ] POST /api/auth/refresh
- [ ] POST /api/upload (protected)

### Admin Dashboard
- [ ] Login page updated
- [ ] Properties list with delete
- [ ] Property form (create/edit)
- [ ] Image upload component
- [ ] CRUD operations working

### Frontend
- [ ] Properties load from database
- [ ] No static JSON fallback
- [ ] Loading states
- [ ] Error handling
- [ ] Image optimization

### Security
- [ ] Rate limiting
- [ ] Input validation
- [ ] CORS configured
- [ ] Secure authentication

### Deployment
- [ ] Environment variables set
- [ ] Production deployment
- [ ] Testing complete

---

## 🎯 Success Criteria

✅ **Website is fully dynamic:**
- All properties loaded from Supabase database
- Real-time updates when properties are added/edited/deleted

✅ **Strong authentication:**
- Supabase Auth implemented
- Secure token-based authentication
- Token refresh working
- Protected admin routes

✅ **Full CRUD operations:**
- Create, read, update, delete properties
- Image uploads to Supabase Storage
- Admin dashboard fully functional

✅ **Production ready:**
- Secure and tested
- Performance optimized
- Error handling in place

---

## 📊 Timeline Summary

- **Week 1:** Database setup + Authentication foundation
- **Week 2:** Authentication complete + Image uploads + CRUD APIs
- **Week 3:** Dashboard CRUD + Data migration + Security
- **Week 4:** Frontend enhancements + Testing + Deployment

**Total Estimated Time: 80-100 hours**

---

## 🚀 Quick Start Priority Order

If you want to prioritize, do this order:

1. **Database Setup** (Phase 1) - Foundation
2. **Authentication** (Phase 2) - Security first
3. **Image Upload** (Phase 3) - Enable content creation
4. **CRUD Operations** (Phase 4) - Core functionality
5. **Data Migration** (Phase 5) - Move existing data
6. **Security** (Phase 6) - Harden the system
7. **Enhancements** (Phase 7) - Polish
8. **Deployment** (Phase 8) - Go live

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)

---

**Ready to start? Begin with Phase 1, Step 1.1!** 🚀

