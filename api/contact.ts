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
    
    // Validate phone format (basic - 10 digits)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      return res.status(400).json({ error: 'Invalid phone number' });
    }
    
    // Store in database
    const { data: submission, error: dbError } = await supabase
      .from('form_submissions')
      .insert({
        name: name.trim(),
        phone: cleanPhone,
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
                  <div class="value"><a href="tel:${cleanPhone}">${cleanPhone}</a></div>
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

