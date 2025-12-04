# ✅ Google Sheets Setup - Your Configuration

## Your Web App URL

Your Google Apps Script Web App is deployed and running:

```
https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec
```

**Status:** ✅ Active and responding

---

## Next Step: Add to Vercel

### 1. Go to Vercel Dashboard
1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Website Project** (not dashboard)
3. Go to **Settings** → **Environment Variables**

### 2. Add Environment Variable

Click **Add New** and enter:

**Variable Name:**
```
VITE_GOOGLE_SHEETS_WEB_APP_URL
```

**Value:**
```
https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec
```

**Environments:** Select all three:
- ✅ Production
- ✅ Preview  
- ✅ Development

Click **Save**

### 3. Redeploy Website

1. Go to **Deployments** tab
2. Click the **3 dots** (⋯) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

---

## Test the Integration

After redeploying:

1. **Visit your live website**
2. **Go to Contact page**
3. **Fill out and submit the form:**
   - Name: Test User
   - Phone: 9876543210
   - Email: test@example.com
   - Interest: Residential Plots
   - Message: Test submission

4. **Verify:**
   - ✅ Form shows success message
   - ✅ Check your Google Sheet - new row should appear
   - ✅ Check `info@ganiproperties.com` - email notification should arrive

---

## Troubleshooting

### If form submission fails:
1. Check browser console (F12) for errors
2. Verify environment variable is set correctly in Vercel
3. Test Web App URL directly: [Test URL](https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec)
4. Check Apps Script execution logs (View → Logs in Apps Script editor)

### If data doesn't appear in sheet:
1. Verify Spreadsheet ID is correct in Apps Script
2. Check sheet name is "Inquiries" (case-sensitive)
3. Verify Apps Script has permission to access the sheet

### If email doesn't send:
1. Check ADMIN_EMAIL is set to `info@ganiproperties.com` in Apps Script
2. Verify MailApp permissions are authorized
3. Check Apps Script execution logs

---

## ✅ Setup Complete!

Once you've added the environment variable and redeployed, your contact form will:
- ✅ Save submissions to Google Sheets
- ✅ Send email notifications automatically
- ✅ Work completely free (no API costs)

---

**Your Web App URL is ready to use!** 🎉




