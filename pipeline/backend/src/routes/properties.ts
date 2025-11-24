import { Router, Request, Response } from 'express';
import {
  loadProperties,
  createProperty,
  updateProperty,
  deleteProperty,
  getPropertyById,
} from '../utils/storage.js';
import { validateCreateProperty, validateUpdateProperty } from '../middleware/validation.js';
import { extractCoordinatesFromGoogleMaps } from '../utils/googleMaps.js';
import { authenticateToken } from '../middleware/auth.js';
import { Property } from '../types/property.js';

const router = Router();

// GET /api/properties - Get all properties (public - for main app)
router.get('/', (req: Request, res: Response) => {
  try {
    const properties = loadProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

// GET /api/properties/:id - Get single property (public - for main app)
router.get('/:id', (req: Request, res: Response) => {
  try {
    const property = getPropertyById(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// POST /api/properties - Create new property (protected)
router.post('/', authenticateToken, validateCreateProperty, (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    
    // Extract coordinates from Google Maps URL if provided and lat/lon not set
    if (data.googleMapsUrl && (!data.lat || !data.lon)) {
      const coords = extractCoordinatesFromGoogleMaps(data.googleMapsUrl);
      if (coords) {
        data.lat = coords.lat;
        data.lon = coords.lng;
      }
    }
    
    // Remove googleMapsUrl from data before saving
    delete data.googleMapsUrl;
    
    const property = createProperty(data);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

// PUT /api/properties/:id - Update property (protected)
router.put('/:id', authenticateToken, validateUpdateProperty, (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };
    delete updates.id; // Don't allow ID changes
    
    // Extract coordinates from Google Maps URL if provided and lat/lon not set
    if (updates.googleMapsUrl && (!updates.lat || !updates.lon)) {
      const coords = extractCoordinatesFromGoogleMaps(updates.googleMapsUrl);
      if (coords) {
        updates.lat = coords.lat;
        updates.lon = coords.lng;
      }
    }
    
    // Remove googleMapsUrl from updates before saving
    delete updates.googleMapsUrl;
    
    const property = updateProperty(id, updates);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

// DELETE /api/properties/:id - Delete property (protected)
router.delete('/:id', authenticateToken, (req: Request, res: Response) => {
  try {
    const deleted = deleteProperty(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

export default router;

