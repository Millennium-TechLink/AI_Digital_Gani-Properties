import jwt from 'jsonwebtoken';
import type { Handler } from '@netlify/functions';
import { parseRequest, handleOptions, createResponse } from '../lib/netlify';

export const handler: Handler = async (event, context) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions();
  }

  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method not allowed' });
  }

  try {
    const req = parseRequest(event);
    const { username, password } = req.body || {};

    if (!username || !password) {
      return createResponse(400, {
        success: false,
        message: 'Username and password are required',
      });
    }

    // Get credentials from environment variables
    const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const JWT_SECRET = process.env.JWT_SECRET;
    const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

    if (!ADMIN_USERNAME || !ADMIN_PASSWORD || !JWT_SECRET) {
      console.error('Missing ADMIN_USERNAME, ADMIN_PASSWORD, or JWT_SECRET environment variable');
      return createResponse(500, {
        success: false,
        message: 'Server misconfigured. Contact administrator.',
      });
    }

    // Check credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Generate JWT token
      const token = jwt.sign(
        { username, type: 'admin' },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return createResponse(200, {
        success: true,
        token,
        message: 'Login successful',
      });
    } else {
      return createResponse(401, {
        success: false,
        message: 'Invalid username or password',
      });
    }
  } catch (error: any) {
    console.error('Login error:', error);
    return createResponse(500, {
      success: false,
      message: 'Internal server error',
    });
  }
};















