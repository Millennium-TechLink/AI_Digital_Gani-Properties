import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ReactNode, useLayoutEffect } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const lenis = useLenis();

  // Scroll-to-top lives here, not in a standalone component listening to
  // useLocation() from outside <Suspense> (that was ScrollToTop.tsx, now
  // removed) - this component sits *inside* the Suspense boundary that
  // wraps <Routes>, so unlike resetting from outside it, this can only
  // ever fire once the real content for this route has actually
  // committed. Confirmed via a deliberate repro (delayed a lazy page's
  // chunk and navigated before it was prefetched): resetting from outside
  // Suspense fired the instant the URL changed, while the *old* page's
  // content was still what was mounted (the target chunk hadn't loaded
  // yet) - visible as the old page's top-of-page content sitting at
  // scroll 0 for however long the chunk took, before the real new page
  // finally swapped in. Keyed on pathname+search rather than an empty
  // array so it still fires for in-place param changes on an already-
  // mounted route too (e.g. /property/a -> /property/b never unmounts
  // this component, since React Router matches the same <Route>).
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [location.pathname, location.search, lenis]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94], // Buttery smooth easing
        }}
        className="relative"
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

