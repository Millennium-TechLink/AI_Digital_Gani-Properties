import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const INTERVAL = 5000;

// Same four Pexels photos as before, just self-hosted now instead of
// hotlinked - fetched from the exact original images.pexels.com URLs
// (same width/quality params, byte-for-byte the same images) and saved
// into public/images/. Pexels' CDN sits behind Cloudflare bot management,
// which was setting third-party cookies on every hero load and tripping
// Lighthouse's third-party-cookies/inspector-issues checks; serving these
// same-origin removes that without changing which photos are shown.
const sections = [
  {
    id: 'premium-plots',
    tag: 'Residential',
    title: 'PREMIUM PLOTS',
    sub: 'Bengaluru North · Est. 2009',
    background: '/images/hero-premium-plots.jpg',
  },
  {
    id: 'fertile-farmlands',
    tag: 'Agricultural',
    title: 'FERTILE FARMLANDS',
    sub: 'Chikkaballapur · Organic Growth',
    background: '/images/hero-fertile-farmlands.jpg',
  },
  {
    id: 'strategic-location',
    tag: 'Commercial',
    title: 'PRIME LOCATION',
    sub: 'Yelahanka Hub · High Returns',
    background: '/images/hero-strategic-location.jpg',
  },
  {
    id: 'future-legacy',
    tag: 'Legacy',
    title: 'BUILD YOUR LEGACY',
    sub: 'Trusted Partner · Since 2009',
    background: '/images/hero-future-legacy.jpg',
  },
];

