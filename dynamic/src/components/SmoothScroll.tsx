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

    // gsap.ticker.add still buys us frame-order coordination with
    // ScrollTrigger (Lenis updates before GSAP reads the new scroll
    // position, same tick) - but the callback's own `time` argument is
    // deliberately ignored here. That argument is GSAP's own cumulative
    // ticker clock, a *different* time base than the performance.now()
    // used below to resync after a backgrounded tab. Feeding Lenis one
    // clock on every regular tick and a different one only on resync
    // means every tick is computing its delta against a slightly-off
    // reference - individually invisible, but it compounds over a
    // session and spikes right after any tab-switch pause, which reads
    // exactly as "gets laggier over time, worse after switching back".
    // performance.now() is the real wall clock Lenis's own raf() docs
    // expect either way, so there's no reason to route through GSAP's
    // derived value at all.
    const update = () => {
      lenis.raf(performance.now());
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // No separate visibilitychange resync needed anymore: since every tick
    // above already feeds Lenis performance.now() rather than GSAP's own
    // cumulative clock, the very first tick after a backgrounded tab
    // regains focus is already correct on its own - there's no stale delta
    // left for a resync to fix.

    return () => {
      lenis.off('scroll', ScrollTrigger.update);
      gsap.ticker.remove(update);
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
