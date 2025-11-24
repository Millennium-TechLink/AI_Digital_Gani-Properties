import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import SEOHead from '@/components/SEOHead';
import { 
  Quote, 
  MapPin, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  IndianRupee, 
  Coins,
  Shield,
  Heart,
  Target,
  Award,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import Image from '@/components/Image';

const foundations = [
  {
    icon: MapPin,
    title: 'STRINGENT LAND ACQUISITION',
    description: 'Navigating the intricacies of procuring land through a multi-tiered procedure.',
  },
  {
    icon: Lightbulb,
    title: 'THOUGHT LEADERSHIP',
    description: 'Driving innovation and integrity as the cornerstones of our thought leadership.',
  },
  {
    icon: Users,
    title: 'HOLISTIC APPROACH TO CRM',
    description: 'Maximising the value of our relationships with our valued clientele.',
  },
  {
    icon: TrendingUp,
    title: 'OPERATING EFFICIENCIES',
    description: 'Delivering exceptional value in a sustainable and cost-effective manner.',
  },
  {
    icon: IndianRupee,
    title: 'CONSERVATIVE FINANCIAL STRATEGY',
    description: 'Dedicated to prudent fiscal management and an investment-grade balance sheet.',
  },
  {
    icon: Coins,
    title: 'PRUDENT CAPITAL ALLOCATION',
    description: 'Adhering to a disciplined and optimised approach to capital allocation.',
  },
];


export default function AboutPage() {
  const foundationsRef = useRef(null);
  const valuesRef = useRef(null);
  const foundationsInView = useInView(foundationsRef, { once: true, margin: '-100px' });

  return (
    <>
      <SEOHead
        title="About Gani Properties - Trusted Property Providers in Bangalore Since 2009"
        description="Learn about Gani Properties, one of Bangalore's leading property providers. Building sturdier foundations in Bengaluru's real estate landscape since 2009. Verified properties, transparent pricing, and expert guidance in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
        keywords={[
          'Gani Properties about',
          'property providers Bangalore',
          'real estate company Bangalore',
          'trusted property dealers',
          'Bengaluru real estate',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/about`}
      />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-gp-surface/5 via-white to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
              ABOUT US
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gp-ink mb-6">
              Building Sturdier Foundations
            </h1>
            <p className="text-xl md:text-2xl text-gp-ink-muted leading-relaxed">
              Since our inception, Gani Properties Pvt. Ltd. has been committed to sculpting 
              Bengaluru&apos;s real estate landscape with premium developments that transcend 
              diverse categories.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Company Story */}
      <section className="py-20 bg-white relative overflow-hidden">
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
              className="prose prose-lg max-w-none text-gp-ink-muted leading-relaxed space-y-6 text-lg"
            >
              <p>
                Since our inception, Gani Properties Pvt. Ltd. has been committed to sculpting 
                Bengaluru&apos;s real estate landscape with premium developments that transcend 
                diverse categories, solidifying our stature as a leading name in the industry.
              </p>
              <p>
                Backed by an extensive portfolio spanning residential plots, farmland, and agricultural 
                lands, we have crafted a distinguished legacy that embodies unyielding excellence 
                and unmatched quality. We believe that the cornerstone of our leadership within the 
                industry lies in not just meeting but surpassing customer expectations. Our 
                user-focused approach serves as the bedrock, ensuring that every property we offer 
                delivers the epitome of value and transparency to customers.
              </p>
              <p>
                Every land acquisition presents a new opportunity for Gani Properties, approached 
                with prudence, unlocking new territories while upholding environmental and societal 
                duties. Our corporate philosophy rides on innovation, quality, and trust. We are a 
                professionally managed organisation with a stable and confident business model guided 
                by the principles of excellence, integrity, and service to society.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Building Sturdy Foundations */}
      <section ref={foundationsRef} className="py-32 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-0 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
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
              OUR FOUNDATIONS
            </span>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
              Building Sturdy Foundations
            </h2>
            <p className="text-xl text-gp-ink-muted leading-relaxed">
              The pillars that support our commitment to excellence and customer satisfaction
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {foundations.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={foundationsInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-3xl p-8 border border-gp-ink/10 hover:border-gp-accent/30 hover:shadow-2xl transition-all duration-300 h-full"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-gp-accent/20 to-gp-gold/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-8 w-8 text-gp-accent" />
                  </div>
                  <h3 className="text-lg font-display font-bold text-gp-ink mb-3 uppercase tracking-tight">
                    {item.title}
                  </h3>
                  <p className="text-gp-ink-muted leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

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
                gradient: 'from-blue-500/20 to-cyan-500/20',
                color: 'text-blue-600',
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'We are committed to delivering excellence in every property we offer, ensuring verified titles and premium standards.',
                gradient: 'from-amber-500/20 to-orange-500/20',
                color: 'text-amber-600',
              },
              {
                icon: Heart,
                title: 'Customer First',
                description: 'Our customers are at the heart of everything we do. We prioritize their needs, satisfaction, and long-term success.',
                gradient: 'from-pink-500/20 to-rose-500/20',
                color: 'text-pink-600',
              },
              {
                icon: Target,
                title: 'Excellence',
                description: 'We strive for excellence in all aspects of our operations, from land acquisition to customer service.',
                gradient: 'from-purple-500/20 to-indigo-500/20',
                color: 'text-purple-600',
              },
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'We embrace innovative approaches and modern solutions to stay ahead in the evolving real estate landscape.',
                gradient: 'from-yellow-500/20 to-amber-500/20',
                color: 'text-yellow-600',
              },
              {
                icon: CheckCircle,
                title: 'Trust',
                description: 'We build lasting relationships based on trust, reliability, and consistent delivery on our promises.',
                gradient: 'from-green-500/20 to-emerald-500/20',
                color: 'text-green-600',
              },
            ].map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="group relative"
                >
                  <div className={`bg-gradient-to-br ${value.gradient} rounded-3xl p-8 border-2 border-transparent hover:border-gp-accent/30 transition-all duration-300 h-full shadow-lg hover:shadow-2xl`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                    >
                      <Icon className={`h-10 w-10 ${value.color}`} />
                    </motion.div>
                    <h3 className="text-2xl font-display font-bold text-gp-ink mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gp-ink-muted leading-relaxed text-lg">
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
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-10 shadow-xl border border-gp-ink/10"
            >
              <div className="inline-block px-4 py-2 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full mb-6">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Mission
                </span>
              </div>
              <p className="text-lg text-gp-ink-muted leading-relaxed">
                To constantly endeavour to be the Preferred Developer of Residential, Commercial 
                and Hospitality spaces in the markets in which we operate, without compromising 
                on our Core Values, for the benefit of all our Stakeholders.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white rounded-3xl p-10 shadow-xl border border-gp-ink/10"
            >
              <div className="inline-block px-4 py-2 bg-gradient-to-br from-gp-gold to-gp-accent rounded-full mb-6">
                <span className="text-sm font-bold text-white uppercase tracking-wider">
                  Vision
                </span>
              </div>
              <p className="text-lg text-gp-ink-muted leading-relaxed">
                To be a World-class Organisation in our Products, Processes, People and Performance.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-4">
                Service Areas
              </h2>
              <p className="text-lg text-gp-ink-muted leading-relaxed">
                Proudly serving prime locations across Bengaluru and surrounding areas
              </p>
            </motion.div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                'Kattigenahalli',
                'Hunasamaranahalli',
                'Yelahanka',
                'Chikkaballapur',
                'And surrounding areas in Bengaluru',
              ].map((area, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-br from-white to-gp-surface/5 rounded-2xl border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-3 h-3 bg-gradient-to-br from-gp-accent to-gp-gold rounded-full flex-shrink-0" />
                  <span className="text-gp-ink font-medium">{area}</span>
                </motion.div>
              ))}
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
                CHAIRMAN&apos;S DESK
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mt-4 mb-4">
                A Message from Our Chairman
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              {/* Chairman Photo */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-1"
              >
                                  <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-gp-surface to-gp-bg shadow-xl">
                    <Image
                      src="https://i.pravatar.cc/400?img=12"
                      alt="Mr. Krishnakumar Goyal - Chairman & Managing Director"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                <div className="mt-6 text-center">
                  <h3 className="text-2xl font-display font-bold text-gp-ink mb-2">
                    Mr. Krishnakumar Goyal
                  </h3>
                  <p className="text-lg text-gp-ink-muted font-medium">
                    Chairman & Managing Director
                  </p>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gp-ink/10">
                  <Quote className="h-12 w-12 text-gp-accent mb-6" />
                  <div className="prose prose-lg max-w-none text-gp-ink-muted leading-relaxed space-y-6">
                    <p>
                      Welcome to Gani Properties Pvt. Ltd. It is with great pride and humility that 
                      I share our journey with you. Over the years, we have built a reputation founded 
                      on integrity, transparency, and an unwavering commitment to our customers.
                    </p>
                    <p>
                      What started as a vision to provide quality real estate solutions in Bengaluru has 
                      grown into a trusted name in the industry. We believe that every land parcel we 
                      offer is not just a transaction, but a foundation for dreams—whether it&apos;s a 
                      family building their first home, an investor seeking growth, or a farmer looking 
                      to cultivate their future.
                    </p>
                    <p>
                      Our success is measured not by the properties we sell, but by the trust we build 
                      and the relationships we nurture. Every property undergoes rigorous verification, 
                      ensuring legal compliance and clear titles. We stand by our promise of transparency 
                      and quality in every interaction.
                    </p>
                    <p>
                      As we continue to grow, our core values remain unchanged: putting our customers first, 
                      maintaining the highest standards of integrity, and contributing positively to 
                      Bengaluru&apos;s real estate landscape. Thank you for considering Gani Properties 
                      for your real estate needs.
                    </p>
                    <p className="font-semibold text-gp-ink pt-4">
                      — Mr. Krishnakumar Goyal
                    </p>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                name: 'Rajesh Kumar',
                location: 'Yelahanka, Bengaluru',
                property: 'Residential Plot',
                testimonial: 'Excellent service! The team at Gani Properties helped us find the perfect plot for our dream home. Clear documentation and transparent process throughout. Highly recommended!',
                rating: 5,
              },
              {
                name: 'Priya Sharma',
                location: 'Kattigenahalli',
                property: 'Farm Land',
                testimonial: 'As a first-time investor, I was nervous about buying farmland. But the team guided me through every step, answered all my questions, and ensured everything was legally verified. Thank you!',
                rating: 5,
              },
              {
                name: 'Suresh Reddy',
                location: 'Hunasamaranahalli',
                property: 'Agricultural Land',
                testimonial: 'Professional, honest, and reliable. They helped us acquire agricultural land with complete transparency. The site visit was arranged promptly and all paperwork was handled efficiently.',
                rating: 5,
              },
              {
                name: 'Anita Desai',
                location: 'Chikkaballapur',
                property: 'Residential Plot',
                testimonial: 'We had been looking for a residential plot for months. Gani Properties not only found us the perfect property but also ensured all legal checks were done. Great experience!',
                rating: 5,
              },
              {
                name: 'Vikram Singh',
                location: 'Bengaluru',
                property: 'Farm Land',
                testimonial: 'Trustworthy and professional. The team provided detailed information about the property, arranged site visits, and made the entire buying process smooth. Very satisfied!',
                rating: 5,
              },
              {
                name: 'Meera Patel',
                location: 'Yelahanka, Bengaluru',
                property: 'Residential Plot',
                testimonial: 'Excellent customer service and attention to detail. They verified everything before showing us the property. The transaction was seamless and transparent. Highly recommended!',
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gradient-to-br from-white to-gp-surface/5 rounded-3xl p-8 border border-gp-ink/10 hover:border-gp-accent/30 transition-all duration-300 hover:shadow-xl"
              >
                <Quote className="h-8 w-8 text-gp-accent mb-4" />
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 text-gp-gold fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.488 6.91l6.572-.955L10 0l2.94 5.955 6.572.955-4.757 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gp-ink-muted leading-relaxed mb-6">
                  {testimonial.testimonial}
                </p>
                <div className="pt-6 border-t border-gp-ink/10">
                  <p className="font-semibold text-gp-ink mb-1">{testimonial.name}</p>
                  <p className="text-sm text-gp-ink-muted mb-1">{testimonial.location}</p>
                  <p className="text-sm text-gp-accent font-medium">{testimonial.property}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
