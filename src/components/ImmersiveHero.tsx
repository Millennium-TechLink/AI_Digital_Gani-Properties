import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowDown, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

interface ParticleConfig {
  initialX: number;
  initialY: number;
  targetX: number;
  duration: number;
  delay: number;
}

export default function ImmersiveHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [particles, setParticles] = useState<ParticleConfig[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [screenHeight, setScreenHeight] = useState(800);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Generate particle configs only on client side - reduced count for performance
    if (typeof window !== 'undefined') {
      setScreenHeight(window.innerHeight);
      // Reduced particle count from 20 to 10 for better performance
      const particleConfigs: ParticleConfig[] = Array.from({ length: 10 }, () => ({
        initialX: Math.random() * window.innerWidth,
        initialY: window.innerHeight + 100,
        targetX: Math.random() * window.innerWidth,
        duration: Math.random() * 8 + 12, // Slightly longer for smoother movement
        delay: Math.random() * 5,
      }));
      setParticles(particleConfigs);
    }
  }, []);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#0F3A3D' }} // Fallback background color
    >
      {/* Parallax Background Layer - z-0 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.img
          src="/images/parallax.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            y,
            top: 0,
            left: 0,
            width: '100%',
            height: '120%',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.6s ease-in-out',
            willChange: 'transform',
            transform: 'translate3d(0, 0, 0)',
            backfaceVisibility: 'hidden',
            WebkitTransform: 'translate3d(0, 0, 0)',
          }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.warn('Parallax image failed to load:', e);
            setImageLoaded(false);
          }}
        />
        {/* Fallback background gradient (shows when image is loading) */}
        <div
          className="absolute inset-0 w-full h-full bg-gradient-to-b from-gp-bg via-gp-surface to-gp-surface"
          style={{
            opacity: imageLoaded ? 0 : 1,
            transition: 'opacity 0.6s ease-in-out',
            zIndex: 0
          }}
        />

        {/* Dark Overlay - Reduced opacity to show image through (adjust opacity values as needed) */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(15, 58, 61, 0.4), rgba(15, 46, 49, 0.35), rgba(15, 46, 49, 0.4))'
          }}
        />
      </div>

      {/* Animated Overlay Pattern - z-10 */}
      <div className="absolute inset-0 opacity-10" style={{ zIndex: 10 }}>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,0.1)_25%,rgba(201,181,137,0.1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,0.1)_75%,rgba(201,181,137,0.1)_100%)] bg-[length:40px_40px]" />
      </div>

      {/* Floating Particles Effect - z-15 - Optimized for performance */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 15 }}>
          {particles.map((particle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: 'rgba(201, 181, 137, 0.7)',
                boxShadow: '0 0 10px rgba(201, 181, 137, 0.9), 0 0 20px rgba(201, 181, 137, 0.5)',
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
                backfaceVisibility: 'hidden',
              }}
              initial={{
                x: particle.initialX,
                y: particle.initialY,
                opacity: 0,
              }}
              animate={{
                y: -screenHeight - 200,
                x: particle.targetX,
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'linear',
              }}
            />
          ))}
        </div>
      )}

      {/* Content - z-20 - GPU accelerated */}
      <motion.div
        style={{
          opacity,
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
        }}
        className="container mx-auto px-4 lg:px-6 relative z-20 pt-32"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30 mb-8 scale-90 sm:scale-100"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
          >
            <ShieldCheck className="h-4 w-4 text-gp-accent" style={{ color: '#C9B589' }} />
            <span className="text-xs sm:text-sm font-medium" style={{ color: '#ffffff' }}>25+ Years of Excellence</span>
          </motion.div>

          {/* ... (lines 163-237 omitted for brevity) ... */}

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20"
          >
            {[
              { value: '25+', label: 'Years of Legacy' },
              { value: '100+', label: 'Properties Delivered' },
              { value: '600+', label: 'Happy Customers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-display font-bold mb-1" style={{ color: '#C9B589' }}>
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Scroll</span>
          <div className="w-6 h-10 rounded-full flex items-start justify-center p-2" style={{ border: '2px solid rgba(255, 255, 255, 0.6)' }}>
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 rounded-full"
              style={{ backgroundColor: '#ffffff' }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
