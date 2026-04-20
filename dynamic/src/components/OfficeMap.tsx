import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { ExternalLink, MapPin } from 'lucide-react';
import { Button } from './ui/button';

// Fix leaflet default icon issue in React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Office Coordinates (Ballari)
const position: [number, number] = [15.1566155, 76.9408305];
const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Gani+Properties+Ballari';

export default function OfficeMap() {
  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup minWidth={250}>
            <div className="p-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gp-accent/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gp-accent" />
                </div>
                <h3 className="font-display font-bold text-gp-ink text-base m-0">Gani Properties</h3>
              </div>
              
              <p className="text-gp-ink-muted text-sm mb-4 leading-relaxed">
                2nd Floor, Neema square, Moka Road, Beside Madhuri Nursing Home, KHB Colony, Ballari, Karnataka 583103
              </p>

              <Button 
                asChild
                size="sm"
                className="w-full bg-[#0F3A3D] hover:bg-black border-none"
              >
                <a 
                  href={googleMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 !text-white no-underline hover:no-underline"
                >
                  View on Google Maps
                  <ExternalLink className="h-3.5 w-3.5 !text-white" />
                </a>
              </Button>
            </div>
          </Popup>
        </Marker>
      </MapContainer>

      {/* Static Overlay for Branding Background (Optional) */}
      <div className="absolute top-4 right-4 z-[400] hidden md:block">
        <div className="bg-white/90 backdrop-blur-md p-3 rounded-xl border border-gp-accent/20 shadow-lg">
          <p className="text-[10px] font-bold text-gp-accent uppercase tracking-widest">Official Office</p>
        </div>
      </div>
    </div>
  );
}
