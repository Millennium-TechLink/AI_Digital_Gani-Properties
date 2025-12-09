import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import PropertyCard from '@/components/PropertyCard';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property } from '@/types/property';
import { generateBreadcrumbSchema } from '@/lib/seo';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CataloguePage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getAll();
      setProperties(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties. Please try again later.');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/` },
    { name: 'Catalogue', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/catalogue` },
  ]);

  return (
    <>
      <SEOHead
        title="Property Catalogue | All Properties in Bangalore | Gani Properties"
        description="Complete property catalogue featuring all available properties in Bangalore. Browse residential plots, commercial spaces, retail outlets, hospitality properties, industrial facilities, and farmland investments."
        keywords={[
          'property catalogue Bangalore',
          'all properties Bangalore',
          'property listings',
          'real estate catalogue',
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/catalogue`}
        structuredData={breadcrumbSchema}
      />

      <div className="min-h-screen pt-20 bg-gradient-to-b from-gp-surface/5 to-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 lg:px-6 py-12"
        >
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-4">
              Property Catalogue
            </h1>
            <p className="text-lg text-gp-ink-muted">
              Browse our complete collection of properties across Bangalore
            </p>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gp-accent border-t-transparent mb-4"></div>
              <p className="text-gp-ink-muted">Loading catalogue...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto text-center py-20">
              <AlertCircle className="h-16 w-16 text-gp-accent mx-auto mb-6" />
              <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">{error}</h2>
              <Button onClick={loadProperties}>Try Again</Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gp-ink-muted mb-4">No properties available at the moment</p>
              <p className="text-gp-ink-muted mb-8">Please check back later or contact us for more information.</p>
              <Button onClick={() => navigate('/contact')}>Contact Us</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {properties.map((property, index) => (
                property && (
                  <motion.div
                    key={property.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.03 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                )
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
