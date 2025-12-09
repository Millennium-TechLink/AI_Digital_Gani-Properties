import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import PropertyCard from '@/components/PropertyCard';
import FiltersBar from '@/components/FiltersBar';
import MapToggle from '@/components/MapToggle';
import { LayoutGrid, Map as MapIcon, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property, PropertyType } from '@/types/property';
import { generateBreadcrumbSchema } from '@/lib/seo';

export default function PropertyTypePage() {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (type) {
      loadProperties();
    }
  }, [type]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getAll();
      const filtered = Array.isArray(data) 
        ? data.filter(p => p?.type === type)
        : [];
      setProperties(filtered);
    } catch (err) {
      console.error('Error loading properties:', err);
      setError('Failed to load properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const typeNames: Record<string, string> = {
    'residential-plots': 'Residential Plots',
    'residential-apartments': 'Residential Apartments',
    'residential-villas': 'Residential Villas',
    'commercial': 'Commercial Properties',
    'retail': 'Retail Properties',
    'hospitality': 'Hospitality Properties',
    'industrial': 'Industrial Properties',
    'land': 'Land Properties',
  };

  const typeName = type ? typeNames[type] || type.replace(/-/g, ' ') : 'Properties';

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/` },
    { name: 'Properties', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/properties` },
    { name: typeName, url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property-type/${type}` },
  ]);

  if (!type) {
    return (
      <div className="min-h-screen pt-20">
        <div className="container mx-auto px-4 lg:px-6 py-20 text-center">
          <h1 className="text-4xl font-display font-bold text-gp-ink mb-4">Invalid Property Type</h1>
          <Button onClick={() => navigate('/properties')}>Browse All Properties</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={`${typeName} in Bangalore | Gani Properties`}
        description={`Browse ${typeName.toLowerCase()} in Bangalore. Verified properties with transparent pricing in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur.`}
        keywords={[
          typeName.toLowerCase(),
          `${typeName.toLowerCase()} Bangalore`,
          `properties in Bangalore`,
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property-type/${type}`}
        structuredData={breadcrumbSchema}
      />

      <div className="min-h-screen pt-20 bg-gradient-to-b from-gp-surface/5 to-white">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <Button
            onClick={() => navigate('/properties')}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Properties
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 lg:px-6 pb-12"
        >
          <div className="max-w-3xl mb-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-4">
              {typeName}
            </h1>
            <p className="text-lg text-gp-ink-muted">
              Browse our collection of {typeName.toLowerCase()} in Bangalore
            </p>
          </div>

          <FiltersBar />

          <div className="mt-8 flex justify-between items-center mb-8">
            <p className="text-gp-ink-muted">
              {properties.length} {properties.length !== 1 ? 'properties' : 'property'} found
            </p>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="h-4 w-4" />
                Grid
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('map')}
              >
                <MapIcon className="h-4 w-4" />
                Map
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gp-accent border-t-transparent mb-4"></div>
              <p className="text-gp-ink-muted">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-xl text-gp-ink-muted mb-4">{error}</p>
              <Button onClick={loadProperties}>Try Again</Button>
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gp-ink-muted mb-4">No properties found in this category</p>
              <Button onClick={() => navigate('/properties')}>Browse All Properties</Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, index) => (
                property && (
                  <motion.div
                    key={property.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <PropertyCard property={property} />
                  </motion.div>
                )
              ))}
            </div>
          ) : (
            <MapToggle
              properties={properties}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </motion.div>
      </div>
    </>
  );
}
