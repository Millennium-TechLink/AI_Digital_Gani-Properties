# Standalone Google Sheets Form Implementation

## Overview

The contact form has been completely restructured to be **100% independent** from any backend or API dependencies. It now submits directly to Google Sheets via Google Apps Script Web App, with the URL hardcoded for maximum reliability.

## What Changed

### ✅ New Standalone Module: `src/lib/googleSheetsForm.ts`

A completely self-contained module that:
- **Hardcodes the Google Apps Script URL** for reliability
- Uses native `fetch` API (no axios dependency)
- Handles CORS with fallback to no-cors mode
- Includes built-in validation
- Collects UTM parameters automatically
- Handles honeypot spam protection

### ✅ Updated Components

1. **`src/components/LeadForm.tsx`**
   - Now uses `submitToGoogleSheets()` from the standalone module
   - No longer depends on `@/lib/forms`
   - Completely independent form submission

2. **`src/components/Footer.tsx`**
   - Newsletter subscription now uses the standalone module
   - Updated to use new function names

### ✅ Removed Dependencies

- ❌ No longer requires `axios` for form submission (uses native `fetch`)
- ❌ No backend API needed
- ❌ No environment variable required (URL is hardcoded)
- ❌ No external form services needed

## Google Apps Script URL

**Hardcoded URL:**
```
https://script.google.com/macros/s/AKfycbwqbD70-b7Pcy-CruhGsWDsNNOmdI6aAgWV2KXEDvQYD70YDg9P2srkO5ghdFxjX6J83w/exec
```

This URL is embedded directly in `src/lib/googleSheetsForm.ts` for maximum reliability. It can still fall back to the environment variable if needed, but the hardcoded URL takes priority.

## How It Works

1. **Form Submission Flow:**
   ```
   User fills form → Validation → Submit to Google Apps Script → Google Sheets
   ```

2. **Data Collection:**
   - Automatically collects UTM parameters from URL
   - Captures current page path
   - Includes honeypot field for spam protection

3. **Submission Method:**
   - First tries CORS mode (can read response)
   - Falls back to no-cors mode if CORS fails
   - Google Apps Script processes and saves to Sheets

## Features

### ✅ Built-in Validation
- Name: minimum 2 characters
- Phone: minimum 10 digits
- Email: format validation (if provided)

### ✅ Spam Protection
- Honeypot field (hidden from users)
- Silently rejects bot submissions

### ✅ Error Handling
- User-friendly error messages
- Network error handling
- Graceful fallbacks

### ✅ UTM Tracking
- Automatically captures `utm_source`, `utm_medium`, `utm_campaign`
- Tracks which page the form was submitted from

## File Structure

```
src/
├── lib/
│   ├── googleSheetsForm.ts    ← NEW: Standalone form module
│   └── forms.ts               ← OLD: Can be removed (kept for reference)
├── components/
│   ├── LeadForm.tsx           ← UPDATED: Uses new module
│   └── Footer.tsx             ← UPDATED: Uses new module
```

## Usage Example

```typescript
import { 
  submitToGoogleSheets, 
  collectUTMParameters,
  getCurrentPagePath,
  validateFormData,
  type FormSubmissionData 
} from '@/lib/googleSheetsForm';

// Prepare form data
const formData: FormSubmissionData = {
  name: 'John Doe',
  phone: '9876543210',
  email: 'john@example.com',
  interest: 'Residential Plots',
  message: 'I am interested in your properties',
  page: getCurrentPagePath(),
  hp: '', // Honeypot (should be empty)
  ...collectUTMParameters(), // Auto-collect UTM params
};

// Validate
const validation = validateFormData(formData);
if (!validation.valid) {
  console.error(validation.error);
  return;
}

// Submit
const result = await submitToGoogleSheets(formData);
if (result.success) {
  console.log('Success!', result.message);
} else {
  console.error('Error:', result.error);
}
```

## Benefits

1. **✅ Zero Backend Dependencies**
   - Works without any backend server
   - No API endpoints needed
   - No database required

2. **✅ Maximum Reliability**
   - Hardcoded URL ensures it always works
   - No environment variable configuration needed
   - Works in development and production

3. **✅ Simple & Fast**
   - Direct submission to Google Sheets
   - No intermediate services
   - Minimal code complexity

4. **✅ Cost-Effective**
   - Google Sheets: Free
   - Google Apps Script: Free
   - No third-party form services needed

## Testing

To test the form:

1. Fill out the contact form on any page
2. Submit the form
3. Check Google Sheets for the new entry
4. Verify email notification was sent (if configured in Apps Script)

## Maintenance

### Updating the Google Apps Script URL

If you need to update the URL, edit `src/lib/googleSheetsForm.ts`:

```typescript
const GOOGLE_SHEETS_WEB_APP_URL = 
  'https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec';
```

### Environment Variable Fallback

The module still supports environment variables as a fallback:

```env
VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

But the hardcoded URL takes priority, so this is optional.

## Migration Notes

- ✅ All form submissions now go directly to Google Sheets
- ✅ No changes needed to Google Apps Script
- ✅ No changes needed to Google Sheets structure
- ✅ Old `forms.ts` file can be kept for reference or removed
- ✅ No breaking changes to form components

## Next Steps

1. ✅ Form is now standalone and independent
2. ✅ Test form submission in development
3. ✅ Verify submissions appear in Google Sheets
4. ✅ Deploy to production (no additional setup needed)

---

**Status:** ✅ Complete - Form is now 100% independent and ready for production use.

