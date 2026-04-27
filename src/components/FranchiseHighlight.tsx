import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Hammer, Ruler, HardHat, Pickaxe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const franchiseModels = [
  {
    name: 'City Franchise',
    investment: '₹8-10 Lakhs',
    roi: '18-24 Months',
    feature: 'Exclusive city rights',
    borderColor: 'border-gp-red/30',
  },
  {
    name: 'Regional Franchise',
    investment: '₹15-20 Lakhs',
    roi: '24-30 Months',
    feature: 'Multi-city operations',
    borderColor: 'border-gp-red/30',
  },
  {
    name: 'Builder Partner',
    investment: 'Depends on Investment',
    roi: '30-36 Months',
    feature: 'State-level authority',
    borderColor: 'border-gp-red/30',
  },
];

export default function FranchiseHighlight() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Blueprint Pattern */}
      <div className="absolute inset-0 opacity-[0.08] bg-blueprint" />

      {/* Red Glowing Accents */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gp-red/[0.03] rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gp-red/[0.03] rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Content: Text & Models */}
          <div className="lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1 border-l-4 border-gp-red bg-gp-red/10 mb-6">
                <Sparkles className="w-3 h-3 text-gp-red" />
                <span className="text-[10px] font-black text-gp-red tracking-[0.3em] uppercase">Segment Leader</span>
              </div>

              <h2 className="text-5xl md:text-6xl font-display font-black text-gp-ink mb-6 leading-tight uppercase tracking-tight">
                CONSTRUCT YOUR <br />
                <span className="text-gp-red">LEGACY</span>
              </h2>

              <p className="text-lg text-gp-ink/60 leading-relaxed mb-12 max-w-xl font-medium">
                Gani Properties introduces India&apos;s first <span className="text-gp-ink font-black uppercase tracking-tight">&quot;Approval to Key&quot;</span> construction franchise ecosystem.
                Join a movement that combines industrial expertise with vocational empowerment.
              </p>

              {/* Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                {franchiseModels.map((model, index) => (
                  <motion.div
                    key={model.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`p-6 rounded-none border-l-2 ${model.borderColor} bg-gp-light-grey/60 backdrop-blur-sm group hover:bg-gp-red/5 transition-all duration-300 shadow-sm`}
                  >
                    <h4 className="text-sm font-black text-gp-ink tracking-widest uppercase mb-3 group-hover:text-gp-red transition-colors">{model.name}</h4>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gp-ink/40 uppercase tracking-tighter font-bold flex items-center gap-2">
                        <Pickaxe className="w-3 h-3" />
                        Investment
                      </span>
                      <span className="text-sm font-black text-gp-red">{model.investment}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/franchise">
                <Button className="bg-gp-red hover:bg-red-700 text-white px-8 py-7 rounded-none group shadow-lg hover:shadow-red-600/20">
                  <span className="font-black tracking-widest text-xs">EXPLORE FRANCHISE OPPORTUNITIES</span>
                  <ArrowRight className="ml-3 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right Content: Visual Construction Animation */}
          <div className="lg:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-10 blueprint-section"
            >
              {/* Main Silhouette Container */}
              <div className="relative group p-8">
                {/* Construction Scan Line */}
                <motion.div
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-0.5 bg-gp-red shadow-[0_0_15px_#DD2B1C] z-30 opacity-50"
                />

                <div className="relative">
                  {/* The Silhouette Image */}
                  <img
                    src="/images/franchise_silhouette.png"
                    alt="Self Made Man"
                    className="w-full h-auto relative z-20 grayscale group-hover:grayscale-0 transition-all duration-1000 filter drop-shadow-[0_0_30px_rgba(221,43,28,0.1)]"
                  />

                  {/* Animated Construction Tools Overlays */}
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, 0],
                      y: [0, -20, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-10 left-1/4 z-30 text-gp-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Hammer className="w-12 h-12" />
                  </motion.div>

                  <motion.div
                    animate={{
                      rotate: [0, 15, -15, 0],
                      x: [0, 20, 0]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute top-1/2 -right-12 z-30 text-gp-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Ruler className="w-12 h-12" />
                  </motion.div>

                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: 360
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-10 right-1/4 z-30 text-gp-red opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <HardHat className="w-12 h-12" />
                  </motion.div>
                </div>

                {/* Blueprint Grid Lines Overlay */}
                <div className="absolute inset-0 border-2 border-dashed border-gp-red/10 rounded-3xl -m-4 pointer-events-none" />
              </div>

              {/* Floating Industrial Status Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white border border-gp-red/20 p-5 shadow-2xl z-40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gp-red/10 flex items-center justify-center border border-gp-red/20">
                    <Ruler className="w-6 h-6 text-gp-red" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gp-ink/40 tracking-[0.2em] uppercase">Precision</div>
                    <div className="text-sm font-black text-gp-ink uppercase tracking-tight">BUILDING SUCCESS</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute top-10 -right-6 bg-white border border-gp-red/20 p-5 shadow-2xl z-40"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gp-red/10 flex items-center justify-center border border-gp-red/20">
                    <Hammer className="w-6 h-6 text-gp-red" />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-gp-ink/40 tracking-[0.2em] uppercase">Empowerment</div>
                    <div className="text-sm font-black text-gp-ink uppercase tracking-tight">SELF-MADE DREAMS</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
