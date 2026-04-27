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
      style={{ backgroundColor: '#1A1A1A' }} // Fallback background color
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

        {/* Dark Overlay - Reduced opacity to show image through */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(26, 26, 26, 0.4), rgba(26, 26, 26, 0.35), rgba(26, 26, 26, 0.4))'
          }}
        />
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
                backgroundColor: 'rgba(221, 43, 28, 0.7)',
                boxShadow: '0 0 10px rgba(221, 43, 28, 0.9), 0 0 20px rgba(221, 43, 28, 0.5)',
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
            <MapPin className="h-4 w-4 text-gp-accent" style={{ color: '#DD2B1C' }} />
            <span className="text-xs sm:text-sm font-medium" style={{ color: '#ffffff' }}>Trusted in Bengaluru Since 2009</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-[1.1]"
            style={{
              color: '#ffffff',
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            Where Dreams
            <br />
            <span className="bg-gradient-to-r from-gp-accent to-gp-gold bg-clip-text" style={{ WebkitTextFillColor: 'transparent', backgroundImage: 'linear-gradient(to right, #DD2B1C, #b91c1c)' }}>
              Take Root
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            style={{ color: 'rgba(255, 255, 255, 0.95)' }}
          >
            Your journey to layout ownership begins here. Premium plots, fertile farmland,
            and agricultural lands that become the foundation of your legacy.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              asChild
              variant="default"
              size="lg"
              className="text-lg px-8 py-6 h-auto shadow-2xl hover:scale-105 transition-transform"
            >
              <Link to="/properties">
                Explore Properties
                <ArrowDown className="ml-2 h-5 w-5" />
              </Link>
            </Button>

            {/* Enhanced Schedule Visit Button Container */}
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              {/* Glowing background effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-gp-accent via-gp-gold to-gp-accent rounded-2xl opacity-60 blur-xl group-hover:opacity-80 transition-opacity duration-300 animate-pulse" />

              {/* Button container with gradient border */}
              <div className="relative bg-gradient-to-br from-gp-accent/20 via-gp-gold/20 to-gp-accent/20 backdrop-blur-md border-2 border-white/30 rounded-2xl p-[2px] group-hover:border-gp-accent transition-all duration-300">
                <Button
                  asChild
                  size="lg"
                  className="relative text-lg px-8 py-6 h-auto bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md text-white border-0 w-full hover:from-white/20 hover:to-white/10 transition-all duration-300 shadow-lg"
                >
                  <a href="https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit" target="_blank" rel="noopener noreferrer">
                    <Phone className="h-5 w-5 mr-2" />
                    Schedule Visit
                  </a>
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 border-t border-white/20"
          >
            {[
              { value: '25+', label: 'Years' },
              { value: '100+', label: 'Properties' },
              { value: '600+', label: 'Happy Families' },
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
