import { supabaseAdmin } from './lib/supabase';
import { authenticateToken } from './lib/auth';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCorsHeaders(res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Authenticate user
    const authResult = await authenticateToken(req);
    if (authResult.error) {
      return res.status(401).json({ error: authResult.error });
    }

    // Get image data from request
    const { image, fileName } = req.body;

    if (!image || !fileName) {
      return res.status(400).json({ error: 'Image and fileName are required' });
    }

    // Validate file size (5MB limit)
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const fileSizeInMB = buffer.length / (1024 * 1024);

    if (fileSizeInMB > 5) {
      return res.status(400).json({ error: 'Image size must be less than 5MB' });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const mimeMatch = image.match(/data:([^;]+);/);
    const mimeType = mimeMatch ? mimeMatch[1] : '';

    if (!allowedTypes.includes(mimeType)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed' });
    }

    // Generate unique filename
    const fileExt = fileName.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const uniqueFileName = `property-${timestamp}-${randomStr}.${fileExt}`;

    // Upload to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('property-images')
      .upload(uniqueFileName, buffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return res.status(500).json({ error: 'Failed to upload image: ' + error.message });
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('property-images')
      .getPublicUrl(uniqueFileName);

    return res.json({
      success: true,
      url: publicUrl,
      fileName: uniqueFileName,
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

