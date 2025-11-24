# Resend Email Setup Guide
## Step-by-Step Instructions for Email Functionality

---

## 🎯 What You'll Set Up

1. **Resend Account**
2. **API Key**
3. **Domain Verification** (optional, for production)
4. **Email Templates** (optional)

---

## 📋 Step 1: Create Resend Account

### 1.1 Sign Up
1. Go to **https://resend.com**
2. Click **"Get Started"** or **"Sign Up"**
3. Choose sign-up method:
   - **Email** (recommended)
   - **GitHub** (alternative)
4. Enter your email address
5. Create a password
6. Click **"Create account"**

### 1.2 Verify Email
1. Check your email inbox
2. Click verification link
3. You'll be redirected to Resend dashboard

### 1.3 Access Dashboard
- After verification, you'll see the Resend dashboard
- You're ready to setup!

---

## 📋 Step 2: Get API Key

### 2.1 Navigate to API Keys
1. In left sidebar, click **"API Keys"**
2. Or go to: https://resend.com/api-keys

### 2.2 Create API Key
1. Click **"Create API Key"** button
2. Fill in details:

   **Name:**
   ```
   Gani Properties Production
   ```
   (or any descriptive name)

   **Permission:**
   - Select **"Sending access"** (default)
   - This allows sending emails

   **Domain:**
   - Leave empty (for now)
   - Or select your verified domain

3. Click **"Add"** or **"Create"**

### 2.3 Copy API Key
1. **Important**: Copy the API key immediately
2. It will look like:
   ```
   re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
3. ⚠️ **You won't be able to see it again!**
4. Save it securely (password manager or `.env` file)

### 2.4 Verify Key
- The key should start with `re_`
- It's about 40-50 characters long
- Save it as `RESEND_API_KEY`

---

## 📋 Step 3: Setup Domain (Optional - For Production)

### 3.1 Why Verify Domain?
- Use your own domain for "From" address
- Better email deliverability
- Professional appearance
- Example: `noreply@ganiproperties.com`

### 3.2 If Not Verifying Domain
- You can use Resend's domain: `noreply@resend.dev`
- Works for testing and small volumes
- Free tier allows this

### 3.3 Verify Domain (Production)
1. In left sidebar, click **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain:
   ```
   ganiproperties.com
   ```
4. Click **"Add Domain"**
5. Follow DNS setup instructions:
   - Add DNS records to your domain provider
   - Wait for verification (can take up to 48 hours)
   - Once verified, you can use `@ganiproperties.com` emails

---

## 📋 Step 4: Configure Environment Variables

### 4.1 Vercel Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:

```env
# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@resend.dev
```

**Or if domain verified:**
```env
FROM_EMAIL=noreply@ganiproperties.com
```

### 4.2 Local Development (.env)
For local testing, create `.env` file:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@resend.dev
```

---

## 📋 Step 5: Test Email Sending

### 5.1 Test via API
You can test using curl:

```bash
curl -X POST 'https://api.resend.com/emails' \
  -H 'Authorization: Bearer re_YOUR_API_KEY' \
  -H 'Content-Type: application/json' \
  -d '{
    "from": "Gani Properties <noreply@resend.dev>",
    "to": ["your-email@example.com"],
    "subject": "Test Email",
    "html": "<h1>Test Email</h1><p>This is a test from Resend!</p>"
  }'
```

### 5.2 Test via Contact Form
1. Submit a contact form on your website
2. Check admin email inbox
3. Should receive formatted email

### 5.3 Check Resend Dashboard
1. Go to **"Emails"** in sidebar
2. You should see sent emails
3. Check status (delivered, bounced, etc.)

---

## 📋 Step 6: Email Configuration Details

### 6.1 From Address
**For Testing:**
```
noreply@resend.dev
```

**For Production (if domain verified):**
```
noreply@ganiproperties.com
```

### 6.2 To Address (Admin)
```
info@ganiproperties.com
```
(Or your preferred admin email)

### 6.3 Reply-To Address
- Set to customer's email (if provided)
- Allows admin to reply directly

---

## 📋 Step 7: Email Template (Already Configured)

### 7.1 Contact Form Email
The email template is already configured in `api/contact.ts`:
- ✅ HTML formatted
- ✅ Includes all form fields
- ✅ Professional styling
- ✅ Includes submission timestamp
- ✅ Includes submission ID

### 7.2 Customize Template (Optional)
Edit `api/contact.ts` to customize:
- Email subject
- Email HTML template
- Email styling

---

## 📊 Resend Free Tier Limits

### What's Included
- ✅ **3,000 emails/month** (free)
- ✅ **100 emails/day** (rate limit)
- ✅ **1 domain** (can verify)
- ✅ **Unlimited API requests**
- ✅ **Email analytics**

### When to Upgrade
- If you exceed 3,000 emails/month
- Need multiple domains
- Need higher rate limits
- **Pro Plan**: $20/month (50,000 emails)

---

## 🚨 Common Issues & Solutions

### Issue: "Invalid API key"
**Solution**: 
- Verify you copied the entire key
- Check for extra spaces
- Make sure key starts with `re_`
- Regenerate if needed

### Issue: "Email not received"
**Solution**:
- Check spam folder
- Verify `ADMIN_EMAIL` is correct
- Check Resend dashboard for delivery status
- Verify API key is correct

### Issue: "Domain not verified"
**Solution**:
- Use `noreply@resend.dev` for testing
- Or complete domain verification
- Check DNS records are correct

### Issue: "Rate limit exceeded"
**Solution**:
- Free tier: 100 emails/day
- Wait 24 hours or upgrade plan
- Check email sending frequency

---

## ✅ Setup Complete!

Your Resend is now ready for:
- ✅ Sending contact form emails
- ✅ Email notifications
- ✅ Professional email delivery
- ✅ Email analytics

**Next Steps:**
1. Test contact form submission
2. Verify email delivery
3. Monitor email usage in dashboard

---

## 📊 What's Configured

### Email Service
✅ Resend account created
✅ API key obtained
✅ Environment variables set

### Email Template
✅ Contact form email template
✅ HTML formatting
✅ Professional styling

### Integration
✅ Integrated with Supabase (stores submissions)
✅ Integrated with serverless function (`api/contact.ts`)

---

## 📚 Related Documentation

- **Supabase Setup**: `docs/SUPABASE_SETUP_GUIDE.md`
- **Form Implementation**: `docs/FORM_IMPLEMENTATION.md`
- **Deployment**: `docs/DEPLOYMENT_READY.md`

---

## 🆘 Need Help?

1. **Resend Docs**: https://resend.com/docs
2. **Resend Support**: support@resend.com
3. **Check API**: `api/contact.ts` for email sending code

---

## 🎯 Quick Reference

### Resend Dashboard
- **Dashboard**: https://resend.com/emails
- **API Keys**: https://resend.com/api-keys
- **Domains**: https://resend.com/domains
- **Analytics**: https://resend.com/analytics

### API Endpoint
```
POST https://api.resend.com/emails
```

### Environment Variables
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@resend.dev
```

---

**You're all set! 🎉**

