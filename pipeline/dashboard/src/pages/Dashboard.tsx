import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { propertiesApi } from '../api/properties';
import { Property } from '../types/property';
import { Plus, TrendingUp, Home, CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';

export default function Dashboard() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.getAll();
      setProperties(data);
      setError(null);
    } catch (err) {
      setError('Failed to load properties');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    sold: properties.filter(p => p.status === 'sold').length,
    new: properties.filter(p => p.status === 'new').length,
  };

  const recentProperties = properties
    .sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime())
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-gp-accent border-t-transparent rounded-full"
          />
          <p className="text-gp-ink-muted">Loading dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const statCards = [
    {
      label: 'Total Properties',
      value: stats.total,
      icon: Home,
      color: 'text-gp-accent',
      bgColor: 'bg-gp-accent/10',
      delay: 0.1,
    },
    {
      label: 'Available',
      value: stats.available,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      delay: 0.2,
    },
    {
      label: 'Sold',
      value: stats.sold,
      icon: TrendingUp,
      color: 'text-gp-ink-muted',
      bgColor: 'bg-gray-50',
      delay: 0.3,
    },
    {
      label: 'New',
      value: stats.new,
      icon: Clock,
      color: 'text-gp-gold',
      bgColor: 'bg-yellow-50',
      delay: 0.4,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gp-accent/10 rounded-lg">
            <Sparkles className="h-6 w-6 text-gp-accent" />
          </div>
          <h1 className="text-4xl font-display font-bold text-gp-ink">
            Dashboard
          </h1>
        </div>
        <p className="text-gp-ink-muted text-lg">
          Manage and monitor your property listings
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg shadow-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {error}
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: stat.delay }}
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 ${stat.bgColor} rounded-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gp-ink-muted mb-1 font-medium">{stat.label}</p>
              <motion.p
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: stat.delay + 0.2, type: 'spring' }}
                className="text-4xl font-bold text-gp-ink"
              >
                {stat.value}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bg-gradient-to-r from-gp-accent/10 to-gp-gold/10 p-8 rounded-xl border border-gp-accent/20 shadow-sm"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-gp-ink mb-2">
              Quick Actions
            </h2>
            <p className="text-gp-ink-muted">
              Add a new property to your portfolio
            </p>
          </div>
          <Link
            to="/properties/new"
            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gp-accent text-white rounded-lg hover:bg-gp-gold transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">Add New Property</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Recent Properties */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-sm border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-display font-bold text-gp-ink">Recent Properties</h2>
          <Link
            to="/properties"
            className="group flex items-center gap-2 text-sm font-medium text-gp-accent hover:text-gp-gold transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {recentProperties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block p-4 bg-gray-100 rounded-full mb-4">
              <Home className="h-8 w-8 text-gp-ink-muted" />
            </div>
            <p className="text-gp-ink-muted mb-4">
              No properties yet. Start building your portfolio!
            </p>
            <Link
              to="/properties/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gp-accent text-white rounded-lg hover:bg-gp-gold transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Your First Property
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {recentProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                whileHover={{ x: 4 }}
              >
                <Link
                  to={`/properties/edit/${property.id}`}
                  className="block p-5 border-2 border-gray-200 rounded-xl hover:border-gp-accent hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gp-ink mb-2 group-hover:text-gp-accent transition-colors">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gp-ink-muted">
                        <span>{property.city}, {property.area}</span>
                        <span>•</span>
                        <span className="capitalize">{property.type.replace(/-/g, ' ')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span
                        className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${
                          property.status === 'available'
                            ? 'bg-green-100 text-green-700'
                            : property.status === 'sold'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {property.status}
                      </span>
                      <ArrowRight className="h-5 w-5 text-gp-ink-muted group-hover:text-gp-accent group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
