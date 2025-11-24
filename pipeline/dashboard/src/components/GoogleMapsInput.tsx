import { useState, useEffect } from 'react';
import { MapPin, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface GoogleMapsInputProps {
  value: string;
  onChange: (url: string) => void;
  onCoordinatesExtracted?: (lat: number, lng: number) => void;
  lat?: number;
  lng?: number;
}

export default function GoogleMapsInput({
  value,
  onChange,
  onCoordinatesExtracted,
  lat,
  lng,
}: GoogleMapsInputProps) {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [extractedCoords, setExtractedCoords] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!value) {
      setIsValid(null);
      setExtractedCoords(null);
      return;
    }

    // Check if it's a valid Google Maps URL
    const googleMapsPatterns = [
      /maps\.google\./i,
      /google\.com\/maps/i,
      /goo\.gl\/maps/i,
      /maps\.app\.goo\.gl/i,
    ];

    const isValidUrl = googleMapsPatterns.some(pattern => pattern.test(value));
    setIsValid(isValidUrl);

    if (isValidUrl) {
      // Extract coordinates
      extractCoordinates(value);
    }
  }, [value]);

  const extractCoordinates = (url: string) => {
    // Pattern 1: Direct coordinates in query parameter ?q=lat,lng
    const qParamMatch = url.match(/[?&]q=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (qParamMatch) {
      const lat = parseFloat(qParamMatch[1]);
      const lng = parseFloat(qParamMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setExtractedCoords({ lat, lng });
        onCoordinatesExtracted?.(lat, lng);
        return;
      }
    }

    // Pattern 2: Coordinates in path /@lat,lng
    const atMatch = url.match(/@([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setExtractedCoords({ lat, lng });
        onCoordinatesExtracted?.(lat, lng);
        return;
      }
    }

    // Pattern 3: Query parameter with query=lat,lng
    const queryMatch = url.match(/[?&]query=([+-]?\d+\.?\d*),([+-]?\d+\.?\d*)/);
    if (queryMatch) {
      const lat = parseFloat(queryMatch[1]);
      const lng = parseFloat(queryMatch[2]);
      if (!isNaN(lat) && !isNaN(lng)) {
        setExtractedCoords({ lat, lng });
        onCoordinatesExtracted?.(lat, lng);
        return;
      }
    }

    setExtractedCoords(null);
  };

  const openInMaps = () => {
    if (value) {
      window.open(value, '_blank');
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gp-ink mb-2">
        Google Maps Link
      </label>
      
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <MapPin className="h-5 w-5 text-gp-ink-muted" />
        </div>
        <input
          type="url"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://maps.google.com/?q=12.9716,77.5946"
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
        />
        {value && (
          <button
            type="button"
            onClick={openInMaps}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gp-accent hover:text-gp-gold transition-colors"
            title="Open in Google Maps"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Status Messages */}
      <AnimatePresence>
        {value && isValid === true && extractedCoords && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-green-800">
                Coordinates extracted successfully!
              </p>
              <p className="text-xs text-green-600">
                Lat: {extractedCoords.lat.toFixed(6)}, Lng: {extractedCoords.lng.toFixed(6)}
              </p>
            </div>
          </motion.div>
        )}

        {value && isValid === false && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          >
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-800">
              Please enter a valid Google Maps URL
            </p>
          </motion.div>
        )}

        {lat && lng && !extractedCoords && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              Coordinates already set: Lat {lat.toFixed(6)}, Lng {lng.toFixed(6)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

