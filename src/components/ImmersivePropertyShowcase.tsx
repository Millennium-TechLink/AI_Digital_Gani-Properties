import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types/property';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImmersivePropertyShowcaseProps {
  properties: Property[];
}

export default function ImmersivePropertyShowcase({ properties }: ImmersivePropertyShowcaseProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const ref = useRef<HTMLElement>(null);

  const showcasedProperties = properties.slice(0, 6);
  const totalSlides = showcasedProperties.length;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const textOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-slide — continuous, resets on manual interaction
  useEffect(() => {
    if (totalSlides <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [totalSlides, nextSlide, currentIndex]);

  return (
    <section
      ref={ref}
      // Force white bg via inline style — overrides any global CSS transform stacking context issues
      style={{ backgroundColor: '#ffffff', position: 'relative', padding: '8rem 0' }}
    >
      <div className="container mx-auto px-4 lg:px-6">

        {/* Header */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-sm font-bold text-gp-accent uppercase tracking-[0.3em] mb-4 block">
            ESTATE SELECTION
          </span>
          <h2 className="text-5xl md:text-7xl font-display font-bold text-gp-ink mb-6">
            Handpicked <span className="text-gradient-gold">Excellence</span>
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed font-light">
            Discover a curated collection of premium properties, where every land holds
            the promise of a legacy.
          </p>
        </motion.div>

        {totalSlides > 0 ? (
          <div className="max-w-4xl mx-auto">
            {/* Flex row: [Button] [Slide] [Button] — buttons sit OUTSIDE overflow-hidden so they never clip */}
            <div className="flex items-center gap-5">

              {/* Prev button — always in DOM flow, never clipped */}
              <button
                onClick={prevSlide}
                disabled={totalSlides <= 1}
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#0E1B1C',
                  color: '#C9B589',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  opacity: totalSlides <= 1 ? 0 : 1,
                }}
                aria-label="Previous slide"
              >
                <ChevronLeft size={26} />
              </button>

              {/* Slide viewport */}
              <div
                style={{
                  flex: 1,
                  height: '560px',
                  overflow: 'hidden',
                  borderRadius: '24px',
                  position: 'relative',
                }}
              >
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div
                    key={currentIndex}
                    custom={direction}
                    variants={{
                      enter: (d: number) => ({
                        x: d > 0 ? '100%' : '-100%',
                        opacity: 0,
                        scale: 0.92,
                        rotateY: d > 0 ? 8 : -8,
                        filter: 'blur(4px)',
                      }),
                      center: {
                        zIndex: 1,
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        rotateY: 0,
                        filter: 'blur(0px)',
                      },
                      exit: (d: number) => ({
                        zIndex: 0,
                        x: d < 0 ? '100%' : '-100%',
                        opacity: 0,
                        scale: 0.92,
                        rotateY: d < 0 ? 8 : -8,
                        filter: 'blur(4px)',
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      x: { type: 'spring', stiffness: 280, damping: 28, mass: 0.8 },
                      opacity: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      scale: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      rotateY: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                      filter: { duration: 0.35, ease: 'easeOut' },
                    }}
                    style={{ position: 'absolute', inset: 0 }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(14,27,28,0.05)',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {/* PropertyCard already renders its own featured badge if applicable */}
                      <PropertyCard property={showcasedProperties[currentIndex]} />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next button */}
              <button
                onClick={nextSlide}
                disabled={totalSlides <= 1}
                style={{
                  flexShrink: 0,
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#0E1B1C',
                  color: '#C9B589',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  opacity: totalSlides <= 1 ? 0 : 1,
                }}
                aria-label="Next slide"
              >
                <ChevronRight size={26} />
              </button>
            </div>

            {/* Pagination dots with progress fill */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '28px' }}>
              {showcasedProperties.map((_, index) => {
                const isActive = currentIndex === index;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    aria-label={`Go to slide ${index + 1}`}
                    style={{
                      height: '8px',
                      width: isActive ? '64px' : '8px',
                      borderRadius: '999px',
                      border: 'none',
                      padding: 0,
                      cursor: 'pointer',
                      backgroundColor: isActive ? 'rgba(201,181,137,0.25)' : 'rgba(14,27,28,0.15)',
                      transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background-color 0.4s ease',
                      overflow: 'hidden',
                      position: 'relative',
                    }}
                  >
                    {isActive && (
                      <span
                        key={currentIndex}
                        style={{
                          display: 'block',
                          height: '100%',
                          width: '100%',
                          background: 'linear-gradient(90deg, #C9B589, #D5B36A)',
                          borderRadius: '999px',
                          transformOrigin: 'left',
                          animation: 'carousel-progress 4s linear forwards',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              style={{ textAlign: 'center', marginTop: '48px' }}
            >
              <Link
                to="/properties"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#0E1B1C',
                  color: '#C9B589',
                  padding: '14px 32px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '13px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                }}
              >
                <span>Explore All Properties</span>
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        ) : (
          <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#C9B589', fontSize: '18px', fontFamily: 'Playfair Display, serif', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Curating Excellence...
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
