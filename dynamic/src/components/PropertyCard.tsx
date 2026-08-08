import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { Property } from '@/types/property';
import { cn } from '@/lib/utils';
import Image from './Image';

interface PropertyCardProps {
  property: Property;
  variant?: 'grid' | 'list';
}

export default function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  if (!property) return null;

  const statusColors = {
    available: 'glass-card border-green-500/30 text-green-700 font-bold',
    sold: 'glass-dark border-white/10 text-white/60 font-medium',
    new: 'glass-card border-gp-accent/30 text-gp-accent font-bold',
  };

  const Badge = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <div className={cn("px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[8px] sm:text-[10px] font-bold tracking-widest uppercase border backdrop-blur-md transition-all duration-300 shadow-sm flex items-center justify-center", className)}>
      {children}
    </div>
  );

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
          <div className="group flex flex-col md:flex-row gap-6 p-6 bg-white rounded-3xl border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-2xl cursor-pointer h-full relative">
            {property.featured && (
              <div className="absolute top-4 right-4 z-20">
                <div className="px-4 py-1.5 glass-dark rounded-full shadow-gold-glow flex items-center gap-2 border-gp-accent/30">
                  <span className="text-gp-gold">★</span>
                  <span className="text-[10px] font-bold text-white tracking-[0.2em] uppercase">Featured</span>
                </div>
              </div>
            )}
            <motion.div
              className="relative w-full md:w-64 h-48 rounded-2xl overflow-hidden flex-shrink-0"
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
                <h3 className="text-2xl font-display font-semibold text-gp-ink group-hover:text-gp-accent transition-colors leading-tight overflow-visible">
                  {property.title}
                </h3>
                <Badge className={cn('ml-4 flex-shrink-0', statusColors[property.status as keyof typeof statusColors])}>
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
                <ul className="flex flex-nowrap gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  {property.highlights.slice(0, 3).map((highlight, idx) => (
                    <li key={idx} className="text-xs bg-gp-surface/10 text-gp-ink px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
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
      className="h-full relative"
      style={{
        willChange: 'transform, opacity',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {property.featured && (
        // Stacked below the status badge on narrow screens instead of sharing
        // its row - on a card squeezed down to ~250px (like this one inside
        // the home carousel), a top-left status pill and a top-right featured
        // pill collide in the middle. From sm: up there's enough width for
        // the original side-by-side corners.
        <div className="absolute top-9 left-3 sm:top-4 sm:left-auto sm:right-4 z-20">
          <div className="px-2 py-0.5 sm:px-3 sm:py-1.5 bg-gp-ink/80 backdrop-blur-md border border-gp-red/30 rounded-full shadow-[0_0_15px_rgba(221,43,28,0.2)] flex items-center gap-1 sm:gap-2">
            <span className="text-gp-gold text-[10px] sm:text-xs">★</span>
            <span className="text-[8px] sm:text-[10px] font-black text-white uppercase tracking-[0.15em] sm:tracking-[0.2em]">Featured</span>
          </div>
        </div>
      )}
      <Link to={`/property/${property.slug}`}>
        <div className="group bg-white rounded-3xl overflow-hidden border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-2xl cursor-pointer h-full flex flex-col">
          <motion.div
            className="relative h-[150px] sm:h-[280px] overflow-hidden bg-gp-surface/5"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src={property.images && property.images[0] ? property.images[0] : '/images/Land.webp'}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110 z-0"
            />
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10">
            <Badge className={cn('', statusColors[property.status as keyof typeof statusColors])}>
              {property.status}
            </Badge>
          </div>
          </motion.div>
        <div className="pt-6 px-4 pb-4 sm:pt-10 sm:px-8 sm:pb-8 flex-1 flex flex-col min-h-[150px] sm:min-h-[240px]">
          <h3 className="text-lg sm:text-2xl font-display font-semibold text-gp-ink mb-1.5 sm:mb-3 group-hover:text-gp-accent transition-colors leading-tight overflow-visible">
            {property.title}
          </h3>
          <div className="flex items-center gap-2 text-gp-ink-muted mb-2 sm:mb-4">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm">{property.area}, {property.city}</span>
          </div>
          {property.priceLabel && (
            <p className="text-base sm:text-xl font-semibold text-gp-accent mb-1.5 sm:mb-2">{property.priceLabel}</p>
          )}
          {property.size && (
            <p className="text-sm text-gp-ink-muted mb-2 sm:mb-4">{property.size}</p>
          )}
          {property.highlights.length > 0 && (
            <ul
              className="flex flex-nowrap gap-1.5 sm:gap-2 mb-4 overflow-x-auto scrollbar-hide"
              // The row can hold more tags than a narrow mobile card is wide
              // (e.g. inside the home carousel, ~200px of usable width) even
              // after shrinking the pills, so it stays natively scrollable -
              // but scrollbar-hide removes the one native hint that there's
              // more to see. This mask fades the last ~24px to transparent
              // as a lightweight "there's more this way" affordance instead
              // of a hard, unindicated cut-off.
              style={{
                maskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, black calc(100% - 24px), transparent 100%)',
              }}
            >
              {property.highlights.slice(0, 3).map((highlight, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="text-[10px] sm:text-xs bg-gp-surface/10 text-gp-ink px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-lg transition-colors duration-300 group-hover:bg-gp-accent/20 whitespace-nowrap flex-shrink-0"
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
