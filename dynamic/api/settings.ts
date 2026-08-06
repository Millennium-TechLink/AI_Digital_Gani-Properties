import { authenticateToken } from './lib/auth.js';
import { readSettings, writeSettings } from './lib/settings.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/settings - public, only non-sensitive fields (never smtpPass)
  if (req.method === 'GET') {
    try {
      const settings = await readSettings();
      return res.json({
        applicationEmail: settings.applicationEmail,
        enquiryEmail: settings.enquiryEmail,
        careersEmail: settings.careersEmail,
        emailFromName: settings.emailFromName,
        smtpHost: settings.smtpHost,
        smtpPort: settings.smtpPort,
        smtpUser: settings.smtpUser,
        // smtpPass is intentionally never returned
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      return res.status(500).json({ error: 'Failed to fetch settings' });
    }
  }

  // PUT /api/settings - admin only
  if (req.method === 'PUT') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const body = req.body || {};
      const updates: Record<string, any> = {};
      if (body.applicationEmail) updates.applicationEmail = body.applicationEmail;
      if (body.enquiryEmail) updates.enquiryEmail = body.enquiryEmail;
      if (body.careersEmail) updates.careersEmail = body.careersEmail;
      if (body.emailFromName) updates.emailFromName = body.emailFromName;
      if (body.smtpHost !== undefined) updates.smtpHost = body.smtpHost;
      if (body.smtpPort !== undefined) updates.smtpPort = body.smtpPort;
      if (body.smtpUser !== undefined) updates.smtpUser = body.smtpUser;
      if (body.smtpPass !== undefined) updates.smtpPass = body.smtpPass;

      const updated = await writeSettings(updates);
      return res.json({ ...updated, success: true });
    } catch (error: any) {
      console.error('Error updating settings:', error);
      return res.status(500).json({ error: 'Failed to update settings', details: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
