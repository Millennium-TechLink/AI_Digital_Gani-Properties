import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Ruler } from 'lucide-react';
import { statsApi } from './lib/statsApi';
import SEOHead from './components/SEOHead';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import HomePage from './pages/Home';
import PropertiesPage from './pages/Properties';
import PropertyPage from './pages/Property';
import CataloguePage from './pages/Catalogue';
import PropertyTypePage from './pages/PropertyType';
import AboutPage from './pages/About';
import ContactPage from './pages/Contact';
import FranchisePage from './pages/Franchise';
import PrivacyPage from './pages/Privacy';
import TermsPage from './pages/Terms';
import NotFoundPage from './pages/NotFound';
import Dashboard from './pages/Dashboard';
import CareersPage from './pages/Careers';
import DevelopersPage from './pages/Developers';
import Chatbot from './components/Chatbot';
import CustomCursor from './components/CustomCursor';

function App() {
  const location = useLocation();

  useEffect(() => {
    statsApi.logVisit();
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      <SEOHead
        title="Gani Properties - Premium Property Providers in Bangalore"
        description="Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands. Trusted real estate dealer with transparent pricing in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
      />
      
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        {/* Global Construction Blueprint Curtain Wipe */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            className="fixed inset-0 z-[99999] pointer-events-none flex flex-col items-center justify-center bg-[#DD2B1C] text-white"
            initial={{ scaleY: 1 }}
            animate={{ scaleY: 0 }}
            exit={{ scaleY: 1 }}
            transition={{
              duration: 0.65,
              ease: [0.76, 0, 0.24, 1], // Smooth premium wipe curve
            }}
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
              originY: 0
            }}
          >
            {/* Subtle decorative markings */}
            <div className="absolute top-8 left-8 font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] hidden sm:block">
              Gani Properties // Blueprint Schematic
            </div>
            <div className="absolute top-8 right-8 font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] hidden sm:block">
              Scale: 1:100 @ A3 // dwg.01
            </div>
            <div className="absolute bottom-8 left-8 font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] hidden sm:block">
              Elevation: +154.60m
            </div>
            <div className="absolute bottom-8 right-8 font-mono text-[9px] text-white/30 uppercase tracking-[0.2em] hidden sm:block">
              Coordinates: 12.9716° N, 77.5946° E
            </div>

            {/* Blueprint graphics */}
            <div className="relative flex flex-col items-center gap-5 text-center select-none px-6">
              {/* Outer rotating blueprint compass circle */}
              <div className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center relative bg-white/5 backdrop-blur-sm shadow-2xl">
                {/* Spinning crosshair rings */}
                <motion.div 
                  className="absolute inset-2 border border-dashed border-white/20 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute w-full h-[1px] bg-white/20 left-0 top-1/2 -translate-y-1/2" />
                <div className="absolute w-[1px] h-full bg-white/20 left-1/2 top-0 -translate-x-1/2" />
                
                {/* Pulsing architectural tool */}
                <motion.div
                  animate={{ scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Ruler className="w-8 h-8 text-white relative z-10" />
                </motion.div>
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-xl uppercase tracking-[0.3em] text-white text-shadow-sm font-bold">
                  Gani Properties
                </h4>
                <div className="w-12 h-[2px] bg-white/30 mx-auto my-1" />
                <p className="text-[10px] font-mono tracking-[0.45em] uppercase text-white/60">
                  Constructing Your Legacy
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <main className="flex-grow relative">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/properties" element={<PageTransition><PropertiesPage /></PageTransition>} />
            <Route path="/property/:slug" element={<PageTransition><PropertyPage /></PageTransition>} />
            <Route path="/catalogue" element={<PageTransition><CataloguePage /></PageTransition>} />
            <Route path="/property-type/:type" element={<PageTransition><PropertyTypePage /></PageTransition>} />
            <Route path="/developers" element={<PageTransition><DevelopersPage /></PageTransition>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><ContactPage /></PageTransition>} />
            <Route path="/franchise" element={<PageTransition><FranchisePage /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><PrivacyPage /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><TermsPage /></PageTransition>} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/careers" element={<PageTransition><CareersPage /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
          </Routes>
        </main>

        <Footer />
        <BackToTop />
        <Chatbot />
      </div>
    </>
  );
}

export default App;
