import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getActiveCategoryFromPath, getCategoryFromPropertyType } from '@/lib/route';
import { getSubcategories } from '@/config/categories';
import { PropertyType } from '@/types/property';
import Image from '@/components/Image';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const pathname = location.pathname;
  const searchParams = new URLSearchParams(location.search);
  const isHomePage = pathname === '/';
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get active category from pathname or query params
  let activeCategory = getActiveCategoryFromPath(pathname);
  
  // If on /properties page, check query params for type
  if (!activeCategory && pathname === '/properties') {
    const typeParam = searchParams.get('type');
    if (typeParam) {
      activeCategory = getCategoryFromPropertyType(typeParam as PropertyType);
    }
  }
  
  const subcategories = activeCategory ? getSubcategories(activeCategory) : [];

  useEffect(() => {
    const handleScroll = () => {
      // On homepage: transparent at top, teal after scrolling
      // On other pages: always teal
      if (isHomePage) {
        setScrolled(window.scrollY > 50);
      } else {
        setScrolled(true); // Always show background on other pages
      }
    };
    
    // Check initial scroll position
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  // Handle mouse enter/leave for hover
  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 150);
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/properties', label: 'Properties' },
    { to: '/franchise', label: 'Franchise' },
    { to: '/careers', label: 'Careers' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  // Determine header styling based on page and scroll position
  const getHeaderClasses = () => {
    if (isHomePage && !scrolled) {
      // Homepage at top: fully transparent, no blur
      return '';
    } else {
      // Homepage scrolled or other pages: teal with blur
      return 'backdrop-blur-md shadow-lg';
    }
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-500',
        getHeaderClasses()
      )}
      style={
        isHomePage && !scrolled 
          ? { backgroundColor: 'transparent', backdropFilter: 'none' } 
          : { backgroundColor: '#0F3A3D' }
      }
    >
      <nav className="container mx-auto px-4 lg:px-6">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-14 w-auto flex-shrink-0"
            >
              <Image
                src="/images/Logo.webp"
                alt="Gani Properties"
                width={120}
                height={56}
                className="h-full w-auto object-contain transition-transform group-hover:scale-110"
                priority
              />
            </motion.div>
            <span className="text-2xl font-display font-bold text-white group-hover:text-gp-accent transition-colors duration-300 hidden sm:block">
              Gani Properties
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link, index) => {
              if (link.to === '/properties' && activeCategory && subcategories.length > 0) {
                // Properties link with dropdown
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        'text-white/90 hover:text-white transition-all duration-300 font-medium flex items-center gap-1 relative group',
                        pathname === link.to && 'text-white'
                      )}
                    >
                      <span className="relative">
                        {link.label}
                        {pathname === link.to && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute bottom-0 left-0 right-0 h-0.5 bg-gp-accent"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                      </span>
                      <motion.div
                        animate={{ rotate: dropdownOpen ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Link>
                    
                    {/* Dropdown Menu */}
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gp-ink/10 overflow-hidden"
                        >
                          <div className="py-2">
                            {subcategories.map((subcategory, idx) => (
                              <motion.div
                                key={subcategory.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: idx * 0.05 }}
                              >
                                <Link
                                  to={subcategory.path}
                                  className="block px-4 py-2 text-gp-ink hover:bg-gp-surface/10 hover:text-gp-accent transition-all duration-200 hover:pl-6"
                                  onClick={() => setDropdownOpen(false)}
                                >
                                  {subcategory.label}
                                </Link>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              }
              
              // Regular link
              return (
                <motion.div
                  key={link.to}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    to={link.to}
                    className={cn(
                      'text-white/90 hover:text-white transition-all duration-300 font-medium relative group',
                      pathname === link.to && 'text-white'
                    )}
                  >
                    <span className="relative">
                      {link.label}
                      {pathname === link.to && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gp-accent"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="lg:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden pb-4 space-y-2 overflow-hidden"
            >
              {navLinks.map((link, index) => {
                if (link.to === '/properties' && activeCategory && subcategories.length > 0) {
                  // Properties link with mobile dropdown
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-1"
                    >
                      <Link
                        to={link.to}
                        className={cn(
                          'block py-2 text-white/90 hover:text-white transition-all duration-300 font-medium hover:pl-2',
                          pathname === link.to && 'text-white'
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                      {/* Mobile subcategories */}
                      <div className="pl-4 space-y-1">
                        {subcategories.map((subcategory, idx) => (
                          <motion.div
                            key={subcategory.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: (index * 0.1) + (idx * 0.05) }}
                          >
                            <Link
                              to={subcategory.path}
                              className="block py-2 text-white/70 hover:text-white transition-all duration-300 text-sm hover:pl-2"
                              onClick={() => setIsOpen(false)}
                            >
                              {subcategory.label}
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                }
                
                return (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        'block py-2 text-white/90 hover:text-white transition-all duration-300 hover:pl-2',
                        pathname === link.to && 'text-white'
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  );
}
