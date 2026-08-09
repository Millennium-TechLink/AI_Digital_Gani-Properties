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
    // took 300px of scroll to show up, which read as sluggish).
    //
    // The 40ms timer below is a *bounded* debounce, not a "wait until
    // scrolling goes quiet" one - that distinction matters a lot here.
    // Lenis fires a scroll event on essentially every animation frame while
    // it's easing toward a target, which continues for a while after the
    // user's actual input stops. The previous version cleared and
    // rescheduled its setTimeout on every one of those events for as long
    // as `next` still differed from the (not-yet-committed) ref - which,
    // during continuous scrolling, is the whole time. That meant the
    // timer never actually fired until scrolling had gone fully quiet,
    // not 40ms after crossing the threshold - the button visibly lagged
    // behind where the user actually was on the page. Scheduling once
    // per pending decision and re-reading the live scroll position only
    // when that single timer fires bounds the reaction time to a flat
    // 40ms regardless of how long the scroll gesture continues.
    const liveScrollY = () => (lenis ? lenis.scroll : window.scrollY);

    const decide = (scrollY: number) => (scrollY > 200 ? true : scrollY < 100 ? false : isVisibleRef.current);

    const evaluate = (scrollY: number) => {
      const next = decide(scrollY);
      if (next === isVisibleRef.current) return;
      if (debounceRef.current) return; // a decision is already scheduled; it'll pick up the latest position when it fires

      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        const finalNext = decide(liveScrollY());
        if (finalNext !== isVisibleRef.current) {
          isVisibleRef.current = finalNext;
          setIsVisible(finalNext);
        }
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
    // 0.8s, not the previous 1.2s - a "back to top" click is a utility
    // action people expect to respond immediately, not a cinematic scroll.
    // Still eased (not an instant jump) so it doesn't feel abrupt, just
    // meaningfully snappier than before.
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.8, easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
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
          // Stacked above the Chatbot toggle (fixed bottom-4/bottom-6 right-4/right-6,
          // 48px on mobile / 64px from sm:) so the two floating buttons never overlap -
          // Chatbot renders at a higher z-index and was sitting on top of / intercepting
          // clicks on this button otherwise. Sized down on mobile, along with the
          // Chatbot toggle, so together they cover less of the page content while scrolling.
          // transition-shadow, not transition-all: initial/animate/exit/
          // whileHover/whileTap above already control opacity/scale/y via
          // Framer Motion's own engine. A CSS transition-all on the same
          // element also tries to transition those same properties on every
          // change, so two independent animation systems fight over them -
          // the classic cause of stutter/flicker on Framer Motion elements
          // (see SmoothScroll.tsx's autoRaf fix for the scroll-engine half
          // of this same class of bug). Scoping to just the one CSS-only
          // property (the hover shadow color) removes the conflict.
          className="fixed bottom-20 right-4 sm:bottom-28 sm:right-8 z-50 w-11 h-11 sm:w-14 sm:h-14 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-gp-accent/50 transition-shadow duration-300 group cursor-pointer"
          aria-label="Back to top"
        >
          {/* Static glow, not a looping pulse: the previous version
              animated opacity/scale on this (blur-xl, so a genuinely
              expensive GPU-composited layer) plus a separate infinite
              bounce on the arrow below, both running continuously the
              entire time the button is visible - which is exactly while
              the user is scrolling, the one moment frame budget actually
              matters. Neither loop added information; whileHover/whileTap
              on the button already give it feedback when it's actually
              interacted with. */}
          <div className="absolute inset-0 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full opacity-60 blur-xl" />
          <ArrowUp className="relative z-10 h-5 w-5 sm:h-6 sm:w-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
