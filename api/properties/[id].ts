import { supabase } from '../lib/supabase';
import { authenticateToken } from '../lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractCoordinatesFromGoogleMaps } from '../lib/googleMaps';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;

  // GET /api/properties/:id - Get single property (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Transform data
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
      };
      
      return res.json(property);
    } catch (error: any) {
      console.error('Error fetching property:', error);
      return res.status(500).json({ error: 'Failed to fetch property' });
    }
  }

  // PUT /api/properties/:id - Update property (protected)
  if (req.method === 'PUT') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const updates = { ...req.body };
      delete updates.id; // Don't allow ID changes
      
      // Extract coordinates from Google Maps URL if provided
      if (updates.googleMapsUrl && (!updates.lat || !updates.lon)) {
        const coords = extractCoordinatesFromGoogleMaps(updates.googleMapsUrl);
        if (coords) {
          updates.lat = coords.lat;
          updates.lon = coords.lng;
        }
      }
      
      delete updates.googleMapsUrl;
      
      // Prepare update data
      const updateData: any = {};
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.type !== undefined) updateData.type = updates.type;
      if (updates.city !== undefined) updateData.city = updates.city;
      if (updates.area !== undefined) updateData.area = updates.area;
      if (updates.priceLabel !== undefined) updateData.price_label = updates.priceLabel;
      if (updates.size !== undefined) updateData.size = updates.size;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.highlights !== undefined) updateData.highlights = JSON.stringify(updates.highlights);
      if (updates.lat !== undefined) updateData.lat = updates.lat;
      if (updates.lon !== undefined) updateData.lon = updates.lon;
      if (updates.images !== undefined) updateData.images = updates.images;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.title !== undefined) {
        // Regenerate slug if title changed
        updateData.slug = updates.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      updateData.updated_at = new Date().toISOString();
      
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error || !data) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Transform response
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
      };
      
      return res.json(property);
    } catch (error: any) {
      console.error('Error updating property:', error);
      return res.status(500).json({ error: 'Failed to update property' });
    }
  }

  // DELETE /api/properties/:id - Delete property (protected)
  if (req.method === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}





