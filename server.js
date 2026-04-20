import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Data file paths
const DATA_FILE = path.join(__dirname, 'data', 'properties.json');
const CAREERS_FILE = path.join(__dirname, 'data', 'careers.json');
const SETTINGS_FILE = path.join(__dirname, 'data', 'settings.json');
const LEADS_FILE = path.join(__dirname, 'data', 'leads.json');
const STATS_FILE = path.join(__dirname, 'data', 'stats.json');

const DEFAULT_SETTINGS = {
  applicationEmail: 'Vaishnavi.gore@millenniumtechlink.com', // Legacy field
  enquiryEmail: 'Vaishnavi.gore@millenniumtechlink.com',
  careersEmail: 'Vaishnavi.gore@millenniumtechlink.com',
  emailFromName: 'Gani Properties Portfolio',
};

const DEFAULT_STATS = {
  totalVisits: 0,
  dailyHits: {}, // { 'YYYY-MM-DD': count }
  totalLeads: 0,
};

// Middleware
app.use(cors());
app.use(express.json());

// Multer setup: memory storage, max 5MB, PDF/DOC/DOCX only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
  },
});

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Helper to read JSON files safely
async function readJsonFile(filePath, defaultValue = []) {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return defaultValue;
  }
}

// Helper to write JSON files
async function writeJsonFile(filePath, data) {
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// Read properties from file
async function readProperties() {
  return readJsonFile(DATA_FILE, []);
}

// Write properties to file
async function writeProperties(properties) {
  await writeJsonFile(DATA_FILE, properties);
}

// Read careers from file
async function readCareers() {
  return readJsonFile(CAREERS_FILE, []);
}

// Write careers to file
async function writeCareers(careers) {
  await writeJsonFile(CAREERS_FILE, careers);
}

// Read settings from file
async function readSettings() {
  const settings = await readJsonFile(SETTINGS_FILE, DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...settings };
}

// Write settings to file
async function writeSettings(settings) {
  await writeJsonFile(SETTINGS_FILE, settings);
}

// Read leads from file
async function readLeads() {
  return readJsonFile(LEADS_FILE, []);
}

// Write leads to file
async function writeLeads(leads) {
  await writeJsonFile(LEADS_FILE, leads);
}

// Read stats from file
async function readStats() {
  const stats = await readJsonFile(STATS_FILE, DEFAULT_STATS);
  return { ...DEFAULT_STATS, ...stats };
}

// Write stats to file
async function writeStats(stats) {
  await writeJsonFile(STATS_FILE, stats);
}

// Auth middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Extract coordinates from Google Maps URL
function extractCoordinatesFromGoogleMaps(url) {
  try {
    // Try to extract from URL patterns
    const match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (match) {
      return { lat: parseFloat(match[1]), lng: parseFloat(match[2]) };
    }
    
    // Try query parameter
    const urlObj = new URL(url);
    const ll = urlObj.searchParams.get('ll');
    if (ll) {
      const [lat, lng] = ll.split(',');
      return { lat: parseFloat(lat), lng: parseFloat(lng) };
    }
    
    return null;
  } catch {
    return null;
  }
}

// Routes

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { username, type: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      return res.json({
        success: true,
        token,
        message: 'Login successful',
      });
    } else {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
});

// --- Property Routes ---

