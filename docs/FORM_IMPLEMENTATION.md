# Contact Form Implementation Guide
## Email + Database Storage Setup

---

## 🎯 Recommended Solution: Supabase + Resend

**Cost**: $0/month (free tiers)  
**Email Limit**: 3,000/month (free)  
**Storage**: 500MB (free)

---

## Step 1: Setup Supabase Database

### 1.1 Create Table

Go to Supabase SQL Editor and run:

```sql
-- Create form_submissions table
CREATE TABLE form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  interest TEXT,
  message TEXT,
  page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  responded BOOLEAN DEFAULT FALSE
);

-- Create indexes
CREATE INDEX idx_form_submissions_created_at ON form_submissions(created_at DESC);
CREATE INDEX idx_form_submissions_read ON form_submissions(read);

-- Enable RLS
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for form submissions)
CREATE POLICY "Public insert access" ON form_submissions
  FOR INSERT WITH CHECK (true);

-- Admin can read all (protected by service key)
CREATE POLICY "Admin read access" ON form_submissions
  FOR SELECT USING (true);
```

---

## Step 2: Setup Resend (Email Service)

### 2.1 Create Account
1. Go to https://resend.com
2. Sign up (free)
3. Verify your email

### 2.2 Get API Key
1. Go to API Keys
2. Create new API key
3. Copy the key (save it!)

### 2.3 Optional: Verify Domain
- For production, verify your domain
- For testing, can use their domain

---

## Step 3: Create Serverless Function

### 3.1 Create API File

**File**: `api/contact.ts`

```typescript
import { createClient } from '@supabase/supabase-js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@ganiproperties.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@resend.dev';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { 
      name, 
      phone, 
      email, 
      interest, 
      message, 
      page, 
      utm_source, 
      utm_medium, 
      utm_campaign,
      hp // Honeypot field
    } = req.body;
    
    // Honeypot spam check
    if (hp && hp !== '') {
      return res.status(200).json({ ok: true }); // Silent fail for bots
    }
    
    // Validate required fields
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }
    
    // Validate phone format (basic)
    if (!/^[0-9]{10}$/.test(phone.replace(/\D/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // Store in database
    const { data: submission, error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.trim() || null,
        interest: interest || null,
        message: message?.trim() || null,
        page: page || null,
        utm_source: utm_source || null,
        utm_medium: utm_medium || null,
        utm_campaign: utm_campaign || null,
      })
      .select()
      .single();
    
    if (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Failed to save submission' });
    }
    
    // Send email to admin
    if (RESEND_API_KEY) {
      try {
        const emailSubject = interest 
          ? `New ${interest} Inquiry from ${name}`
          : `New Contact Form Submission from ${name}`;
        
        const emailHtml = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #0F3A3D; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
              .field { margin: 15px 0; }
              .label { font-weight: bold; color: #0F3A3D; }
              .value { margin-top: 5px; }
              .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>New Contact Form Submission</h2>
              </div>
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${name}</div>
                </div>
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${phone}">${phone}</a></div>
                </div>
                ${email ? `
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${email}">${email}</a></div>
                </div>
                ` : ''}
                ${interest ? `
                <div class="field">
                  <div class="label">Interest:</div>
                  <div class="value">${interest}</div>
                </div>
                ` : ''}
                ${message ? `
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                ` : ''}
                <div class="field">
                  <div class="label">Page:</div>
                  <div class="value">${page || 'Unknown'}</div>
                </div>
                ${utm_source ? `
                <div class="field">
                  <div class="label">UTM Source:</div>
                  <div class="value">${utm_source}</div>
                </div>
                ` : ''}
                <div class="footer">
                  <p>Submitted at: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                  <p>Submission ID: ${submission.id}</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `;
        
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: `Gani Properties <${FROM_EMAIL}>`,
            to: [ADMIN_EMAIL],
            reply_to: email || FROM_EMAIL,
            subject: emailSubject,
            html: emailHtml,
          }),
        });
        
        if (!emailResponse.ok) {
          const errorData = await emailResponse.json();
          console.error('Email sending failed:', errorData);
          // Don't fail the request if email fails - data is saved
        }
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails - data is saved
      }
    }
    
    return res.status(200).json({ 
      ok: true, 
      id: submission.id,
      message: 'Thank you! We will contact you soon.'
    });
    
  } catch (error: any) {
    console.error('Contact form error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
}
```

---

## Step 4: Update Frontend Form

### 4.1 Update forms.ts

**File**: `src/lib/forms.ts` (Update)

```typescript
// ... existing code ...

export async function submitLead(payload: LeadPayload): Promise<SubmitResponse> {
  try {
    // Use new serverless function
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/contact`;
    
    const response = await axios({
      method: 'POST',
      url: endpoint,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    if (response.status >= 200 && response.status < 300) {
      return { ok: true };
    } else {
      return { ok: false, error: 'Failed to submit form' };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    if (axios.isAxiosError(error)) {
      return { 
        ok: false, 
        error: error.response?.data?.error || error.message || 'Network error' 
      };
    }
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}
```

---

## Step 5: Environment Variables

### 5.1 Vercel Environment Variables

Add to Vercel project settings:

```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=your-service-key
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=info@ganiproperties.com
FROM_EMAIL=noreply@yourdomain.com (or use resend.dev for testing)
```

### 5.2 Frontend Environment Variables

```
VITE_API_URL=https://your-api.vercel.app/api
```

---

## Step 6: Install Dependencies

```bash
# For serverless function
npm install @supabase/supabase-js

# Already installed: axios (for frontend)
```

---

## Step 7: Test

1. Submit test form
2. Check Supabase database (should see entry)
3. Check admin email (should receive email)
4. Verify all fields are saved correctly

---

## 📊 View Submissions in Dashboard (Optional)

You can add a submissions page to your admin dashboard:

**File**: `pipeline/dashboard/src/pages/Submissions.tsx`

```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = async () => {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) setSubmissions(data);
    setLoading(false);
  };

  return (
    <div>
      <h1>Form Submissions</h1>
      {/* Display submissions table */}
    </div>
  );
}
```

---

## ✅ Checklist

- [ ] Supabase table created
- [ ] Resend account created
- [ ] API key obtained
- [ ] Serverless function created
- [ ] Frontend updated
- [ ] Environment variables set
- [ ] Tested form submission
- [ ] Verified email delivery
- [ ] Verified data storage

---

## 🎉 You're Done!

Now:
- ✅ Admin receives email for every submission
- ✅ All submissions stored in Supabase
- ✅ Can view submissions in dashboard
- ✅ Cost: $0/month (free tiers)

---

## 🔄 Alternative: Web3Forms + Supabase

If you prefer Web3Forms for email:

1. Sign up at https://web3forms.com (free)
2. Get access key
3. Update `api/contact.ts` to use Web3Forms API
4. Same database storage in Supabase

**See `docs/FORM_SOLUTIONS.md` for Web3Forms implementation**

