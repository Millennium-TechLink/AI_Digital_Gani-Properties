import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useId, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getActiveCategoryFromPath, getCategoryFromPropertyType } from '@/lib/route';
import { getSubcategories } from '@/config/categories';
import { PropertyType } from '@/types/property';
import Image from '@/components/Image';
import { useScrollLock } from '@/lib/useScrollLock';

// Mobile menu photo grid - a spread of property categories, matching the
// same hero images already used elsewhere on the site (no new assets).
const MENU_GRID_IMAGES = [
  { src: '/images/hero-residential.png', alt: 'Residential properties' },
  { src: '/images/hero-commercial.png', alt: 'Commercial properties' },
  { src: '/images/hero-agricultural.png', alt: 'Agricultural land' },
  { src: '/images/hero-premium-plots.jpg', alt: 'Premium plots' },
];

// Same accounts/handles as the footer - kept in one place would be better,
// but duplicating here avoids coupling the mobile menu to Footer's internals.
const SOCIAL_LINKS = [
  { href: 'https://www.facebook.com', icon: Facebook, label: 'Facebook' },
  { href: 'https://www.instagram.com', icon: Instagram, label: 'Instagram' },
  { href: 'https://x.com', icon: null, label: 'X (formerly Twitter)' },
  { href: 'https://www.linkedin.com', icon: Linkedin, label: 'LinkedIn' },
];

// Stagger info passed via each item's `custom` prop.
type StaggerInfo = { index: number; total: number };

// Deliberately asymmetric enter/exit: opening plays a slow top-to-bottom
// reveal (each link arriving a beat after the last) to feel considered -
// but mirroring that exact pacing on the way out reads as sluggish, since
// closing is a response to a click and wants to feel immediate. So the
// exit is quicker, with a lighter reverse stagger (bottom-to-last item
// leaves first) that finishes well inside the panel's own ~0.5s clip-path
// retraction (see the panel's own exit transition below) - content is gone
// before the box has visibly closed, rather than being visibly caught by
// the retracting edge.
// Delay multiplier is deliberately smaller than it might look (0.04, not
// something like Lando's own spacing) - there are 7 links here, not 4, so
// the same per-item gap that reads as considered on a short list drags the
// last item's arrival out past 900ms on this one. 0.12 + index*0.04 keeps
// the whole cascade landing under ~0.75s even for "Contact" (index 6).
const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: '120%', rotateX: 30 },
  visible: ({ index }: StaggerInfo) => ({
    opacity: 1,
    y: '0%',
    rotateX: 0,
    transition: {
      duration: 0.55,
      delay: 0.25 + index * 0.05,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  exit: ({ index, total }: StaggerInfo) => ({
    opacity: 0,
    y: '120%',
    rotateX: 30,
    transition: {
      duration: 0.3,
      delay: (total - 1 - index) * 0.03,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  }),
};

const staggerImageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.82, y: 30 },
  visible: ({ index }: StaggerInfo) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.22 + index * 0.06,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
  exit: ({ index, total }: StaggerInfo) => ({
    opacity: 0,
    scale: 0.82,
    y: 30,
    transition: {
      duration: 0.3,
      delay: (total - 1 - index) * 0.03,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  }),
};

const socialVariants: Variants = {
  hidden: { opacity: 0, scale: 0.3, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: 0.65 + index * 0.05,
      ease: [0.34, 1.56, 0.64, 1] as const,
    },
  }),
  exit: (index: number) => ({
    opacity: 0,
    scale: 0.2,
    y: 15,
    transition: {
      duration: 0.25,
      delay: (SOCIAL_LINKS.length - 1 - index) * 0.03,
      ease: [0.32, 0, 0.67, 0] as const,
    },
  }),
};

