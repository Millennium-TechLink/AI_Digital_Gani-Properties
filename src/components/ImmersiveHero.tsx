import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone, ArrowDown, MapPin } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

export default function ImmersiveHero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white"
    >
      {/* Parallax Background Layer - z-0 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <motion.img
          src="/images/construction_workers_shade.png"
          alt="Construction Site"
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
          }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.warn('Parallax image failed to load:', e);
            setImageLoaded(false);
          }}
        />
        {/* Fallback background gradient (shows when image is loading) */}
        <div
          className="absolute inset-0 w-full h-full bg-white"
          style={{
            opacity: imageLoaded ? 0 : 1,
            transition: 'opacity 0.6s ease-in-out',
            zIndex: 0
          }}
        />

        {/* Light Overlay - Ensuring high contrast for text */}
        <div
          className="absolute inset-0 z-10 bg-gradient-to-b from-white/60 via-white/40 to-white/60"
        />
        
      </div>

      {/* Content - z-20 */}
      <motion.div
        style={{
          opacity,
          willChange: 'opacity',
          transform: 'translate3d(0, 0, 0)',
        }}
        className="container mx-auto px-4 lg:px-6 relative z-20"
      >
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gp-red/10 backdrop-blur-md rounded-none border-l-4 border-gp-red mb-8"
          >
            <MapPin className="h-4 w-4 text-gp-red" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gp-ink">Trusted in Bengaluru Since 2009</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-black mb-6 leading-[0.9] text-gp-ink uppercase tracking-tighter"
          >
            WHERE DREAMS
            <br />
            <span className="text-gp-red">TAKE ROOT</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-xl md:text-2xl lg:text-3xl mb-12 max-w-3xl mx-auto leading-relaxed font-medium text-gp-ink/70"
          >
            Your journey to land ownership begins here. Premium plots, fertile farmland,
            and agricultural lands engineered for your legacy.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-gp-red hover:bg-red-700 text-white px-10 py-8 rounded-none group shadow-lg hover:shadow-red-600/20 text-xs font-black tracking-[0.2em] uppercase"
            >
              <Link to="/properties">
                Explore Properties
                <ArrowDown className="ml-3 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gp-ink text-gp-ink hover:bg-gp-light-grey px-10 py-8 rounded-none group transition-all text-xs font-black tracking-[0.2em] uppercase"
            >
              <a href="https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit" target="_blank" rel="noopener noreferrer">
                <Phone className="h-5 w-5 mr-3" />
                Schedule Visit
              </a>
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-12 border-t border-gp-ink/10"
          >
            {[
              { value: '15+', label: 'Years' },
              { value: '100+', label: 'Projects' },
              { value: '1000+', label: 'Customers' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl font-display font-black mb-1 text-gp-red">
                  {stat.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gp-ink/40">{stat.label}</div>
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
