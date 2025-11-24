# Migration Guide: Next.js → Vite + React Router

This document outlines the changes needed to migrate components from Next.js to Vite + React Router.

## Key Changes

### 1. Imports

**Next.js → React Router:**
```tsx
// ❌ Next.js
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// ✅ Vite + React Router
import { Link, useNavigate, useLocation } from 'react-router-dom';
```

**Next.js Image → Custom Image:**
```tsx
// ❌ Next.js
import Image from 'next/image';
<Image src="/image.jpg" alt="..." fill />

// ✅ Vite
import Image from '@/components/Image';
<Image src="/image.jpg" alt="..." fill />
```

**Remove 'use client':**
```tsx
// ❌ Next.js
'use client';

// ✅ Vite (not needed - all components are client-side)
// Just remove this line
```

### 2. Routing Hooks

**usePathname():**
```tsx
// ❌ Next.js
const pathname = usePathname();

// ✅ React Router
const location = useLocation();
const pathname = location.pathname;
```

**useSearchParams():**
```tsx
// ❌ Next.js
const searchParams = useSearchParams();
const type = searchParams.get('type');

// ✅ React Router
const [searchParams] = useSearchParams();
const type = searchParams.get('type');
```

**useRouter():**
```tsx
// ❌ Next.js
const router = useRouter();
router.push('/path');
router.replace('/path');

// ✅ React Router
const navigate = useNavigate();
navigate('/path');
navigate('/path', { replace: true });
```

### 3. Navigation

**Link component:**
```tsx
// ❌ Next.js
<Link href="/about">About</Link>

// ✅ React Router
<Link to="/about">About</Link>
```

**Programmatic navigation:**
```tsx
// ❌ Next.js
router.push('/properties?type=residential');

// ✅ React Router
navigate('/properties?type=residential');
```

### 4. Error Handling

**notFound():**
```tsx
// ❌ Next.js
import { notFound } from 'next/navigation';
if (!property) {
  notFound();
}

// ✅ React Router
import { Navigate } from 'react-router-dom';
if (!property) {
  return <Navigate to="/404" replace />;
}
```

### 5. Metadata / SEO

**Next.js Metadata:**
```tsx
// ❌ Next.js
export const metadata: Metadata = {
  title: 'Page Title',
  description: 'Description',
};

// ✅ React Helmet Async
import { Helmet } from 'react-helmet-async';
<Helmet>
  <title>Page Title | Gani Properties</title>
  <meta name="description" content="Description" />
</Helmet>
```

### 6. Dynamic Routes

**Next.js:**
```tsx
// app/property/[slug]/page.tsx
export default function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  // ...
}
```

**React Router:**
```tsx
// src/pages/Property.tsx
import { useParams } from 'react-router-dom';

export default function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  // ...
}
```

### 7. API Routes

**Next.js API routes:**
```tsx
// ❌ Next.js
fetch('/api/forms', { method: 'POST', body: JSON.stringify(data) });
```

**External form provider:**
```tsx
// ✅ Vite - use lib/forms.ts
import { submitLead } from '@/lib/forms';
await submitLead(payload);
```

## Component Migration Checklist

For each component, verify:

- [ ] Removed `'use client'` directive
- [ ] Replaced `next/link` with `react-router-dom` Link
- [ ] Replaced `next/image` with custom Image component
- [ ] Updated routing hooks (usePathname → useLocation, etc.)
- [ ] Updated navigation calls (router.push → navigate)
- [ ] Updated Link href → to prop
- [ ] Replaced notFound() with Navigate component
- [ ] Updated imports from '@/components/...' (path alias should still work)
- [ ] Removed Next.js specific features (Suspense boundaries for navigation, etc.)

## Page Migration Checklist

For each page component:

- [ ] Convert to regular React component (not default export with special Next.js props)
- [ ] Use useParams() for dynamic route params
- [ ] Use useSearchParams() for query params
- [ ] Add Helmet component for SEO
- [ ] Update all Links and navigation
- [ ] Remove Next.js metadata exports

## Files Already Migrated

- ✅ `src/main.tsx` - Entry point
- ✅ `src/App.tsx` - Router setup
- ✅ `src/index.css` - Global styles
- ✅ `src/lib/utils.ts` - Utility functions
- ✅ `src/lib/forms.ts` - Form submission
- ✅ `src/lib/route.ts` - Route helpers
- ✅ `src/types/property.ts` - Type definitions
- ✅ `src/config/categories.ts` - Category config
- ✅ `src/components/ui/*` - UI components
- ✅ `src/components/BackToTop.tsx` - Back to top button
- ✅ `src/components/Image.tsx` - Image wrapper

## Files Pending Migration

All components in the `components/` directory need migration. Start with:

1. `PropertyCard.tsx` - Frequently used component
2. `LeadForm.tsx` - Form component
3. `FiltersBar.tsx` - Uses search params
4. `Navbar.tsx` - Complex navigation
5. `Footer.tsx` - Links and images
6. All page components in `app/` → `src/pages/`

## Testing After Migration

1. **Check Routing:**
   - All links work
   - Back/forward browser buttons work
   - Direct URL access works
   - Dynamic routes resolve correctly

2. **Check Forms:**
   - Form submission works with configured provider
   - Validation errors display
   - Success messages appear

3. **Check Images:**
   - All images load correctly
   - Lazy loading works
   - No broken image links

4. **Check SEO:**
   - Page titles update
   - Meta descriptions present
   - Open Graph tags present

5. **Check Performance:**
   - No console errors
   - Fast page loads
   - Smooth animations
