import { supabase } from '../lib/supabase';
import { authenticateToken } from '../lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractCoordinatesFromGoogleMaps } from '../lib/googleMaps';
import { propertySchema } from '../lib/validation';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
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

  // GET /api/properties - Get all properties (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) {
        console.error('Database error:', error);
        // Return empty array instead of error for better UX
        return res.json([]);
      }
      
      // Transform data to match frontend Property type
      const properties = (Array.isArray(data) ? data : []).map((p: any) => ({
        ...p,
        postedAt: p.posted_at,
        priceLabel: p.price_label,
        highlights: Array.isArray(p.highlights) ? p.highlights : (typeof p.highlights === 'string' ? JSON.parse(p.highlights || '[]') : []),
      }));
      
      return res.json(properties);
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      // Return empty array for graceful degradation
      return res.json([]);
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
      
      // Validate input
      const validationResult = propertySchema.safeParse({
        title: propertyData.title,
        type: propertyData.type,
        city: propertyData.city,
        area: propertyData.area,
        price_label: propertyData.priceLabel,
        size: propertyData.size,
        status: propertyData.status,
        highlights: propertyData.highlights || [],
        lat: propertyData.lat,
        lon: propertyData.lon,
        images: propertyData.images || [],
        description: propertyData.description,
      });

      if (!validationResult.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: validationResult.error.errors,
        });
      }

      // Generate slug from title
      const slug = propertyData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Prepare data for Supabase
      const insertData = {
        title: validationResult.data.title,
        type: validationResult.data.type,
        city: validationResult.data.city,
        area: validationResult.data.area,
        price_label: validationResult.data.price_label || null,
        size: validationResult.data.size || null,
        status: validationResult.data.status,
        highlights: validationResult.data.highlights,
        lat: validationResult.data.lat || null,
        lon: validationResult.data.lon || null,
        images: validationResult.data.images,
        description: validationResult.data.description,
        slug: slug,
        posted_at: new Date().toISOString(),
        created_by: authResult.user?.id || null,
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
      
      // Transform response
      const property = {
        ...data,
        postedAt: data.posted_at,
        priceLabel: data.price_label,
        highlights: Array.isArray(data.highlights) ? data.highlights : (typeof data.highlights === 'string' ? JSON.parse(data.highlights || '[]') : []),
      };
      
      return res.status(201).json(property);
    } catch (error: any) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

