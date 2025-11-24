/**
 * Extract coordinates from Google Maps URL or place ID
 * Supports various Google Maps URL formats:
 * - https://maps.google.com/?q=lat,lng
 * - https://www.google.com/maps/place/.../@lat,lng
 * - https://www.google.com/maps/search/?api=1&query=lat,lng
 * - Place ID format
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export function extractCoordinatesFromGoogleMaps(url: string): Coordinates | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Clean the URL
  url = url.trim();

  // Pattern 1: Direct coordinates in query parameter ?q=lat,lng
  const qParamMatch = url.match(/[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
  if (qParamMatch) {
    const lat = parseFloat(qParamMatch[1]);
    const lng = parseFloat(qParamMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // Pattern 2: Coordinates in path /@lat,lng
  const atMatch = url.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
  if (atMatch) {
    const lat = parseFloat(atMatch[1]);
    const lng = parseFloat(atMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // Pattern 3: Query parameter with query=lat,lng
  const queryMatch = url.match(/[?&]query=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
  if (queryMatch) {
    const lat = parseFloat(queryMatch[1]);
    const lng = parseFloat(queryMatch[2]);
    if (!isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
  }

  // Pattern 4: Direct lat,lng in URL
  const directMatch = url.match(/([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
  if (directMatch) {
    const lat = parseFloat(directMatch[1]);
    const lng = parseFloat(directMatch[2]);
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      return { lat, lng };
    }
  }

  return null;
}

export function isValidGoogleMapsUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  const googleMapsPatterns = [
    /maps\.google\./i,
    /google\.com\/maps/i,
    /goo\.gl\/maps/i,
    /maps\.app\.goo\.gl/i,
  ];

  return googleMapsPatterns.some(pattern => pattern.test(url));
}

