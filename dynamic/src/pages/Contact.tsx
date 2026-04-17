import { motion, useInView } from 'framer-motion';
import { useRef, lazy, Suspense } from 'react';
import SEOHead from '@/components/SEOHead';
import { MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LeadForm from '@/components/LeadForm';
const OfficeMap = lazy(() => import('@/components/OfficeMap'));
import 'leaflet/dist/leaflet.css';

export default function ContactPage() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <>
      <SEOHead
        title="Contact Gani Properties - Property Providers in Bangalore | Phone, Email, WhatsApp"
        description="Contact Gani Properties for your real estate needs. Call +91 99005 70799, email marketing@ourganiproperties.com, or visit us in Ballari. Schedule site visits for properties in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
        keywords={[
          'contact Gani Properties',
          'property dealers contact Bangalore',
          'real estate contact Bangalore',
          'Gani Properties phone number',
          'property inquiry Bangalore',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/contact`}
      />

      {/* Hero Section */}
      <div className="pt-32 pb-20 bg-gradient-to-b from-gp-surface/5 via-white to-white relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
              CONTACT US
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-gp-ink mb-6">
              Let&apos;s Start a Conversation
            </h1>
            <p className="text-xl md:text-2xl text-gp-ink-muted leading-relaxed">
              Have questions? Want to schedule a site visit? We&apos;re here to help you find your perfect property.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Contact Form & Info Section */}
      <section ref={ref} className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(201,181,137,1)_25%,rgba(201,181,137,1)_50%,transparent_50%,transparent_75%,rgba(201,181,137,1)_75%,rgba(201,181,137,1)_100%)] bg-[length:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-7xl mx-auto relative">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7"
              >
                <div className="bg-gradient-to-br from-white to-gp-surface/5 rounded-3xl p-8 md:p-10 shadow-xl border border-gp-ink/10">
                  <LeadForm context="contact" />
                </div>
              </motion.div>

              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 space-y-8"
              >
                <div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-gp-ink mb-8">
                    Get in Touch
                  </h2>

                  <div className="space-y-4">
                    {[
                      {
                        icon: MapPin,
                        title: 'Head Office',
                        content: '2nd Floor, Neema Square, Moka Road\nBasaveshwara Nagar, Ballari\nKarnataka 583103',
                        link: 'https://maps.google.com/?q=Gani+Properties,+2nd+Floor,+Neema+Square,+Moka+Road,+Basaveshwara+Nagar,+Ballari,+Karnataka+583103',
                      },
                      {
                        icon: Phone,
                        title: 'Phone',
                        content: '+91 99005 70799',
                        link: 'tel:+919900570799',
                      },
                      {
                        icon: Mail,
                        title: 'Email',
                        content: 'marketing@ourganiproperties.com',
                        link: 'mailto:marketing@ourganiproperties.com',
                      },
                      {
                        icon: Clock,
                        title: 'Business Hours',
                        content: 'Monday - Saturday: 9:00 AM - 7:00 PM\nSunday: 10:00 AM - 5:00 PM',
                        link: null,
                      },
                    ].map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.div
                          key={item.title}
                          initial={{ opacity: 0, y: 20 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                          className="flex items-start gap-4 p-5 bg-white rounded-2xl border border-gp-ink/10 hover:border-gp-accent/30 hover:shadow-lg transition-all duration-300 group"
                        >
                          <div className="w-14 h-14 bg-gradient-to-br from-gp-accent/20 to-gp-gold/20 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                            <Icon className="h-7 w-7 text-gp-accent" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-display font-semibold text-gp-ink mb-2 text-lg">
                              {item.title}
                            </h3>
                            {item.link ? (
                              <a
                                href={item.link}
                                className="text-gp-ink-muted hover:text-gp-accent transition-colors whitespace-pre-line"
                              >
                                {item.content}
                              </a>
                            ) : (
                              <p className="text-gp-ink-muted whitespace-pre-line">
                                {item.content}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* WhatsApp CTA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="pt-8 border-t border-gp-ink/10"
                >
                  <div className="bg-gradient-to-br from-gp-surface to-gp-bg rounded-3xl p-8 text-white">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                        <MessageCircle className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-display font-semibold text-xl">Prefer WhatsApp?</h3>
                    </div>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      Get instant responses on WhatsApp for quick queries and site visit bookings.
                    </p>
                    <Button
                      asChild
                      size="lg"
                      className="w-full bg-white text-gp-ink hover:bg-gp-accent hover:text-white transition-colors"
                    >
                      <a
                        href="https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
                        </svg>
                        Chat on WhatsApp
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-gradient-to-b from-white via-gp-surface/5 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 lg:px-6 relative z-10">
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-sm font-medium text-gp-accent uppercase tracking-wider mb-4 block">
                VISIT US
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-4">
                Find Our Location
              </h2>
              <p className="text-lg text-gp-ink-muted leading-relaxed max-w-2xl mx-auto">
                Visit us in Ballari to discuss your property needs in person.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-[500px] rounded-3xl overflow-hidden border border-gp-ink/10 shadow-2xl bg-white"
            >
              <Suspense fallback={
                <div className="h-full w-full flex items-center justify-center bg-gp-surface/5">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gp-accent"></div>
                </div>
              }>
                <OfficeMap />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
