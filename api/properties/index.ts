import { supabase } from '../lib/supabase';
import { authenticateToken } from '../lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { extractCoordinatesFromGoogleMaps } from '../lib/googleMaps';

// Enable CORS
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
        return res.status(500).json({ error: 'Failed to fetch properties' });
      }
      
      // Transform data to match frontend Property type
      const properties = (data || []).map((p: any) => ({
        ...p,
        postedAt: p.posted_at,
        highlights: Array.isArray(p.highlights) ? p.highlights : JSON.parse(p.highlights || '[]'),
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
        highlights: Array.isArray(data.highlights) ? data.highlights : JSON.parse(data.highlights || '[]'),
      };
      
      return res.status(201).json(property);
    } catch (error: any) {
      console.error('Error creating property:', error);
      return res.status(500).json({ error: 'Failed to create property' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}





