import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { statsApi } from './lib/statsApi';
import SEOHead from './components/SEOHead';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';
import HomePage from './pages/Home';
import Chatbot from './components/Chatbot';

import SmoothScroll from './components/SmoothScroll';

// Route-level code splitting: everything except the home page (the most-visited
// entry point, so it stays in the main bundle) loads on demand. This keeps the
// initial JS a visitor downloads limited to what the landing page actually needs,
// instead of shipping the entire site - including the admin Dashboard - up front.
const PropertiesPage = lazy(() => import('./pages/Properties'));
const PropertyPage = lazy(() => import('./pages/Property'));
const CataloguePage = lazy(() => import('./pages/Catalogue'));
const PropertyTypePage = lazy(() => import('./pages/PropertyType'));
const AboutPage = lazy(() => import('./pages/About'));
const ContactPage = lazy(() => import('./pages/Contact'));
const FranchisePage = lazy(() => import('./pages/Franchise'));
const PrivacyPage = lazy(() => import('./pages/Privacy'));
const TermsPage = lazy(() => import('./pages/Terms'));
const NotFoundPage = lazy(() => import('./pages/NotFound'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CareersPage = lazy(() => import('./pages/Careers'));
const DevelopersPage = lazy(() => import('./pages/Developers'));

function RouteFallback() {
  // Only shown on a cold direct load of a non-home route (e.g. someone opens a
  // shared /franchise link fresh) - normal in-app navigation keeps the previous
  // page visible until the next one is ready, so this rarely appears in practice.
  // No entrance animation on this one deliberately - a loading indicator has to
  // be visible on the very first painted frame, not fade in after one. An
  // opacity-from-0 animation here risks a stuck-invisible frame if anything
  // delays the animation (backgrounded tab, reduced-motion, slow first paint).
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-gp-accent/15" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gp-accent border-r-gp-gold animate-spin" />
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gp-ink-muted">
        Gani Properties
      </p>
    </div>
  );
}

function App() {
  useEffect(() => {
    statsApi.logVisit();
  }, []);

  return (
    <SmoothScroll>
      <ScrollToTop />
      <SEOHead
        title="Gani Properties - Premium Property Providers in Bangalore"
        description="Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands. Trusted real estate dealer with transparent pricing in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
      />

      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-grow relative">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
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
          </Suspense>
        </main>

        <Footer />
        <BackToTop />
        <Chatbot />
      </div>
    </SmoothScroll>
  );
}

export default App;
