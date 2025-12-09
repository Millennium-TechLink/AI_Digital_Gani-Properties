import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gp-bg via-gp-surface to-gp-bg relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gp-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gp-gold rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto text-center"
          style={{
            willChange: 'transform, opacity',
            transform: 'translate3d(0, 0, 0)',
          }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-white/90 mb-10 leading-relaxed">
            Connect with our team today to explore premium lands in Bengaluru
          </p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            style={{
              willChange: 'transform, opacity',
              transform: 'translate3d(0, 0, 0)',
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <Button
                asChild
                variant="default"
                size="lg"
                className="bg-white text-gp-ink hover:bg-gp-accent hover:text-white shadow-lg"
              >
                <a href="https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit" target="_blank" rel="noopener noreferrer">
                  <Phone className="h-5 w-5" />
                  Get Started on WhatsApp
                </a>
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10 shadow-lg"
              >
                <Link to="/contact">
                  Contact Us
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
