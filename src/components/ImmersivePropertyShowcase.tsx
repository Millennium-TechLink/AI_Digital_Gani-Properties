import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { ArrowRight } from 'lucide-react';

interface ImmersivePropertyShowcaseProps {
  properties: Property[];
}

export default function ImmersivePropertyShowcase({ properties }: ImmersivePropertyShowcaseProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Optimized scroll transforms - removed scale for better performance
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  return (
    <section
      ref={ref}
      className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden"
      style={{
        willChange: 'transform',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          style={{ 
            opacity,
            willChange: 'opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
            FEATURED PROPERTIES
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
            Handpicked Excellence
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed">
            Each property represents a careful selection of premium lands in prime locations, 
            verified for quality and ready for your dreams.
          </p>
        </motion.div>

        {/* Property Grid with Stagger */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {properties.slice(0, 6).map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-3 group text-lg font-medium text-gp-accent hover:text-gp-gold transition-colors"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
