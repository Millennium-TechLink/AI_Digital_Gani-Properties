import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const lenis = useLenis();

  // useLayoutEffect, not useEffect: an SPA route change doesn't reset the
  // browser's native scroll position on its own - the new page's DOM mounts
  // while the viewport is still scrolled to wherever the previous page left
  // off. useEffect fires *after* the browser has already painted that first
  // frame, so for a moment you'd see the new page's content at the old
  // scroll offset (whatever happened to be at that same pixel position,
  // sometimes still resembling the old page) before it snapped to the top -
  // exactly the "previous page flashes, then the real page appears" jump.
  // useLayoutEffect runs synchronously before paint, so the correction
  // happens before the user ever sees the wrong-position frame.
  useLayoutEffect(() => {
    // Native scrollTo first: this is the one part that's guaranteed
    // synchronous. Lenis maintains its own scroll state independently of
    // the native scroll position - calling window.scrollTo() directly moves
    // the browser's scroll but Lenis doesn't know about it, so on the next
    // frame it can fight the reset back to wherever it still thinks the
    // page is. Following up with Lenis's own scrollTo keeps both in sync;
    // it's the redundant-looking second call, not a replacement for the
    // first.
    window.scrollTo(0, 0);
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, search, lenis]);

  return null;
}
