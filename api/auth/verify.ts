import jwt from 'jsonwebtoken';
import type { Handler } from '@netlify/functions';
import { parseRequest, handleOptions, createResponse } from '../lib/netlify';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'GET') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const req = parseRequest(event);
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return createResponse(401, {
        success: false,
        message: 'No token provided',
      });
    }

    const token = authHeader.substring(7);
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      return createResponse(200, {
        success: true,
        user: decoded,
      });
    } catch (error) {
      return createResponse(401, {
        success: false,
        message: 'Invalid or expired token',
      });
    }
  } catch (error: any) {
    console.error('Verify error:', error);
    return createResponse(500, {
      success: false,
      message: 'Internal server error',
    });
  }
};















