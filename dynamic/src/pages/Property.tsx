import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, CheckCircle, ArrowLeft, AlertCircle } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Image from '@/components/Image';
import { propertiesApi } from '@/lib/propertiesApi';
import { Property } from '@/types/property';
import { Button } from '@/components/ui/button';
import { generateBreadcrumbSchema } from '@/lib/seo';

export default function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      loadProperty();
    }
  }, [slug]);

  const loadProperty = async () => {
    if (!slug) {
      setError('Invalid property slug');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await propertiesApi.getBySlug(slug);
      
      if (!data) {
        setError('Property not found');
      } else {
        setProperty(data);
      }
    } catch (err) {
      console.error('Error loading property:', err);
      setError('Failed to load property. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-gp-surface/5 to-white">
        <div className="container mx-auto px-4 lg:px-6 py-20">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gp-accent border-t-transparent mb-4"></div>
            <p className="text-gp-ink-muted">Loading property details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen pt-20 bg-gradient-to-b from-gp-surface/5 to-white">
        <div className="container mx-auto px-4 lg:px-6 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-12 shadow-lg border border-gp-ink/10">
              <AlertCircle className="h-16 w-16 text-gp-accent mx-auto mb-6" />
              <h1 className="text-3xl font-display font-bold text-gp-ink mb-4">
                {error || 'Property Not Found'}
              </h1>
              <p className="text-gp-ink-muted mb-8">
                {error || 'The property you are looking for does not exist or has been removed.'}
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/properties')} variant="default">
                  Browse All Properties
                </Button>
                <Button onClick={() => navigate('/')} variant="outline">
                  Go Home
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/` },
    { name: 'Properties', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/properties` },
    { name: property.title, url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property/${property.slug}` },
  ]);

  return (
    <>
      <SEOHead
        title={`${property.title} | Gani Properties`}
        description={property.description || `${property.title} in ${property.area}, ${property.city}. ${property.priceLabel || ''}`}
        keywords={[
          property.title,
          `${property.type} in ${property.area}`,
          `properties in ${property.city}`,
          property.area,
          property.city,
        ]}
        url={`${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property/${property.slug}`}
        structuredData={breadcrumbSchema}
      />

      <div className="min-h-screen pt-20 bg-gradient-to-b from-gp-surface/5 to-white">
        <div className="container mx-auto px-4 lg:px-6 py-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 lg:px-6 pb-20"
        >
          <div className="max-w-6xl mx-auto">
            {/* Main Image */}
            {property.images && property.images.length > 0 && (
              <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-3xl overflow-hidden mb-8 bg-gp-surface/5">
                <Image
                  src={property.images[0] || '/images/Land.webp'}
                  alt={property.title || 'Property image'}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Image Gallery */}
            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {property.images.slice(1, 5).map((image, index) => (
                  <div
                    key={index}
                    className="relative h-32 md:h-48 rounded-2xl overflow-hidden bg-gp-surface/5"
                  >
                    <Image
                      src={image}
                      alt={`${property.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg border border-gp-ink/10">
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-gp-ink mb-6">
                    {property.title}
                  </h1>

                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex items-center gap-2 text-gp-ink-muted">
                      <MapPin className="h-5 w-5" />
                      <span>{property.area}, {property.city}</span>
                    </div>
                    {property.postedAt && (
                      <div className="flex items-center gap-2 text-gp-ink-muted">
                        <Calendar className="h-5 w-5" />
                        <span>{new Date(property.postedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {property.priceLabel && (
                    <div className="mb-8">
                      <p className="text-3xl font-bold text-gp-accent mb-2">
                        {property.priceLabel}
                      </p>
                      {property.size && (
                        <p className="text-lg text-gp-ink-muted">{property.size}</p>
                      )}
                    </div>
                  )}

                  {property.description && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">
                        Description
                      </h2>
                      <div className="prose prose-lg max-w-none text-gp-ink-muted leading-relaxed">
                        <p className="whitespace-pre-line">{property.description}</p>
                      </div>
                    </div>
                  )}

                  {property.highlights && property.highlights.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">
                        Highlights
                      </h2>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {property.highlights.map((highlight, index) => (
                          <li key={index} className="flex items-center gap-2 text-gp-ink-muted">
                            <CheckCircle className="h-5 w-5 text-gp-accent flex-shrink-0" />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl p-8 shadow-lg border border-gp-ink/10 sticky top-24">
                  <div className="mb-6">
                    <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                      property.status === 'available' 
                        ? 'bg-green-100 text-green-800' 
                        : property.status === 'sold'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>

                  <div className="space-y-4 mb-8">
                    <div>
                      <p className="text-sm text-gp-ink-muted mb-1">Type</p>
                      <p className="font-semibold text-gp-ink capitalize">
                        {property.type.replace(/-/g, ' ')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gp-ink-muted mb-1">Location</p>
                      <p className="font-semibold text-gp-ink">{property.area}</p>
                      <p className="text-sm text-gp-ink-muted">{property.city}</p>
                    </div>
                    {property.size && (
                      <div>
                        <p className="text-sm text-gp-ink-muted mb-1">Size</p>
                        <p className="font-semibold text-gp-ink">{property.size}</p>
                      </div>
                    )}
                  </div>

                  {property.lat && property.lon && (
                    <div className="mb-8">
                      <Link
                        to={`https://www.google.com/maps?q=${property.lat},${property.lon}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full"
                      >
                        <Button className="w-full" variant="default">
                          View on Map
                        </Button>
                      </Link>
                    </div>
                  )}

                  <Link to="/contact">
                    <Button className="w-full" variant="outline">
                      Contact Us
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
