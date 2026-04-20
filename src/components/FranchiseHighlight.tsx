import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Handshake, Award, Target, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const highlights = [
  {
    icon: TrendingUp,
    title: 'Pioneering Model',
    description: 'India\'s first construction-focused franchise ecosystem',
    color: 'from-blue-500/20 to-purple-500/20',
  },
  {
    icon: Handshake,
    title: 'Trusted Partnership',
    description: 'Built on transparency and mutual success',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Award,
    title: 'Market Leadership',
    description: 'Positioned for long-term profitability',
    color: 'from-amber-500/20 to-orange-500/20',
  },
];

const franchiseModels = [
  {
    name: 'City Franchise',
    investment: '₹8-10 Lakhs',
    roi: '18-24 Months',
    feature: 'Exclusive city rights',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-200',
  },
  {
    name: 'Regional Franchise',
    investment: '₹15-20 Lakhs',
    roi: '24-30 Months',
    feature: 'Multi-city operations',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-200',
  },
  {
    name: 'Builder Partner',
    investment: 'Depends on Investment',
    roi: '30-36 Months',
    feature: 'State-level authority',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-200',
  },
];

export default function FranchiseHighlight() {
  return (
    <section className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gp-accent/10 border border-gp-accent/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-gp-accent" />
            <span className="text-sm font-bold text-gp-accent tracking-widest uppercase">
              Pioneering Segment Leader
            </span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
            India&apos;s First <span className="text-gp-accent">&quot;Approval to Key&quot;</span> Franchise
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed mb-8">
            Gani Properties introduces the <span className="font-bold text-gp-ink">first-of-its-kind construction franchise ecosystem</span> in India. We move beyond traditional real estate by offering a comprehensive model that provides employment, technical support, and vocational training for sustainable business growth.
          </p>
        </motion.div>

        {/* Three Key Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {highlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <div className="bg-white rounded-2xl p-8 border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-xl h-full">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${highlight.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-gp-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-gp-ink mb-3">
                    {highlight.title}
                  </h3>
                  <p className="text-gp-ink-muted leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Four Franchise Models */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-display font-bold text-gp-ink text-center mb-4">
            Three Strategic Franchise Models
          </h3>
          <p className="text-lg text-gp-ink-muted text-center mb-12 max-w-2xl mx-auto">
            Choose the investment level and market scope that aligns with your business goals and financial capacity.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {franchiseModels.map((model, index) => (
              <motion.div
                key={model.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <div className={`bg-gradient-to-br ${model.gradient} rounded-2xl p-6 border-2 ${model.borderColor} hover:shadow-xl transition-all duration-300 h-full flex flex-col`}>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold text-gp-ink mb-2">
                      {model.name}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gp-accent" />
                        <span className="text-sm font-semibold text-gp-ink">
                          {model.investment}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-gp-gold" />
                        <span className="text-sm text-gp-ink-muted">
                          ROI: {model.roi}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gp-ink-muted mt-auto">
                    {model.feature}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <p className="text-lg text-gp-ink-muted mb-6">
            Ready to transform your entrepreneurial vision into reality?
          </p>
          <Link to="/franchise">
            <Button
              size="lg"
              className="bg-gp-accent hover:bg-gp-gold text-white px-8 py-6 text-lg font-medium group"
            >
              Explore Franchise Opportunities
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

