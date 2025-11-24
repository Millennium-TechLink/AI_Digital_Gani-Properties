import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button after scrolling down 200px
      // Hide it when scrolled back to top
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Check initial scroll position on mount
    toggleVisibility();

    // Add scroll event listener with passive option for better performance
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    
    // Cleanup: remove event listener on unmount
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    // Smooth scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
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
          className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-gp-accent/50 transition-all duration-300 group cursor-pointer"
          style={{
            position: 'fixed',
            bottom: '2rem',
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
