import { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import 'leaflet/dist/leaflet.css';
import { motion, AnimatePresence } from 'framer-motion';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// Fix default marker icons once globally
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapToggleProps {
  properties: Property[];
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export default function MapToggle({ properties, viewMode }: MapToggleProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  if (viewMode === 'grid') {
    return null;
  }

  // Filter properties that have both lat and lon
  const propertiesWithCoordinates = properties.filter(p => 
    p.lat !== null && 
    p.lon !== null && 
    !isNaN(Number(p.lat)) && 
    !isNaN(Number(p.lon))
  );
  
  // Default values for Bangalore center if no coordinates are found
  const DEFAULT_LAT = 13.0827;
  const DEFAULT_LON = 77.5946;

  let centerLat = DEFAULT_LAT;
  let centerLon = DEFAULT_LON;

  if (propertiesWithCoordinates.length > 0) {
    centerLat = propertiesWithCoordinates.reduce((sum, p) => sum + Number(p.lat || 0), 0) / propertiesWithCoordinates.length;
    centerLon = propertiesWithCoordinates.reduce((sum, p) => sum + Number(p.lon || 0), 0) / propertiesWithCoordinates.length;
  }

  return (
    <div className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-gp-ink/10 shadow-lg">
      <MapContainer
        key={`map-${propertiesWithCoordinates.length}-${centerLat}`}
        center={[centerLat || DEFAULT_LAT, centerLon || DEFAULT_LON]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {propertiesWithCoordinates.map((property) => (
          <Marker
            key={property.id}
            position={[Number(property.lat), Number(property.lon)]}
            eventHandlers={{
              click: () => setSelectedProperty(property),
            }}
          >
            <Popup>
              <div className="max-w-xs p-1">
                <h3 className="font-semibold text-sm mb-1 text-gp-ink">{property.title}</h3>
                <p className="text-xs text-gp-ink-muted mb-2">{property.area}, {property.city}</p>
                {property.priceLabel && (
                  <p className="text-sm font-bold text-gp-accent">{property.priceLabel}</p>
                )}
                <a 
                  href={`/property/${property.slug}`} 
                  className="text-xs text-gp-accent hover:underline mt-2 block"
                  onClick={(e) => {
                    // Pre-prevent potential event issues with Leaflet
                    e.stopPropagation();
                  }}
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      <AnimatePresence>
        {selectedProperty && (
          <div className="absolute top-4 left-4 right-4 z-[1000] max-w-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -20 }}
              className="relative"
            >
              <button 
                onClick={() => setSelectedProperty(null)}
                className="absolute -top-2 -right-2 z-[1001] bg-white shadow-xl rounded-full p-1.5 border border-gray-200 hover:bg-gray-100 transition-colors"
                aria-label="Close property preview"
              >
                <div className="h-4 w-4 bg-gp-ink/80 rounded-full flex items-center justify-center text-white text-[10px] font-bold">✕</div>
              </button>
              <div className="shadow-2xl rounded-2xl overflow-hidden">
                <PropertyCard property={selectedProperty} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
