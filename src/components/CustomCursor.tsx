import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Hammer, Ruler, Pencil } from 'lucide-react';

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'hammer' | 'ruler' | 'pencil'>('default');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Snappier spring configuration for better responsiveness
  const springConfig = { damping: 20, stiffness: 400, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Direct motion value updates are high-performance and bypass React render cycle
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      if (!target) return;

      const isClickable = !!target.closest('button, a, .clickable, input, select, textarea');
      setIsHovering(prev => prev !== isClickable ? isClickable : prev);

      let newType: 'default' | 'hammer' | 'ruler' | 'pencil' = 'default';
      if (target.closest('.property-card')) {
        newType = 'hammer';
      } else if (target.closest('.blueprint-section')) {
        newType = 'ruler';
      } else if (target.closest('input, textarea')) {
        newType = 'pencil';
      }
      
      setCursorType(prev => prev !== newType ? newType : prev);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] hidden lg:block overflow-hidden">
      <motion.div
        style={{
          x: springX,
          y: springY,
          willChange: 'transform',
        }}
        className="relative"
      >
        {/* Main Circle */}
        <motion.div
          animate={{
            scale: isHovering ? 1.5 : 1,
            backgroundColor: isHovering ? 'rgba(221, 43, 28, 0.15)' : 'rgba(0, 0, 0, 0.1)',
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-gp-red/30 backdrop-blur-[2px]"
        />

        {/* Tool Icon */}
        <motion.div
          initial={false}
          animate={{
            scale: isHovering ? 1.2 : 0.8,
            rotate: isHovering ? [0, -10, 10, 0] : 0,
            opacity: cursorType !== 'default' || isHovering ? 1 : 0,
          }}
          transition={{
            rotate: { repeat: isHovering ? Infinity : 0, duration: 1 }
          }}
          className="absolute -translate-x-1/2 -translate-y-1/2 left-4 top-4"
        >
          {cursorType === 'hammer' && <Hammer className="w-5 h-5 text-gp-red" />}
          {cursorType === 'ruler' && <Ruler className="w-5 h-5 text-gp-red" />}
          {cursorType === 'pencil' && <Pencil className="w-5 h-5 text-gp-red" />}
          {cursorType === 'default' && isHovering && <Hammer className="w-5 h-5 text-gp-red" />}
        </motion.div>

        {/* Dot */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-gp-red rounded-full" />
      </motion.div>
    </div>
  );
}
