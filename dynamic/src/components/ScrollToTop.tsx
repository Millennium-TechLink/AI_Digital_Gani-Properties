import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLenis } from 'lenis/react';

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    // Lenis maintains its own scroll state independently of the native
    // scroll position - calling window.scrollTo() directly moves the
    // browser's scroll but Lenis doesn't know about it, so on the next
    // frame it can fight the reset back to wherever it still thinks the
    // page is (the "doesn't actually start at the top" symptom), or cause
    // a visible jump reconciling the mismatch (the "flickers on route
    // change" symptom). Going through Lenis's own scrollTo keeps both in
    // sync. Falls back to native scrollTo for the brief window before
    // Lenis has initialized.
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, search, lenis]);

  return null;
}
