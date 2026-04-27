import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, ArrowLeft, Phone, Mail, ExternalLink } from 'lucide-react';
import SEOHead from '@/components/SEOHead';
import Image from '@/components/Image';
import LeadForm from '@/components/LeadForm';
import { propertiesApi, PropertiesApiError } from '@/lib/propertiesApi';
import { Property } from '@/types/property';
import { generatePropertySchema, generateBreadcrumbSchema } from '@/lib/seo';
import { Button } from '@/components/ui/button';

export default function PropertyPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (slug) {
      loadProperty();
    }
  }, [slug]);

  const loadProperty = async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertiesApi.getBySlug(slug);
      
      if (!data) {
        setError('Property not found');
        setLoading(false);
        return;
      }
      
      setProperty(data);
    } catch (err) {
      if (err instanceof PropertiesApiError) {
        setError(err.message);
      } else {
        setError('Failed to load property. Please try again later.');
      }
      console.error('Error loading property:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <SEOHead title="Loading Property..." />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gp-accent mx-auto mb-4"></div>
            <p className="text-gp-ink-muted">Loading property details...</p>
          </div>
        </div>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <SEOHead title="Property Not Found" />
        <div className="min-h-screen pt-20 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <h1 className="text-3xl font-display font-bold text-gp-ink mb-4">
              Property Not Found
            </h1>
            <p className="text-gp-ink-muted mb-6">
              {error || 'The property you are looking for does not exist or has been removed.'}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/properties')} variant="default">
                Browse Properties
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline">
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Home', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/` },
    { name: 'Properties', url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/properties` },
    { name: property.title, url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property/${property.slug}` },
  ]);

  const propertySchema = generatePropertySchema({
    ...property,
    url: `${import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com'}/property/${property.slug}`,
  });

  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://ganiproperties.com';

  return (
    <>
      <SEOHead
        title={`${property.title} | ${property.area}, ${property.city} | Gani Properties`}
        description={property.description || `Explore ${property.title} in ${property.area}, ${property.city}. ${property.priceLabel ? `Price: ${property.priceLabel}.` : ''} ${property.size ? `Size: ${property.size}.` : ''} Contact Gani Properties for more details.`}
        image={property.images[0]}
        keywords={[
          property.title,
          `${property.type} ${property.city}`,
          `property in ${property.area}`,
          `real estate ${property.city}`,
          property.area,
          property.city,
        ]}
        url={`${siteUrl}/property/${property.slug}`}
        type="product"
        structuredData={[propertySchema, breadcrumbSchema]}
      />

      <div className="min-h-screen pt-20">
        {/* Back Button */}
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Property Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 lg:px-6 mb-8"
        >
          <div className="max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gp-ink mb-4">
              {property.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gp-ink-muted mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{property.area}, {property.city}</span>
              </div>
              {property.postedAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(property.postedAt).toLocaleDateString('en-IN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>
              )}
            </div>
            {property.priceLabel && (
              <p className="text-2xl font-semibold text-gp-accent mb-4">
                {property.priceLabel}
              </p>
            )}
            {property.size && (
              <p className="text-lg text-gp-ink-muted mb-6">
                Size: {property.size}
              </p>
            )}
          </div>
        </motion.div>

        {/* Image Gallery */}
        {property.images && property.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="container mx-auto px-4 lg:px-6 mb-12"
          >
            <div className="max-w-6xl">
              {/* Main Image */}
              <div className="relative w-full h-[400px] md:h-[600px] rounded-2xl overflow-hidden mb-4">
                <Image
                  src={property.images[selectedImageIndex] || property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative h-20 md:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImageIndex === index
                          ? 'border-gp-accent scale-105'
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${property.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Property Details */}
        <div className="container mx-auto px-4 lg:px-6 mb-12">
          <div className="max-w-6xl grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 mb-6"
              >
                <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">
                  Description
                </h2>
                <p className="text-gp-ink-muted leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </motion.div>

              {/* Highlights */}
              {property.highlights && property.highlights.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="bg-white rounded-2xl p-6 md:p-8 mb-6"
                >
                  <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">
                    Key Features
                  </h2>
                  <ul className="grid md:grid-cols-2 gap-3">
                    {property.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-gp-accent rounded-full"></span>
                        <span className="text-gp-ink-muted">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Map */}
              {property.lat && property.lon && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="bg-white rounded-2xl p-6 md:p-8 mb-6"
                >
                  <h2 className="text-2xl font-display font-bold text-gp-ink mb-4">
                    Location
                  </h2>
                  <div className="relative w-full h-64 rounded-xl overflow-hidden bg-gp-surface border border-gp-ink/5">
                    <iframe
                      src={`https://maps.google.com/maps?q=${property.lat},${property.lon}&z=15&output=embed`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map showing location of ${property.title}`}
                      className="grayscale-[0.2] contrast-[1.1]"
                    />
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${property.lat},${property.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-gp-accent hover:text-gp-gold transition-colors"
                  >
                    Open in Google Maps
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-2xl p-6 md:p-8 sticky top-24"
              >
                <h2 className="text-xl font-display font-bold text-gp-ink mb-6">
                  Interested in this property?
                </h2>
                <LeadForm propertyTitle={property.title} />
                
                <div className="mt-6 pt-6 border-t border-gp-ink/10">
                  <h3 className="text-lg font-semibold text-gp-ink mb-4">Contact Us</h3>
                  <div className="space-y-3">
                    <a
                      href="tel:+919900570799"
                      className="flex items-center gap-3 text-gp-ink-muted hover:text-gp-accent transition-colors"
                    >
                      <Phone className="h-5 w-5" />
                      <span>+91 99005 70799</span>
                    </a>
                    <a
                      href="mailto:info@ourganiproperties.com"
                      className="flex items-center gap-3 text-gp-ink-muted hover:text-gp-accent transition-colors"
                    >
                      <Mail className="h-5 w-5" />
                      <span>info@ourganiproperties.com</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Related Properties */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="container mx-auto px-4 lg:px-6 mb-12"
        >
          <div className="max-w-6xl">
            <h2 className="text-2xl font-display font-bold text-gp-ink mb-6">
              More Properties
            </h2>
            <Link
              to="/properties"
              className="inline-flex items-center text-gp-accent hover:text-gp-gold transition-colors"
            >
              View All Properties
              <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
            </Link>
          </div>
        </motion.div>
      </div>
    </>
  );
}
