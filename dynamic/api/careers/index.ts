import { supabase } from '../lib/supabase.js';
import { authenticateToken } from '../lib/auth.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/careers - list all openings (public)
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('careers')
        .select('*')
        .order('posted_at', { ascending: false });

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to fetch careers' });
      }

      const careers = (data || []).map((c: any) => ({
        ...c,
        postedAt: c.posted_at,
        requirements: Array.isArray(c.requirements) ? c.requirements : JSON.parse(c.requirements || '[]'),
        benefits: Array.isArray(c.benefits) ? c.benefits : JSON.parse(c.benefits || '[]'),
      }));

      return res.status(200).json(careers);
    } catch (error: any) {
      console.error('Error fetching careers:', error);
      return res.status(500).json({ error: 'Failed to fetch careers' });
    }
  }

  // POST /api/careers - create a new opening (protected)
  if (req.method === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const body = { ...req.body };

      const insertData = {
        title: body.title,
        category: body.category,
        description: body.description || null,
        requirements: JSON.stringify(body.requirements || []),
        benefits: JSON.stringify(body.benefits || []),
        state: body.state || null,
        city: body.city || null,
        posted_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('careers')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        return res.status(500).json({ error: 'Failed to create career' });
      }

      const career = {
        ...data,
        postedAt: data.posted_at,
        requirements: Array.isArray(data.requirements) ? data.requirements : JSON.parse(data.requirements || '[]'),
        benefits: Array.isArray(data.benefits) ? data.benefits : JSON.parse(data.benefits || '[]'),
      };

      return res.status(201).json(career);
    } catch (error: any) {
      console.error('Error creating career:', error);
      return res.status(500).json({ error: 'Failed to create career' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
