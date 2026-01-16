# Tech Stack

This document outlines the complete technology stack used in the Gani Properties application.

## Frontend

### Core Framework
- **React** (v18.2.0) - Modern UI library for building interactive interfaces
- **TypeScript** (v5.6.3) - Type-safe JavaScript with enhanced developer experience
- **Vite** (v5.4.11) - Next-generation frontend build tool for fast development

### Routing & Navigation
- **React Router DOM** (v7.0.0) - Declarative routing for React applications

### Styling & UI
- **Tailwind CSS** (v3.4.17) - Utility-first CSS framework
- **PostCSS** (v8.4.47) - CSS transformation tool
- **Autoprefixer** (v10.4.20) - Automatic vendor prefixing
- **Framer Motion** (v12.23.24) - Production-ready animation library
- **Lucide React** (v0.552.0) - Beautiful & consistent icon toolkit

### UI Components
- **Radix UI** - Unstyled, accessible component primitives
  - `@radix-ui/react-dialog` (v1.1.15)
  - `@radix-ui/react-label` (v2.1.1)
  - `@radix-ui/react-select` (v2.1.7)
- **Class Variance Authority** (v0.7.1) - Component variant management
- **Tailwind Merge** (v3.3.1) - Utility class conflict resolution
- **clsx** (v2.1.1) - Conditional className utility

### Forms & Validation
- **React Hook Form** (v7.66.0) - Performant form management
- **Zod** (v4.1.12) - TypeScript-first schema validation
- **@hookform/resolvers** (v5.2.2) - Validation resolvers for React Hook Form

### Maps & Location
- **Leaflet** (v1.9.4) - Open-source JavaScript library for interactive maps
- **React Leaflet** (v4.2.1) - React components for Leaflet maps
- **Google Maps API** - Location services and coordinate extraction

### SEO & Meta
- **React Helmet Async** (v2.0.5) - Document head manager for React

## Backend & API

### Runtime & Framework
- **Node.js** (v22.x) - JavaScript runtime
- **Vercel Serverless Functions** - Serverless API endpoints
- **@vercel/node** (v3.0.0) - Vercel runtime helpers

### Database & Storage
- **Supabase** (v2.39.0) - Open-source Firebase alternative
  - PostgreSQL database
  - File storage
  - Real-time capabilities
  - Row-level security

### Authentication & Security
- **JWT (JSON Web Tokens)** (v9.0.2) - Secure authentication
- Custom authentication middleware
- Token-based session management

### HTTP Client
- **Axios** (v1.7.9) - Promise-based HTTP client

### Third-Party Integrations
- **Google Sheets API** - Form submissions and data collection
- **Google Maps API** - Geocoding and location services

## Development Tools

### Code Quality
- **ESLint** (v8.57.1) - JavaScript/TypeScript linter
  - `@typescript-eslint/eslint-plugin` (v7.18.0)
  - `@typescript-eslint/parser` (v7.18.0)
  - `eslint-plugin-react-hooks` (v4.6.2)
  - `eslint-plugin-react-refresh` (v0.4.12)

### TypeScript Configuration
- Multiple `tsconfig.json` files for different parts of the application
- Type definitions for all major libraries

### Environment Management
- **dotenv** (v16.3.1) - Environment variable management
- `.nvmrc` - Node version specification

## Build & Deployment

### Hosting Platforms
- **Vercel** (Primary) - Serverless deployment platform
  - Automatic HTTPS
  - Edge Network CDN
  - Serverless Functions
  - Environment variables management

- **Netlify** (Alternative) - Modern web hosting
  - Continuous deployment
  - Redirect rules
  - Form handling

### Build Process
- **Vite** - Lightning-fast builds
  - Code splitting
  - Tree shaking
  - Asset optimization
  - Source maps (disabled in production)
  - Manual chunk splitting for vendors

### CI/CD
- Git-based deployment workflow
- Automatic builds on push
- Environment-specific configurations

## Scripts & Automation

### Custom Scripts
- `generate-sitemap.js` - Dynamic sitemap generation for SEO
- `google-apps-script.js` - Google Sheets integration script

### NPM Scripts
```json
{
  "dev": "vite",                    // Start development server
  "build": "tsc && vite build",     // Type-check and build for production
  "preview": "vite preview",        // Preview production build locally
  "lint": "eslint ...",             // Run linter
  "generate-sitemap": "node ..."    // Generate sitemap
}
```

## Project Structure

### Main Application
- `/src` - React application source code
- `/api` - Serverless API functions
- `/public` - Static assets
- `/docs` - Documentation

### Pipeline
- `/pipeline/backend` - Backend service (optional standalone)
- `/pipeline/dashboard` - Admin dashboard (optional)

## API Architecture

### Endpoints
- `/api/auth/login` - User authentication
- `/api/auth/verify` - Token verification
- `/api/properties` - Property CRUD operations
- `/api/properties/[id]` - Single property operations
- `/api/upload` - File upload handling

### Middleware
- Authentication middleware
- Validation middleware
- CORS configuration

## Key Features

### Performance Optimizations
- Code splitting and lazy loading
- Image optimization (WebP format)
- Asset preloading
- Manual vendor chunking
- Tree-shaking unused code

### SEO Features
- Dynamic meta tags
- Sitemap generation
- Robots.txt configuration
- Server-side rendering ready
- Semantic HTML structure

### Accessibility
- ARIA-compliant components (Radix UI)
- Keyboard navigation support
- Screen reader optimization

### Developer Experience
- Hot Module Replacement (HMR)
- TypeScript for type safety
- ESLint for code quality
- Path aliases (@/ imports)
- Comprehensive documentation

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ support required
- Mobile responsive design

## Security

- JWT-based authentication
- Environment variable protection
- CORS configuration
- Supabase row-level security
- Secure file upload handling
- XSS protection through React

## Scalability

- Serverless architecture
- CDN delivery
- Database connection pooling (Supabase)
- Efficient state management
- Optimized bundle sizes

---

**Last Updated:** December 15, 2025
**Node Version:** 22.x
**Package Manager:** npm


