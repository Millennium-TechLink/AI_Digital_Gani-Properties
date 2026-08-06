import { supabase } from '../_lib/supabase.js';
import { authenticateToken } from '../_lib/auth.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractCoordinatesFromGoogleMaps } from '../_lib/googleMaps.js';

// Enable CORS
function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function transformProperty(data: any) {
  return {
    ...data,
    postedAt: data.posted_at,
    priceLabel: data.price_label,
    highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
    images: Array.isArray(data.images) ? data.images : JSON.parse(data.images || '[]'),
  };
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Single-property routes go through ?id= instead of /properties/[id] -
  // Vercel wasn't resolving bracket-dynamic function files in this project
  // (every request to a [id].ts path fell through to the SPA rewrite instead
  // of reaching the function: GET got index.html back with a 200, everything
  // else got a 405 from static-asset serving refusing non-GET methods).
  // Query params sidestep that entirely, so GET/PUT/DELETE for a single
  // property all live here now instead of in properties/[id].ts.
  const id = typeof req.query.id === 'string' ? req.query.id : undefined;

  // GET /api/properties?id=... - Get a single property (public)
  if (req.method === 'GET' && id) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Property not found' });
      }

      return res.json(transformProperty(data));
    } catch (error: any) {
      console.error('Error fetching property:', error);
      return res.status(500).json({ error: 'Failed to fetch property' });
    }
  }

  // GET /api/properties - Get all properties (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch properties' });
      }

      // Transform data to match frontend Property type
      const properties = (data || []).map((p: any) => ({
        ...p,
        postedAt: p.posted_at,
        highlights: Array.isArray(p.highlights) ? p.highlights : JSON.parse(p.highlights || '[]'),
        images: Array.isArray(p.images) ? p.images : JSON.parse(p.images || '[]'),
      }));

      return res.json(properties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      return res.status(500).json({ error: 'Failed to fetch properties' });
    }
  }

  // POST /api/properties - Create new property (protected)
  if (req.method === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const propertyData = { ...req.body };

      // Extract coordinates from Google Maps URL if provided
      if (propertyData.googleMapsUrl && (!propertyData.lat || !propertyData.lon)) {
        const coords = extractCoordinatesFromGoogleMaps(propertyData.googleMapsUrl);
        if (coords) {
          propertyData.lat = coords.lat;
          propertyData.lon = coords.lng;
        }
      }

      // Remove googleMapsUrl from data
      delete propertyData.googleMapsUrl;

      // Generate slug from title
      const slug = propertyData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Prepare data for Supabase
      const insertData = {
        title: propertyData.title,
        type: propertyData.type,
        city: propertyData.city,
        area: propertyData.area,
        price_label: propertyData.priceLabel || null,
        size: propertyData.size || null,
        status: propertyData.status,
        highlights: JSON.stringify(propertyData.highlights || []),
        lat: propertyData.lat || null,
        lon: propertyData.lon || null,
        images: propertyData.images || [],
        description: propertyData.description,
        slug: slug,
        posted_at: new Date().toISOString(),
        featured: propertyData.featured ?? false,
      };

      const { data, error } = await supabase
        .from('properties')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to create property' });
      }

      return res.status(201).json(transformProperty(data));
    } catch (error: any) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  // PUT /api/properties?id=... - Update property (protected)
  if (req.method === 'PUT') {
    if (!id) {
      return res.status(400).json({ error: 'Missing property id' });
    }
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
      if (updates.featured !== undefined) updateData.featured = updates.featured;
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

      return res.json(transformProperty(data));
    } catch (error: any) {
      console.error('Error updating property:', error);
      return res.status(500).json({ error: 'Failed to update property' });
    }
  }

  // DELETE /api/properties?id=... - Delete property (protected)
  if (req.method === 'DELETE') {
    if (!id) {
      return res.status(400).json({ error: 'Missing property id' });
    }
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

      return res.status(204).send('');
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return res.status(500).json({ error: 'Failed to delete property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
