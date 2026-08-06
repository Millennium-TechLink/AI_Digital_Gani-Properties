import multer from 'multer';
import nodemailer from 'nodemailer';
import { supabase } from '../_lib/supabase.js';
import { readSettings, DEFAULT_SETTINGS } from '../_lib/settings.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Not api/careers/[id]/apply.ts on purpose: Vercel wasn't resolving bracket-
// dynamic function files in this project (every request to a [id].ts path
// fell through to the SPA rewrite instead of reaching the function - GET got
// index.html back with a 200, everything else got a 405 from static-asset
// serving refusing non-GET methods). The job id is passed as ?id= instead,
// which sidesteps that entirely.
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Same multer config as server.js: memory storage (no persistent filesystem
// on Vercel to write to anyway), 5MB cap, PDF/DOC/DOCX only.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
});

// Vercel's Node runtime only auto-parses JSON/urlencoded/text bodies - a
// multipart/form-data body is left as a raw stream specifically so libraries
// like multer can consume it directly, same as they would against a plain
// Node http.IncomingMessage. multer's own API is middleware-style
// (req, res, next), so it's promisified here to await inline.
function runMulter(req: VercelRequest, res: VercelResponse): Promise<void> {
  return new Promise((resolve, reject) => {
    upload.single('resumeFile')(req as any, res as any, (err: unknown) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const jobId = typeof req.query.id === 'string' ? req.query.id : undefined;
  if (!jobId) {
    return res.status(400).json({ error: 'Missing job id' });
  }

  try {
    await runMulter(req, res);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || 'Failed to process upload' });
  }

  try {
    const { data: job, error: jobError } = await supabase
      .from('careers')
      .select('*')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const { name, email, phone, coverLetter, resumeLink, jobTitle, jobCategory } = req.body as Record<string, string>;
    if (!name || !email || !phone || !coverLetter) {
      return res.status(400).json({ error: 'Name, email, phone, and cover letter are required' });
    }

    const settings = await readSettings();
    const recipientEmail = settings.careersEmail || settings.applicationEmail || DEFAULT_SETTINGS.careersEmail;
    const fromName = settings.emailFromName || DEFAULT_SETTINGS.emailFromName;

    const smtpUser = settings.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings.smtpPass || process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass || !recipientEmail) {
      console.error('SMTP credentials or recipient email not configured. Go to Dashboard -> Settings.');
      return res.status(500).json({
        error: 'Email not configured. Please go to Dashboard → Settings → Email Settings and enter your SMTP credentials.',
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

    const location = [job.city, job.state].filter(Boolean).join(', ');
    // multer attaches `file` to the request object itself, but VercelRequest's
    // type doesn't know about that augmentation - cast at the boundary.
    const uploadedFile = (req as unknown as { file?: Express.Multer.File }).file;
    const fileName = uploadedFile ? uploadedFile.originalname : null;

    const htmlBody = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08)">
        <div style="background:linear-gradient(135deg,#0F3A3D,#1a5a5e);padding:32px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700">New Job Application</h1>
          <p style="color:rgba(255,255,255,0.8);margin:8px 0 0">Gani Properties Careers</p>
        </div>
        <div style="padding:32px">
          <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin-bottom:24px">
            <h2 style="margin:0 0 4px;color:#0F3A3D;font-size:18px">${jobTitle || job.title}</h2>
            <p style="margin:0;color:#666;font-size:14px">${jobCategory || job.category}${location ? ' &bull; ' + location : ''}</p>
          </div>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px;width:120px">Applicant</td><td style="padding:10px 0;border-bottom:1px solid #eee;font-weight:600;color:#1a1a1a">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Email</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="mailto:${email}" style="color:#0F3A3D">${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Phone</td><td style="padding:10px 0;border-bottom:1px solid #eee">${phone}</td></tr>
            ${resumeLink ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Resume Link</td><td style="padding:10px 0;border-bottom:1px solid #eee"><a href="${resumeLink}" style="color:#0F3A3D" target="_blank">View Resume</a></td></tr>` : ''}
            ${uploadedFile ? `<tr><td style="padding:10px 0;border-bottom:1px solid #eee;color:#888;font-size:13px">Resume File</td><td style="padding:10px 0;border-bottom:1px solid #eee">📎 ${fileName} (attached)</td></tr>` : ''}
          </table>
          <div style="margin-top:24px">
            <h3 style="font-size:14px;color:#888;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.05em">Cover Letter</h3>
            <div style="background:#f8f9fa;border-left:3px solid #C9B589;border-radius:4px;padding:16px;color:#333;line-height:1.7;white-space:pre-wrap">${coverLetter}</div>
          </div>
        </div>
        <div style="background:#f8f9fa;padding:16px 32px;text-align:center;color:#aaa;font-size:12px">This email was sent automatically from the Gani Properties careers portal.</div>
      </div>
    `;

    const attachments = [];
    if (uploadedFile) {
      attachments.push({
        filename: uploadedFile.originalname,
        content: uploadedFile.buffer,
        contentType: uploadedFile.mimetype,
      });
    }

    try {
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email,
        subject: `[Job Application] ${jobTitle || job.title} — ${name}`,
        html: htmlBody,
        attachments,
      });
      return res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (emailError: any) {
      console.error('Email send error:', emailError.message);
      return res.status(500).json({ error: 'Failed to send email. Please double-check the SMTP credentials in Dashboard → Settings.' });
    }
  } catch (error: any) {
    console.error('Error processing application:', error);
    return res.status(500).json({ error: 'Failed to process application' });
  }
}