// Word-split for staggered letter animation
function SplitTitle({ text, direction }: { text: string; direction: number }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden leading-none">
          <motion.span
            className="inline-block"
            initial={{ y: direction > 0 ? '110%' : '-110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: direction > 0 ? '-110%' : '110%', opacity: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: wi * 0.08 }}
          >
            {word}
          </motion.span>
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </>
  );
}

export default function HeroFullScreen() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [direction, setDirection] = useState(1);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  // Mirrors Navbar's body.mobile-menu-open class (already the hook the
  // Chatbot widget uses to hide itself while the mobile menu's full-screen
  // panel is open). A MutationObserver, not a prop, because this component
  // and Navbar aren't parent/child - same decoupling reason as the
  // Chatbot's. This slideshow auto-advancing behind an opaque panel the
  // user can't see is pointless on its own, but it's also actively
  // unhelpful: if the 5s auto-advance happens to land in the same instant
  // as someone opening the menu, the crossfade and the menu's own open
  // animation compete for attention and the whole thing reads as busier/
  // glitchier than either actually is.
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(document.body.classList.contains('mobile-menu-open'));
    const observer = new MutationObserver(() => {
      setMenuOpen(document.body.classList.contains('mobile-menu-open'));
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback((idx: number, dir = 1) => {
    setDirection(dir);
    setCurrent(idx);
    setProgress(0);
    startTimeRef.current = Date.now();
  }, []);

  const next = useCallback(() => goTo((current + 1) % sections.length, 1), [current, goTo]);
  const prev = useCallback(() => goTo((current - 1 + sections.length) % sections.length, -1), [current, goTo]);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    // Paused, not just stopped: intentionally leaves current/progress
    // exactly where they were rather than resetting - resuming should
    // continue from the same slide, not jump. (Restarting a fresh 5s
    // window on resume rather than accounting for elapsed pause time is a
    // deliberate simplification - nobody's watching a paused slideshow's
    // countdown behind an opaque menu panel closely enough to notice.)
    if (menuOpen) return;

    startTimeRef.current = Date.now();

    progressRef.current = setInterval(() => {
      setProgress(Math.min(((Date.now() - startTimeRef.current) / INTERVAL) * 100, 100));
    }, 30);

    intervalRef.current = setInterval(() => {
      setCurrent((p) => (p + 1) % sections.length);
      setDirection(1);
      setProgress(0);
      startTimeRef.current = Date.now();
    }, INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [current, menuOpen]);

  const section = sections[current];

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">

      {/* ── Background: crossfade with cinematic overlay ── */}
      <AnimatePresence initial={false} mode="sync">
        <motion.div
          key={section.id}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          {/* Ken Burns subtle zoom.
              fetchPriority is only "high" on the very first slide - that's
              the actual LCP candidate (it's the only one in the DOM before
              any user interaction or the 5s auto-advance), and it matches
              the <link rel="preload"> for the same file in index.html.
              Marking every later slide "high" too would just have them
              compete with each other and with in-flight API calls for no
              benefit, since none of them block first paint. */}
          <motion.img
            src={section.background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            {...({ fetchpriority: section.id === sections[0].id ? 'high' : 'auto' } as Record<string, string>)}
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 7, ease: 'easeOut' }}
          />
          {/* Vignette + dark gradient.
              Both were lightest exactly where the readability complaints
              were: the radial vignette went from 10% black at dead-center
              up to 55% only toward the edges, and the linear gradient's
              middle stop was fully transparent - but the tag pill, title,
              and sub-label all sit in that same center band. Against a
              busy/bright frame (the Yelahanka skyline slide especially)
              there wasn't enough darkening there to guarantee contrast
              regardless of what the photo underneath happens to look like.
              Raised both floors so the center always has a baseline of
              darkening no matter which of the 4 slides is showing; text
              opacity/shadow on the actual copy below is the second layer
              of defense on top of this. */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.6) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/25 to-black/70" />
          {/* Top-left corner darkener so the logo is always readable */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse 40% 35% at 0% 0%, rgba(0,0,0,0.65) 0%, transparent 100%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ── GANI PROPERTIES header ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex flex-col items-center pt-[calc(2vh+82px)]">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-px w-10 bg-gp-accent/80" />
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white font-black uppercase tracking-[0.4em]"
            style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', letterSpacing: '0.4em' }}
          >
            GANI PROPERTIES
          </motion.span>
          <div className="h-px w-10 bg-gp-accent/80" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-1.5"
        >
          <MapPin className="h-2.5 w-2.5 text-gp-accent drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]" />
          {/* Was text-white/50 with no shadow - fine against the darkest
              parts of a frame, but this sits over 4 different rotating
              photos and some (the Yelahanka skyline slide especially) are
              bright enough behind this exact spot that 50%-opacity text
              nearly disappeared. Raised opacity and added a shadow so
              legibility doesn't depend on which slide happens to be
              showing - same treatment applied to the sub-label and tag
              below. */}
          <span
            className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/85"
            style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
          >
            Trusted Excellence in Real Estate
          </span>
        </motion.div>
      </div>

      {/* ── Center content ──
          pointer-events-none: this div spans the full hero (inset-0) at a
          higher z-index than the prev/next edge-zone buttons below, so
          without this it silently intercepted every click across the
          entire slide, including over those buttons - they were rendered
          but never actually clickable. pointer-events-auto is restored
          just on the CTA buttons, the only real interactive children here. */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-16 gap-4 pointer-events-none">

        {/* Category pill */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={`tag-${current}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm"
            >
              <span className="w-1 h-1 rounded-full bg-gp-accent" />
              <span
                className="text-[9px] font-black uppercase tracking-[0.3em] text-white/90"
                style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
              >
                {section.tag}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Main title — word-masked stagger */}
        <div className="h-[120px] md:h-[180px] flex items-center justify-center">
          <div
            className="text-white font-black uppercase text-center"
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 5.5rem)',
              letterSpacing: '-0.02em',
              fontFamily: '"Rubik Wide", system-ui, sans-serif',
              lineHeight: 0.9,
              maxWidth: '700px',
            }}
          >
            <AnimatePresence mode="wait" initial={false}>
              <div key={`title-${current}`} className="inline">
                <SplitTitle text={section.title} direction={direction} />
              </div>
            </AnimatePresence>
          </div>
        </div>

        {/* Sub-label */}
        <div className="h-6 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.3em] text-white/85 font-semibold"
              style={{ textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
            >
              {section.sub}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Thin divider line */}
        <div className="h-4 flex items-center justify-center">
          <motion.div
            className="w-12 h-px bg-gp-accent/60"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          />
        </div>

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 mt-1 pointer-events-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/properties"
            className="px-7 py-2.5 bg-gp-accent text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-all duration-300 hover:scale-105"
          >
            Explore Properties
          </Link>
          <Link
            to="/contact"
            className="px-7 py-2.5 border border-white/25 text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
          >
            Contact Us
          </Link>
        </motion.div>
      </div>

      {/* ── Slide progress indicators (bottom center) ── */}
      <div className="absolute bottom-8 left-0 right-0 z-20 flex flex-col items-center gap-3">
        {/* Per-slide bars */}
        <div className="flex items-center gap-2">
          {sections.map((s, i) => (
            <button
              key={s.id}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Slide ${i + 1}`}
              className="relative h-[2px] bg-white/15 overflow-hidden cursor-pointer transition-all duration-500"
              style={{ width: i === current ? 56 : 20 }}
            >
              {i === current && (
                <div
                  className="absolute inset-y-0 left-0 bg-gp-accent"
                  style={{ width: `${progress}%` }}
                />
              )}
              {i < current && <div className="absolute inset-0 bg-white/50" />}
            </button>
          ))}
          <span className="ml-3 text-[9px] font-black tracking-[0.2em] text-white/40">
            <span className="text-white/75">{String(current + 1).padStart(2, '0')}</span>
            {' / '}
            {String(sections.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* ── Subtle prev/next edge zones (invisible click areas) ── */}
      <button onClick={prev} className="absolute left-0 top-0 w-1/6 h-full z-10 cursor-w-resize" aria-label="Previous" />
      <button onClick={next} className="absolute right-0 top-0 w-1/6 h-full z-10 cursor-e-resize" aria-label="Next" />
    </section>
  );
}
