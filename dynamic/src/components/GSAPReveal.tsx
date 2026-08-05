import { useEffect, useRef, ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface GSAPRevealProps {
  children: ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
  duration?: number;
  distance?: number;
}

function getOffset(direction: GSAPRevealProps['direction'], distance: number) {
  switch (direction) {
    case 'up': return { x: 0, y: distance };
    case 'down': return { x: 0, y: -distance };
    case 'left': return { x: distance, y: 0 };
    case 'right': return { x: -distance, y: 0 };
    default: return { x: 0, y: 0 };
  }
}

export default function GSAPReveal({
  children,
  direction = 'up',
  delay = 0,
  duration = 0.8,
  distance = 30
}: GSAPRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const { x, y } = getOffset(direction, distance);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(element,
        {
          opacity: 0,
          x,
          y
        },
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration,
          delay,
          ease: 'power3.out',
          force3D: true,
          scrollTrigger: {
            trigger: element,
            start: 'top 85%',
            toggleActions: 'play none none none',
          }
        }
      );
    }, elementRef);

    return () => ctx.revert();
  }, [direction, delay, duration, distance, x, y]);

  return (
    <div
      ref={elementRef}
      // The hidden starting state is applied here, synchronously, on the very
      // first render - not just inside gsap.fromTo() in the effect below.
      // Without this, React paints the children at their natural, fully
      // visible state first (the effect hasn't run yet), and then GSAP
      // snaps it to opacity:0 to begin the reveal - that snap is exactly
      // what reads as a flicker/flash on every mount. Setting it here means
      // the element is already correctly hidden on the first painted frame,
      // so GSAP has nothing to visibly "correct" before animating in.
      style={{
        opacity: 0,
        transform: `translate3d(${x}px, ${y}px, 0)`,
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
      }}
    >
      {children}
    </div>
  );
}
