# 📧 Contact Form - Google Sheets Integration

## Overview

The contact form has been restructured to use **Google Sheets** for data storage and **Google Apps Script** for automated email notifications.

---

## ✅ What Changed

### Before (Resend + Supabase)
- Form submissions → Vercel API → Supabase Database
- Email notifications via Resend API
- Required API keys and paid services

### After (Google Sheets + Apps Script)
- Form submissions → Google Sheets Web App → Google Sheet
- Email notifications via Google Apps Script
- **Completely free** - no API costs
- Easy data management in spreadsheet

---

## 📁 Files Changed

1. **`src/lib/forms.ts`** - Updated to submit to Google Sheets Web App
2. **`scripts/google-apps-script.js`** - New Google Apps Script code
3. **`ENV_EXAMPLE.txt`** - Updated with Google Sheets URL variable

---

## 🔧 Setup Required

### 1. Google Sheet Setup
- Create spreadsheet with headers
- Copy Spreadsheet ID

### 2. Apps Script Setup
- Paste script code
- Update configuration
- Deploy as Web App
- Copy Web App URL

### 3. Vercel Environment Variable
- Add `VITE_GOOGLE_SHEETS_WEB_APP_URL`
- Redeploy website

**Full instructions:** See `docs/GOOGLE_SHEETS_SETUP.md`

---

## 📊 Data Flow

```
User submits form
    ↓
Frontend (LeadForm.tsx)
    ↓
forms.ts → Google Sheets Web App URL
    ↓
Google Apps Script (doPost function)
    ↓
    ├─→ Save to Google Sheet
    └─→ Send email to info@ganiproperties.com
    ↓
Return success response
```

---

## 🔑 Environment Variables

### Required:
```env
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

### No longer needed:
- ~~`RESEND_API_KEY`~~ (removed)
- ~~`SUPABASE_URL`~~ (optional - only if using for other features)
- ~~`SUPABASE_SERVICE_KEY`~~ (optional)

---

## 📝 Form Fields

The form collects:
- **Name** (required)
- **Phone** (required)
- **Email** (optional)
- **Interest** (optional - Residential Plots, Farm Plots, etc.)
- **Message** (optional)
- **Page** (auto - which page form was submitted from)
- **UTM Parameters** (auto - for tracking)
- **Honeypot** (hidden - spam protection)

---

## 📧 Email Notifications

When a form is submitted:
1. Data is saved to Google Sheet
2. Email is sent to `info@ganiproperties.com` with:
   - All form data
   - Timestamp
   - Link to view in Google Sheets
   - Reply-to set to submitter's email (if provided)

---

## 🎯 Benefits

✅ **Free** - No API costs  
✅ **Simple** - Easy to view and manage inquiries  
✅ **Reliable** - Google infrastructure  
✅ **Automated** - Email notifications built-in  
✅ **Scalable** - Handles unlimited submissions  
✅ **Exportable** - Easy to export data  

---

## 🔄 Migration Notes

If you were using the old Resend/Supabase setup:
1. Old submissions remain in Supabase
2. New submissions go to Google Sheets
3. You can keep both systems running during transition
4. Eventually remove Resend API key from Vercel

---

## 📚 Documentation

- **Quick Start:** `docs/GOOGLE_SHEETS_QUICK_START.md`
- **Full Setup:** `docs/GOOGLE_SHEETS_SETUP.md`
- **Apps Script Code:** `scripts/google-apps-script.js`

---

**Setup complete! Contact form now uses Google Sheets.** 🎉







