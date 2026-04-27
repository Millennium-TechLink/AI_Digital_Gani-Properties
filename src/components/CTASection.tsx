import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="py-28 bg-[#F9F9F9] relative overflow-hidden">
      {/* Red glow accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DD2B1C]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#DD2B1C]/3 rounded-full blur-3xl pointer-events-none" />
      
      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DD2B1C]/20 to-transparent" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-[#DD2B1C]/60" />
            <span className="text-[10px] font-black text-[#DD2B1C] uppercase tracking-[0.4em]">Get Started</span>
            <div className="h-px w-8 bg-[#DD2B1C]/60" />
          </div>

          <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] mb-5 leading-tight">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-[#666] mb-10 leading-relaxed font-medium">
            Connect with our team today to explore premium lands in Bengaluru.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.a
              href="https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-8 py-3.5 bg-[#DD2B1C] text-white text-[10px] font-black uppercase tracking-[0.25em] hover:bg-red-700 transition-colors shadow-lg shadow-red-900/10"
            >
              <Phone className="h-4 w-4" />
              Get Started on WhatsApp
            </motion.a>

            <motion.div
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to="/contact"
                className="flex items-center gap-2 px-8 py-3.5 border border-black/10 text-[#1A1A1A] text-[10px] font-black uppercase tracking-[0.25em] hover:bg-black/5 transition-colors backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
