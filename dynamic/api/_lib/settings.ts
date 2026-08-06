import { supabase } from './supabase.js';

export interface SiteSettings {
  applicationEmail: string;
  enquiryEmail: string;
  careersEmail: string;
  emailFromName: string;
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  smtpPass: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  applicationEmail: '',
  enquiryEmail: '',
  careersEmail: '',
  emailFromName: 'Gani Properties',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPass: '',
};

// Single-row table, keyed by a fixed id - there is only ever one settings
// record. Mirrors server.js's readSettings()/writeSettings() (previously
// file-based, now Supabase-backed since Vercel functions have no
// persistent filesystem between invocations).
const SETTINGS_ROW_ID = 'default';

export async function readSettings(): Promise<SiteSettings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', SETTINGS_ROW_ID)
    .maybeSingle();

  if (error) {
    console.error('Error reading settings:', error);
    return DEFAULT_SETTINGS;
  }
  if (!data) {
    return DEFAULT_SETTINGS;
  }

  return {
    applicationEmail: data.application_email || DEFAULT_SETTINGS.applicationEmail,
    enquiryEmail: data.enquiry_email || data.application_email || DEFAULT_SETTINGS.enquiryEmail,
    careersEmail: data.careers_email || data.application_email || DEFAULT_SETTINGS.careersEmail,
    emailFromName: data.email_from_name || DEFAULT_SETTINGS.emailFromName,
    smtpHost: data.smtp_host || DEFAULT_SETTINGS.smtpHost,
    smtpPort: data.smtp_port || DEFAULT_SETTINGS.smtpPort,
    smtpUser: data.smtp_user || DEFAULT_SETTINGS.smtpUser,
    smtpPass: data.smtp_pass || DEFAULT_SETTINGS.smtpPass,
  };
}

export async function writeSettings(updates: Partial<SiteSettings>): Promise<SiteSettings> {
  const current = await readSettings();
  const merged = { ...current, ...updates };

  // Keep legacy applicationEmail in sync with enquiryEmail, same as server.js.
  if (updates.enquiryEmail) {
    merged.applicationEmail = updates.enquiryEmail;
  }

  const row = {
    id: SETTINGS_ROW_ID,
    application_email: merged.applicationEmail,
    enquiry_email: merged.enquiryEmail,
    careers_email: merged.careersEmail,
    email_from_name: merged.emailFromName,
    smtp_host: merged.smtpHost,
    smtp_port: merged.smtpPort,
    smtp_user: merged.smtpUser,
    smtp_pass: merged.smtpPass,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from('settings').upsert(row);
  if (error) {
    console.error('Error writing settings:', error);
    throw error;
  }

  return merged;
}
