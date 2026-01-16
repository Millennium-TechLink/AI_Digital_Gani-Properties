/**
 * Google Apps Script for Gani Properties Contact Form
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet named "Gani Properties Inquiries"
 * 2. In the first row, add these headers (Column A to J):
 *    - Timestamp
 *    - Name
 *    - Phone
 *    - Email
 *    - Interest
 *    - Message
 *    - Page
 *    - UTM Source
 *    - UTM Medium
 *    - UTM Campaign
 * 3. Go to Extensions → Apps Script
 * 4. Delete the default code and paste this entire file
 * 5. Save the script (File → Save, name it "Contact Form Handler")
 * 6. Deploy as Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Click the gear icon ⚙️ → "Web app"
 *    - Description: "Contact Form Handler"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 7. Copy the Web App URL (you'll need this for the frontend)
 * 8. Update the SPREADSHEET_ID and ADMIN_EMAIL below
 */

// ============================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================

// Get your Spreadsheet ID from the URL:
// https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

// Admin email to receive notifications
const ADMIN_EMAIL = 'info@ganiproperties.com';

// Sheet name (tab name in your spreadsheet)
const SHEET_NAME = 'Inquiries';

// ============================================
// MAIN FUNCTION - DO NOT EDIT BELOW
// ============================================

/**
 * Main function to handle POST requests from the contact form
 */
function doPost(e) {
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.name || !data.phone) {
      return ContentService
        .createTextOutput(JSON.stringify({
          ok: false,
          error: 'Name and phone are required'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Honeypot spam check
    if (data.hp && data.hp !== '') {
      // Silent fail for bots
      return ContentService
        .createTextOutput(JSON.stringify({ ok: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Get the spreadsheet
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    // If sheet doesn't exist, create it
    if (!sheet) {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const newSheet = ss.insertSheet(SHEET_NAME);
      // Add headers
      newSheet.getRange(1, 1, 1, 10).setValues([[
        'Timestamp',
        'Name',
        'Phone',
        'Email',
        'Interest',
        'Message',
        'Page',
        'UTM Source',
        'UTM Medium',
        'UTM Campaign'
      ]]);
      // Format header row
      const headerRange = newSheet.getRange(1, 1, 1, 10);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0F3A3D');
      headerRange.setFontColor('#FFFFFF');
      return doPost(e); // Retry with new sheet
    }
    
    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.name.trim(),
      data.phone.replace(/\D/g, ''), // Clean phone number
      data.email ? data.email.trim() : '',
      data.interest || '',
      data.message ? data.message.trim() : '',
      data.page || '',
      data.utm_source || '',
      data.utm_medium || '',
      data.utm_campaign || ''
    ];
    
    // Append data to sheet
    sheet.appendRow(rowData);
    
    // Format the new row (optional styling)
    const lastRow = sheet.getLastRow();
    const newRowRange = sheet.getRange(lastRow, 1, 1, 10);
    newRowRange.setVerticalAlignment('top');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, 10);
    
    // Send email notification
    sendEmailNotification(data, timestamp);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: true,
        message: 'Thank you! We will contact you soon.'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error
    console.error('Error processing form submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        ok: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      ok: true,
      message: 'Gani Properties Contact Form API is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Send email notification to admin
 */
function sendEmailNotification(data, timestamp) {
  try {
    const subject = data.interest 
      ? `New ${data.interest} Inquiry from ${data.name}`
      : `New Contact Form Submission from ${data.name}`;
    
    // Format timestamp
    const formattedDate = Utilities.formatDate(
      timestamp,
      Session.getScriptTimeZone(),
      'dd MMM yyyy, hh:mm a'
    );
    
    // Build email body
    let emailBody = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: #0F3A3D;
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            margin-bottom: 0;
          }
          .header h2 {
            margin: 0;
            font-size: 20px;
          }
          .content {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 0 0 8px 8px;
            border: 1px solid #ddd;
            border-top: none;
          }
          .field {
            margin: 15px 0;
            padding-bottom: 15px;
            border-bottom: 1px solid #eee;
          }
          .field:last-child {
            border-bottom: none;
          }
          .label {
            font-weight: bold;
            color: #0F3A3D;
            display: block;
            margin-bottom: 5px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .value {
            margin-top: 5px;
            font-size: 14px;
            color: #555;
          }
          .value a {
            color: #0F3A3D;
            text-decoration: none;
          }
          .value a:hover {
            text-decoration: underline;
          }
          .footer {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #0F3A3D;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .cta-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #0F3A3D;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>📧 New Contact Form Submission</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">👤 Name:</span>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>
          
          <div class="field">
            <span class="label">📱 Phone:</span>
            <div class="value">
              <a href="tel:${data.phone.replace(/\D/g, '')}">${escapeHtml(data.phone)}</a>
            </div>
          </div>
    `;
    
    if (data.email) {
      emailBody += `
          <div class="field">
            <span class="label">✉️ Email:</span>
            <div class="value">
              <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a>
            </div>
          </div>
      `;
    }
    
    if (data.interest) {
      emailBody += `
          <div class="field">
            <span class="label">🏠 Interest:</span>
            <div class="value">${escapeHtml(data.interest)}</div>
          </div>
      `;
    }
    
    if (data.message) {
      emailBody += `
          <div class="field">
            <span class="label">💬 Message:</span>
            <div class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
          </div>
      `;
    }
    
    emailBody += `
          <div class="field">
            <span class="label">🌐 Page:</span>
            <div class="value">${escapeHtml(data.page || 'Unknown')}</div>
          </div>
    `;
    
    if (data.utm_source || data.utm_medium || data.utm_campaign) {
      emailBody += `
          <div class="field">
            <span class="label">📊 UTM Parameters:</span>
            <div class="value">
              ${data.utm_source ? `Source: ${escapeHtml(data.utm_source)}<br>` : ''}
              ${data.utm_medium ? `Medium: ${escapeHtml(data.utm_medium)}<br>` : ''}
              ${data.utm_campaign ? `Campaign: ${escapeHtml(data.utm_campaign)}` : ''}
            </div>
          </div>
      `;
    }
    
    emailBody += `
          <div class="footer">
            <p><strong>Submitted:</strong> ${formattedDate}</p>
            <p style="margin-top: 10px;">
              <a href="https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/edit" 
                 class="cta-button" 
                 style="color: white; text-decoration: none;">
                View in Google Sheets
              </a>
            </p>
            <p style="margin-top: 15px; font-size: 11px; color: #999;">
              This is an automated email from Gani Properties contact form.
            </p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Send email
    MailApp.sendEmail({
      to: ADMIN_EMAIL,
      subject: subject,
      htmlBody: emailBody,
      replyTo: data.email || ADMIN_EMAIL,
      name: 'Gani Properties Contact Form'
    });
    
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't fail the request if email fails - data is already saved
  }
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return String(text).replace(/[&<>"']/g, function(m) { return map[m]; });
}














