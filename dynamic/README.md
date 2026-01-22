# Gani Properties - Dynamic Version

This is the **fully dynamic version** of the Gani Properties website. All data is fetched from the API/Supabase database with no static fallbacks.

## Key Differences from Static Version

- ✅ **Fully API-driven** - No static JSON fallback
- ✅ **Real-time data** - All properties fetched from Supabase
- ✅ **Error handling** - Proper error states and loading indicators
- ✅ **Dynamic Property pages** - Complete property detail pages with images, maps, and forms
- ✅ **Better UX** - Loading states and error messages throughout

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env` file):
```env
VITE_API_URL=http://localhost:3000/api  # or your production API URL
VITE_SITE_URL=https://yourdomain.com
VITE_GOOGLE_SHEETS_WEB_APP_URL=your_google_script_url
```

3. Run development server:
```bash
npm run dev
```

The app will run on `http://localhost:5174` (different port from main app)

## Build

```bash
npm run build
```

## API Requirements

This version requires:
- Supabase database with `properties` table
- API endpoints at `/api/properties` and `/api/properties/:id`
- Proper CORS configuration

## Features

- **Dynamic Property Loading** - All properties fetched from API
- **Property Detail Pages** - Full property pages with galleries, maps, and contact forms
- **Error Handling** - Graceful error states when API is unavailable
- **Loading States** - Proper loading indicators throughout
- **SEO Optimized** - Dynamic meta tags and structured data

## Notes

- This version will show errors if the API is not available (unlike the static version which falls back to JSON)
- Make sure your Supabase database is properly configured
- API endpoints must be accessible and return data in the correct format
