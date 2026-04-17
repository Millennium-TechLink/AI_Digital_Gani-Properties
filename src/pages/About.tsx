import { motion } from 'framer-motion';
import { useRef } from 'react';
import SEOHead from '@/components/SEOHead';
import { 
  Quote, 
  MapPin,
  Lightbulb,
  Shield,
  Heart,
  Target,
  Award,
  CheckCircle,
  Globe
} from 'lucide-react';
import Image from '@/components/Image';
import ApprovalToKeyJourney from '@/components/ApprovalToKeyJourney';




export default function AboutPage() {
  const valuesRef = useRef(null);

  return (
    <>
      <SEOHead
        title="About Gani Properties - Trusted Property Providers in Bangalore Since 2009"
        description="Learn about Gani Properties, a premier property provider. Building sturdier foundations in Karnataka's real estate landscape since 2009. Verified properties, transparent pricing, and expert guidance in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
        keywords={[
          'Gani Properties about',
          'property providers Bangalore',
          'real estate company Bangalore',
          'trusted property dealers',
          'Bengaluru real estate',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/about`}
      />

      <div className="pt-40 pb-28 bg-gradient-to-b from-gp-surface/20 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(201,181,137,0.1)_0%,transparent_70%)]" />
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-gp-accent/10 rounded-full blur-[120px]" 
          />
          <motion.div 
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 12, repeat: Infinity }}
            className="absolute -bottom-24 -left-24 w-[600px] h-[600px] bg-gp-gold/10 rounded-full blur-[120px]" 
          />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gp-accent/10 text-gp-accent text-sm font-bold tracking-widest uppercase mb-8 border border-gp-accent/20">
              <span className="w-2 h-2 bg-gp-accent rounded-full animate-pulse" />
              Our Corporate Legacy
            </span>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold text-gp-ink mb-8 tracking-tight">
              Building Sturdier <span className="text-transparent bg-clip-text bg-gradient-to-r from-gp-accent to-gp-gold italic">Foundations</span>
            </h1>
            <p className="text-xl md:text-3xl text-gp-ink-muted leading-relaxed max-w-4xl mx-auto font-light">
              Gani Properties Pvt. Ltd. is committed to sculpting the real estate landscape 
              with premium developments that transcend traditional categories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gp-ink/10 to-transparent" />
        
        <div className="container mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-4"
            >
              <h2 className="text-4xl font-display font-bold text-gp-ink mb-6 sticky top-32">
                A Legacy of Excellence <span className="text-gp-accent font-serif italic text-5xl">Since 2009</span>
              </h2>
              <div className="h-1 w-20 bg-gp-accent rounded-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="lg:col-span-8 space-y-8"
            >
              <p className="text-2xl text-gp-ink font-medium leading-relaxed italic border-l-4 border-gp-gold pl-8 py-2">
                Gani Properties has evolved from a local developer into a pioneering segment leader, solidifying our stature through unwavering commitment to quality and transparency.
              </p>
              
              <div className="prose prose-xl max-w-none text-gp-ink-muted leading-relaxed space-y-10 font-normal">
                <p>
                  As pioneers in the Indian market, we are the first to implement a dedicated 
                  <span className="text-gp-accent font-bold">&quot;Approval to Key&quot;</span> franchise model within the construction segment. We provide a comprehensive 
                  ecosystem of support—from technical knowledge and business strategy to technical 
                  benchmarking—creating meaningful employment and vocational opportunities for 
                  our partners across the country.
                </p>
                <p>
                  Our core strength lies in our <span className="text-gp-ink font-bold font-display">End-to-End Service</span> model. We manage every project 
                  from initial <span className="text-gp-accent font-bold">Approval to Key</span> handover. This includes the entire PSD 
                  (Project Schematics/Design) phase and Pre-Construction management, 
                  ensuring that our clients receive a finished product that meets the highest 
                  standards of quality and compliance.
                </p>
                <p>
                  Backed by an extensive portfolio spanning residential plots, farmland, and agricultural 
                  lands, we have crafted a distinguished legacy that embodies unyielding excellence. Our user-focused approach serves as the bedrock, ensuring 
                  that every property we offer delivers the epitome of value to our customers.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building Sturdy Foundations */}
      <ApprovalToKeyJourney />

      {/* Core Values */}
      <section ref={valuesRef} className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
              OUR VALUES
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Core Values
            </h2>
            <p className="text-xl text-gp-ink-muted leading-relaxed">
              The fundamental principles that guide our actions and define who we are
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Shield,
                title: 'Integrity',
                description: 'We conduct business with unwavering honesty, transparency, and ethical standards in every transaction and interaction.',
                color: 'text-blue-600',
                bg: 'bg-blue-50',
                border: 'hover:border-blue-200',
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'We are committed to delivering excellence in every property we offer, ensuring verified titles and premium standards.',
                color: 'text-amber-600',
                bg: 'bg-amber-50',
                border: 'hover:border-amber-200',
              },
              {
                icon: Heart,
                title: 'Customer First',
                description: 'Our customers are at the heart of everything we do. We prioritize their needs, satisfaction, and long-term success.',
                color: 'text-pink-600',
                bg: 'bg-pink-50',
                border: 'hover:border-pink-200',
              },
              {
                icon: Target,
                title: 'Excellence',
                description: 'We strive for excellence in all aspects of our operations, from land acquisition to customer service.',
                color: 'text-purple-600',
                bg: 'bg-purple-50',
                border: 'hover:border-purple-200',
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'We embrace innovative approaches and modern solutions to stay ahead in the evolving real estate landscape.',
                color: 'text-yellow-600',
                bg: 'bg-yellow-50',
                border: 'hover:border-yellow-200',
              },
              {
                icon: CheckCircle,
                title: 'Trust',
                description: 'We build lasting relationships based on trust, reliability, and consistent delivery on our promises.',
                color: 'text-green-600',
                bg: 'bg-green-50',
                border: 'hover:border-green-200',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <div className={`bg-white rounded-[2rem] p-10 border border-gp-ink/5 ${value.border} transition-all duration-500 h-full shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden`}>
                    <div className={`w-20 h-20 ${value.bg} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className={`h-10 w-10 ${value.color}`} />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gp-ink mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gp-ink-muted leading-relaxed text-lg font-light">
                      {value.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-gp-ink/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gp-accent/5 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gp-accent/10 rounded-full mb-8 border border-gp-accent/20">
                  <Target className="w-4 h-4 text-gp-accent" />
                  <span className="text-xs font-bold text-gp-accent uppercase tracking-widest">
                    Our Mission
                  </span>
                </div>
                <p className="text-3xl font-display font-medium text-gp-ink mb-6 leading-tight">
                  Pioneering the Indian construction landscape
                </p>
                <p className="text-lg text-gp-ink-muted leading-relaxed font-light">
                  Delivering an unparalleled &quot;Approval to Key&quot; experience while empowering entrepreneurs through India&apos;s first construction franchise model, generating sustainable employment and technical excellence.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-gp-ink/5 relative overflow-hidden group"
            >
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gp-gold/10 rounded-full blur-[80px] -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-150" />
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gp-surface rounded-full mb-8 border border-gp-gold/20">
                  <Globe className="w-4 h-4 text-gp-gold" />
                  <span className="text-xs font-bold text-gp-gold uppercase tracking-widest">
                    Our Vision
                  </span>
                </div>
                <p className="text-3xl font-display font-medium text-gp-ink mb-6 leading-tight">
                  India&apos;s most trusted real estate ecosystem
                </p>
                <p className="text-lg text-gp-ink-muted leading-relaxed font-light">
                  Recognised globally for unyielding quality, innovative processes, and empowering communities through our premier construction franchise and transparency-first approach.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Footprint & Network */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
                OUR PRESENCE
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
                Strategic Market Footprint
              </h2>
              <p className="text-lg text-gp-ink-muted leading-relaxed max-w-3xl mx-auto">
                Building dreams locally, empowering entrepreneurs nationally.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Bangalore Operations */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-[2.5rem] p-10 border border-gp-ink/5 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                  <MapPin className="w-48 h-48 text-gp-ink" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gp-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <MapPin className="w-8 h-8 text-gp-accent" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-gp-ink mb-2">Property & Construction</h3>
                  <p className="text-xl text-gp-accent font-medium mb-8">Across Bengaluru Territories</p>
                  <p className="text-lg text-gp-ink-muted leading-relaxed mb-8 font-light italic">
                    Delivering premium residential plots, agricultural lands, and our signature &quot;Approval to Key&quot; construction services comprehensively across all regions and suburbs of Bengaluru.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {['Yelahanka', 'Kattigenahalli', 'Hunasamaranahalli', 'Chikkaballapur'].map((area, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/item">
                        <div className="w-1.5 h-1.5 bg-gp-accent rounded-full group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm text-gp-ink-muted font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Karnataka Franchise */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-gp-surface/30 rounded-[2.5rem] p-10 border border-gp-gold/20 shadow-xl relative overflow-hidden group hover:shadow-2xl hover:border-gp-gold/40 transition-all duration-500"
              >
                <div className="absolute top-0 right-0 p-10 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
                  <Globe className="w-48 h-48 text-gp-gold" />
                </div>
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-gp-gold/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <Globe className="w-8 h-8 text-gp-gold" />
                  </div>
                  <h3 className="text-3xl font-display font-bold text-gp-ink mb-2">National Franchise Network</h3>
                  <p className="text-xl text-gp-gold font-medium mb-8">Pan-India Expansion</p>
                  <p className="text-lg text-gp-ink-muted leading-relaxed mb-8 font-light italic">
                    Pioneering India&apos;s first construction franchise model. Partnering with ambitious entrepreneurs starting in Karnataka and scaling nationwide.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {['City Rights', 'Regional Authority', 'Builder Partnership', 'Vocational Support'].map((area, idx) => (
                      <div key={idx} className="flex items-center gap-2 group/item">
                        <div className="w-1.5 h-1.5 bg-gp-gold rounded-full group-hover/item:scale-150 transition-transform" />
                        <span className="text-sm text-gp-ink-muted font-medium">{area}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Chairman's Desk */}
      <section className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/3 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <span className="text-sm font-medium text-gp-accent uppercase tracking-wider">
                FROM THE DESK
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mt-4 mb-4">
                A Message from Our Managing Director
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
              {/* Chairman Photo */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl bg-gp-ink">
                  <div className="aspect-[4/5] relative">
                    <Image
                      src="/images/Ashok.webp"
                      alt="Ashok Chauhan - Managing Director"
                      fill
                      className="object-cover transition-transform duration-1000 hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gp-ink via-gp-ink/80 to-transparent p-10 pt-20">
                    <h3 className="text-3xl font-display font-bold text-white mb-1">
                      Ashok Chauhan
                    </h3>
                    <p className="text-gp-gold font-bold tracking-[0.2em] text-xs uppercase opacity-90">
                      Managing Director
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7"
              >
                <div className="bg-white rounded-[3rem] p-12 lg:p-16 shadow-2xl border border-gp-ink/5 relative overflow-hidden h-full">
                  <div className="relative z-10">
                    <h3 className="text-4xl font-display font-bold text-gp-ink mb-10 leading-tight">
                      A Vision for <span className="italic text-gp-accent">Empowerment</span> & Quality
                    </h3>
                    <div className="prose prose-xl max-w-none text-gp-ink-muted leading-relaxed space-y-8 font-light">
                      <div className="relative mb-12 p-12 bg-gp-accent/5 rounded-[2.5rem] border-l-8 border-gp-accent italic overflow-hidden">
                        <Quote className="h-8 w-8 text-gp-accent absolute top-8 right-8" />
                        <p className="text-2xl font-medium text-gp-ink leading-relaxed relative z-10">
                          &quot;We don&apos;t just build structures; we build end-to-end solutions that empower households and entrepreneurs alike.&quot;
                        </p>
                      </div>
                      <p>
                        Welcome to Gani Properties Pvt. Ltd. We are proud to be the first in the Indian market 
                        to implement a comprehensive <span className="text-gp-ink font-bold">&quot;Approval to Key&quot;</span> franchise model. Our mission is to provide 
                        employment, business opportunities, and the deep technical knowledge required to succeed.
                      </p>
                      <p>
                        We empower our partners with extensive vocational training on how to 
                        effectively run and capture the local market, ensuring they enter the franchise space with absolute confidence and professional benchmarking.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
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
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
              TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gp-ink-muted leading-relaxed">
              Real stories from families and investors who trusted us with their property dreams
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Yelahanka, Bengaluru',
                property: 'Residential Plot',
                testimonial: 'Excellent service! The team at Gani Properties helped us find the perfect plot for our dream home. Clear documentation and transparent process throughout.',
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                location: 'Kattigenahalli',
                property: 'Farm Land',
                testimonial: 'As a first-time investor, I was nervous about buying farmland. But the team guided me through every step and ensured everything was legally verified.',
                rating: 5,
              },
              {
                name: 'Suresh Reddy',
                location: 'Hunasamaranahalli',
                property: 'Agricultural Land',
                testimonial: 'Professional, honest, and reliable. They helped us acquire agricultural land with complete transparency. All paperwork was handled efficiently.',
                rating: 5,
              },
              {
                name: 'Anita Desai',
                location: 'Chikkaballapur',
                property: 'Residential Plot',
                testimonial: 'Gani Properties not only found us the perfect property but also ensured all legal checks were done. Great experience!',
                rating: 5,
              },
              {
                name: 'Vikram Singh',
                location: 'Bengaluru',
                property: 'Farm Land',
                testimonial: 'Trustworthy and professional. The team provided detailed information, arranged site visits, and made the entire process smooth.',
                rating: 5,
              },
              {
                name: 'Meera Patel',
                location: 'Yelahanka, Bengaluru',
                property: 'Residential Plot',
                testimonial: 'Excellent customer service and attention to detail. The transaction was seamless and transparent. Highly recommended!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] p-10 border border-gp-ink/5 hover:border-gp-accent/20 transition-all duration-500 hover:shadow-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-gp-gold fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.757 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <Quote className="h-8 w-8 text-gp-accent/10 mb-4" />
                  <p className="text-xl text-gp-ink-muted leading-relaxed font-light italic mb-8">
                    &quot;{testimonial.testimonial}&quot;
                  </p>
                </div>
                <div className="pt-8 border-t border-gp-ink/5">
                  <p className="font-display font-bold text-gp-ink text-lg">{testimonial.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-gp-accent uppercase tracking-wider">{testimonial.property}</span>
                    <span className="w-1 h-1 bg-gp-ink/20 rounded-full" />
                    <span className="text-xs text-gp-ink-muted">{testimonial.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      
    </>
  );
}


