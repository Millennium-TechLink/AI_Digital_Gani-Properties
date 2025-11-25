import axios from 'axios';

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
  page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  timestamp: number;
  hp?: string;
}

export interface SubmitResponse {
  ok: boolean;
  error?: string;
}

/**
 * Collect UTM parameters from URL
 */
export function collectUTM(): Partial<LeadPayload> {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utm: Partial<LeadPayload> = {};
  
  if (params.get('utm_source')) utm.utm_source = params.get('utm_source')!;
  if (params.get('utm_medium')) utm.utm_medium = params.get('utm_medium')!;
  if (params.get('utm_campaign')) utm.utm_campaign = params.get('utm_campaign')!;
  
  return utm;
}

/**
 * Submit lead form to Google Sheets via Apps Script Web App
 * Stores data in Google Sheets and sends email notification via Apps Script
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResponse> {
  try {
    // Get Google Sheets Web App URL from environment variable
    const googleSheetsWebAppUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;
    
    if (!googleSheetsWebAppUrl) {
      // In development, show a helpful message instead of error
      if (import.meta.env.DEV) {
        console.warn('VITE_GOOGLE_SHEETS_WEB_APP_URL not configured. Form will not submit in development.');
        return { 
          ok: false, 
          error: 'Form service not configured. Please add VITE_GOOGLE_SHEETS_WEB_APP_URL to your .env file.' 
        };
      }
      console.error('VITE_GOOGLE_SHEETS_WEB_APP_URL not configured');
      return { ok: false, error: 'Form service not configured. Please contact support.' };
    }

    // Prepare payload for Google Apps Script
    const finalPayload = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email || '',
      interest: payload.interest || '',
      message: payload.message || '',
      page: payload.page || '',
      utm_source: payload.utm_source || '',
      utm_medium: payload.utm_medium || '',
      utm_campaign: payload.utm_campaign || '',
      hp: payload.hp || '', // Honeypot field for spam protection
    };

    // Set headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const response = await axios({
      method: 'POST',
      url: googleSheetsWebAppUrl,
      data: finalPayload,
      headers,
      timeout: 15000, // Increased timeout for Google Apps Script
    });

    if (response.status >= 200 && response.status < 300) {
      const responseData = response.data;
      if (responseData && responseData.ok) {
        return { ok: true };
      } else {
        return { 
          ok: false, 
          error: responseData?.error || 'Failed to submit form' 
        };
      }
    } else {
      return { ok: false, error: 'Failed to submit form' };
    }
  } catch (error) {
    console.error('Form submission error:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || error.message || 'Network error';
      return { 
        ok: false, 
        error: errorMessage
      };
    }
    return { 
      ok: false, 
      error: error instanceof Error ? error.message : 'Network error' 
    };
  }
}
