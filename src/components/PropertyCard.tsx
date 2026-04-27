import { Link } from 'react-router-dom';
import { MapPin, Maximize2, Building, HardHat, Hammer, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property } from '@/types/property';
import Image from './Image';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
}

export default function PropertyCard({ property }: PropertyCardProps) {
  if (!property) return null;

  return (
    <Link 
      to={`/property/${property.slug || property.id}`}
      className="group block h-full property-card"
    >
      <motion.div
        whileHover={{ y: -8 }}
        className="bg-white border border-gp-ink/5 overflow-hidden h-full flex flex-col relative transition-all duration-500 hover:shadow-2xl hover:border-gp-red/30"
      >
        {/* Construction Ruler Border Top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-[repeating-linear-gradient(90deg,transparent,transparent_9px,rgba(0,0,0,0.1)_9px,rgba(0,0,0,0.1)_10px)] z-20" />
        
        {/* Image Container */}
        <div className="relative h-[280px] overflow-hidden">
          <Image
            src={property.images && property.images[0] ? property.images[0] : '/images/Land.webp'}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
          
          {/* Featured Badge - Top Right */}
          {property.featured && (
            <div className="absolute top-4 right-4 z-20">
              <div className="px-3 py-1.5 bg-gp-ink/80 backdrop-blur-md border border-gp-red/30 rounded-full shadow-[0_0_15px_rgba(221,43,28,0.2)] flex items-center gap-2">
                <span className="text-gp-red text-xs">★</span>
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Featured</span>
              </div>
            </div>
          )}

          {/* Status Badge - Top Left */}
          <div className="absolute top-4 left-4 z-10">
            <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] shadow-lg flex items-center gap-2 ${
              property.status === 'available' ? 'bg-gp-red text-white' : 'bg-gp-ink text-white'
            }`}>
              {property.status === 'available' ? <HardHat className="w-3 h-3" /> : <Hammer className="w-3 h-3" />}
              {property.status}
            </div>
          </div>

          {/* Pricing Overlay */}
          <div className="absolute bottom-4 left-4 text-white z-10">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-80 flex items-center gap-2">
              <Ruler className="w-3 h-3 text-gp-red" />
              Starting From
            </p>
            <p className="text-2xl font-black tracking-tight">
              {property.price != null
                ? `₹${property.price.toLocaleString()}` 
                : property.priceLabel || 'Price on Request'}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 flex-grow flex flex-col relative bg-white min-h-[240px]">
          {/* Industrial Accent - Corner Ruler */}
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gp-red/10 group-hover:border-gp-red/30 transition-colors" />

          <h3 className="text-lg font-display font-black text-gp-ink mb-2 uppercase tracking-tight group-hover:text-gp-red transition-colors line-clamp-1">
            {property.title}
          </h3>
          
          <div className="flex items-center gap-2 text-gp-ink/40 mb-4">
            <MapPin className="h-3 w-3 text-gp-red" />
            <span className="text-[10px] font-bold uppercase tracking-widest">{property.city}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-auto border-t border-gp-ink/5 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gp-light-grey flex items-center justify-center border border-gp-ink/5">
                <Maximize2 className="h-4 w-4 text-gp-red" />
              </div>
              <div>
                <p className="text-[8px] font-black text-gp-ink/40 uppercase tracking-widest leading-none mb-1">Plot Area</p>
                <p className="text-xs font-bold text-gp-ink">{property.area} sqft</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gp-light-grey flex items-center justify-center border border-gp-ink/5">
                <Building className="h-4 w-4 text-gp-red" />
              </div>
              <div>
                <p className="text-[8px] font-black text-gp-ink/40 uppercase tracking-widest leading-none mb-1">Structure</p>
                <p className="text-xs font-bold text-gp-ink">{property.type}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
