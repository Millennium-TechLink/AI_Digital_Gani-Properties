import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import SEOHead from '@/components/SEOHead';
import { 
  HardHat, Ruler, ShieldCheck, 
  Lightbulb, ArrowRight,
  Target, Zap, Users2, Building
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from '@/components/Image';

const capabilities = [
  {
    icon: Lightbulb,
    title: 'Project Schematics (PSD)',
    description: 'Bespoke architectural design and master planning tailored to maximize land value and functionality.',
  },
  {
    icon: ShieldCheck,
    title: 'Government Approvals',
    description: 'Navigating the complex regulatory landscape to secure all necessary permits and clearances efficiently.',
  },
  {
    icon: Ruler,
    title: 'Technical Benchmarking',
    description: 'Setting gold standards in construction quality and engineering precision for every development.',
  },
  {
    icon: HardHat,
    title: 'Approval to Key',
    description: 'A seamless, end-to-end management model from first soil break to the final key handover.',
  },
];

const expertiseAreas = [
  {
    title: 'Residential Projects',
    description: 'From luxury villas to sustainable plotted developments.',
    image: '/images/Residential.webp'
  },
  {
    title: 'Commercial Spaces',
    description: 'Modern business hubs and retail complexes designed for growth.',
    image: '/images/Commercial.webp'
  },
  {
    title: 'Educational Institutions',
    description: 'State-of-the-art campus developments and learning environments.',
    image: '/images/Land.webp' // Using Land.webp as placeholder for educational
  },
  {
    title: 'Hospitality & More',
    description: 'Hotels, resorts, and specialized hospital infrastructure.',
    image: '/images/Hospitality.webp'
  }
];

export default function DevelopersPage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);

  return (
    <>
      <SEOHead
        title="Real Estate Development Partners | Gani Properties"
        description="Partner with Gani Properties for professional real estate development. We offer 'Approval to Key' project management, architectural design, and regulatory expertise for residential, commercial, and institutional projects."
        keywords={[
          'real estate development Bangalore',
          'joint venture builders',
          'property development experts',
          'approval to key construction',
          'Gani Properties developers',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/developers`}
      />

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gp-ink"
      >
        <div className="absolute inset-0 z-0 opacity-40">
          <motion.div style={{ y: heroY }} className="h-full w-full">
            <Image
              src="/images/Land.webp"
              alt="Development Background"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-gp-ink/60 via-gp-ink/40 to-gp-ink z-[1]" />

        <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <span className="text-sm font-semibold text-gp-accent uppercase tracking-widest mb-4 block">
              REAL ESTATE DEVELOPMENT
            </span>
            <h1 className="text-4xl md:text-7xl font-display font-bold text-white mb-8 leading-tight">
              Transforming Potential into <br />
              <span className="text-gp-accent italic text-3xl md:text-6xl">Lasting Landmarks</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto">
              Gani Properties brings over 25 years of legacy and technical expertise to landowners and investors. We turn complex visions into tangible, high-value realities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gp-accent hover:bg-gp-gold text-white px-8 py-6 text-lg font-medium group"
                onClick={() => document.getElementById('partnership-form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Partner With Us
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-medium"
                onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Our Expertise
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gp-ink mb-6">
              Our Development Capabilities
            </h2>
            <p className="text-lg text-gp-ink-muted">
              We provide a comprehensive framework that handles every technical and regulatory aspect of property development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-8 rounded-3xl bg-gp-surface/5 border border-gp-ink/5 hover:border-gp-accent/30 transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gp-accent/10 flex items-center justify-center mb-6 group-hover:bg-gp-accent group-hover:text-white transition-colors duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-gp-ink mb-4">{item.title}</h3>
                  <p className="text-gp-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="py-24 bg-gp-surface/10 overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex flex-col lg:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <span className="text-sm font-semibold text-gp-accent uppercase tracking-widest mb-4 block">
                SECTOR FOCUS
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-bold text-gp-ink">
                Diverse Expertise Across <br />
                Multi-Segment Real Estate
              </h2>
            </div>
            <p className="text-lg text-gp-ink-muted lg:max-w-sm">
              Our technical benchmarking ensures excellence whether we are building a home, a hospital, or a corporate hub.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {expertiseAreas.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[350px] rounded-3xl overflow-hidden cursor-pointer"
              >
                <Image
                  src={area.image}
                  alt={area.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-[1]" />
                <div className="absolute bottom-0 left-0 p-8 z-[2] w-full transform transition-transform duration-300 group-hover:translate-y-[-10px]">
                  <h3 className="text-2xl font-bold text-white mb-2">{area.title}</h3>
                  <p className="text-white/80 line-clamp-2">{area.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Gani Advantage */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="bg-gp-ink rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gp-accent/20 via-transparent to-transparent" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
              <div>
                <h2 className="text-3xl md:text-5xl font-display font-bold mb-8">
                  Why Collaborate with <br />
                  <span className="text-gp-accent">Gani Properties?</span>
                </h2>
                <div className="space-y-6">
                  {[
                    { title: 'Project Experience', icon: Target, text: 'Over 100+ projects delivered with zero quality compromises.' },
                    { title: 'Operational Speed', icon: Zap, text: 'Fast-tracked approvals through deep regulatory knowledge.' },
                    { title: 'Strategic Network', icon: Users2, text: 'Access to a vast network of tier-1 contractors and legal experts.' },
                    { title: 'Full Transparency', icon: Building, text: 'Detailed reporting and milestone-based progress tracking.' }
                  ].map((benefit, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-gp-accent" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{benefit.title}</h4>
                        <p className="text-white/70">{benefit.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div id="partnership-form" className="bg-white rounded-[2rem] p-8 text-gp-ink shadow-xl">
                 <h3 className="text-2xl font-bold mb-2">Discuss Your Project</h3>
                 <p className="text-sm text-gp-ink-muted mb-6">Let's explore how we can maximize your property's potential.</p>
                 <form className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gp-ink/60">Full Name</label>
                            <input type="text" className="w-full bg-gp-surface/30 border-none rounded-xl px-4 py-3 focus:ring-2 ring-gp-accent/20" placeholder="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gp-ink/60">Phone</label>
                            <input type="tel" className="w-full bg-gp-surface/30 border-none rounded-xl px-4 py-3 focus:ring-2 ring-gp-accent/20" placeholder="+91 00000 00000" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gp-ink/60">Land Location / Project Type</label>
                        <input type="text" className="w-full bg-gp-surface/30 border-none rounded-xl px-4 py-3 focus:ring-2 ring-gp-accent/20" placeholder="e.g. 5 Acres in Devanahalli" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-gp-ink/60">Brief Message</label>
                        <textarea className="w-full bg-gp-surface/30 border-none rounded-xl px-4 py-3 focus:ring-2 ring-gp-accent/20 min-h-[100px]" placeholder="Tell us about your proposal..."></textarea>
                    </div>
                    <Button className="w-full bg-gp-accent hover:bg-gp-gold text-white py-6 font-bold text-lg shadow-lg">
                        Submit
                    </Button>
                 </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
