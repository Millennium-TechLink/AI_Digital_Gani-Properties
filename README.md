# Gani Properties - React + Vite

A modern, fast, scalable React + Vite website for Gani Properties Pvt. Ltd., featuring premium real estate listings with stunning UI and immersive animations.

## 🚀 Tech Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS with design tokens
- **Framer Motion** - Smooth animations and transitions
- **React Router v7+** - Client-side routing
- **Lucide React** - Beautiful icons
- **shadcn/ui** - Accessible component primitives
- **React Hook Form + Zod** - Form validation
- **React Leaflet + OpenStreetMap** - Interactive maps
- **React Helmet Async** - SEO management
- **Axios** - HTTP client for form submissions

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── ui/             # shadcn/ui components (Button, Input, etc.)
│   └── ...
├── pages/              # Page components (routes)
├── lib/                # Utility functions and helpers
├── types/              # TypeScript type definitions
├── config/             # Configuration files
├── data/               # Static data (properties.json)
└── App.tsx             # Main app component with routes
```

## 📚 Documentation

All documentation is available in the [`docs/`](./docs/) folder:

### SEO & Optimization
- [SEO Roadmap](./docs/SEO_ROADMAP.md) - Complete SEO strategy
- [SEO Implementation](./docs/SEO_IMPLEMENTATION.md) - SEO setup guide
- [SEO Quick Start](./docs/SEO_QUICK_START.md) - Quick SEO checklist
- [SEO Status](./docs/SEO_STATUS.md) - Current SEO status

### Deployment & Hosting
- [Deployment Roadmap](./docs/DEPLOYMENT_ROADMAP.md) - **Complete deployment roadmap** ⭐
- [Pre-Deployment Checklist](./docs/PRE_DEPLOYMENT_CHECKLIST.md) - **Checklist before going live** ⭐
- [Monthly Cost Breakdown](./docs/MONTHLY_COST_BREAKDOWN.md) - **Complete pricing breakdown** ⭐
- [Hosting Comparison](./docs/HOSTING_COMPARISON.md) - Platform comparison & costs
- [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment instructions

### Contact Form Setup
- [Form Solutions](./docs/FORM_SOLUTIONS.md) - **Best options with cost analysis** ⭐
- [Form Implementation](./docs/FORM_IMPLEMENTATION.md) - Complete setup guide
- [Quick Form Setup](./docs/FORM_SETUP_QUICK.md) - 5-minute setup

### Service Setup Guides
- [Supabase Setup Guide](./docs/SUPABASE_SETUP_GUIDE.md) - **Complete database setup** ⭐
- [Resend Setup Guide](./docs/RESEND_SETUP_GUIDE.md) - **Complete email setup** ⭐

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Copy environment variables:
```bash
# Create .env file based on .env.example
cp .env.example .env
```

3. Configure form provider in `.env`:
```env
VITE_FORM_PROVIDER=web3forms
VITE_FORM_ENDPOINT=https://api.web3forms.com/submit
VITE_FORM_ACCESS_KEY=your_access_key_here
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📝 Form Provider Setup

The project supports multiple form providers:

### Web3Forms (Recommended)
```env
VITE_FORM_PROVIDER=web3forms
VITE_FORM_ENDPOINT=https://api.web3forms.com/submit
VITE_FORM_ACCESS_KEY=your_web3forms_access_key
```

### Formspree
```env
VITE_FORM_PROVIDER=formspree
VITE_FORM_ENDPOINT=https://formspree.io/f/YOUR_FORM_ID
```

### Getform
```env
VITE_FORM_PROVIDER=getform
VITE_FORM_ENDPOINT=https://getform.io/f/YOUR_FORM_ID
VITE_FORM_ACCESS_KEY=your_getform_token
```

### Custom Endpoint
```env
VITE_FORM_PROVIDER=custom
VITE_FORM_ENDPOINT=https://your-api.com/submit
VITE_FORM_ACCESS_KEY=your_api_key
```

## 🎨 Design System

The project uses CSS variables for design tokens defined in `src/index.css`:

- **Brand Colors**: `--gp-bg`, `--gp-surface`, `--gp-accent`, `--gp-gold`, `--gp-ink`
- **Typography**: `--font-display`, `--font-body`, `--font-ui`
- **Spacing & Radius**: Custom border radius values
- **Shadows**: Elevation system

## 📦 Key Features

- ✨ Premium, minimalistic UI design
- 🎭 Smooth animations with Framer Motion
- 🗺️ Interactive property maps with React Leaflet
- 🔍 Advanced property filtering and search
- 📱 Fully responsive design
- ♿ Accessible components
- 🚀 Optimized performance with Vite
- 🔒 Form validation and spam protection
- 📊 SEO optimized with React Helmet

## 🔄 Migration from Next.js

This project has been migrated from Next.js to Vite + React Router. Key changes:

- `next/link` → `react-router-dom` Link
- `next/image` → Custom Image component wrapper
- `next/navigation` → `react-router-dom` hooks
- API routes → External form providers (Web3Forms, Formspree, etc.)
- Next.js metadata → React Helmet Async

## 📄 License

Private - Gani Properties Pvt. Ltd.
