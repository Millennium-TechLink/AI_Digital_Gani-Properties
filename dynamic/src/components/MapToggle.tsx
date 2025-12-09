import { useState, lazy, Suspense } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';

// Lazy load react-leaflet components (only available on client)
const MapContainer = lazy(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })));
const TileLayer = lazy(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })));
const Marker = lazy(() => import('react-leaflet').then(mod => ({ default: mod.Marker })));
const Popup = lazy(() => import('react-leaflet').then(mod => ({ default: mod.Popup })));

interface MapToggleProps {
  properties: Property[];
  viewMode: 'grid' | 'map';
  onViewModeChange: (mode: 'grid' | 'map') => void;
}

export default function MapToggle({ properties, viewMode, onViewModeChange: _onViewModeChange }: MapToggleProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  if (viewMode === 'grid') {
    return null;
  }

  // Ensure properties is an array
  const safeProperties = Array.isArray(properties) ? properties : [];
  const propertiesWithCoordinates = safeProperties.filter(p => p?.lat && p?.lon);
  
  // Default to Bangalore if no properties with coordinates
  const centerLat = propertiesWithCoordinates.length > 0
    ? propertiesWithCoordinates.reduce((sum, p) => sum + (p.lat || 0), 0) / propertiesWithCoordinates.length
    : 12.9716;
  const centerLon = propertiesWithCoordinates.length > 0
    ? propertiesWithCoordinates.reduce((sum, p) => sum + (p.lon || 0), 0) / propertiesWithCoordinates.length
    : 77.5946;

  return (
    <div className="relative h-[600px] w-full rounded-3xl overflow-hidden border border-gp-ink/10">
      <Suspense fallback={
        <div className="h-full w-full flex items-center justify-center bg-gp-surface/5">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gp-accent mx-auto mb-4"></div>
            <p className="text-gp-ink-muted">Loading map...</p>
          </div>
        </div>
      }>
        <MapContainer
          center={[centerLat, centerLon]}
          zoom={propertiesWithCoordinates.length > 0 ? 10 : 11}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {propertiesWithCoordinates.map((property) => (
            property?.lat && property?.lon && (
              <Marker
                key={property.id || Math.random()}
                position={[property.lat, property.lon]}
                eventHandlers={{
                  click: () => setSelectedProperty(property),
                }}
              >
                <Popup>
                  <div className="max-w-xs">
                    <h3 className="font-semibold text-sm mb-1">{property.title || 'Property'}</h3>
                    <p className="text-xs text-gray-600 mb-2">{property.area || ''}, {property.city || ''}</p>
                    {property.priceLabel && (
                      <p className="text-sm font-bold text-gp-accent">{property.priceLabel}</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </Suspense>
      {selectedProperty && (
        <div className="absolute top-4 left-4 right-4 z-[1000] max-w-md">
          <PropertyCard property={selectedProperty} />
        </div>
      )}
    </div>
  );
}
