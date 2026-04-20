import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
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

function App() {
  useEffect(() => {
    statsApi.logVisit();
  }, []);

  return (
    <>
      <ScrollToTop />
      <SEOHead
        title="Gani Properties - Premium Property Providers in Bangalore"
        description="Leading property providers in Bangalore offering verified residential plots, farmland, and agricultural lands. Trusted real estate dealer with transparent pricing in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur."
      />
      
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
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
        </main>

        <Footer />
        <BackToTop />
        <Chatbot />
      </div>
    </>
  );
}

export default App;
