import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Image from '@/components/Image';
import { ArrowRight } from 'lucide-react';

const categories = [
  {
    slug: 'residential-plots',
    title: 'Residential',
    description: 'Plots, apartments, and villas for your dream home',
    image: '/images/Residential.webp',
    count: '150+',
    gradient: 'from-blue-500/20 to-purple-500/20',
    link: '/properties?type=residential-plots',
  },
  {
    slug: 'commercial',
    title: 'Commercial',
    description: 'Office spaces and commercial properties for business',
    image: '/images/Commercial.webp',
    count: '80+',
    gradient: 'from-indigo-500/20 to-blue-500/20',
    link: '/properties?type=commercial',
  },
  {
    slug: 'retail',
    title: 'Retail',
    description: 'Shops, malls, and retail spaces in prime locations',
    image: '/images/Retail.webp',
    count: '60+',
    gradient: 'from-pink-500/20 to-rose-500/20',
    link: '/properties?type=retail',
  },
  {
    slug: 'hospitality',
    title: 'Hospitality',
    description: 'Hotels, restaurants, and hospitality establishments',
    image: '/images/Hospitality.webp',
    count: '40+',
    gradient: 'from-orange-500/20 to-amber-500/20',
    link: '/properties?type=hospitality',
  },
  {
    slug: 'industrial',
    title: 'Industrial',
    description: 'Warehouses, logistics parks, and industrial spaces',
    image: '/images/Industrial.webp',
    count: '50+',
    gradient: 'from-gray-500/20 to-slate-500/20',
    link: '/properties?type=industrial',
  },
  {
    slug: 'farm-plots',
    title: 'Land',
    description: 'Farm plots and agricultural lands for investment',
    image: '/images/Land.webp',
    count: '120+',
    gradient: 'from-green-500/20 to-emerald-500/20',
    link: '/properties?type=farm-plots',
  },
];

export default function ImmersiveCategories() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      {/* Background Elements */}
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
            PROPERTY TYPES
          </span>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-gp-ink mb-6">
            Discover Your Perfect Match
          </h2>
          <p className="text-xl text-gp-ink-muted leading-relaxed">
            From residential properties to commercial spaces, retail outlets, hospitality establishments, and industrial facilities—find the property that aligns with your vision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="group"
              style={{
                willChange: 'transform, opacity',
                transform: 'translate3d(0, 0, 0)',
              }}
            >
              <Link to={category.link || `/property-type/${category.slug}`}>
                <div className="relative h-[500px] rounded-3xl overflow-hidden bg-gradient-to-br from-gp-surface to-gp-bg cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500">
                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <Image
                      src={category.image}
                      alt={category.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      style={{
                        willChange: 'transform',
                        transform: 'translate3d(0, 0, 0)',
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-b ${category.gradient} z-10`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-gp-surface via-gp-surface/50 to-transparent z-20" />
                  </div>

                  {/* Content */}
                  <div className="absolute inset-0 z-30 flex flex-col justify-end p-8">
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium text-white mb-3">
                        {category.count} Available
                      </span>
                    </div>
                    <h3 className="text-3xl font-display font-bold text-white mb-3 group-hover:text-gp-accent transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-white group-hover:text-gp-accent transition-colors font-medium">
                      <span>Explore</span>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
