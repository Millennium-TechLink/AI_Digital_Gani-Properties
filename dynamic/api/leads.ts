import nodemailer from 'nodemailer';
import { authenticateToken } from './lib/auth.js';
import { readSettings, DEFAULT_SETTINGS } from './lib/settings.js';
import { createLead, getLeads, deleteLead } from './lib/leads.js';
import { incrementLeadCount } from './lib/stats.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function buildLeadEmail(lead: { name: string; email: string; phone: string; interest: string; message: string }) {
  return `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#0F3A3D,#1a5a5e);padding:40px;text-align:center">
        <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px">New Property Enquiry</h1>
        <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:16px">Gani Properties Portfolio</p>
      </div>
      <div style="padding:40px">
        <div style="background:#f8f9fa;border-radius:10px;padding:24px;margin-bottom:30px;border:1px solid #edf2f7; text-align:center">
          <h2 style="margin:0;color:#0F3A3D;font-size:20px;font-weight:700">${lead.interest}</h2>
        </div>
        <table style="width:100%;border-collapse:collapse">
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px;width:120px">Client Name</td>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7;font-weight:600;color:#1a202c">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px">Phone Number</td>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7;font-weight:600;color:#1a202c">
              <a href="tel:${lead.phone}" style="color:#0F3A3D;text-decoration:none">${lead.phone}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px">Email Address</td>
            <td style="padding:12px 0;border-bottom:1px solid #edf2f7">
              <a href="mailto:${lead.email}" style="color:#0F3A3D;text-decoration:none">${lead.email || 'N/A'}</a>
            </td>
          </tr>
        </table>
        <div style="margin-top:30px">
          <h3 style="font-size:13px;color:#718096;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700">Message / Inquiry Details</h3>
          <div style="background:#f8f9fa;border-left:4px solid #C9B589;border-radius:6px;padding:20px;color:#2d3748;line-height:1.7;white-space:pre-wrap;font-size:15px">${lead.message || 'Patiently waiting for contact.'}</div>
        </div>
        <div style="margin-top:40px;text-align:center">
          <a href="tel:${lead.phone}" style="background:#C9B589;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block">Return Call Now</a>
        </div>
      </div>
      <div style="background:#f7fafc;padding:20px 40px;text-align:center;color:#a0aec0;font-size:13px;border-top:1px solid #edf2f7">
        This lead was generated automatically from the Gani Properties website.
      </div>
    </div>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Single-lead routes go through ?id= instead of /leads/[id] - Vercel
  // wasn't resolving bracket-dynamic function files in this project (see
  // properties/index.ts for the full explanation), so delete lives here too.
  const id = typeof req.query.id === 'string' ? req.query.id : undefined;

  // POST /api/leads - public, submitted by the site's contact/enquiry forms
  if (req.method === 'POST') {
    try {
      const { name, email, phone, interest, message, page, propertyTitle } = req.body || {};
      if (!name || !phone) {
        return res.status(400).json({ error: 'Name and phone are required' });
      }

      const lead = await createLead({ name, email, phone, interest, message, page, propertyTitle });

      // Stats counter isn't critical to the enquiry itself - don't fail the
      // whole request if it errors.
      try {
        await incrementLeadCount();
      } catch (statsError) {
        console.error('Failed to increment lead count:', statsError);
      }

      const settings = await readSettings();
      const recipientEmail = settings.enquiryEmail || settings.applicationEmail || DEFAULT_SETTINGS.enquiryEmail;
      const fromName = settings.emailFromName || DEFAULT_SETTINGS.emailFromName;
      const smtpUser = settings.smtpUser || process.env.SMTP_USER;
      const smtpPass = settings.smtpPass || process.env.SMTP_PASS;

      if (!smtpUser || !smtpPass || !recipientEmail) {
        console.error('SMTP credentials or recipient email not configured. Go to Dashboard -> Settings.');
        return res.status(200).json({
          success: true,
          message: 'Enquiry received and logged, but email notifications are not configured.',
          id: lead.id,
        });
      }

      const smtpHost = settings.smtpHost || DEFAULT_SETTINGS.smtpHost;
      const smtpPort = settings.smtpPort || DEFAULT_SETTINGS.smtpPort;
      const isGmail = smtpHost.includes('gmail');
      const isOffice365 = smtpHost.includes('office365') || smtpHost.includes('outlook');

      const smtpConfig = {
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
        ...(isOffice365 && { requireTLS: true, tls: { ciphers: 'SSLv3' } }),
        ...(isGmail && { service: 'gmail' }),
      };

      try {
        const transporter = nodemailer.createTransport(smtpConfig);
        await transporter.sendMail({
          from: `"${fromName}" <${smtpUser}>`,
          to: recipientEmail,
          replyTo: lead.email || smtpUser,
          subject: `[New Lead] ${lead.interest} — ${lead.name}`,
          html: buildLeadEmail(lead),
        });
        return res.status(200).json({ success: true, message: 'Enquiry sent successfully', id: lead.id });
      } catch (emailError: any) {
        console.error('Email send error:', emailError.message);
        return res.status(200).json({
          success: true,
          message: 'Enquiry logged, but email failed. Check SMTP settings.',
          id: lead.id,
        });
      }
    } catch (error) {
      console.error('Error processing lead:', error);
      return res.status(500).json({ error: 'Failed to process lead' });
    }
  }

  // GET /api/leads - admin only
  if (req.method === 'GET') {
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }
    try {
      const leads = await getLeads();
      return res.json(leads);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  }

  // DELETE /api/leads?id=... - admin only
  if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'Missing lead id' });
    }
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }
    try {
      await deleteLead(id);
      return res.status(204).send('');
    } catch (error) {
      return res.status(500).json({ error: 'Failed to delete lead' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
