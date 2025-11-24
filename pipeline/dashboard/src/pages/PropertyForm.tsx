import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { propertiesApi } from '../api/properties';
import { PropertyType } from '../types/property';
import ImageUpload from '../components/ImageUpload';
import GoogleMapsInput from '../components/GoogleMapsInput';
import { ArrowLeft, Save, Sparkles, CheckCircle2 } from 'lucide-react';

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'residential-plots', label: 'Residential Plots' },
  { value: 'residential-apartments', label: 'Residential Apartments' },
  { value: 'residential-villas', label: 'Residential Villas' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'commercial-offices', label: 'Commercial Offices' },
  { value: 'retail', label: 'Retail' },
  { value: 'retail-shops', label: 'Retail Shops' },
  { value: 'retail-malls', label: 'Retail Malls' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'hospitality-hotels', label: 'Hospitality Hotels' },
  { value: 'hospitality-restaurants', label: 'Hospitality Restaurants' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'industrial-warehouses', label: 'Industrial Warehouses' },
  { value: 'industrial-logistics', label: 'Industrial Logistics' },
  { value: 'farm-plots', label: 'Farm Plots' },
  { value: 'agricultural-lands', label: 'Agricultural Lands' },
];

const propertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum([
    'residential-plots',
    'residential-apartments',
    'residential-villas',
    'commercial',
    'commercial-offices',
    'retail',
    'retail-shops',
    'retail-malls',
    'hospitality',
    'hospitality-hotels',
    'hospitality-restaurants',
    'industrial',
    'industrial-warehouses',
    'industrial-logistics',
    'farm-plots',
    'agricultural-lands',
  ]),
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  priceLabel: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(['available', 'sold', 'new']),
  highlights: z.string().optional(),
  lat: z.string().optional(),
  lon: z.string().optional(),
  googleMapsUrl: z.string().optional(),
  images: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function PropertyForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [extractedLat, setExtractedLat] = useState<number | undefined>();
  const [extractedLng, setExtractedLng] = useState<number | undefined>();
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      status: 'available',
      images: [],
      googleMapsUrl: '',
    },
  });

  const images = watch('images');
  const googleMapsUrl = watch('googleMapsUrl');

  useEffect(() => {
    if (isEditing && id) {
      loadProperty(id);
    }
  }, [id, isEditing]);

  const loadProperty = async (propertyId: string) => {
    try {
      const property = await propertiesApi.getById(propertyId);
      setValue('title', property.title);
      setValue('type', property.type);
      setValue('city', property.city);
      setValue('area', property.area);
      setValue('priceLabel', property.priceLabel || '');
      setValue('size', property.size || '');
      setValue('status', property.status);
      setValue('highlights', property.highlights.join(', '));
      setValue('lat', property.lat?.toString() || '');
      setValue('lon', property.lon?.toString() || '');
      setValue('images', property.images || []);
      setValue('description', property.description);
      setExtractedLat(property.lat);
      setExtractedLng(property.lon);
    } catch (err) {
      setError('Failed to load property');
      console.error(err);
    }
  };

  const handleCoordinatesExtracted = (lat: number, lng: number) => {
    setExtractedLat(lat);
    setExtractedLng(lng);
    setValue('lat', lat.toString());
    setValue('lon', lng.toString());
  };

  const onSubmit = async (data: PropertyFormData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const propertyData = {
        title: data.title,
        type: data.type,
        city: data.city,
        area: data.area,
        priceLabel: data.priceLabel || undefined,
        size: data.size || undefined,
        status: data.status,
        highlights: data.highlights
          ? data.highlights.split(',').map(h => h.trim()).filter(Boolean)
          : [],
        lat: extractedLat || (data.lat ? parseFloat(data.lat) : undefined),
        lon: extractedLng || (data.lon ? parseFloat(data.lon) : undefined),
        googleMapsUrl: data.googleMapsUrl || undefined,
        images: data.images || [],
        description: data.description,
      };

      if (isEditing && id) {
        await propertiesApi.update(id, propertyData);
      } else {
        await propertiesApi.create(propertyData);
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/properties');
      }, 1500);
    } catch (err) {
      setError('Failed to save property');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <button
          onClick={() => navigate('/properties')}
          className="flex items-center gap-2 text-gp-ink-muted hover:text-gp-ink mb-4 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Properties
        </button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gp-accent/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-gp-accent" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gp-ink">
            {isEditing ? 'Edit Property' : 'Add New Property'}
          </h1>
        </div>
        <p className="text-gp-ink-muted text-lg mt-2">
          {isEditing ? 'Update property information' : 'Create a new property listing'}
        </p>
      </motion.div>

      {/* Success Message */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg shadow-sm flex items-center gap-3"
        >
          <CheckCircle2 className="h-6 w-6" />
          <div>
            <p className="font-semibold">Property saved successfully!</p>
            <p className="text-sm">Redirecting to properties list...</p>
          </div>
        </motion.div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-8"
      >
        {/* Basic Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-gp-ink pb-4 border-b border-gray-200">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent transition-all"
                placeholder="e.g., Premium Residential Plots in Kattigenahalli"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Property Type *
              </label>
              <select
                {...register('type')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              >
                {propertyTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Status *
              </label>
              <select
                {...register('status')}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              >
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="new">New</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                City *
              </label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
                placeholder="e.g., Bengaluru"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
              )}
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Area *
              </label>
              <input
                {...register('area')}
                type="text"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
                placeholder="e.g., Kattigenahalli"
              />
              {errors.area && (
                <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
              )}
            </div>

            {/* Price Label */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Price Label
              </label>
              <input
                {...register('priceLabel')}
                type="text"
                placeholder="e.g., ₹1 28–42 L"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              />
            </div>

            {/* Size */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Size
              </label>
              <input
                {...register('size')}
                type="text"
                placeholder="e.g., 1200–2400 sq ft"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-gp-ink pb-4 border-b border-gray-200">
            Location
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Maps URL */}
            <div className="md:col-span-2">
              <GoogleMapsInput
                value={googleMapsUrl || ''}
                onChange={(url) => setValue('googleMapsUrl', url)}
                onCoordinatesExtracted={handleCoordinatesExtracted}
                lat={extractedLat}
                lng={extractedLng}
              />
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Latitude
              </label>
              <input
                {...register('lat')}
                type="number"
                step="any"
                placeholder="e.g., 13.2058"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              />
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Longitude
              </label>
              <input
                {...register('lon')}
                type="number"
                step="any"
                placeholder="e.g., 77.5833"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-gp-ink pb-4 border-b border-gray-200">
            Images
          </h2>
          <ImageUpload
            images={images || []}
            onChange={(newImages) => setValue('images', newImages)}
            maxImages={10}
          />
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-gp-ink pb-4 border-b border-gray-200">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 gap-6">
            {/* Highlights */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Highlights (comma-separated)
              </label>
              <input
                {...register('highlights')}
                type="text"
                placeholder="e.g., BBMP approved, Gated community, East facing"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Description *
              </label>
              <textarea
                {...register('description')}
                rows={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gp-accent focus:border-transparent resize-none"
                placeholder="Describe the property in detail..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/properties')}
            className="px-6 py-3 border border-gray-200 rounded-lg text-gp-ink hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 bg-gp-accent text-white rounded-lg hover:bg-gp-gold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-semibold"
          >
            {loading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEditing ? 'Update Property' : 'Create Property'}
              </>
            )}
          </button>
        </div>
      </motion.form>
    </div>
  );
}