export default function Navbar() {
  // Unique per-mount id for the background pattern's <svg><defs> - avoids
  // colliding with any other pattern id on the page if this ever renders
  // more than once (e.g. React strict-mode double-invoke in dev).
  // useId()'s raw output contains colons, which url(#...) fragment
  // references don't reliably handle across browsers - stripped here.
  const topoPatternId = useId().replace(/:/g, '');
  const [isOpen, setIsOpen] = useState(false);
  // Separate from `isOpen`: `isOpen` flipping to false immediately tells
  // AnimatePresence to start the ~0.3s collapse animation below, but the
  // page shouldn't actually unlock (un-fix the body, restart Lenis, jump
  // scroll back) until that animation has actually finished playing out -
  // doing both in the same commit un-freezes the page mid-collapse and the
  // scroll-position snap collides visually with the still-animating panel,
  // which is what reads as a jerky, un-fluid close. This is ONLY about the
  // scroll lock/Lenis now (see closeMenuForNavigation below for why it's
  // sometimes cleared early, on purpose) - it used to also gate the
  // header's dark styling, which was the bug: navigating via a nav link
  // clears this immediately (has to, for Lenis), so the header would snap
  // out of dark mode while the panel was still visibly closing behind it -
  // inconsistent with the X button, which doesn't clear this until the
  // panel's exit animation actually finishes. panelVisible below is what
  // the header now watches instead, precisely because it does NOT have
  // that early-clear exception - it stays true through both close paths.
  const [scrollLocked, setScrollLocked] = useState(false);
  // Tracks "is the panel mounted or still animating its exit" - kept
  // separate from scrollLocked (see the comment above) so the header's
  // dark styling holds until the panel has ACTUALLY finished closing
  // regardless of which of the two close paths triggered it, while
  // scrollLocked can still unlock earlier when navigation needs it to.
  const [panelVisible, setPanelVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Drives the full-screen mobile panel's height. Framer Motion can only
  // smoothly tween a plain number (implicitly px) or 'auto' - a
  // 'calc(100vh - 5rem)' string can't be interpolated frame-by-frame, so the
  // actual pixel target is computed here instead and kept in sync with the
  // viewport on resize/orientation change.
  const [viewportHeight, setViewportHeight] = useState(
    () => (typeof window !== 'undefined' ? window.innerHeight : 800)
  );
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const isHomePage = pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get active category from pathname or query params
  let activeCategory = getActiveCategoryFromPath(pathname);
  
  // If on /properties page, check query params for type
  if (!activeCategory && pathname === '/properties') {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      activeCategory = getCategoryFromPropertyType(typeParam as PropertyType);
    }
  }
  
  const subcategories = activeCategory ? getSubcategories(activeCategory) : [];

  useEffect(() => {
    const handleScroll = () => {
      // On homepage: transparent at top, white after scrolling
      if (isHomePage) {
        setScrolled(window.scrollY > 50);
      } else {
        setScrolled(true); // Always show background on other pages
      }
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  useEffect(() => {
    const handleResize = () => setViewportHeight(window.innerHeight);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Lock scroll when mobile menu is open (see scrollLocked comment above for
  // why this tracks scrollLocked rather than isOpen directly)
  useScrollLock(scrollLocked);

  // The Chatbot widget (fixed bottom-right, z-[9999]) is a global sibling
  // of this component, not a child, so there's no prop to pass it - a body
  // class is the simplest way to reach it without wiring up shared state
  // across App.tsx. See the body.mobile-menu-open rule in index.css.
  // panelVisible, not scrollLocked - see its declaration for why.
  useEffect(() => {
    document.body.classList.toggle('mobile-menu-open', panelVisible);
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [panelVisible]);

  const openMenu = () => {
    setIsOpen(true);
    setScrollLocked(true);
    setPanelVisible(true);
  };

  const closeMenu = () => {
    setIsOpen(false);
    // scrollLocked and panelVisible are both intentionally left true here -
    // the AnimatePresence below clears both via onExitComplete once the
    // panel has actually finished collapsing.
  };

  // Used by the nav links specifically, not the X button. A plain
  // closeMenu() here would leave scrollLocked (and therefore Lenis) frozen
  // for the ~300ms it takes the panel to collapse - but PageTransition's
  // route-change scroll reset fires as soon as the new page actually
  // mounts, which can be well within that window. Calling lenis.scrollTo()
  // while Lenis is still stopped is a no-op, so that reset-to-top silently
  // did nothing, and by the time onExitComplete finally unlocked scroll,
  // useScrollLock's own cleanup restored the *old* page's pre-open scroll
  // offset instead - the new page loaded already scrolled down. Unlocking
  // immediately here means Lenis is already running again by the time
  // PageTransition's reset fires, so it actually takes effect. The panel
  // still visually collapses over the new page exactly as before - only
  // the scroll lock timing changes.
  //
  // panelVisible is deliberately NOT cleared here, unlike scrollLocked -
  // it stays true until onExitComplete, same as the X button path, so the
  // header holds its dark styling for the full close regardless of which
  // path triggered it. Clearing it early here was the original bug: the
  // header would snap back to white/transparent while the panel was still
  // visibly closing over the new page, making navigation-triggered closes
  // look inconsistent with (and glitchier than) the X button.
  const closeMenuForNavigation = () => {
    setIsOpen(false);
    setScrollLocked(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle mouse enter/leave for hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/developers', label: 'Developers' },
    { to: '/franchise', label: 'Franchise' },
    { to: '/careers', label: 'Careers' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  // Determine header styling based on page, scroll position, and menu state.
  //
  // Three states now, not two - the mobile panel is a full-screen dark
  // takeover (not a white dropdown card anymore), so the row above it needs
  // its own dark mode to read as one continuous surface with the panel,
  // the same way it previously had to read as one continuous *white*
  // surface with the old dropdown.
  //
  // panelVisible, not scrollLocked or isOpen: isOpen flips to false the
  // instant the X (or a nav link) is clicked, but the panel below keeps
  // animating closed for another ~0.5s via AnimatePresence. If the header
  // reacted to isOpen directly, its own background would revert to the
  // closed look immediately while the still-visible, still-dark panel
  // underneath hadn't gone anywhere - a seam between the row and the panel
  // for that whole window, which reads as the header flickering.
  // scrollLocked doesn't work either for this specifically because
  // closeMenuForNavigation clears it early on purpose (see its comment).
  // panelVisible (see its declaration) is kept true through both close
  // paths and only clears once the panel has actually finished collapsing,
  // which is what this needs.
  const headerMode: 'transparent' | 'white' | 'dark' =
    scrolled || !isHomePage
      ? (isOpen ? 'dark' : 'white')
      : 'transparent';

  const headerBackgroundColor =
    headerMode === 'dark' ? '#1A1A1A' : headerMode === 'white' ? '#FFFFFF' : 'rgba(255,255,255,0)';
  const headerBoxShadow =
    headerMode === 'white'
      ? '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)'
      : '0 10px 15px -3px rgba(0,0,0,0), 0 4px 6px -4px rgba(0,0,0,0)';
  const headerBackdropBlur = headerMode !== 'transparent' ? 'blur(12px)' : 'blur(0px)';

  return (
    <motion.header
      initial={{
        y: -100,
        backgroundColor: headerBackgroundColor,
        boxShadow: headerBoxShadow,
        backdropFilter: headerBackdropBlur,
      }}
      animate={{
        y: 0,
        backgroundColor: headerBackgroundColor,
        boxShadow: headerBoxShadow,
        backdropFilter: headerBackdropBlur,
      }}
      transition={{
        y: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
        backgroundColor: { duration: 0.3, ease: 'easeOut' },
        boxShadow: { duration: 0.3, ease: 'easeOut' },
        backdropFilter: { duration: 0.3, ease: 'easeOut' },
      }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="container mx-auto pl-4 pr-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center group relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                // transition-[filter,opacity], not transition-all: whileHover/
                // whileTap above own this element's scale (transform).
                "relative h-20 w-auto flex-shrink-1 flex items-center transition-[filter,opacity] duration-500",
                headerMode !== 'white' ? "brightness-0 invert opacity-90" : ""
              )}
            >
              <Image
                src="/images/Logo.svg"
                alt="Gani Properties"
                className="h-12 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => {
              if (link.to === '/properties' && activeCategory && subcategories.length > 0) {
                // Properties link with dropdown
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        'transition-all duration-300 font-bold uppercase text-[10px] tracking-[0.2em] flex items-center gap-1 relative group',
                        scrolled || !isHomePage ? 'text-gp-ink' : 'text-white'
                      )}
                    >
                      <span className="relative">
                        {link.label}
                      </span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Link>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-black/10 overflow-hidden"
                        >
                          <div className="py-2">
                            {subcategories.map((subcategory, idx) => (
                              <motion.div
                                key={subcategory.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                              >
                                <Link
                                  to={subcategory.path}
                                  className="block px-4 py-2 text-gp-ink hover:bg-black/5 hover:text-gp-accent transition-all duration-200 hover:pl-6 text-[10px] font-bold uppercase tracking-wider"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  {subcategory.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }
              
              // Regular link
              return (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    className={cn(
                      'transition-all duration-300 font-bold uppercase text-[10px] tracking-[0.2em] relative group',
                      scrolled || !isHomePage ? 'text-gp-ink' : 'text-white',
                      pathname === link.to && (scrolled || !isHomePage ? 'text-gp-accent' : 'text-white')
                    )}
                  >
                    <span className="relative">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button + Enquire CTA */}
          {/* relative, not just a flex row: the CTA below is absolutely
              positioned rather than a normal flex sibling. It used to sit
              in-flow before the button with `gap-3`, which meant every
              time it mounted/unmounted (i.e. every open/close, on sm:+
              widths where it's visible) it physically pushed the
              hamburger/X icon sideways - a real position jump on the one
              element people are looking straight at when they click it.
              That's almost certainly the "top bar flicker". Taking it out
              of flow means the button's position is now fixed regardless
              of whether the CTA exists. */}
          <div className="relative flex items-center lg:hidden">
            {/* AnimatePresence, not a bare `isOpen &&`: without it, this
                unmounts the instant isOpen flips false and just vanishes -
                no exit prop gets a chance to run at all. */}
            <AnimatePresence>
              {isOpen && (
                <motion.a
                  key="enquire-cta"
                  href="tel:+919900570799"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1, transition: { duration: 0.25, delay: 0.1 } }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                  className="absolute right-full mr-3 hidden items-center gap-1.5 rounded-full bg-gp-accent px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white sm:inline-flex"
                >
                  <Phone className="h-3 w-3" />
                  Enquire
                </motion.a>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={cn(
                'relative flex h-10 w-10 items-center justify-center transition-colors',
                headerMode === 'white' && !isOpen ? 'text-gp-ink' : 'text-white'
              )}
              onClick={() => (isOpen ? closeMenu() : openMenu())}
              aria-label="Toggle menu"
            >
              <motion.div
                animate={{ rotate: isOpen ? 90 : 0, opacity: isOpen ? 0 : 1 }}
                transition={{ duration: 0.2 }}
                className="absolute flex items-center justify-center"
              >
                <Menu className="h-6 w-6" />
              </motion.div>
              <motion.div
                animate={{ rotate: isOpen ? 0 : -90, opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className="absolute flex items-center justify-center pointer-events-none"
              >
                <X className="h-6 w-6" />
              </motion.div>
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation - full-screen takeover */}
        <AnimatePresence
          onExitComplete={() => {
            setScrollLocked(false);
            setPanelVisible(false);
          }}
        >
          {isOpen && (
            <motion.div
              initial={{ clipPath: 'inset(0% 0% 100% 0% round 0px 0px 60px 60px)' }}
              animate={{
                clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)',
                transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
              }}
              exit={{
                clipPath: 'inset(0% 0% 100% 0% round 0px 0px 60px 60px)',
                transition: { duration: 0.55, delay: 0.52, ease: [0.65, 0, 0.35, 1] },
              }}
              style={{ height: viewportHeight }}
              className="lg:hidden absolute top-0 left-0 right-0 z-[-1] overflow-hidden bg-gp-ink pt-20"
            >
              {/* Background texture pattern */}
              <motion.svg
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 0.07, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                <defs>
                  <pattern
                    id={topoPatternId}
                    width="240"
                    height="240"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M-20,30 C40,0 80,80 140,40 S240,10 280,50"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M-20,100 C40,70 80,150 140,110 S240,80 280,120"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                    <path
                      d="M-20,170 C40,140 80,220 140,180 S240,150 280,190"
                      stroke="white"
                      strokeWidth="1"
                      fill="none"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#${topoPatternId})`} />
              </motion.svg>

              <div className="relative flex h-full flex-col px-6 py-4 pb-[72px] sm:px-10 sm:py-10 sm:pb-24">
                <div className="flex flex-1 flex-col sm:flex-row sm:items-start sm:justify-between sm:gap-12">
                  {/* Photo grid */}
                  <div className="hidden sm:grid sm:w-auto sm:max-w-xs sm:flex-shrink-0 sm:grid-cols-2 sm:gap-4">
                    {MENU_GRID_IMAGES.map((image, index) => (
                      <motion.div
                        key={image.src}
                        custom={{ index, total: MENU_GRID_IMAGES.length }}
                        variants={staggerImageVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="aspect-square overflow-hidden rounded-xl bg-white/5"
                      >
                        <motion.img
                          src={image.src}
                          alt={image.alt}
                          initial={{ scale: 1.25 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.9, delay: 0.22 + index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Nav links with line-masking reveal */}
                  <nav className="flex flex-1 flex-col justify-center sm:justify-start sm:items-end sm:text-right">
                    {navLinks.map((link, index) => {
                      const hasSubcategories =
                        link.to === '/properties' && activeCategory && subcategories.length > 0;
                      const isActive = pathname === link.to;
                      return (
                        <div key={link.to} className="overflow-hidden py-1 sm:py-1.5">
                          <motion.div
                            custom={{ index, total: navLinks.length }}
                            variants={staggerItemVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                          >
                            <Link
                              to={link.to}
                              onClick={closeMenuForNavigation}
                              className={cn(
                                'relative inline-block font-display text-3xl font-bold uppercase leading-[1.05] tracking-tight text-white/90 transition-colors duration-300 hover:text-gp-accent sm:text-5xl',
                                isActive && 'text-gp-accent'
                              )}
                            >
                              {link.label}
                              {isActive && (
                                <motion.span
                                  layoutId="mobile-nav-active-strike"
                                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                  className="absolute left-0 top-1/2 h-[3px] w-full -translate-y-1/2 bg-gp-accent"
                                />
                              )}
                            </Link>
                            {hasSubcategories && (
                              <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 sm:mt-2 sm:justify-end sm:gap-x-4 sm:gap-y-1">
                                {subcategories.map((subcategory) => (
                                  <Link
                                    key={subcategory.id}
                                    to={subcategory.path}
                                    onClick={closeMenuForNavigation}
                                    className="text-[10px] font-bold uppercase tracking-widest text-white/40 transition-colors duration-300 hover:text-gp-accent sm:text-[11px]"
                                  >
                                    {subcategory.label}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        </div>
                      );
                    })}

                    {/* Badge line reveal */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] } }}
                      exit={{ opacity: 0, y: -15, transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } }}
                      className="mt-4 flex flex-col items-center gap-1.5 sm:mt-8 sm:items-end sm:gap-2"
                    >
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1, transition: { duration: 0.4, delay: 0.58, ease: 'easeOut' } }}
                        exit={{ scaleX: 0, transition: { duration: 0.25 } }}
                        className="h-px w-10 bg-gp-accent/60 origin-right"
                      />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/50 sm:text-[10px]">
                        Gani Properties &middot; Est. 2009
                      </span>
                    </motion.div>
                  </nav>
                </div>

                {/* Footer enquiries + socials slide-fade */}
                <motion.div
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.58, ease: [0.16, 1, 0.3, 1] } }}
                  exit={{ opacity: 0, y: 15, transition: { duration: 0.3, ease: [0.32, 0, 0.67, 0] } }}
                  className="mt-2 flex flex-shrink-0 flex-col items-center gap-1.5 border-t border-white/10 pt-2 text-center sm:mt-10 sm:gap-4 sm:pt-6"
                >
                  <div>
                    <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.3em] text-white/40 sm:text-[10px]">
                      Business Enquiries
                    </p>
                    <a
                      href="tel:+919900570799"
                      className="text-xs font-medium text-white/80 transition-colors hover:text-gp-accent sm:text-sm"
                    >
                      +91 99005 70799
                    </a>
                  </div>
                  <div className="flex items-center gap-5">
                    {SOCIAL_LINKS.map((social, index) => (
                      <motion.a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                        custom={index}
                        variants={socialVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="text-white/60 transition-colors hover:text-gp-accent"
                      >
                        {social.icon ? (
                          <social.icon className="h-4 w-4" />
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        )}
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
