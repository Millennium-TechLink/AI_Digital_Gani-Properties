import { useEffect } from 'react';
import { useLenis } from 'lenis/react';

/**
 * Locks page scroll while `locked` is true - for modals, mobile menus, or any
 * full-screen overlay that shouldn't let the page behind it scroll.
 *
 * Two things are needed together, and neither is enough on its own here:
 *
 * 1. lenis.stop() - Lenis drives scrolling itself (intercepting wheel/touch
 *    and animating scroll position via rAF), independently of native CSS.
 *    Without this it keeps processing input and moving the page underneath
 *    regardless of what overflow is set to.
 *
 * 2. Pinning body to position:fixed at the current scroll offset - plain
 *    `overflow: hidden` (even on both <html> and <body>, which is what
 *    <ReactLenis root> actually uses as its scroll container) turns out to
 *    still let some wheel/programmatic scroll paths through in testing.
 *    Fixing the body's position removes it from the scrollable flow
 *    entirely, which is the same technique libraries like body-scroll-lock
 *    use specifically because plain overflow-hidden has cross-browser gaps.
 */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;

    const scrollY = window.scrollY;
    lenis?.stop();

    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      body.style.overflow = previous.overflow;
      window.scrollTo(0, scrollY);
      lenis?.start();
    };
  }, [locked, lenis]);
}
