import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Home, Sprout, Trees, Award, Heart, Building } from 'lucide-react';

const journeySteps = [
  {
    icon: Home,
    title: 'Your Dream',
    description: 'Every journey begins with a vision. We help you find the perfect land to build your future.',
  },
  {
    icon: Sprout,
    title: 'Our Promise',
    description: 'Verified titles, transparent pricing, and properties that exceed expectations.',
  },
  {
    icon: Trees,
    title: 'Prime Locations',
    description: "Carefully selected plots in Bengaluru's most promising areas with great connectivity.",
  },
  {
    icon: Award,
    title: 'Expert Guidance',
    description: 'Our experienced team guides you through every step with professional expertise.',
  },
  {
    icon: Heart,
    title: 'Your Legacy',
    description: 'Building more than properties — we help create lasting legacies for generations.',
  },
  {
    icon: Building,
    title: 'Future Ready',
    description: 'Investments that grow with time, creating sustainable value for your family.',
  },
];

export default function StoryJourney() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="py-32 bg-white relative overflow-hidden"
    >
      {/* Subtle red accent glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#DD2B1C]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-[#DD2B1C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#DD2B1C]/60" />
            <span className="text-[10px] font-black text-[#DD2B1C] uppercase tracking-[0.4em]">
              YOUR JOURNEY
            </span>
            <div className="h-px w-8 bg-[#DD2B1C]/60" />
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-[#1A1A1A] mb-6">
            From Dream to Reality
          </h2>
          <p className="text-lg text-[#666] leading-relaxed">
            A story-driven journey where every step brings you closer to your perfect property.
            Experience the Gani Properties difference.
          </p>
        </motion.div>

        {/* Journey Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {journeySteps.map((step, index) => {
            const StepIcon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <div className="bg-[#F9F9F9] border border-black/[0.04] hover:border-[#DD2B1C]/30 rounded-2xl p-8 h-full transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(221,43,28,0.1)]">
                  {/* Step number */}
                  <div className="absolute top-5 right-6 text-5xl font-black text-black/[0.03] select-none" style={{ fontFamily: '"Rubik Wide", system-ui, sans-serif' }}>
                    {String(index + 1).padStart(2, '0')}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 flex items-center justify-center border border-[#DD2B1C]/30 bg-[#DD2B1C]/5 mb-6 group-hover:bg-[#DD2B1C]/10 transition-colors duration-300">
                    <StepIcon className="h-5 w-5 text-[#DD2B1C]" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-3 tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-[#666] leading-relaxed text-sm font-medium">
                    {step.description}
                  </p>

                  {/* Bottom accent line on hover */}
                  <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[#DD2B1C] group-hover:w-full transition-all duration-500 rounded-b-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
