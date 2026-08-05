import { supabase } from '../lib/supabase.js';
import { authenticateToken } from '../lib/auth.js';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Career ID is required' });
  }

  // PUT /api/careers/:id - update an opening (protected)
  if (req.method === 'PUT') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const body = { ...req.body };
      const updateData: any = {};
      if (body.title !== undefined) updateData.title = body.title;
      if (body.category !== undefined) updateData.category = body.category;
      if (body.description !== undefined) updateData.description = body.description;
      if (body.requirements !== undefined) updateData.requirements = JSON.stringify(body.requirements);
      if (body.benefits !== undefined) updateData.benefits = JSON.stringify(body.benefits);
      if (body.state !== undefined) updateData.state = body.state;
      if (body.city !== undefined) updateData.city = body.city;

      const { data, error } = await supabase
        .from('careers')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error || !data) {
        return res.status(404).json({ error: 'Career not found' });
      }

      const career = {
        ...data,
        postedAt: data.posted_at,
        requirements: Array.isArray(data.requirements) ? data.requirements : JSON.parse(data.requirements || '[]'),
        benefits: Array.isArray(data.benefits) ? data.benefits : JSON.parse(data.benefits || '[]'),
      };

      return res.status(200).json(career);
    } catch (error: any) {
      console.error('Error updating career:', error);
      return res.status(500).json({ error: 'Failed to update career' });
    }
  }

  // DELETE /api/careers/:id - remove an opening (protected)
  if (req.method === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const { error } = await supabase.from('careers').delete().eq('id', id);

      if (error) {
        return res.status(404).json({ error: 'Career not found' });
      }

      return res.status(204).send('');
    } catch (error: any) {
      console.error('Error deleting career:', error);
      return res.status(500).json({ error: 'Failed to delete career' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
