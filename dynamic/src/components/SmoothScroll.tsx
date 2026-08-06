import { ReactLenis, useLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    // Connect Lenis to ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // When a tab is backgrounded (switching to another app/window), browsers
    // throttle or fully pause requestAnimationFrame - which GSAP's ticker is
    // built on. gsap.ticker.time keeps counting real elapsed wall-clock time
    // regardless, so the very next tick after the tab becomes visible again
    // reports a huge jump (however long it was hidden for). Lenis computes
    // its own internal delta from that jump and feeds it straight into its
    // scroll physics as if one enormous frame had elapsed, which is exactly
    // what corrupts its smoothing state until a refresh resets everything.
    // Resyncing Lenis's clock to "now" the instant the tab regains focus -
    // before the next ticker call can hand it that stale delta - avoids it.
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        lenis.raf(performance.now());
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [lenis]);

  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
