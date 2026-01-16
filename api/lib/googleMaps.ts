/**
 * Extract coordinates from Google Maps URL
 * Supports various Google Maps URL formats
 */
export function extractCoordinatesFromGoogleMaps(url: string): { lat: number; lng: number } | null {
  if (!url) return null;

  try {
    // Format 1: https://www.google.com/maps?q=12.9716,77.5946
    const qMatch = url.match(/[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (qMatch) {
      return {
        lat: parseFloat(qMatch[1]),
        lng: parseFloat(qMatch[2]),
      };
    }

    // Format 2: https://www.google.com/maps/@12.9716,77.5946,15z
    const atMatch = url.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (atMatch) {
      return {
        lat: parseFloat(atMatch[1]),
        lng: parseFloat(atMatch[2]),
      };
    }

    // Format 3: https://maps.google.com/?ll=12.9716,77.5946
    const llMatch = url.match(/[?&]ll=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (llMatch) {
      return {
        lat: parseFloat(llMatch[1]),
        lng: parseFloat(llMatch[2]),
      };
    }

    // Format 4: https://www.google.com/maps/place/.../@12.9716,77.5946,15z
    const placeMatch = url.match(/\/place\/[^/]+\/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (placeMatch) {
      return {
        lat: parseFloat(placeMatch[1]),
        lng: parseFloat(placeMatch[2]),
      };
    }

    return null;
  } catch (error) {
    console.error('Error extracting coordinates:', error);
    return null;
  }
}















