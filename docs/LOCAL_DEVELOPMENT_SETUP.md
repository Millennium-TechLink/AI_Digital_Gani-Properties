# 🛠️ Local Development Setup

Quick guide to set up your local development environment.

---

## 📋 Prerequisites

- Node.js 22.x (check with `node --version`)
- npm or yarn

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create `.env` File

Create a `.env` file in the project root with:

```env
# Site Configuration
VITE_SITE_URL=http://localhost:5173

# Supabase Configuration (for properties)
VITE_SUPABASE_URL=https://oacpemdmeemulfkgxhui.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9hY3BlbWRtZWVtdWxma2d4aHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Nzg1MjcsImV4cCI6MjA3OTU1NDUyN30.h40KGiN7-F0plx3eCWdMsUY5bBl7fjB4B-x8KNk7NKU

# Google Sheets Contact Form (optional for local dev)
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec

# API URL (only needed if running local backend)
# VITE_API_URL=http://localhost:3000/api
```

**Note:** The `.env` file is already in `.gitignore`, so it won't be committed.

### 3. Start Development Server

```bash
npm run dev
```

Your site will be available at: `http://localhost:5173`

---

## ⚠️ Common Development Warnings

### 1. API Connection Errors

**Error:** `Failed to load resource: net::ERR_CONNECTION_REFUSED`

**Explanation:** This is normal in local development. The app will:
- Try to fetch properties from the API
- Automatically fall back to static data from `src/data/properties.json`
- Show a warning in console (this is expected)

**Solution:** No action needed. The app works with static data in development.

### 2. Google Sheets URL Not Configured

**Error:** `VITE_GOOGLE_SHEETS_WEB_APP_URL not configured`

**Explanation:** The contact form needs the Google Sheets Web App URL to submit.

**Solution:** Add it to your `.env` file (see Step 2 above).

### 3. Framer Motion Warning

**Warning:** `Please ensure that the container has a non-static position`

**Explanation:** This is a warning about scroll animations. Not critical.

**Solution:** Can be ignored, or fix by adding `position: relative` to parent containers.

### 4. React DevTools

**Message:** `Download the React DevTools for a better development experience`

**Explanation:** This is just a suggestion, not an error.

**Solution:** Optional - install [React DevTools](https://reactjs.org/link/react-devtools) browser extension.

---

## 🔧 Development Features

### Hot Module Replacement (HMR)
- Changes to files automatically reload the browser
- State is preserved where possible

### Static Data Fallback
- Properties load from `src/data/properties.json` if API is unavailable
- Contact form shows error if Google Sheets URL not configured

### TypeScript
- Full type checking enabled
- Errors shown in terminal and browser console

---

## 📁 Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── lib/           # Utilities and API clients
├── types/         # TypeScript types
└── data/          # Static data (properties.json)
```

---

## 🐛 Troubleshooting

### Port Already in Use

**Error:** `Port 5173 is already in use`

**Solution:**
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

### Dependencies Issues

**Error:** Module not found

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Environment Variables Not Loading

**Solution:**
- Make sure `.env` file is in project root
- Restart dev server after adding variables
- Variables must start with `VITE_` to be accessible in frontend

---

## ✅ Development Checklist

- [ ] Node.js 22.x installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with required variables
- [ ] Dev server running (`npm run dev`)
- [ ] Site loads at `http://localhost:5173`
- [ ] No critical errors in console

---

**Happy coding! 🚀**

