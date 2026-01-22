import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'properties.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Read properties from file
async function readProperties() {
  try {
    await ensureDataDir();
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, return empty array
    return [];
  }
}

// Write properties to file
async function writeProperties(properties) {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify(properties, null, 2));
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

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Local API server running on http://localhost:${PORT}`);
  console.log(`📁 Properties stored in: ${DATA_FILE}`);
  console.log(`🔑 Login: ${ADMIN_USERNAME} / ${ADMIN_PASSWORD}`);
});

