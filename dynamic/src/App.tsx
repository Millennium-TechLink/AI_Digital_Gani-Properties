import { useEffect, Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { statsApi } from './lib/statsApi';
import SEOHead from './components/SEOHead';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import PageTransition from './components/PageTransition';
import HomePage from './pages/Home';
import Chatbot from './components/Chatbot';

import SmoothScroll from './components/SmoothScroll';

// Route-level code splitting: everything except the home page (the most-visited
// entry point, so it stays in the main bundle) loads on demand. This keeps the
// initial JS a visitor downloads limited to what the landing page actually needs,
// instead of shipping the entire site - including the admin Dashboard - up front.
//
// Each import is kept as a named function (not inlined into lazy() directly) so
// the exact same function can be called again below to prefetch the chunk in
// the background - that's what actually makes navigation feel smooth, rather
// than a loading indicator that just hides the wait.
const importProperties = () => import('./pages/Properties');
const importProperty = () => import('./pages/Property');
const importCatalogue = () => import('./pages/Catalogue');
const importPropertyType = () => import('./pages/PropertyType');
const importAbout = () => import('./pages/About');
const importContact = () => import('./pages/Contact');
const importFranchise = () => import('./pages/Franchise');
const importPrivacy = () => import('./pages/Privacy');
const importTerms = () => import('./pages/Terms');
const importNotFound = () => import('./pages/NotFound');
const importDashboard = () => import('./pages/Dashboard');
const importCareers = () => import('./pages/Careers');
const importDevelopers = () => import('./pages/Developers');

const PropertiesPage = lazy(importProperties);
const PropertyPage = lazy(importProperty);
const CataloguePage = lazy(importCatalogue);
const PropertyTypePage = lazy(importPropertyType);
const AboutPage = lazy(importAbout);
const ContactPage = lazy(importContact);
const FranchisePage = lazy(importFranchise);
const PrivacyPage = lazy(importPrivacy);
const TermsPage = lazy(importTerms);
const NotFoundPage = lazy(importNotFound);
const Dashboard = lazy(importDashboard);
const CareersPage = lazy(importCareers);
const DevelopersPage = lazy(importDevelopers);

// requestIdleCallback isn't available in Safari - fall back to a short timeout.
const onIdle = (cb: () => void) =>
  'requestIdleCallback' in window ? window.requestIdleCallback(cb) : setTimeout(cb, 200);

function App() {
  useEffect(() => {
    statsApi.logVisit();

    // Prefetch every route's chunk shortly after the home page has painted,
    // so by the time someone actually clicks a nav link, the code is already
    // downloaded and cached - the navigation just mounts it, no visible wait.
    onIdle(() => {
      [
        importProperties, importProperty, importCatalogue, importPropertyType,
        importAbout, importContact, importFranchise, importPrivacy, importTerms,
        importNotFound, importDashboard, importCareers, importDevelopers,
      ].forEach((importFn) => importFn());
    });
  }, []);

  return (
    <SmoothScroll>
      <SEOHead
        title="Gani Properties - Premium Property Providers in Bangalore"
        description="Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands. Trusted real estate dealer with transparent pricing in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
      />

      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-grow relative">
          {/* No visible fallback - with the routes prefetched on idle above,
              the lazy import almost always resolves before it's ever needed.
              For the rare cold direct-load case where it hasn't resolved yet,
              rendering nothing briefly reads as smoother than a spinner popping
              in and back out. */}
          <Suspense fallback={null}>
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
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
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
