import { supabase } from './lib/supabase';
import { authenticateToken } from './lib/auth';
import type { Handler } from '@netlify/functions';
import { parseRequest, handleOptions, createResponse, extractPathParam } from './lib/netlify';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  const req = parseRequest(event);

  // POST /api/upload - Upload images (protected)
  if (event.httpMethod === 'POST') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return createResponse(401, { error: authResult.error });
      }

      // Note: Netlify Functions have a 6MB body limit
      // For larger files, use Supabase Storage directly from frontend
      // This endpoint can be used for smaller images or as a proxy
      
      const formData = req.body;
      
      if (!formData || !formData.files) {
        return createResponse(400, { error: 'No files uploaded' });
      }

      // For now, return instructions to use Supabase Storage directly
      // In production, you might want to handle uploads here or use Supabase Storage
      return createResponse(501, { 
        error: 'Use Supabase Storage directly from frontend for image uploads',
        instructions: 'Upload images directly to Supabase Storage bucket from the dashboard'
      });
    } catch (error: any) {
      console.error('Error uploading files:', error);
      return createResponse(500, { error: 'Failed to upload files' });
    }
  }

  // DELETE /api/upload/images/:filename - Delete image (protected)
  if (event.httpMethod === 'DELETE') {
    try {
      const authResult = await authenticateToken(req);
      if (authResult.error) {
        return createResponse(401, { error: authResult.error });
      }

      // Extract filename from path or query
      const filename = extractPathParam(event, 'filename') || req.query.filename;
      
      if (!filename || typeof filename !== 'string') {
        return createResponse(400, { error: 'Filename required' });
      }

      // Delete from Supabase Storage
      const { error } = await supabase.storage
        .from('property-images')
        .remove([filename]);
      
      if (error) {
        console.error('Error deleting file:', error);
        return createResponse(500, { error: 'Failed to delete file' });
      }

      return createResponse(200, { success: true });
    } catch (error: any) {
      console.error('Error deleting file:', error);
      return createResponse(500, { error: 'Failed to delete file' });
    }
  }

  return createResponse(405, { error: 'Method not allowed' });
};















