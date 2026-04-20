import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Home, Sprout, Trees, Award, Heart, Building } from 'lucide-react';

const journeySteps = [
  {
    icon: Home,
    title: 'Your Dream',
    description: 'Every journey begins with a vision. We help you find the perfect land to build your future.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: Sprout,
    title: 'Our Promise',
    description: 'Verified titles, transparent pricing, and properties that exceed expectations.',
    color: 'from-gp-gold to-gp-accent',
  },
  {
    icon: Trees,
    title: 'Prime Locations',
    description: 'Carefully selected plots in Bengaluru\'s most promising areas with great connectivity.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: Award,
    title: 'Expert Guidance',
    description: 'Our experienced team guides you through every step with professional expertise.',
    color: 'from-gp-gold to-gp-accent',
  },
  {
    icon: Heart,
    title: 'Your Legacy',
    description: 'Building more than properties - we help create lasting legacies for generations.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: Building,
    title: 'Future Ready',
    description: 'Investments that grow with time, creating sustainable value for your family.',
    color: 'from-gp-gold to-gp-accent',
  },
];

export default function StoryJourney() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section
      ref={ref}
      className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden"
      style={{
        willChange: 'auto',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
            YOUR JOURNEY
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
            From Dream to Reality
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed">
            A story-driven journey where every step brings you closer to your perfect property.
            Experience the Gani Properties difference.
          </p>
        </motion.div>

        {/* Journey Timeline */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gp-accent/30 to-transparent transform -translate-y-1/2" />

          {/* Journey Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {journeySteps.map((step, index) => {
              const StepIcon = step.icon;
              const delay = index * 0.1;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                  style={{
                    willChange: 'transform, opacity',
                    transform: 'translate3d(0, 0, 0)',
                  }}
                >
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 h-full">
                    {/* Icon */}
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <StepIcon className="h-8 w-8 text-white" />
                    </div>

                    {/* Step Number */}
                    <div className="absolute top-4 right-4 text-6xl font-display font-bold text-gp-ink/15">
                      {String(index + 1).padStart(2, '0')}
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-display font-bold text-gp-ink mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gp-ink/70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
