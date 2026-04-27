import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEOHead from '@/components/SEOHead';
import PropertyCard from '@/components/PropertyCard';
import FiltersBar from '@/components/FiltersBar';
import MapToggle from '@/components/MapToggle';
import { LayoutGrid, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property, PropertyFilters } from '@/types/property';
import { generateBreadcrumbSchema } from '@/lib/seo';

export default function PropertiesPage() {
  const [searchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const data = await propertiesApi.getAll();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filters: PropertyFilters = {
    search: searchParams.get('search') || '',
    type: searchParams.get('type') as any || undefined,
    price: searchParams.get('price') || '',
    size: searchParams.get('size') || '',
    sort: (searchParams.get('sort') as PropertyFilters['sort']) || 'newest',
  };

  // Determine category from filter type
  const category = useMemo(() => {
    if (!filters.type) return null;
    const type = filters.type;
    if (type === 'residential-plots' || type === 'residential-apartments' || type === 'residential-villas') {
      return 'residential';
    }
    if (type === 'commercial' || type === 'commercial-offices') {
      return 'commercial';
    }
    if (type === 'retail' || type === 'retail-shops' || type === 'retail-malls') {
      return 'retail';
    }
    if (type === 'hospitality' || type === 'hospitality-hotels' || type === 'hospitality-restaurants') {
      return 'hospitality';
    }
    if (type === 'industrial' || type === 'industrial-warehouses' || type === 'industrial-logistics') {
      return 'industrial';
    }
    if (type === 'farm-plots' || type === 'agricultural-lands') {
      return 'land';
    }
    return null;
  }, [filters.type]);

  const filteredProperties = useMemo(() => {
    let filtered: Property[] = [...properties];

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(
        p => p.title.toLowerCase().includes(query) ||
             p.area.toLowerCase().includes(query) ||
             p.city.toLowerCase().includes(query)
      );
    }

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.price) {
      filtered = filtered.filter(p => {
        if (!p.priceLabel) return false;
        const [minStr, maxStr] = filters.price!.split('-');
        const min = parseInt(minStr);
        const max = maxStr ? parseInt(maxStr) : Infinity;
        
        const priceMatch = p.priceLabel.match(/(\d+)/);
        if (!priceMatch) return true;
        const price = parseInt(priceMatch[1]);
        return price >= min && price <= max;
      });
    }

    if (filters.sort === 'newest') {
      filtered.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (filters.sort === 'price-asc') {
      filtered.sort((a, b) => {
        const aPrice = a.priceLabel?.match(/(\d+)/)?.[1] || '0';
        const bPrice = b.priceLabel?.match(/(\d+)/)?.[1] || '0';
        return parseInt(aPrice) - parseInt(bPrice);
      });
    } else if (filters.sort === 'price-desc') {
      filtered.sort((a, b) => {
        const aPrice = a.priceLabel?.match(/(\d+)/)?.[1] || '0';
        const bPrice = b.priceLabel?.match(/(\d+)/)?.[1] || '0';
        return parseInt(bPrice) - parseInt(aPrice);
      });
    }

    return filtered;
  }, [filters]);

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/` },
    { name: 'Properties', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/properties` },
  ]);

  const seoTitle = category 
    ? `${category.charAt(0).toUpperCase() + category.slice(1)} Properties in Bangalore | Gani Properties`
    : 'All Properties in Bangalore | Residential Plots, Commercial & More | Gani Properties';

  const seoDescription = category
    ? `Browse ${category} properties in Bangalore. Find verified ${category} plots, land, and properties in Kattigenahalli, Yelahanka, Hunasamaranahalli, and Chikkaballapur.`
    : 'Browse all available properties in Bangalore from Gani Properties. Residential plots, commercial spaces, retail outlets, hospitality properties, industrial facilities, and farmland. Verified titles and transparent pricing.';

  return (
    <>
      <SEOHead
        title={seoTitle}
        description={seoDescription}
        keywords={[
          category ? `${category} properties Bangalore` : 'properties Bangalore',
          'real estate Bangalore',
          'property listings Bangalore',
          ...(category ? [`${category} plots`, `${category} land`] : []),
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/properties${filters.type ? `?type=${filters.type}` : ''}`}
        structuredData={breadcrumbSchema}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pt-28 pb-12 bg-white"
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="max-w-3xl">
            {category === 'residential' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  At Gani Properties, we build more than homes. We give life to dreams of homeowners.
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  We prioritise offering nothing short of the finest residential properties and remain steadfast in our dedication to orchestrating an unparalleled home-buying experience for our customers.
                </p>
              </div>
            ) : category === 'commercial' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  Our commercial portfolio showcases meticulously designed spaces that redefine 21st-century workplaces.
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  Embrace innovation and empower your business with Gani Properties&apos; industry-leading commercial projects.
                </p>
              </div>
            ) : category === 'retail' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  Step into a realm of retail excellence with Gani Properties&apos; dynamic projects designed to fuel the growth of your business.
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  Crafted to be more than just spaces, these facilities serve as consumer magnets, generating footfalls that drive success.
                </p>
              </div>
            ) : category === 'hospitality' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  The diverse portfolio of Gani Properties Hospitality projects, designed to exceed your expectations, ensures a seamless blend of comfort and opulence.
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  Our properties go beyond the ordinary, promising a world-class experience.
                </p>
              </div>
            ) : category === 'industrial' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  An industrial ecosystem where innovation, sustainability, and human-centric design converge to power tomorrow&apos;s leaders.
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  Gani Properties Industrial Park redefines industrial real estate in Bengaluru.
                </p>
              </div>
            ) : category === 'land' ? (
              <div className="relative">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gp-accent to-gp-gold rounded-full" />
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3] pl-6">
                  Premium Land Investments
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed pl-6">
                  Discover premium farmland and agricultural lands for cultivation, farming, and investment across Bengaluru.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gp-ink mb-4 leading-[1.3]">
                  All Properties
                </h1>
                <p className="text-base md:text-lg text-gp-ink-muted leading-relaxed">
                  Browse our complete collection of properties—from residential plots and apartments to commercial spaces, retail outlets, hospitality establishments, industrial facilities, and land investments across Bengaluru
                </p>
              </>
            )}
          </div>
        </div>
      </motion.div>

      <FiltersBar />

      <div className="container mx-auto px-4 lg:px-6 py-12">
        {loading && (
          <div className="text-center py-20">
            <p className="text-gp-ink-muted">Loading properties...</p>
          </div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-between items-center mb-8"
        >
          <p className="text-gp-ink-muted">
            {filteredProperties.length} property{filteredProperties.length !== 1 ? 'ies' : ''} found
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
        </motion.div>

        {viewMode === 'grid' ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <MapToggle
              properties={filteredProperties}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </motion.div>
        )}

        {filteredProperties.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-20"
          >
            <p className="text-xl text-gp-ink-muted mb-4">No properties found</p>
            <p className="text-gp-ink-muted">Try adjusting your filters</p>
          </motion.div>
        )}
      </div>
    </>
  );
}
