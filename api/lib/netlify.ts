import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

export interface NetlifyRequest {
  method: string;
  path: string;
  headers: Record<string, string>;
  body: any;
  query: Record<string, string>;
}

export interface NetlifyResponse {
  statusCode: number;
  headers?: Record<string, string>;
  body: string;
}

/**
 * Helper to parse Netlify event into a more Express-like request object
 */
export function parseRequest(event: HandlerEvent): NetlifyRequest {
  const query: Record<string, string> = {};
  
  // Parse query string
  if (event.queryStringParameters) {
    Object.assign(query, event.queryStringParameters);
  }
  
  // Parse multiValue query string
  if (event.multiValueQueryStringParameters) {
    Object.keys(event.multiValueQueryStringParameters).forEach(key => {
      const values = event.multiValueQueryStringParameters![key];
      if (values && values.length > 0) {
        query[key] = values[0]; // Take first value
      }
    });
  }

  // Parse body
  let body: any = null;
  if (event.body) {
    try {
      body = JSON.parse(event.body);
    } catch (e) {
      // If not JSON, keep as string
      body = event.body;
    }
  }

  return {
    method: event.httpMethod,
    path: event.path,
    headers: event.headers || {},
    body,
    query,
  };
}

/**
 * Helper to create CORS headers
 */
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

/**
 * Helper to create a response
 */
export function createResponse(
  statusCode: number,
  data: any,
  headers?: Record<string, string>
): NetlifyResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(),
      ...headers,
    },
    body: JSON.stringify(data),
  };
}

/**
 * Helper to handle OPTIONS requests (CORS preflight)
 */
export function handleOptions(): NetlifyResponse {
  return {
    statusCode: 200,
    headers: corsHeaders(),
    body: '',
  };
}

/**
 * Extract path parameter from Netlify event
 * For routes like /api/properties/:id, extracts 'id' from path
 */
export function extractPathParam(event: HandlerEvent, paramName: string): string | null {
  // Netlify uses path segments, so we need to extract from the path
  // Example: /.netlify/functions/properties/123 or /api/properties/123
  const pathSegments = event.path.split('/').filter(Boolean);
  
  // Find the relevant segment after 'api' or 'properties'
  // For /api/properties/:id, pathSegments = ['api', 'properties', '123']
  // For /.netlify/functions/properties/:id, pathSegments = ['.netlify', 'functions', 'properties', '123']
  
  let startIndex = -1;
  if (pathSegments.includes('api')) {
    startIndex = pathSegments.indexOf('api');
  } else if (pathSegments.includes('properties')) {
    startIndex = pathSegments.indexOf('properties');
  } else if (pathSegments.includes('upload')) {
    startIndex = pathSegments.indexOf('upload');
  }
  
  if (startIndex === -1) return null;
  
  const relevantSegments = pathSegments.slice(startIndex + 1);
  
  // For properties/:id, id is the last segment
  if (paramName === 'id' && relevantSegments.length >= 1) {
    return relevantSegments[relevantSegments.length - 1];
  }
  
  // For upload/images/:filename, filename is the last segment
  if (paramName === 'filename' && relevantSegments.length >= 2) {
    return relevantSegments[relevantSegments.length - 1];
  }
  
  return null;
}
