import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from '@/components/Image';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setNewsletterLoading(true);
    
    try {
      const formData = {
        name: 'Newsletter',
        phone: '0000000000',
        email,
        interest: 'Newsletter',
        message: 'Newsletter subscription',
        page: window.location.pathname,
      };

      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      const response = await axios.post(`${API_BASE}/leads`, formData);

      if (response.data.success) {
        alert('Thank you for subscribing!');
        setEmail('');
      } else {
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  return (
    <footer className="bg-gp-bg text-white relative overflow-hidden">
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gp-accent/50 to-transparent" />
      
      <div className="container mx-auto px-4 lg:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="relative h-12 w-auto flex-shrink-0">
                <Image
                  src="/images/Logo.webp"
                  alt="Gani Properties"
                  width={100}
                  height={48}
                  className="h-full w-auto object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-display font-bold text-white group-hover:text-gp-accent transition-colors">Gani Properties</span>
                <span className="text-xs text-white/70">Pvt. Ltd. • Builders and Developers</span>
              </div>
            </Link>
            <p className="text-white/80 leading-relaxed">
              Your trusted partner in finding the perfect Layout for your dreams. 
              With verified titles and transparent pricing.
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { to: '/properties', label: 'Browse Properties' },
                { to: '/properties?type=residential-plots', label: 'Residential Plots' },
                { to: '/properties?type=farm-plots', label: 'Layouts' },
                { to: '/about', label: 'About Us' },
              ].map((link, index) => (
                <motion.li
                  key={link.to}
                  initial={{ opacity: 0, x: 0 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                  className="list-none m-0 p-0"
                >
                  <Link
                    to={link.to}
                    className="text-white/80 hover:text-gp-accent transition-all duration-300 hover:pl-2 inline-block py-1"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-gp-accent mt-0.5 flex-shrink-0" />
                <span className="text-white/80">
                  Bengaluru, Karnataka
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-gp-accent flex-shrink-0" />
                <a href="tel:+919900570799" className="text-white/80 hover:text-gp-accent transition-colors">
                  +91 99005 70799
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-gp-accent flex-shrink-0" />
                <a href="mailto:marketing@ourganiproperties.com" className="text-white/80 hover:text-gp-accent transition-colors">
                  marketing@ourganiproperties.com
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <h3 className="font-display font-semibold mb-4 text-white">Get Updates</h3>
            <p className="text-white/80 text-sm mb-4 leading-relaxed">
              Subscribe to get notified about new properties and special offers.
            </p>
            <form onSubmit={handleNewsletter} className="flex flex-col sm:flex-row gap-2">
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-white/30 text-white placeholder:text-white/70 focus:border-white/50 flex-1"
              />
              <Button
                type="submit"
                disabled={newsletterLoading}
                className="bg-gp-accent text-gp-ink hover:bg-gp-gold whitespace-nowrap"
              >
                {newsletterLoading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-white/10 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:pr-20">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-white/80 text-sm text-center md:text-left"
            >
              © {new Date().getFullYear()} Gani Properties Pvt. Ltd. All rights reserved.
            </motion.p>
            <div className="flex gap-4">
              {[
                { to: '/privacy', label: 'Privacy Policy' },
                { to: '/terms', label: 'Terms of Service' },
              ].map((link, index) => (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                >
                  <Link
                    to={link.to}
                    className="text-white/80 hover:text-gp-accent transition-all duration-300 text-sm hover:underline"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              {[
                { href: 'https://www.facebook.com', icon: Facebook, label: 'Facebook' },
                { href: 'https://www.instagram.com', icon: Instagram, label: 'Instagram' },
                { href: 'https://x.com', icon: null, label: 'X (formerly Twitter)' },
                { href: 'https://www.linkedin.com', icon: Linkedin, label: 'LinkedIn' },
              ].map((social, index) => (
                <motion.a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                  className="text-white/80 hover:text-gp-accent transition-colors duration-300"
                  aria-label={social.label}
                >
                  {social.icon ? (
                    <social.icon className="h-5 w-5" />
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  )}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
