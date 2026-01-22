import { supabase } from './lib/supabase';
import { authenticateToken } from './lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,DELETE,OPTIONS');
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

  // POST /api/upload - Upload images (protected)
  if (req.method === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      // Note: Vercel serverless functions have a 4.5MB body limit
      // For larger files, use Supabase Storage directly from frontend
      // This endpoint can be used for smaller images or as a proxy
      
      const formData = req.body;
      
      if (!formData || !formData.files) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      // For now, return instructions to use Supabase Storage directly
      // In production, you might want to handle uploads here or use Supabase Storage
      return res.status(501).json({ 
        error: 'Use Supabase Storage directly from frontend for image uploads',
        instructions: 'Upload images directly to Supabase Storage bucket from the dashboard'
      });
    } catch (error: any) {
      console.error('Error uploading files:', error);
      return res.status(500).json({ error: 'Failed to upload files' });
    }
  }

  // DELETE /api/upload/images/:filename - Delete image (protected)
  if (req.method === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return res.status(401).json({ error: authResult.error });
      }

      const { filename } = req.query;
      
      if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: 'Filename required' });
      }

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from('property-images')
        .remove([filename]);
      
      if (error) {
        console.error('Error deleting file:', error);
        return res.status(500).json({ error: 'Failed to delete file' });
      }

      return res.json({ success: true });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      return res.status(500).json({ error: 'Failed to delete file' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}













