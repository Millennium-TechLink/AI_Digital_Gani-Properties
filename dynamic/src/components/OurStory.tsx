import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from '@/components/Image';

interface Stat {
  targetValue: number;
  suffix: string;
  label: string;
}

const stats: Stat[] = [
  { targetValue: 25, suffix: '+', label: 'Years of legacy' },
  { targetValue: 100, suffix: '+', label: 'Properties Delivered' },
  { targetValue: 30, suffix: '', label: 'Ongoing Projects' },
  { targetValue: 100, suffix: '+', label: 'Acres Delivered' },
  { targetValue: 60, suffix: '+', label: 'Acres in Progress' },
  { targetValue: 600, suffix: '+', label: 'Happy Customers' },
];

function AnimatedCounter({ targetValue, suffix, label, delay = 0 }: Stat & { delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    // Reset count when leaving viewport
    if (!isInView) {
      setCount(0);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      return;
    }

    const duration = 1500; // Slightly longer for smoother animation
    let rafId: number | null = null;

    const timer = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic function for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const newValue = Math.floor(targetValue * easeOut);
        setCount(newValue);

        if (progress < 1) {
          rafId = requestAnimationFrame(animate);
        } else {
          setCount(targetValue);
          rafId = null;
        }
      };

      rafId = requestAnimationFrame(animate);
      animationRef.current = rafId;
    }, delay * 50);

    return () => {
      clearTimeout(timer);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isInView, targetValue, delay]);

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  return (
    <div
      ref={ref}
      className="text-center"
      style={{
        willChange: 'contents',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      <div className="text-3xl md:text-4xl font-display font-bold text-gp-accent mb-2">
        {formatNumber(count)}{suffix}
      </div>
      <div className="text-sm text-gp-ink-muted font-medium">
        {label}
      </div>
    </div>
  );
}

export default function OurStory() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-gp-surface to-gp-bg"
          >
            <Image
              src="/images/Our Story.webp"
              alt="Gani Properties - A Legacy Built on Excellence"
              fill
              className="object-cover"
              priority
            />
          </motion.div>

          {/* Text Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="mb-4">
              <span className="text-sm font-medium text-gp-accent uppercase tracking-wider">
                OUR STORY
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
              A Legacy Built on Excellence
            </h2>
            <p className="text-lg text-gp-ink-muted leading-relaxed mb-8">
              Since our inception, Gani Properties Pvt. Ltd. has been a trusted real estate
              developer in Bengaluru, known for delivering high-quality residential plots,
              farmland, and agricultural lands. We specialize in an **End-to-End Service model**, 
              managing every project—including residential, commercial, educational, and hospital projects—from initial **Approval to Key** handover. By overseeing the 
              complete **PSD (Project Schematics/Design)** and pre-construction stages, we ensure 
              a seamless and transparent experience for all our clients.
            </p>

            {/* Statistics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1] // Smooth ease-out
                  }}
                >
                  <AnimatedCounter
                    targetValue={stat.targetValue}
                    suffix={stat.suffix}
                    label={stat.label}
                    delay={index * 0.05}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
