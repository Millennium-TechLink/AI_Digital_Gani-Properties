# 📊 Google Sheets Contact Form Setup Guide

Complete guide to set up Google Sheets integration for contact form submissions with automated email notifications.

---

## 🎯 Overview

This setup replaces the previous Resend/Supabase integration with:
- ✅ **Google Sheets** - All inquiries stored in a spreadsheet
- ✅ **Google Apps Script** - Automated email notifications
- ✅ **No API costs** - Completely free solution
- ✅ **Easy data management** - View all inquiries in one place

---

## 📋 Step-by-Step Setup

### **STEP 1: Create Google Sheet** (5 minutes)

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it: **"Gani Properties Inquiries"**
4. In the first row (Row 1), add these headers in columns A to J:

| Column | Header |
|--------|--------|
| A | Timestamp |
| B | Name |
| C | Phone |
| D | Email |
| E | Interest |
| F | Message |
| G | Page |
| H | UTM Source |
| I | UTM Medium |
| J | UTM Campaign |

5. **Format the header row:**
   - Select Row 1 (click the "1" on the left)
   - Make text **Bold**
   - Background color: `#0F3A3D` (dark green)
   - Text color: White
   - Center align

6. **Copy your Spreadsheet ID:**
   - Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part
   - Example: `1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t`

---

### **STEP 2: Create Google Apps Script** (10 minutes)

1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Delete all default code
3. Open `scripts/google-apps-script.js` from your project
4. Copy the entire contents
5. Paste into the Apps Script editor

6. **Update Configuration:**
   - Find the `CONFIGURATION` section at the top
   - Replace `YOUR_SPREADSHEET_ID_HERE` with your actual Spreadsheet ID
   - Verify `ADMIN_EMAIL` is set to `info@ganiproperties.com`
   - Verify `SHEET_NAME` is `Inquiries`

7. **Save the script:**
   - Click **File** → **Save**
   - Name it: **"Contact Form Handler"**

---

### **STEP 3: Deploy as Web App** (5 minutes)

1. Click **Deploy** → **New deployment**
2. Click the gear icon ⚙️ next to "Select type"
3. Choose **"Web app"**
4. Configure:
   - **Description**: `Contact Form Handler v1`
   - **Execute as**: **"Me"** (your account)
   - **Who has access**: **"Anyone"** (important!)
5. Click **Deploy**
6. **Authorize permissions:**
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" → "Go to Contact Form Handler (unsafe)"
   - Click "Allow"
7. **Copy the Web App URL:**
   - You'll see a URL like: `https://script.google.com/macros/s/AKfycby.../exec`
   - **Copy this entire URL** - you'll need it for the frontend

---

### **STEP 4: Test the Setup** (5 minutes)

1. Open the Web App URL in a new browser tab
2. You should see: `{"ok":true,"message":"Gani Properties Contact Form API is running",...}`
3. If you see an error, check:
   - Spreadsheet ID is correct
   - Script is saved
   - Permissions are authorized

---

### **STEP 5: Add to Vercel Environment Variables** (5 minutes)

1. Go to your **Vercel Dashboard** → **Website Project**
2. Go to **Settings** → **Environment Variables**
3. Add new variable:

```
Variable Name: VITE_GOOGLE_SHEETS_WEB_APP_URL
Value: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

4. **Important:** 
   - Make sure to use the **full URL** you copied from Step 3
   - Select **Production**, **Preview**, and **Development** environments
   - Click **Save**

5. **Redeploy your website:**
   - Go to **Deployments** tab
   - Click the **3 dots** on latest deployment
   - Click **Redeploy**

---

### **STEP 6: Test the Contact Form** (5 minutes)

1. Visit your live website
2. Go to the Contact page
3. Fill out and submit the form
4. **Check Google Sheet:**
   - Open your spreadsheet
   - You should see a new row with the submission
5. **Check Email:**
   - Check `info@ganiproperties.com` inbox
   - You should receive an email notification

---

## ✅ Verification Checklist

- [ ] Google Sheet created with correct headers
- [ ] Spreadsheet ID copied
- [ ] Apps Script code pasted and configured
- [ ] Script saved
- [ ] Web App deployed
- [ ] Web App URL copied
- [ ] Environment variable added to Vercel
- [ ] Website redeployed
- [ ] Test submission successful
- [ ] Data appears in Google Sheet
- [ ] Email notification received

---

## 🔧 Troubleshooting

### Issue: "Script not found" error
**Solution:**
- Verify the Web App URL is correct
- Make sure deployment is active
- Check "Who has access" is set to "Anyone"

### Issue: "Permission denied" error
**Solution:**
- Re-authorize the script
- Go to Apps Script → Run → Check permissions
- Make sure you authorized all required permissions

### Issue: Data not appearing in sheet
**Solution:**
- Check Spreadsheet ID is correct
- Verify sheet name is "Inquiries" (case-sensitive)
- Check Apps Script execution logs (View → Logs)

### Issue: Email not sending
**Solution:**
- Check ADMIN_EMAIL is correct
- Verify MailApp permissions are authorized
- Check Apps Script execution logs for errors

### Issue: Form submission fails
**Solution:**
- Check browser console for errors
- Verify `VITE_GOOGLE_SHEETS_WEB_APP_URL` is set in Vercel
- Test the Web App URL directly in browser
- Check Apps Script execution logs

---

## 📊 Managing Inquiries

### View All Inquiries
- Open your Google Sheet
- All submissions appear in real-time
- Sort and filter as needed

### Export Data
- File → Download → CSV/Excel
- Or use Google Sheets API for automation

### Backup
- Google Sheets auto-saves
- Consider exporting monthly backups

---

## 🔒 Security Notes

1. **Web App URL is public** - Anyone with the URL can submit forms
   - This is expected behavior for contact forms
   - Honeypot field prevents spam bots

2. **Spreadsheet Access**
   - Keep your spreadsheet private or shared only with your team
   - The Web App URL doesn't give access to the sheet

3. **Email Notifications**
   - Only sent to the configured ADMIN_EMAIL
   - Reply-to is set to the submitter's email (if provided)

---

## 📈 Next Steps

After setup is complete:
1. ✅ Remove old Resend API key from Vercel (optional)
2. ✅ Monitor first few submissions
3. ✅ Set up Google Sheets filters/views for better organization
4. ✅ Consider adding Google Sheets notifications for new rows

---

## 🆘 Support

If you encounter issues:
1. Check Apps Script execution logs (View → Logs)
2. Test Web App URL directly in browser
3. Verify all environment variables are set correctly
4. Check browser console for frontend errors

---

**Setup complete! Your contact form now saves to Google Sheets and sends email notifications automatically.** 🎉














