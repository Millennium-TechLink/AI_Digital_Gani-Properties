import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FileText, PenTool, Calculator, HardHat, Palette, Key } from 'lucide-react';

const constructionSteps = [
  {
    icon: FileText,
    title: 'Legal & Plot Approvals',
    description: 'We secure all necessary zoning rights, building permits, and legal clearances before breaking ground on your plot.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: PenTool,
    title: 'Project Schematics (PSD)',
    description: 'Expert architects draft detailed schematics and layouts focusing on optimal utility, vastu, and structural integrity.',
    color: 'from-gp-gold to-gp-accent',
  },
  {
    icon: Calculator,
    title: 'Budgeting & Sourcing',
    description: 'Transparent material selection and cost estimation ensures your project stays strictly within financial parameters.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: HardHat,
    title: 'Premium Construction',
    description: 'Execution begins with high-grade materials, robust engineering, and strict multi-stage quality assurance checks.',
    color: 'from-gp-gold to-gp-accent',
  },
  {
    icon: Palette,
    title: 'Interiors & Finishing',
    description: 'Adding life to the structure with premium interiors, aesthetic fittings, and move-in-ready landscaping.',
    color: 'from-gp-accent to-gp-gold',
  },
  {
    icon: Key,
    title: 'Key Handover',
    description: 'The final milestone. We hand over the keys to your beautifully crafted, fully legally compliant dream property.',
    color: 'from-gp-gold to-gp-accent',
  },
];

export default function ApprovalToKeyJourney() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section 
      ref={ref} 
      className="py-32 bg-white relative overflow-hidden"
      style={{
        willChange: 'auto',
        transform: 'translate3d(0, 0, 0)',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(201,181,137,0.3)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gp-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gp-gold/5 rounded-full blur-[120px] -ml-64 -mb-64" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-24"
        >
          <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
            END-TO-END SERVICE MODEL
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
            From Approval to Key
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed">
            Experience complete peace of mind. We manage the entire lifecycle of your project—from securing the first legal permit to handing over the final polished key.
          </p>
        </motion.div>

        {/* Journey Grid */}
        <div className="relative max-w-6xl mx-auto">
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-[4.5rem] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gp-accent/30 to-transparent" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-28 gap-x-12">
            {constructionSteps.map((step, index) => {
              const StepIcon = step.icon;
              const delay = index * 0.1;

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group pt-8 lg:pt-0"
                >
                  {/* Floating Number Node */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white border-2 border-gp-accent/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-gp-accent group-hover:rotate-12 transition-all duration-500 z-10 overflow-hidden">
                    <div className="absolute inset-0 bg-gp-accent/5 group-hover:bg-gp-accent/10 transition-colors" />
                    <span className="relative text-2xl font-display font-bold text-gp-accent italic">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>

                  <div className="bg-white rounded-[2.5rem] p-10 pt-14 shadow-xl border border-gp-ink/5 hover:border-gp-accent/20 transition-all duration-500 hover:shadow-2xl h-full flex flex-col items-center lg:items-start text-center lg:text-left backdrop-blur-sm bg-white/95">
                    <div className="mb-6">
                      <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${step.color}`}>
                        <StepIcon className="h-7 w-7 text-white" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gp-ink mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gp-ink-muted leading-relaxed">
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
