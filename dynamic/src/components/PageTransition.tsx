import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';
import { ReactNode, useRef } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const lenis = useLenis();
  // onExitComplete's closure is created once and doesn't refresh on every
  // re-render, so it can't just close over `lenis` directly - a ref is
  // what lets it always read the current instance when it actually fires.
  const lenisRef = useRef(lenis);
  lenisRef.current = lenis;

  return (
    // mode="wait" + this component persisting across route changes
    // (confirmed empirically - React Router reuses this same
    // PageTransition instance rather than remounting it fresh per route,
    // since it's the same component type at the same tree position every
    // time) means the *previous* page's exit animation genuinely plays out
    // in full before the next page enters - this is not a no-op. A
    // scroll-to-top that fires the instant the URL changes (this used to
    // be a useLayoutEffect keyed on location) resets scroll while that
    // exit animation is still showing the *old* page, so for the whole
    // ~0.5s of the fade-out you'd see the old page sitting at scroll 0 -
    // its top-of-page content revealed - before the real new page swapped
    // in. Confirmed via frame-by-frame sampling: Home's own heading
    // stayed on screen at scroll 0 under the /about URL for ~540ms,
    // matching this transition's exact duration.
    // onExitComplete fires once that fade-out has actually finished, right
    // as the incoming page is about to render - resetting scroll there
    // instead means the old page never visibly sits at the wrong scroll
    // position; by the time anything is visible at scroll 0, it's already
    // the new page.
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        window.scrollTo(0, 0);
        lenisRef.current?.scrollTo(0, { immediate: true });
      }}
    >
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

