import { supabase } from '../lib/supabase';
import { authenticateToken } from '../lib/auth';
import type { Handler } from '@netlify/functions';
import { extractCoordinatesFromGoogleMaps } from '../lib/googleMaps';
import { parseRequest, handleOptions, createResponse } from '../lib/netlify';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const req = parseRequest(event);

  // GET /api/properties - Get all properties (public)
  // GET /api/properties/:id - Get single property (public)
  if (event.httpMethod === 'GET') {
    try {
      // Check if there's an ID in the path
      const pathSegments = event.path.split('/').filter(Boolean);
      const propertiesIndex = pathSegments.indexOf('properties');
      const id = propertiesIndex >= 0 && pathSegments[propertiesIndex + 1] 
        ? pathSegments[propertiesIndex + 1] 
        : req.query.id;

      // If ID provided, get single property
      if (id) {
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !data) {
          return createResponse(404, { error: 'Property not found' });
        }
        
        const property = {
          ...data,
          postedAt: data.posted_at,
          priceLabel: data.price_label,
          highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
        };
        
        return createResponse(200, property);
      }

      // Otherwise, get all properties
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        console.error('Database error:', error);
        return createResponse(500, { error: 'Failed to fetch properties' });
      }
      
      // Transform data to match frontend Property type
      const properties = (data || []).map((p: any) => ({
        ...p,
        postedAt: p.posted_at,
        highlights: Array.isArray(p.highlights) ? p.highlights : JSON.parse(p.highlights || '[]'),
      }));
      
      return createResponse(200, properties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      return createResponse(500, { error: 'Failed to fetch properties' });
    }
  }

  // POST /api/properties - Create new property (protected)
  if (event.httpMethod === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return createResponse(401, { error: authResult.error });
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
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert(insertData)
        .select()
        .single();
      
      if (error) {
        console.error('Database error:', error);
        return createResponse(500, { error: 'Failed to create property' });
      }
      
      // Transform response
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
      };
      
      return createResponse(201, property);
    } catch (error: any) {
      console.error('Error creating property:', error);
      return createResponse(500, { error: 'Failed to create property' });
    }
  }

  // PUT /api/properties/:id - Update property (protected)
  if (event.httpMethod === 'PUT') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return createResponse(401, { error: authResult.error });
      }

      // Extract ID from path
      const pathSegments = event.path.split('/').filter(Boolean);
      const propertiesIndex = pathSegments.indexOf('properties');
      const id = propertiesIndex >= 0 && pathSegments[propertiesIndex + 1] 
        ? pathSegments[propertiesIndex + 1] 
        : req.query.id;

      if (!id) {
        return createResponse(400, { error: 'Property ID is required' });
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
        return createResponse(404, { error: 'Property not found' });
      }
      
      // Transform response
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
      };
      
      return createResponse(200, property);
    } catch (error: any) {
      console.error('Error updating property:', error);
      return createResponse(500, { error: 'Failed to update property' });
    }
  }

  // DELETE /api/properties/:id - Delete property (protected)
  if (event.httpMethod === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return createResponse(401, { error: authResult.error });
      }

      // Extract ID from path
      const pathSegments = event.path.split('/').filter(Boolean);
      const propertiesIndex = pathSegments.indexOf('properties');
      const id = propertiesIndex >= 0 && pathSegments[propertiesIndex + 1] 
        ? pathSegments[propertiesIndex + 1] 
        : req.query.id;

      if (!id) {
        return createResponse(400, { error: 'Property ID is required' });
      }

      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
      
      if (error) {
        return createResponse(404, { error: 'Property not found' });
      }
      
      return createResponse(204, {});
    } catch (error: any) {
      console.error('Error deleting property:', error);
      return createResponse(500, { error: 'Failed to delete property' });
    }
  }

  return createResponse(405, { error: 'Method not allowed' });
};















