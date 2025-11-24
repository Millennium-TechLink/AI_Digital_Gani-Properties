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
 * Submit lead form to serverless API
 * Stores in Supabase database and sends email via Resend
 */
export async function submitLead(payload: LeadPayload): Promise<SubmitResponse> {
  try {
    // Use serverless function endpoint
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = `${apiUrl}/contact`;
    
    // Fallback to old endpoint if API_URL not set (backward compatibility)
    const fallbackEndpoint = import.meta.env.VITE_FORM_ENDPOINT;
    const finalEndpoint = endpoint.includes('/contact') && apiUrl ? endpoint : (fallbackEndpoint || endpoint);
    
    if (!finalEndpoint || finalEndpoint === '/contact') {
      console.error('VITE_API_URL or VITE_FORM_ENDPOINT not configured');
      return { ok: false, error: 'Form service not configured' };
    }

    // Prepare payload for serverless function
    const finalPayload = {
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      interest: payload.interest,
      message: payload.message,
      page: payload.page,
      utm_source: payload.utm_source,
      utm_medium: payload.utm_medium,
      utm_campaign: payload.utm_campaign,
      hp: payload.hp || '', // Honeypot field
    };

    // Set headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const response = await axios({
      method: 'POST',
      url: finalEndpoint,
      data: finalPayload,
      headers,
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
