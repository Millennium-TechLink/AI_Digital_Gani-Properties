/**
 * Global animation configurations for buttery smooth transitions
 */

// Buttery smooth easing curves
export const easings = {
  smooth: [0.4, 0, 0.2, 1] as const,
  inOut: [0.4, 0, 0.2, 1] as const,
  out: [0, 0, 0.2, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
  buttery: [0.25, 0.46, 0.45, 0.94] as const,
  ultraSmooth: [0.16, 1, 0.3, 1] as const,
  bounce: [0.68, -0.55, 0.265, 1.55] as const,
};

// Animation durations
export const durations = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  slowest: 1,
};

// Common animation variants
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: {
    duration: durations.slow,
    ease: easings.ultraSmooth,
  },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: {
    duration: durations.slow,
    ease: easings.buttery,
  },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 10 },
  transition: {
    duration: durations.slow,
    ease: easings.buttery,
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: {
    duration: durations.normal,
    ease: easings.ultraSmooth,
  },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 30 },
  transition: {
    duration: durations.slow,
    ease: easings.buttery,
  },
};

export const slideInRight = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 },
  transition: {
    duration: durations.slow,
    ease: easings.buttery,
  },
};

// Stagger children animation
export const staggerContainer = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.slow,
      ease: easings.ultraSmooth,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: durations.fast,
      ease: easings.out,
    },
  },
};

// Hover animations
export const hoverScale = {
  whileHover: {
    scale: 1.05,
    transition: {
      duration: durations.fast,
      ease: easings.ultraSmooth,
    },
  },
  whileTap: {
    scale: 0.95,
    transition: {
      duration: durations.fast,
      ease: easings.ultraSmooth,
    },
  },
};

export const hoverLift = {
  whileHover: {
    y: -8,
    transition: {
      duration: durations.normal,
      ease: easings.ultraSmooth,
    },
  },
};

// Viewport animations
export const viewportOptions = {
  once: true,
  margin: '-50px',
  amount: 0.3,
};

// Default transition for smooth animations
export const defaultTransition = {
  duration: durations.slow,
  ease: easings.ultraSmooth,
};
