import { useState, useEffect, useRef } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const isVisibleRef = useRef(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    // Hysteresis (show above 200px, hide below 100px, hold steady in between)
    // stops a single scroll gesture right at one threshold from flickering
    // the button. The gap is kept small on purpose - a wide gap stops
    // flicker too, but also delays the button noticeably (it previously
    // took 300px of scroll to show up, which read as sluggish). A short
    // 40ms debounce smooths over Lenis's momentum without being felt as lag.
    const evaluate = (scrollY: number) => {
      let next = isVisibleRef.current;
      if (scrollY > 200) next = true;
      else if (scrollY < 100) next = false;

      if (next === isVisibleRef.current) {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
        return;
      }

      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        isVisibleRef.current = next;
        setIsVisible(next);
        debounceRef.current = null;
      }, 40);
    };

    const handleNativeScroll = () => evaluate(window.scrollY);
    const handleLenisScroll = (e: { scroll: number }) => evaluate(e.scroll);

    // Check initial scroll position on mount
    evaluate(window.scrollY);

    // Lenis's own scroll event is a single consistent source of truth tied
    // directly to its animation frames - prefer it over the native scroll
    // event, which can report noisier intermediate values during momentum.
    if (lenis) {
      lenis.on('scroll', handleLenisScroll);
    } else {
      window.addEventListener('scroll', handleNativeScroll, { passive: true });
    }

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (lenis) {
        lenis.off('scroll', handleLenisScroll);
      } else {
        window.removeEventListener('scroll', handleNativeScroll);
      }
    };
  }, [lenis]);

  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.1, y: -5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            duration: 0.3,
            ease: [0.16, 1, 0.3, 1]
          }}
          onClick={scrollToTop}
          // Stacked above the Chatbot toggle (fixed bottom-6 right-6, 64px) so the
          // two floating buttons never overlap - Chatbot renders at a higher z-index
          // and was sitting on top of / intercepting clicks on this button otherwise.
          className="fixed bottom-28 right-8 z-50 w-14 h-14 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-gp-accent/50 transition-all duration-300 group cursor-pointer"
          style={{
            position: 'fixed',
            bottom: '7rem',
            right: '2rem',
          }}
          aria-label="Back to top"
        >
          {/* Animated Glow effect */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full opacity-60 blur-xl"
            animate={{
              opacity: [0.6, 0.8, 0.6],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Arrow icon with subtle bounce animation */}
          <motion.div
            animate={{
              y: [0, -2, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowUp className="relative z-10 h-6 w-6 group-hover:-translate-y-1 transition-transform duration-300" />
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
