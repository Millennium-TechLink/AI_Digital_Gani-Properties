import { Link } from 'react-router-dom';
import { MapPin, Badge } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import Image from './Image';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
}

export default function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const statusColors = {
    available: 'bg-green-100 text-green-800 border-green-200',
    sold: 'bg-gray-100 text-gray-800 border-gray-200',
    new: 'bg-blue-100 text-blue-800 border-blue-200',
  };

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -4 }}
        className="h-full"
      >
        <Link to={`/property/${property.slug}`}>
          <div className="group flex gap-6 p-6 bg-white rounded-3xl border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-2xl cursor-pointer h-full">
            <motion.div
              className="relative w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src={property.images[0] || '/images/Land.webp'}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </motion.div>
          <div className="flex-1 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-2xl font-display font-semibold text-gp-ink group-hover:text-gp-accent transition-colors line-clamp-2">
                  {property.title}
                </h3>
                <Badge className={cn('text-xs font-medium border ml-4 flex-shrink-0', statusColors[property.status])}>
                  {property.status}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-gp-ink-muted mb-4">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{property.area}, {property.city}</span>
              </div>
              {property.priceLabel && (
                <p className="text-xl font-semibold text-gp-accent mb-2">{property.priceLabel}</p>
              )}
              {property.size && (
                <p className="text-sm text-gp-ink-muted mb-4">{property.size}</p>
              )}
              {property.highlights.length > 0 && (
                <ul className="flex flex-wrap gap-2 mb-4">
                  {property.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="text-xs bg-gp-surface/10 text-gp-ink px-2 py-1 rounded-lg">
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -4 }}
      className="h-full"
      style={{
        willChange: 'transform, opacity',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <Link to={`/property/${property.slug}`}>
        <div className="group bg-white rounded-3xl overflow-hidden border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-2xl cursor-pointer h-full flex flex-col">
          <motion.div
            className="relative h-64 overflow-hidden bg-gp-surface/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={property.images[0] || '/images/demo/placeholder.jpg'}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          <div className="absolute top-4 left-4">
            <Badge className={cn('text-xs font-medium border', statusColors[property.status])}>
              {property.status}
            </Badge>
          </div>
          </motion.div>
        <div className="p-6 flex-1 flex flex-col">
          <h3 className="text-2xl font-display font-semibold text-gp-ink mb-2 group-hover:text-gp-accent transition-colors line-clamp-2">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-gp-ink-muted mb-4">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">{property.area}, {property.city}</span>
          </div>
          {property.priceLabel && (
            <p className="text-xl font-semibold text-gp-accent mb-2">{property.priceLabel}</p>
          )}
          {property.size && (
            <p className="text-sm text-gp-ink-muted mb-4">{property.size}</p>
          )}
          {property.highlights.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4 flex-1">
              {property.highlights.slice(0, 3).map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="text-xs bg-gp-surface/10 text-gp-ink px-2 py-1 rounded-lg transition-all duration-300 group-hover:bg-gp-accent/20"
                >
                  {highlight}
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
    </motion.div>
  );
}
