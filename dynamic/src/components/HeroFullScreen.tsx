import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const INTERVAL = 5000;

const sections = [
  {
    id: 'premium-plots',
    tag: 'Residential',
    title: 'PREMIUM PLOTS',
    sub: 'Bengaluru North · Est. 2009',
    background: 'https://images.pexels.com/photos/440731/pexels-photo-440731.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  },
  {
    id: 'fertile-farmlands',
    tag: 'Agricultural',
    title: 'FERTILE FARMLANDS',
    sub: 'Chikkaballapur · Organic Growth',
    background: 'https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  },
  {
    id: 'strategic-location',
    tag: 'Commercial',
    title: 'PRIME LOCATION',
    sub: 'Yelahanka Hub · High Returns',
    background: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
  },
  {
    id: 'future-legacy',
    tag: 'Legacy',
    title: 'BUILD YOUR LEGACY',
    sub: 'Trusted Partner · Since 2009',
    background: 'https://images.pexels.com/photos/157811/pexels-photo-157811.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop',
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
  }, [current]);

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
          {/* Ken Burns subtle zoom */}
          <motion.img
            src={section.background}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 7, ease: 'easeOut' }}
          />
          {/* Vignette + dark gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.55) 100%)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70" />
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
          <div className="h-px w-10 bg-[#DD2B1C]/80" />
          <motion.span
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-white font-black uppercase tracking-[0.4em]"
            style={{ fontSize: 'clamp(0.75rem, 1.2vw, 1rem)', letterSpacing: '0.4em' }}
          >
            GANI PROPERTIES
          </motion.span>
          <div className="h-px w-10 bg-[#DD2B1C]/80" />
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex items-center gap-1.5"
        >
          <MapPin className="h-2.5 w-2.5 text-[#DD2B1C]" />
          <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/50">
            Trusted Excellence in Real Estate
          </span>
        </motion.div>
      </div>

      {/* ── Center content ── */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-16 gap-4">

        {/* Category pill */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`tag-${current}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="inline-flex items-center gap-2 px-3 py-1 border border-white/20 bg-white/5 backdrop-blur-sm"
          >
            <span className="w-1 h-1 rounded-full bg-[#DD2B1C]" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/70">
              {section.tag}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Main title — word-masked stagger */}
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

        {/* Sub-label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${current}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.3em] text-white/45 font-semibold"
          >
            {section.sub}
          </motion.p>
        </AnimatePresence>

        {/* Thin divider line */}
        <motion.div
          className="w-12 h-px bg-[#DD2B1C]/60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        />

        {/* CTA Buttons */}
        <motion.div
          className="flex gap-4 mt-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Link
            to="/properties"
            className="px-7 py-2.5 bg-[#DD2B1C] text-white text-[9px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-all duration-300 hover:scale-105"
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
                  className="absolute inset-y-0 left-0 bg-[#DD2B1C]"
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
