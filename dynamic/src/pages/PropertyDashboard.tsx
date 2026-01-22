import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  LogOut, 
  Save, 
  X, 
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  DollarSign,
  Home,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { propertiesApi, PropertiesApiError } from '@/lib/propertiesApi';
import { login, logout, isAuthenticated } from '@/lib/auth';
import { Property, PropertyType } from '@/types/property';

// Match the same categories as FiltersBar on properties page
const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'residential-plots', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'retail', label: 'Retail' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'industrial', label: 'Industrial' },
  { value: 'farm-plots', label: 'Land' },
];

const STATUS_OPTIONS = [
  { value: 'available', label: 'Available' },
  { value: 'sold', label: 'Sold' },
  { value: 'new', label: 'New' },
];

export default function PropertyDashboard() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    type: 'residential-plots' as PropertyType, // Default to first option
    city: '',
    area: '',
    priceLabel: '',
    size: '',
    status: 'available' as 'available' | 'sold' | 'new',
    highlights: [] as string[],
    lat: '',
    lon: '',
    googleMapsUrl: '',
    images: [] as string[],
    description: '',
  });

  const [highlightInput, setHighlightInput] = useState('');
  const [imageInput, setImageInput] = useState('');

  useEffect(() => {
    setAuthenticated(isAuthenticated());
    if (isAuthenticated()) {
      loadProperties();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);

    try {
      const result = await login(username, password);
      if (result.success) {
        setAuthenticated(true);
        setUsername('');
        setPassword('');
        loadProperties();
      } else {
        setLoginError(result.message);
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setProperties([]);
    setEditingProperty(null);
    setShowForm(false);
  };

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await propertiesApi.getAll();
      setProperties(data);
    } catch (err) {
      if (err instanceof PropertiesApiError) {
        if (err.statusCode === 401) {
          setAuthenticated(false);
          logout();
          setError('Session expired. Please log in again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to load properties');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title,
      type: property.type,
      city: property.city,
      area: property.area,
      priceLabel: property.priceLabel || '',
      size: property.size || '',
      status: property.status,
      highlights: [...property.highlights],
      lat: property.lat?.toString() || '',
      lon: property.lon?.toString() || '',
      googleMapsUrl: '',
      images: [...property.images],
      description: property.description,
    });
    setShowForm(true);
    setFormError(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      await propertiesApi.delete(id);
      setSuccess('Property deleted successfully');
      loadProperties();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof PropertiesApiError) {
        if (err.statusCode === 401) {
          setAuthenticated(false);
          logout();
          setError('Session expired. Please log in again.');
        } else {
          setError(err.message);
        }
      } else {
        setError('Failed to delete property');
      }
    }
  };

  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData({
        ...formData,
        highlights: [...formData.highlights, highlightInput.trim()],
      });
      setHighlightInput('');
    }
  };

  const handleRemoveHighlight = (index: number) => {
    setFormData({
      ...formData,
      highlights: formData.highlights.filter((_, i) => i !== index),
    });
  };

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, imageInput.trim()],
      });
      setImageInput('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      const propertyData = {
        title: formData.title,
        type: formData.type,
        city: formData.city,
        area: formData.area,
        priceLabel: formData.priceLabel || undefined,
        size: formData.size || undefined,
        status: formData.status,
        highlights: formData.highlights,
        lat: formData.lat ? parseFloat(formData.lat) : undefined,
        lon: formData.lon ? parseFloat(formData.lon) : undefined,
        googleMapsUrl: formData.googleMapsUrl || undefined,
        images: formData.images,
        description: formData.description,
      };

      if (editingProperty) {
        await propertiesApi.update(editingProperty.id, propertyData);
        setSuccess('Property updated successfully');
      } else {
        await propertiesApi.create(propertyData);
        setSuccess('Property created successfully');
      }

      // Reset form
      setFormData({
        title: '',
        type: 'residential-plots' as PropertyType,
        city: '',
        area: '',
        priceLabel: '',
        size: '',
        status: 'available',
        highlights: [],
        lat: '',
        lon: '',
        googleMapsUrl: '',
        images: [],
        description: '',
      });
      setEditingProperty(null);
      setShowForm(false);
      loadProperties();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err instanceof PropertiesApiError) {
        if (err.statusCode === 401) {
          setAuthenticated(false);
          logout();
          setFormError('Session expired. Please log in again.');
        } else {
          setFormError(err.message);
        }
      } else {
        setFormError('Failed to save property');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProperty(null);
    setFormData({
      title: '',
      type: 'residential-plots',
      city: '',
      area: '',
      priceLabel: '',
      size: '',
      status: 'available',
      highlights: [],
      lat: '',
      lon: '',
      googleMapsUrl: '',
      images: [],
      description: '',
    });
    setFormError(null);
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gp-surface/10 to-white pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg border border-gp-ink/10"
        >
          <h1 className="text-2xl font-display font-bold text-gp-ink mb-6 text-center">
            Property Dashboard
          </h1>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Username
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gp-ink mb-2">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>

            <Button
              type="submit"
              disabled={loginLoading}
              className="w-full"
            >
              {loginLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Log In'
              )}
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gp-surface/10 to-white pt-28 pb-12">
      <div className="container mx-auto px-4 lg:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gp-ink mb-2">
                Property Dashboard
              </h1>
              <p className="text-gp-ink-muted">
                Manage your property listings
              </p>
            </div>
            <div className="flex gap-3">
              {!showForm && (
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              )}
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2 mb-4"
            >
              <CheckCircle2 className="h-5 w-5" />
              {success}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2 mb-4"
            >
              <AlertCircle className="h-5 w-5" />
              {error}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setError(null)}
                className="ml-auto"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg border border-gp-ink/10 p-6 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-display font-bold text-gp-ink">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="Property title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Type *
                  </label>
                  <Select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as PropertyType })}
                    required
                  >
                    {PROPERTY_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    City *
                  </label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    required
                    placeholder="Bangalore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Area *
                  </label>
                  <Input
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    required
                    placeholder="Kattigenahalli"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Price Label
                  </label>
                  <Input
                    value={formData.priceLabel}
                    onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                    placeholder="₹50 Lakhs onwards"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Size
                  </label>
                  <Input
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    placeholder="1200 sq ft"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Status *
                  </label>
                  <Select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    required
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Google Maps URL
                  </label>
                  <Input
                    value={formData.googleMapsUrl}
                    onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                  <p className="text-xs text-gp-ink-muted mt-1">
                    Coordinates will be extracted automatically
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Latitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lat}
                    onChange={(e) => setFormData({ ...formData, lat: e.target.value })}
                    placeholder="12.9716"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gp-ink mb-2">
                    Longitude
                  </label>
                  <Input
                    type="number"
                    step="any"
                    value={formData.lon}
                    onChange={(e) => setFormData({ ...formData, lon: e.target.value })}
                    placeholder="77.5946"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gp-ink mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={4}
                  placeholder="Property description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gp-ink mb-2">
                  Highlights
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddHighlight();
                      }
                    }}
                    placeholder="Add a highlight"
                  />
                  <Button type="button" onClick={handleAddHighlight}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.highlights.map((highlight, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gp-accent/10 text-gp-accent rounded-full text-sm"
                    >
                      {highlight}
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlight(index)}
                        className="hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gp-ink mb-2">
                  Images (URLs)
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddImage();
                      }
                    }}
                    placeholder="Image URL"
                  />
                  <Button type="button" onClick={handleAddImage}>
                    Add
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingProperty ? 'Update Property' : 'Create Property'}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl shadow-lg border border-gp-ink/10 overflow-hidden"
        >
          <div className="p-6 border-b border-gp-ink/10">
            <h2 className="text-xl font-display font-bold text-gp-ink">
              All Properties ({properties.length})
            </h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-gp-accent mx-auto mb-4" />
              <p className="text-gp-ink-muted">Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div className="p-12 text-center">
              <Home className="h-12 w-12 text-gp-ink-muted mx-auto mb-4" />
              <p className="text-gp-ink-muted">No properties found. Create your first property!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gp-surface/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Property
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Posted
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gp-ink-muted uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gp-ink/10">
                  {properties.map((property) => (
                    <tr key={property.id} className="hover:bg-gp-surface/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {property.images && property.images.length > 0 && (
                            <img
                              src={property.images[0]}
                              alt={property.title}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3EImage%3C/text%3E%3C/svg%3E';
                              }}
                            />
                          )}
                          <div>
                            <div className="font-medium text-gp-ink">{property.title}</div>
                            {property.priceLabel && (
                              <div className="text-sm text-gp-ink-muted flex items-center gap-1">
                                <DollarSign className="h-3 w-3" />
                                {property.priceLabel}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gp-ink">
                          {PROPERTY_TYPES.find(t => t.value === property.type)?.label || 
                           // Fallback: map detailed types to main categories
                           property.type.startsWith('residential') ? 'Residential' :
                           property.type.startsWith('commercial') ? 'Commercial' :
                           property.type.startsWith('retail') ? 'Retail' :
                           property.type.startsWith('hospitality') ? 'Hospitality' :
                           property.type.startsWith('industrial') ? 'Industrial' :
                           (property.type === 'farm-plots' || property.type === 'agricultural-lands') ? 'Land' :
                           property.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gp-ink flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {property.area}, {property.city}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'available' ? 'bg-green-100 text-green-800' :
                          property.status === 'sold' ? 'bg-red-100 text-red-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {property.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gp-ink-muted flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(property.postedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(property)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

