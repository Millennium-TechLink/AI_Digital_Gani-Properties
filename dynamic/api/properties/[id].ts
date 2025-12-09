import { supabase } from '../lib/supabase';
import { authenticateToken } from '../lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractCoordinatesFromGoogleMaps } from '../lib/googleMaps';
import { propertySchema } from '../lib/validation';

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

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Property ID is required' });
  }

  // GET /api/properties/:id - Get single property (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return res.status(404).json({ error: 'Property not found' });
        }
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch property' });
      }

      if (!data) {
        return res.status(404).json({ error: 'Property not found' });
      }
      
      // Transform data
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) 
          ? data.highlights 
          : (typeof data.highlights === 'string' ? JSON.parse(data.highlights || '[]') : []),
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

      // Validate input (only validate provided fields)
      const validationResult = propertySchema.partial().safeParse({
        title: updates.title,
        type: updates.type,
        city: updates.city,
        area: updates.area,
        price_label: updates.priceLabel,
        size: updates.size,
        status: updates.status,
        highlights: updates.highlights,
        lat: updates.lat,
        lon: updates.lon,
        images: updates.images,
        description: updates.description,
      });

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
      }

      // Prepare update data
      const updateData: any = {
        updated_at: new Date().toISOString(),
      };

      const validatedData = validationResult.data;
      if (validatedData.title !== undefined) {
        updateData.title = validatedData.title;
        // Regenerate slug if title changed
        updateData.slug = validatedData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
      if (validatedData.type !== undefined) updateData.type = validatedData.type;
      if (validatedData.city !== undefined) updateData.city = validatedData.city;
      if (validatedData.area !== undefined) updateData.area = validatedData.area;
      if (validatedData.price_label !== undefined) updateData.price_label = validatedData.price_label;
      if (validatedData.size !== undefined) updateData.size = validatedData.size;
      if (validatedData.status !== undefined) updateData.status = validatedData.status;
      if (validatedData.highlights !== undefined) updateData.highlights = validatedData.highlights;
      if (validatedData.lat !== undefined) updateData.lat = validatedData.lat;
      if (validatedData.lon !== undefined) updateData.lon = validatedData.lon;
      if (validatedData.images !== undefined) updateData.images = validatedData.images;
      if (validatedData.description !== undefined) updateData.description = validatedData.description;
      
      const { data, error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error || !data) {
        console.error('Update error:', error);
        return res.status(error?.code === 'PGRST116' ? 404 : 500).json({ 
          error: error?.code === 'PGRST116' ? 'Property not found' : 'Failed to update property' 
        });
      }
      
      // Transform response
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) 
          ? data.highlights 
          : (typeof data.highlights === 'string' ? JSON.parse(data.highlights || '[]') : []),
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
        console.error('Delete error:', error);
        return res.status(error.code === 'PGRST116' ? 404 : 500).json({ 
          error: error.code === 'PGRST116' ? 'Property not found' : 'Failed to delete property' 
        });
      }
      
      return res.status(204).send();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

