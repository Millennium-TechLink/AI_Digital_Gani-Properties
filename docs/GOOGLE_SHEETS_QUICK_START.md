# ⚡ Google Sheets Setup - Quick Start

5-minute setup guide for Google Sheets contact form integration.

---

## 🚀 Quick Setup

### 1. Create Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Create new sheet: **"Gani Properties Inquiries"**
3. Add headers in Row 1: `Timestamp | Name | Phone | Email | Interest | Message | Page | UTM Source | UTM Medium | UTM Campaign`
4. Copy Spreadsheet ID from URL

### 2. Setup Apps Script
1. In sheet: **Extensions** → **Apps Script**
2. Paste code from `scripts/google-apps-script.js`
3. Update `SPREADSHEET_ID` (line 20)
4. Save script

### 3. Deploy Web App
1. Click **Deploy** → **New deployment** → ⚙️ → **Web app**
2. Execute as: **Me**
3. Who has access: **Anyone**
4. Click **Deploy**
5. **Copy the Web App URL**

### 4. Add to Vercel
1. Vercel Dashboard → Project → **Settings** → **Environment Variables**
2. Add: `VITE_GOOGLE_SHEETS_WEB_APP_URL` = `[your-web-app-url]`
3. **Redeploy**

### 5. Test
1. Submit contact form on your website
2. Check Google Sheet - new row should appear
3. Check email - notification should arrive

---

## ✅ Done!

Your contact form now saves to Google Sheets and sends email automatically.

**Full guide:** See `docs/GOOGLE_SHEETS_SETUP.md` for detailed instructions.

