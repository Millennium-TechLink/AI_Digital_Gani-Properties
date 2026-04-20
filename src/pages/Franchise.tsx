import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import { 
  TrendingUp, Award, Zap, Clock, 
  IndianRupee, MapPin, Users, BarChart3, 
  CheckCircle2, ArrowRight, Building2, Globe, Shield,
  Sparkles, Star, ArrowDown, HardHat, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Image from '@/components/Image';

const franchiseModels = [
  {
    id: 'city',
    name: 'City Franchise',
    model: 'Model A',
    investment: '₹8-10 Lakhs',
    territory: 'Exclusive city rights',
    revenueSplit: '70% You, 30% Us',
    gradient: 'from-purple-500/10 to-pink-500/10',
    borderColor: 'border-purple-200',
    hoverGradient: 'from-purple-500/20 to-pink-500/20',
    icon: Building2,
    color: 'purple',
    features: ['Standard CRM Access', 'Local Marketing Suite', '7 Days Training', 'Legal Documentation'],
    requirements: ['500 sq.ft Office', '2 Staff Members', 'City-level focus'],
    cta: 'Apply for City Rights'
  },
  {
    id: 'regional',
    name: 'Regional Franchise',
    model: 'Model B',
    investment: '₹15-20 Lakhs',
    territory: 'Multi-city operations',
    revenueSplit: '75% You, 25% Us',
    gradient: 'from-green-500/10 to-emerald-500/10',
    borderColor: 'border-green-200',
    hoverGradient: 'from-green-500/20 to-emerald-500/20',
    icon: Globe,
    color: 'green',
    features: ['Advanced CRM Tools', 'Regional PR Campaigns', '15 Days Vocational Training', 'Dedicated Regional Manager'],
    requirements: ['1000 sq.ft Hub', '5+ Staff Members', 'Zonal Market Influence'],
    cta: 'Scale Regionally'
  },
  {
    id: 'builder',
    name: 'Builder Partner',
    model: 'Model C',
    investment: 'Depends on Investment',
    territory: 'State-level authority',
    revenueSplit: '80% You, 20% Us',
    gradient: 'from-amber-500/10 to-orange-500/10',
    borderColor: 'border-amber-200',
    hoverGradient: 'from-amber-500/20 to-orange-500/20',
    icon: Shield,
    color: 'amber',
    features: ['Enterprise ERP Systems', 'National Branding', 'Ongoing Expert Training', 'full Legal & Project Consulting'],
    requirements: ['Corporate Headquarters', 'Full Engineering Team', 'Strategic Partnership'],
    cta: 'Become a Strategic Partner'
  },
];

const supportFeatures = [
  {
    icon: Award,
    title: 'First-in-Segment Model',
    description: 'The first dedicated franchise model in the Indian construction industry with proven systems.',
  },
  {
    icon: Users,
    title: 'Vocational Training',
    description: 'Specialized training on local market capture, customer interaction, and construction management.',
  },
  {
    icon: TrendingUp,
    title: 'Business & Tech Support',
    description: 'Comprehensive technical support, knowledge transfer, and lead generation to fuel your growth.',
  },
];

const partnershipTerms = [
  {
    icon: Clock,
    title: 'Agreement Duration',
    description: '3-year initial term with renewal options based on performance review and mutual consent',
  },
  {
    icon: IndianRupee,
    title: 'Revenue Sharing',
    description: 'Competitive splits ranging from 60-80% franchisee share depending on chosen model',
  },
  {
    icon: BarChart3,
    title: 'Marketing Investment',
    description: '2-5% monthly contribution to national branding campaigns for sustained growth',
  },
];

const responsibilities = {
  franchisee: [
    'Maintain branded office/showroom standards',
    'Execute local marketing and client management',
    'Ensure compliance and transparent reporting',
    'Hire qualified operational staff',
  ],
  franchisor: [
    'Continuous training and skill development',
    'Legal documentation assistance',
    'Performance monitoring and growth strategies',
    'Annual conferences and networking events',
  ],
};



export default function FranchisePage() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [activeModelId, setActiveModelId] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  const activeModel = franchiseModels.find(m => m.id === activeModelId);

  return (
    <>
      <SEOHead
        title="Franchise Opportunities in Bangalore | Partner with Gani Properties"
        description="Partner with Gani Properties - Leading property providers in Bangalore. Explore franchise opportunities with proven growth models, comprehensive support, and competitive revenue sharing. Build your real estate empire across India."
        keywords={[
          'franchise opportunities Bangalore',
          'real estate franchise',
          'property franchise India',
          'Gani Properties franchise',
          'real estate business opportunity',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/franchise`}
      />

      {/* Enhanced Hero Section with Background Image */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: '#0F3A3D' }}
      >
        {/* Parallax Background Image Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <motion.img
            src="/images/Franchise Hero.webp"
            alt="Franchise Hero Background"
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              y: heroY,
              top: 0,
              left: 0,
              width: '100%',
              height: '120%',
              opacity: imageLoaded ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
              WebkitTransform: 'translate3d(0, 0, 0)',
            }}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              console.warn('Hero image failed to load:', e);
              setImageLoaded(false);
            }}
          />
          
          {/* Fallback background gradient (shows when image is loading) */}
          <div 
            className="absolute inset-0 w-full h-full bg-gradient-to-b from-gp-bg via-gp-surface to-gp-bg"
            style={{ 
              opacity: imageLoaded ? 0 : 1,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: 0
            }}
          />
          
          {/* Dark Overlay for Text Readability */}
          <div 
            className="absolute inset-0"
            style={{
              zIndex: 1,
              background: 'linear-gradient(to bottom, rgba(15, 58, 61, 0.5), rgba(15, 46, 49, 0.4), rgba(15, 46, 49, 0.5))'
            }}
          />
          
          {/* Additional Gradient Overlay for Better Contrast */}
          <div 
            className="absolute inset-0"
            style={{
              zIndex: 2,
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(15, 58, 61, 0.3) 50%, rgba(15, 46, 49, 0.7) 100%)'
            }}
          />
        </div>

        {/* Animated Overlay Pattern - Subtle */}
        <div className="absolute inset-0 opacity-5" style={{ zIndex: 10 }}>
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,0.1)_25%,rgba(201,181,137,0.1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,0.1)_75%,rgba(201,181,137,0.1)_100%)] bg-[length:40px_40px]" />
        </div>

        {/* Subtle Floating Particles - Reduced for Performance */}
        {typeof window !== 'undefined' && [...Array(15)].map((_, i) => {
          const size = Math.random() * 3 + 1.5;
          const delay = Math.random() * 5;
          const duration = Math.random() * 12 + 8;
          return (
            <motion.div
              key={`particle-${i}`}
              className="absolute rounded-full pointer-events-none"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: `radial-gradient(circle, rgba(201, 181, 137, 0.6) 0%, rgba(201, 181, 137, 0.1) 100%)`,
                boxShadow: `0 0 ${size * 2}px rgba(201, 181, 137, 0.4)`,
                zIndex: 12,
              }}
              initial={{
                x: Math.random() * (window.innerWidth || 1920),
                y: window.innerHeight + 100,
                opacity: 0,
              }}
              animate={{
                y: -100,
                x: Math.random() * (window.innerWidth || 1920),
                opacity: [0, 0.6, 0.6, 0],
              }}
              transition={{
                duration,
                repeat: Infinity,
                delay,
                ease: 'linear',
              }}
            />
          );
        })}

        <div className="container mx-auto px-4 lg:px-6 relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-5xl mx-auto text-center relative"
          >
            {/* Animated Sparkles Icon with Glow */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8 relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-24 h-24 bg-gp-accent/20 rounded-full blur-xl" />
              </motion.div>
              <Sparkles className="w-16 h-16 text-gp-accent mx-auto mb-6 relative z-10 drop-shadow-[0_0_20px_rgba(201,181,137,0.5)]" />
            </motion.div>
            
            {/* Main Heading with Enhanced Effects */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white mb-8 leading-tight relative"
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="block mb-2"
              >
                Your Gateway to
              </motion.span>
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 200 }}
                className="block bg-gradient-to-r from-gp-accent via-gp-gold to-gp-accent bg-clip-text text-transparent relative"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite',
                }}
              >
                Construction Franchising Success
              </motion.span>
              
              {/* Text Glow Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-gp-accent/20 to-gp-gold/20 blur-3xl -z-10"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white/90 leading-relaxed mb-8 max-w-3xl mx-auto"
            >
              India&apos;s first comprehensive <span className="text-gp-accent font-bold">&quot;Approval to Key&quot;</span> franchise model, providing specialized business support and technical vocational training.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-white/80 leading-relaxed mb-12 max-w-2xl mx-auto"
            >
              Our &quot;Paid Socialised Service&quot; model ensures you enter the market with strong branding, proven technical benchmarking, and vocational training on capturing your local market.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/contact">
                <Button
                  size="lg"
                  className="bg-gp-accent hover:bg-gp-gold text-white px-8 py-6 text-lg font-medium group shadow-2xl"
                >
                  Explore Opportunities
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 px-8 py-6 text-lg font-medium"
                onClick={() => {
                  document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Models
                <ArrowDown className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Four Franchise Models - Enhanced */}
      <section id="models" className="py-32 bg-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block inline-flex items-center gap-2"
            >
              <Star className="w-4 h-4" />
              Pricing ~ FRANCHISE MODELS
              <Star className="w-4 h-4" />
            </motion.span>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Three Strategic Franchise Models
            </h2>
            <p className="text-xl text-gp-ink-muted leading-relaxed">
              Choose the investment level and market scope that aligns with your business goals and financial capacity.
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-8 mb-12">
            {franchiseModels.map((model, index) => {
              const Icon = model.icon;
              const isSelected = selectedModel === model.id;
              
              return (
                <motion.div
                  key={model.id}
                  onClick={() => setActiveModelId(model.id)}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ 
                    y: -12,
                    scale: 1.02,
                    transition: { duration: 0.3 }
                  }}
                  onHoverStart={() => setSelectedModel(model.id)}
                  onHoverEnd={() => setSelectedModel(null)}
                  className="group cursor-pointer w-full md:w-[calc(50%-2rem)] lg:w-[calc(33.333%-2rem)] max-w-sm"
                >
                  <motion.div
                    className={`bg-gradient-to-br ${isSelected ? model.hoverGradient : model.gradient} rounded-3xl p-8 border-2 ${model.borderColor} transition-all duration-500 h-full flex flex-col relative overflow-hidden shadow-sm`}
                    whileHover={{ 
                      boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                    }}
                  >
                    {/* Animated Background Glow */}
                    <motion.div
                      className={`absolute inset-0 bg-gradient-to-br ${model.hoverGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                    />
                    
                    <div className="relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        className="w-20 h-20 rounded-2xl bg-white/80 backdrop-blur-sm flex items-center justify-center mb-6 shadow-lg"
                      >
                        <Icon className="w-10 h-10 text-gp-accent" />
                      </motion.div>
                      
                      <span className="text-xs font-semibold text-gp-accent uppercase tracking-wider mb-2 block">
                        {model.model}
                      </span>
                      <h3 className="text-2xl font-bold text-gp-ink mb-6 group-hover:text-gp-accent transition-colors">
                        {model.name}
                      </h3>

                      <div className="space-y-4 mb-6 flex-grow">
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3"
                        >
                          <IndianRupee className="w-6 h-6 text-gp-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gp-ink">Investment</p>
                            <p className="text-xl font-bold text-gp-ink">{model.investment}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3"
                        >
                          <MapPin className="w-6 h-6 text-gp-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gp-ink">Territory</p>
                            <p className="text-sm text-gp-ink-muted">{model.territory}</p>
                          </div>
                        </motion.div>
                        <motion.div
                          whileHover={{ x: 5 }}
                          className="flex items-start gap-3"
                        >
                          <BarChart3 className="w-6 h-6 text-gp-accent mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-semibold text-gp-ink">Revenue Split</p>
                            <p className="text-sm text-gp-ink-muted font-medium">{model.revenueSplit}</p>
                          </div>
                        </motion.div>

                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-32 bg-white relative overflow-hidden border-t border-gp-ink/5">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
              Compare All Models
            </h2>
            <p className="text-lg text-gp-ink-muted">
              Find the perfect partnership tier that fits your expansion goals.
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto overflow-x-auto rounded-3xl border border-gp-ink/10 bg-white shadow-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gp-ink text-white">
                  <th className="p-6 font-display font-bold">Key Feature</th>
                  {franchiseModels.map(m => (
                    <th key={m.id} className="p-6 font-display font-bold text-center border-l border-white/10">
                      {m.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gp-ink/5">
                {[
                  { label: 'Investment Tier', values: ['₹8-10 Lakhs', '₹15-20 Lakhs', 'Capital Intensive'] },
                  { label: 'Territory Rights', values: ['City-Level', 'Regional Hub', 'State/Metro'] },
                  { label: 'Revenue Share', values: ['70% Partner', '75% Partner', '80% Partner'] },
                  { label: 'CRM/ERP Access', values: ['Standard', 'Advanced', 'Enterprise'] },
                  { label: 'Marketing Scope', values: ['Local Focus', 'Regional Outreach', 'National PR'] },
                  { label: 'Training Duration', values: ['7 Days', '15 Days', 'Continuous'] },
                  { label: 'Site Support', values: ['Design Only', 'Direct Managed', 'Custom Engineering'] },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gp-surface/30 transition-colors">
                    <td className="p-6 font-semibold text-gp-ink">{row.label}</td>
                    {row.values.map((val, idx) => (
                      <td key={idx} className="p-6 text-center text-gp-ink-muted border-l border-gp-ink/5 italic">
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* City Franchise Detail - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gp-surface/10 via-white to-gp-surface/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-gp-accent/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gp-gold/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gp-ink/5"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
                    MODEL A
                  </span>
                  <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-8">
                    City Franchise: Your Local Market Advantage
                  </h2>
                  <div className="space-y-5 mb-8">
                    {[
                      { icon: IndianRupee, label: 'Investment', value: '₹8-10 Lakhs', color: 'text-gp-accent' },
                      { icon: MapPin, label: 'Territory', value: 'Exclusive city rights', color: 'text-gp-gold' },
                      { icon: BarChart3, label: 'Revenue Split', value: '70% You, 30% Us', color: 'text-gp-accent' },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.label}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                          className="flex items-start gap-4 group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gp-accent/20 to-gp-gold/20 flex items-center justify-center flex-shrink-0`}
                          >
                            <Icon className={`w-6 h-6 ${item.color}`} />
                          </motion.div>
                          <div>
                            <p className="font-semibold text-gp-ink mb-1">{item.label}</p>
                            <p className="text-gp-ink-muted text-lg">{item.value}</p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                  <p className="text-lg text-gp-ink-muted leading-relaxed">
                    Complete support including branding, training, lead generation, and targeted marketing campaigns for maximum local impact.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="bg-gradient-to-br from-gp-accent/10 via-gp-gold/10 to-gp-accent/10 rounded-3xl p-4 h-full flex items-center justify-center relative overflow-hidden min-h-[400px]"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 bg-gradient-to-br from-gp-accent/5 to-gp-gold/5"
                  />
                  <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden shadow-xl">
                    <Image
                      src="/images/Model A.jpg"
                      alt="City Franchise Model A"
                      className="w-full h-full object-cover rounded-2xl"
                      width={600}
                      height={600}
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Regional & Builder Partnership - Enhanced */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Scaling Up: Regional & Builder Partnership Models
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: 'Regional Franchise (Model B)',
                investment: '₹15-20 Lakhs',
                coverage: 'Multiple cities, semi-exclusive rights',
                revenue: '75% franchisee, 25% franchisor',
                description: 'Includes dedicated manager and construction training modules for comprehensive regional growth.',
                gradient: 'from-green-500/10 to-emerald-500/10',
                border: 'border-green-200',
                icon: Globe,
                delay: 0,
              },
              {
                title: 'Exclusive Builder Partner (Model C)',
                investment: 'Depends on Investment',
                coverage: 'State-level or major metro authority',
                revenue: '80% franchisee, 20% franchisor',
                description: 'Complete project support, joint ventures, and legal consulting for maximum market penetration.',
                gradient: 'from-amber-500/10 to-orange-500/10',
                border: 'border-amber-200',
                icon: Shield,
                delay: 0.2,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: item.delay }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br ${item.gradient} rounded-3xl p-10 border-2 ${item.border} shadow-xl transition-all duration-300`}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-white/80 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-gp-accent" />
                    </div>
                    <h3 className="text-2xl font-bold text-gp-ink">{item.title}</h3>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Investment', value: item.investment },
                      { label: 'Coverage', value: item.coverage },
                      { label: 'Revenue Share', value: item.revenue },
                    ].map((detail, idx) => (
                      <motion.div
                        key={detail.label}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: item.delay + idx * 0.1 }}
                      >
                        <p className="font-semibold text-gp-ink mb-1">{detail.label}</p>
                        <p className="text-gp-ink-muted text-lg">{detail.value}</p>
                      </motion.div>
                    ))}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: item.delay + 0.3 }}
                      className="text-sm text-gp-ink-muted mt-6 pt-6 border-t border-gp-ink/10"
                    >
                      {item.description}
                    </motion.p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partnership Terms - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gp-surface/10 via-white to-gp-surface/10 relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-gp-accent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Partnership Terms & Financial Structure
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {partnershipTerms.map((term, index) => {
              const Icon = term.icon;
              return (
                <motion.div
                  key={term.title}
                  initial={{ opacity: 0, y: 50, rotateY: -15 }}
                  whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ 
                    y: -12,
                    rotateY: 5,
                    transition: { duration: 0.3 }
                  }}
                  className="bg-white rounded-3xl p-10 border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-500 hover:shadow-2xl perspective-1000"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gp-accent/20 to-gp-gold/20 flex items-center justify-center mb-6"
                  >
                    <Icon className="w-10 h-10 text-gp-accent" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gp-ink mb-4">
                    {term.title}
                  </h3>
                  <p className="text-gp-ink-muted leading-relaxed text-lg">
                    {term.description}
                  </p>
                </motion.div>
              );
            })}
          </div>


        </div>
      </section>



      {/* Support System - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gp-bg via-gp-surface to-gp-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute top-1/4 right-1/4 w-96 h-96 bg-gp-accent/10 rounded-full blur-3xl"
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                Comprehensive Support System
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {supportFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 50, rotateX: -15 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    whileHover={{ 
                      y: -12,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                    className="bg-white/10 backdrop-blur-md rounded-3xl p-10 border border-white/20 hover:border-white/40 transition-all duration-500 hover:bg-white/15"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6"
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-white/80 leading-relaxed text-lg">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partner Eligibility Section */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Partner Eligibility
            </h2>
            <p className="text-xl text-gp-ink-muted">
              We seek visionary partners with a commitment to excellence and a drive for market expansion.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                tier: 'City Partner',
                financial: '₹8-10 Lakhs',
                professional: 'Market knowledge, local influence, and dedicated focus on city-level growth.',
                bg: 'bg-white'
              },
              {
                tier: 'Regional Partner',
                financial: '₹15-20 Lakhs',
                professional: 'Multi-city operational capability, strong leadership, and scaling mindset.',
                bg: 'bg-white'
              },
              {
                tier: 'Builder Partner',
                financial: 'Capital Intesive',
                professional: 'Land ownership or development expertise, long-term state-level vision.',
                bg: 'bg-white shadow-xl border-gp-accent/20'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`${item.bg} p-10 rounded-[2.5rem] border border-gp-ink/5 flex flex-col items-center text-center`}
              >
                <div className="text-gp-accent font-bold uppercase tracking-widest mb-4">{item.tier}</div>
                <div className="text-3xl font-bold text-gp-ink mb-6">{item.financial}</div>
                <div className="w-12 h-0.5 bg-gp-accent/20 mb-6" />
                <p className="text-gp-ink-muted leading-relaxed">
                  {item.professional}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Structure Section */}
      <section className="py-32 bg-gp-ink relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gp-accent rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gp-gold rounded-full blur-[120px] -ml-48 -mb-48" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Our Support Ecosystem
            </h2>
            <p className="text-xl text-white/70">
              We empower our partners with end-to-end support across four critical business pillars.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: 'Tech Support',
                icon: Zap,
                items: ['Integrated ERP Systems', 'Lead Management (CRM)', 'Digital Asset Access']
              },
              {
                title: 'Legal & Doc',
                icon: Shield,
                items: ['Contractual Guidance', 'Regulatory Compliance', 'Agreement Drafting']
              },
              {
                title: 'Marketing & PR',
                icon: TrendingUp,
                items: ['National Branding', 'Localized Campaigns', 'Digital PR Strategy']
              },
              {
                title: 'Engineering/PSD',
                icon: HardHat,
                items: ['Design Benchmarking', 'Site Feasibility', 'Technical Consulting']
              }
            ].map((support, index) => {
              const Icon = support.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gp-accent/20 flex items-center justify-center mb-6 group-hover:bg-gp-accent transition-colors">
                    <Icon className="w-7 h-7 text-gp-accent group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-6">{support.title}</h3>
                  <ul className="space-y-4">
                    {support.items.map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white/60 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-gp-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-6xl mx-auto"
          >
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-display font-bold text-gp-ink mb-6">
                Your Responsibilities & Our Commitment
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                { title: 'Franchisee Responsibilities', items: responsibilities.franchisee, gradient: 'from-blue-500/10 to-cyan-500/10', border: 'border-blue-200', iconColor: 'text-gp-accent' },
                { title: 'Our Ongoing Support', items: responsibilities.franchisor, gradient: 'from-green-500/10 to-emerald-500/10', border: 'border-green-200', iconColor: 'text-gp-gold' },
              ].map((section, index) => (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`bg-gradient-to-br ${section.gradient} rounded-3xl p-10 border-2 ${section.border} shadow-xl`}
                >
                  <h3 className="text-2xl font-bold text-gp-ink mb-8">{section.title}</h3>
                  <ul className="space-y-5">
                    {section.items.map((item, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + idx * 0.1 }}
                        className="flex items-start gap-4 group"
                      >
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className={`w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center flex-shrink-0 ${section.iconColor}`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </motion.div>
                        <span className="text-gp-ink-muted text-lg group-hover:text-gp-ink transition-colors">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* Model Detail Modal */}
      <AnimatePresence mode="wait">
        {activeModelId && activeModel && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModelId(null)}
              className="absolute inset-0 bg-gp-bg/90 backdrop-blur-md"
            />
            
            <motion.div
              layoutId={activeModelId}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden z-10 border border-gp-ink/5"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModelId(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gp-surface flex items-center justify-center text-gp-ink hover:bg-gp-accent hover:text-white transition-all z-20"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${activeModel.gradient} flex items-center justify-center mb-6`}>
                    <activeModel.icon className="w-8 h-8 text-gp-accent" />
                  </div>
                  <h3 className="text-sm font-bold text-gp-accent uppercase tracking-[0.2em] mb-2">{activeModel.model}</h3>
                  <h2 className="text-4xl font-display font-bold text-gp-ink mb-6">{activeModel.name}</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gp-surface flex items-center justify-center flex-shrink-0">
                        <IndianRupee className="w-5 h-5 text-gp-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gp-ink-muted uppercase tracking-wider mb-1">Investment</p>
                        <p className="text-lg font-bold text-gp-ink">{activeModel.investment}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gp-surface flex items-center justify-center flex-shrink-0">
                        <BarChart3 className="w-5 h-5 text-gp-accent" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gp-ink-muted uppercase tracking-wider mb-1">Revenue Split</p>
                        <p className="text-lg font-bold text-gp-ink">{activeModel.revenueSplit}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gp-ink/10">
                    <h4 className="text-sm font-bold text-gp-ink mb-4">Core Benefits:</h4>
                    <ul className="grid grid-cols-1 gap-3">
                      {activeModel.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-3 text-gp-ink-muted">
                          <CheckCircle2 className="w-4 h-4 text-gp-accent" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gp-surface/50 p-8 md:p-12 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gp-ink mb-6 uppercase tracking-wider">Partner Requirements</h4>
                    <ul className="space-y-4 mb-8">
                      {activeModel.requirements.map((r, i) => (
                        <li key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gp-ink/5 flex items-center gap-4 group hover:border-gp-accent transition-colors">
                          <div className="w-2 h-2 rounded-full bg-gp-accent group-hover:scale-150 transition-transform" />
                          <span className="text-gp-ink font-medium">{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="text-sm text-gp-ink-muted mb-6 leading-relaxed">
                      Taking the first step involves a detailed feasibility study and credit audit. Join our network of successful real estate entrepreneurs.
                    </p>
                    <Link to="/contact">
                      <Button className="w-full py-7 text-lg group shadow-xl">
                        {activeModel.cta}
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Final CTA - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-gp-bg via-gp-surface to-gp-bg relative overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-gp-accent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-block mb-8">
              <Sparkles className="w-16 h-16 text-gp-accent" />
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-8">
              Ready to Transform Your Entrepreneurial Vision?
            </h2>
            <p className="text-xl text-white/90 mb-12 leading-relaxed">
              Contact us today to explore your franchise opportunity and take the first step towards building your real estate empire.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/contact">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gp-accent hover:bg-gp-gold text-white px-10 py-7 text-lg font-medium group shadow-2xl"
                  >
                    Get in Touch
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/properties">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-7 text-lg font-medium backdrop-blur-sm"
                  >
                    View Properties
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