// Get all properties
app.get('/api/properties', async (req, res) => {
  try {
    const properties = await readProperties();
    
    // Transform to match frontend format
    const transformed = properties.map(p => ({
      ...p,
      postedAt: p.postedAt || p.posted_at,
      priceLabel: p.priceLabel || p.price_label,
      highlights: Array.isArray(p.highlights) ? p.highlights : (typeof p.highlights === 'string' ? JSON.parse(p.highlights || '[]') : []),
    }));

    return res.json(transformed);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// Get single property
app.get('/api/properties/:id', async (req, res) => {
  try {
    const properties = await readProperties();
    const property = properties.find(p => p.id === req.params.id);
    
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const transformed = {
      ...property,
      postedAt: property.postedAt || property.posted_at,
      priceLabel: property.priceLabel || property.price_label,
      highlights: Array.isArray(property.highlights) ? property.highlights : (typeof property.highlights === 'string' ? JSON.parse(property.highlights || '[]') : []),
    };

    return res.json(transformed);
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Create property
app.post('/api/properties', authenticateToken, async (req, res) => {
  try {
    const propertyData = { ...req.body };
    const properties = await readProperties();

    // Extract coordinates from Google Maps URL if provided
    if (propertyData.googleMapsUrl && (!propertyData.lat || !propertyData.lon)) {
      const coords = extractCoordinatesFromGoogleMaps(propertyData.googleMapsUrl);
      if (coords) {
        propertyData.lat = coords.lat;
        propertyData.lon = coords.lng;
      }
    }

    // Generate slug from title
    const slug = propertyData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Create new property
    const newProperty = {
      id: `prop-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      slug,
      title: propertyData.title,
      type: propertyData.type,
      city: propertyData.city,
      area: propertyData.area,
      priceLabel: propertyData.priceLabel || null,
      size: propertyData.size || null,
      status: propertyData.status,
      highlights: propertyData.highlights || [],
      lat: propertyData.lat || null,
      lon: propertyData.lon || null,
      images: propertyData.images || [],
      description: propertyData.description,
      postedAt: new Date().toISOString(),
    };

    properties.push(newProperty);
    await writeProperties(properties);

    return res.status(201).json(newProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(500).json({ error: 'Failed to create property' });
  }
});

// Update property
app.put('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const properties = await readProperties();
    const index = properties.findIndex(p => p.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Property not found' });
    }

    const updates = { ...req.body };
    delete updates.id;

    // Extract coordinates from Google Maps URL if provided
    if (updates.googleMapsUrl && (!updates.lat || !updates.lon)) {
      const coords = extractCoordinatesFromGoogleMaps(updates.googleMapsUrl);
      if (coords) {
        updates.lat = coords.lat;
        updates.lon = coords.lng;
      }
    }

    // Regenerate slug if title changed
    if (updates.title) {
      updates.slug = updates.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Update property
    properties[index] = {
      ...properties[index],
      ...updates,
      id: req.params.id, // Ensure ID doesn't change
    };

    await writeProperties(properties);

    return res.json(properties[index]);
  } catch (error) {
    console.error('Error updating property:', error);
    return res.status(500).json({ error: 'Failed to update property' });
  }
});

// Delete property
app.delete('/api/properties/:id', authenticateToken, async (req, res) => {
  try {
    const properties = await readProperties();
    const filtered = properties.filter(p => p.id !== req.params.id);

    if (filtered.length === properties.length) {
      return res.status(404).json({ error: 'Property not found' });
    }

    await writeProperties(filtered);

    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    return res.status(500).json({ error: 'Failed to delete property' });
  }
});

// --- Career Routes ---

// Get all careers
app.get('/api/careers', async (req, res) => {
  try {
    const careers = await readCareers();
    return res.json(careers);
  } catch (error) {
    console.error('Error fetching careers:', error);
    return res.status(500).json({ error: 'Failed to fetch careers' });
  }
});

// Create career
app.post('/api/careers', authenticateToken, async (req, res) => {
  try {
    const careerData = { ...req.body };
    const careers = await readCareers();

    const newCareer = {
      id: `career-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: careerData.title,
      category: careerData.category,
      description: careerData.description,
      requirements: careerData.requirements || [],
      benefits: careerData.benefits || [],
      state: careerData.state || null,
      city: careerData.city || null,
      postedAt: new Date().toISOString(),
    };

    careers.push(newCareer);
    await writeCareers(careers);

    return res.status(201).json(newCareer);
  } catch (error) {
    console.error('Error creating career:', error);
    return res.status(500).json({ error: 'Failed to create career' });
  }
});

// Update career
app.put('/api/careers/:id', authenticateToken, async (req, res) => {
  try {
    const careers = await readCareers();
    const index = careers.findIndex(c => c.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ error: 'Career not found' });
    }

    const updates = { ...req.body };
    delete updates.id;

    careers[index] = {
      ...careers[index],
      ...updates,
      id: req.params.id,
    };

    await writeCareers(careers);
    return res.json(careers[index]);
  } catch (error) {
    console.error('Error updating career:', error);
    return res.status(500).json({ error: 'Failed to update career' });
  }
});

// Delete career
app.delete('/api/careers/:id', authenticateToken, async (req, res) => {
  try {
    const careers = await readCareers();
    const filtered = careers.filter(c => c.id !== req.params.id);

    if (filtered.length === careers.length) {
      return res.status(404).json({ error: 'Career not found' });
    }

    await writeCareers(filtered);
    return res.status(204).send();
  } catch (error) {
    console.error('Error deleting career:', error);
    return res.status(500).json({ error: 'Failed to delete career' });
  }
});

// Get settings (public - only exposes non-sensitive fields)
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await readSettings();
    return res.json({
      applicationEmail: settings.applicationEmail, // Legacy
      enquiryEmail: settings.enquiryEmail || settings.applicationEmail,
      careersEmail: settings.careersEmail || settings.applicationEmail,
      emailFromName: settings.emailFromName,
      smtpHost: settings.smtpHost || '',
      smtpPort: settings.smtpPort || 587,
      smtpUser: settings.smtpUser || '',
      // smtpPass is intentionally never returned
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings (admin only)
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    console.log('📥 Received settings update request:', req.body);
    const current = await readSettings();
    const updates = {};
    if (req.body.applicationEmail) updates.applicationEmail = req.body.applicationEmail;
    if (req.body.enquiryEmail) updates.enquiryEmail = req.body.enquiryEmail;
    if (req.body.careersEmail) updates.careersEmail = req.body.careersEmail;
    if (req.body.emailFromName) updates.emailFromName = req.body.emailFromName;
    if (req.body.smtpHost !== undefined) updates.smtpHost = req.body.smtpHost;
    if (req.body.smtpPort !== undefined) updates.smtpPort = req.body.smtpPort;
    if (req.body.smtpUser !== undefined) updates.smtpUser = req.body.smtpUser;
    if (req.body.smtpPass !== undefined) updates.smtpPass = req.body.smtpPass;
    
    const updated = { ...current, ...updates };
    
    // Sync legacy applicationEmail with enquiryEmail for maximum compatibility
    if (updates.enquiryEmail) {
      updated.applicationEmail = updates.enquiryEmail;
    }

    console.log('📝 Saving updated settings to disk:', JSON.stringify(updated, null, 2));
    await writeSettings(updated);
    console.log('✅ Settings saved successfully.');
    
    return res.json({ 
      ...updated,
      success: true 
    });
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    return res.status(500).json({ error: 'Failed to update settings', details: error.message });
  }
});

// --- Analytics & Stats ---

// Public endpoint to log a visit (hit counter)
app.post('/api/stats/visit', async (req, res) => {
  try {
    const stats = await readStats();
    const today = new Date().toISOString().split('T')[0];
    
    stats.totalVisits += 1;
    stats.dailyHits[today] = (stats.dailyHits[today] || 0) + 1;
    
    await writeStats(stats);
    return res.json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to log visit' });
  }
});

// Admin endpoint to get stats
app.get('/api/stats', authenticateToken, async (req, res) => {
  try {
    const stats = await readStats();
    return res.json(stats);
  } catch (error) {
    return res.status(500).json({ error: 'Failed' });
  }
});

// --- Property Enquiries ---
app.post('/api/leads', async (req, res) => {
  try {
    const { name, email, phone, interest, message } = req.body;
    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone are required' });
    }

    // --- Persist Lead to Log ---
    const leads = await readLeads();
    const newLead = {
      id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email: email || '',
      phone,
      interest: interest || 'General Property Interest',
      message: message || '',
      submittedAt: new Date().toISOString(),
    };
    leads.unshift(newLead); // Newest first
    await writeLeads(leads);

    // Update stats counter
    const stats = await readStats();
    stats.totalLeads += 1;
    await writeStats(stats);

    // --- Send Email ---
    const settings = await readSettings();
    const recipientEmail = settings.enquiryEmail || settings.applicationEmail || DEFAULT_SETTINGS.enquiryEmail;
    const fromName = settings.emailFromName || DEFAULT_SETTINGS.emailFromName;

    // Build SMTP transporter
    const smtpUser = settings.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings.smtpPass || process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error('❌ SMTP credentials not configured. Go to Dashboard → Settings to set them.');
      return res.status(200).json({ 
        success: true, 
        message: 'Enquiry received and logged, but email notifications are not configured.',
        id: newLead.id
      });
    }

    const smtpHost = settings.smtpHost || 'smtp.gmail.com';
    const smtpPort = settings.smtpPort || 587;
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

    const htmlBody = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.1)">
        <div style="background:linear-gradient(135deg,#0F3A3D,#1a5a5e);padding:40px;text-align:center">
          <h1 style="color:#fff;margin:0;font-size:28px;font-weight:700;letter-spacing:-0.5px">New Property Enquiry</h1>
          <p style="color:rgba(255,255,255,0.8);margin:10px 0 0;font-size:16px">Gani Properties Portfolio</p>
        </div>
        <div style="padding:40px">
          <div style="background:#f8f9fa;border-radius:10px;padding:24px;margin-bottom:30px;border:1px solid #edf2f7; text-align:center">
            <h2 style="margin:0;color:#0F3A3D;font-size:20px;font-weight:700">${interest || 'General Property Interest'}</h2>
          </div>
          
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px;width:120px">Client Name</td>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7;font-weight:600;color:#1a202c">${name}</td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px">Phone Number</td>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7;font-weight:600;color:#1a202c">
                <a href="tel:${phone}" style="color:#0F3A3D;text-decoration:none">${phone}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7;color:#718096;font-size:14px">Email Address</td>
              <td style="padding:12px 0;border-bottom:1px solid #edf2f7">
                <a href="mailto:${email}" style="color:#0F3A3D;text-decoration:none">${email || 'N/A'}</a>
              </td>
            </tr>
          </table>

          <div style="margin-top:30px">
            <h3 style="font-size:13px;color:#718096;margin:0 0 10px;text-transform:uppercase;letter-spacing:0.1em;font-weight:700">Message / Inquiry Details</h3>
            <div style="background:#f8f9fa;border-left:4px solid #C9B589;border-radius:6px;padding:20px;color:#2d3748;line-height:1.7;white-space:pre-wrap;font-size:15px">${message || 'Patiently waiting for contact.'}</div>
          </div>
          
          <div style="margin-top:40px;text-align:center">
            <a href="tel:${phone}" style="background:#C9B589;color:#fff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;transition:all 0.3s ease">Return Call Now</a>
          </div>
        </div>
        <div style="background:#f7fafc;padding:20px 40px;text-align:center;color:#a0aec0;font-size:13px;border-top:1px solid #edf2f7">
          This lead was generated automatically from the Gani Properties website.
        </div>
      </div>
    `;

    try {
      const transporter = nodemailer.createTransport(smtpConfig);
      await transporter.sendMail({
        from: `"${fromName}" <${smtpUser}>`,
        to: recipientEmail,
        replyTo: email || smtpUser,
        subject: `[New Lead] ${interest || 'Property Enquiry'} — ${name}`,
        html: htmlBody,
      });
      console.log(`✅ Property lead email sent to ${recipientEmail} from ${name}`);
      return res.status(200).json({ success: true, message: 'Enquiry sent successfully', id: newLead.id });
    } catch (emailError) {
      console.error('Email send error:', emailError.message);
      return res.status(200).json({ 
        success: true, 
        message: 'Enquiry logged, but email failed. Check SMTP settings.',
        id: newLead.id
      });
    }
  } catch (error) {
    console.error('Error processing lead:', error);
    return res.status(500).json({ error: 'Failed to process lead' });
  }
});

// Admin endpoint to get leads
app.get('/api/leads', authenticateToken, async (req, res) => {
  try {
    const leads = await readLeads();
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch leads' });
  }
});

// Admin endpoint to delete lead
app.delete('/api/leads/:id', authenticateToken, async (req, res) => {
  try {
    const leads = await readLeads();
    const filtered = leads.filter(l => l.id !== req.params.id);
    await writeLeads(filtered);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to delete lead' });
  }
});

// --- Apply for a Career ---
app.post('/api/careers/:id/apply', upload.single('resumeFile'), async (req, res) => {
  try {
    const careers = await readCareers();
    const job = careers.find(c => c.id === req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    const { name, email, phone, coverLetter, resumeLink, jobTitle, jobCategory } = req.body;
    if (!name || !email || !phone || !coverLetter) {
      return res.status(400).json({ error: 'Name, email, phone, and cover letter are required' });
    }

    const settings = await readSettings();
    const recipientEmail = settings.careersEmail || settings.applicationEmail || DEFAULT_SETTINGS.careersEmail;
    const fromName = settings.emailFromName || DEFAULT_SETTINGS.emailFromName;

    // Build SMTP transporter
    const smtpUser = settings.smtpUser || process.env.SMTP_USER;
    const smtpPass = settings.smtpPass || process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error('❌ SMTP credentials not configured. Go to Dashboard → Settings to set them.');
      return res.status(500).json({
        error: 'Email not configured. Please go to Dashboard → Settings → Email Settings and enter your SMTP credentials.',
      });
    }

    const smtpHost = settings.smtpHost || 'smtp.gmail.com';
    const smtpPort = settings.smtpPort || 587;
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
    const uploadedFile = req.file; // multer puts file here
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

    // Build attachments array
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
      console.log(`✅ Application email sent to ${recipientEmail} for ${name} | Job: ${job.title} | File: ${fileName || 'none'}`);
      return res.status(200).json({ success: true, message: 'Application submitted successfully' });
    } catch (emailError) {
      console.error('Email send error:', emailError.message);
      return res.status(500).json({ error: 'Failed to send email. Please configure SMTP credentials (SMTP_USER / SMTP_PASS) on the server.' });
    }
  } catch (error) {
    console.error('Error processing application:', error);
    return res.status(500).json({ error: 'Failed to process application' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📁 Properties stored in: ${DATA_FILE}`);
  console.log(`📁 Careers stored in: ${CAREERS_FILE}`);
  console.log(`🔑 Login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
});


