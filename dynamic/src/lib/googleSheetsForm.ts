/**
 * Standalone Google Sheets Form Submission Module
 * 
 * This module is completely independent and submits form data directly to Google Sheets
 * via Google Apps Script Web App. No backend or API dependencies required.
 */

// Google Apps Script Web App URL - Hardcoded for standalone operation
const GOOGLE_SHEETS_WEB_APP_URL = 
  'https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec';

// Fallback to environment variable if needed (for flexibility)
const getWebAppUrl = (): string => {
  // Use hardcoded URL first (most reliable)
  if (GOOGLE_SHEETS_WEB_APP_URL && !GOOGLE_SHEETS_WEB_APP_URL.includes('YOUR_SCRIPT_ID')) {
    return GOOGLE_SHEETS_WEB_APP_URL;
  }
  
  // Fallback to environment variable
  const envUrl = import.meta.env.VITE_GOOGLE_SHEETS_WEB_APP_URL;
  if (envUrl && !envUrl.includes('YOUR_SCRIPT_ID')) {
    return envUrl;
  }
  
  // Return hardcoded URL even if it has placeholder (will show error)
  return GOOGLE_SHEETS_WEB_APP_URL;
};

export interface FormSubmissionData {
  name: string;
  phone: string;
  email?: string;
  interest?: string;
  message?: string;
  page?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  hp?: string; // Honeypot field for spam protection
}

export interface FormSubmissionResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Collect UTM parameters from the current URL
 */
export function collectUTMParameters(): {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
} {
  if (typeof window === 'undefined') {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const utm: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  } = {};

  if (params.get('utm_source')) {
    utm.utm_source = params.get('utm_source')!;
  }
  if (params.get('utm_medium')) {
    utm.utm_medium = params.get('utm_medium')!;
  }
  if (params.get('utm_campaign')) {
    utm.utm_campaign = params.get('utm_campaign')!;
  }

  return utm;
}

/**
 * Get the current page path
 */
export function getCurrentPagePath(): string {
  if (typeof window === 'undefined') {
    return 'unknown';
  }
  return window.location.pathname;
}

/**
 * Submit form data to Google Sheets via Google Apps Script
 */
export async function submitToGoogleSheets(
  data: FormSubmissionData
): Promise<FormSubmissionResponse> {
  try {
    // Validate required fields
    if (!data.name || !data.phone) {
      return {
        success: false,
        error: 'Name and phone are required fields.',
      };
    }

    // Honeypot spam check
    if (data.hp && data.hp.trim() !== '') {
      return {
        success: true,
        message: 'Thank you! We will contact you soon.',
      };
    }

    // Get the Web App URL
    const webAppUrl = getWebAppUrl();

    // Check if URL is valid
    if (!webAppUrl || webAppUrl.includes('YOUR_SCRIPT_ID')) {
      console.error('Google Sheets Web App URL is not configured properly.');
      return {
        success: false,
        error: 'Form service is not configured. Please contact support.',
      };
    }

    // Prepare payload for Google Apps Script
    const payload = {
      name: data.name.trim(),
      phone: data.phone.replace(/\D/g, ''),
      email: data.email ? data.email.trim() : '',
      interest: data.interest || '',
      message: data.message ? data.message.trim() : '',
      page: data.page || getCurrentPagePath(),
      utm_source: data.utm_source || '',
      utm_medium: data.utm_medium || '',
      utm_campaign: data.utm_campaign || '',
      hp: data.hp || '',
    };

    // Submit to Google Apps Script
    await fetch(webAppUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Try with cors mode first
    try {
      const corsResponse = await fetch(webAppUrl, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (corsResponse.ok) {
        const responseData = await corsResponse.json();
        if (responseData && responseData.ok) {
          return {
            success: true,
            message: responseData.message || 'Thank you! We will contact you soon.',
          };
        } else {
          return {
            success: false,
            error: responseData?.error || 'Failed to submit form. Please try again.',
          };
        }
      }
    } catch (corsError) {
      console.log('CORS mode not available, using no-cors mode');
    }

    return {
      success: true,
      message: 'Thank you! We will contact you soon.',
    };

  } catch (error) {
    console.error('Form submission error:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Network error. Please check your connection and try again.';
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Validate form data before submission
 */
export function validateFormData(data: FormSubmissionData): {
  valid: boolean;
  error?: string;
} {
  if (!data.name || data.name.trim().length < 2) {
    return {
      valid: false,
      error: 'Name must be at least 2 characters long.',
    };
  }

  if (!data.phone || data.phone.replace(/\D/g, '').length < 10) {
    return {
      valid: false,
      error: 'Please enter a valid phone number with at least 10 digits.',
    };
  }

  if (data.email && data.email.trim() !== '') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return {
        valid: false,
        error: 'Please enter a valid email address.',
      };
    }
  }

  return { valid: true };
}
