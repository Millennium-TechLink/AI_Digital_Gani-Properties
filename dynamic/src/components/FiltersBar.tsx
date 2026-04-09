import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { PropertyType, PropertyFilters } from '@/types/property';

export default function FiltersBar() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({
    search: '',
    type: undefined,
    price: '',
    size: '',
    sort: 'newest',
  });

  useEffect(() => {
    setFilters({
      search: searchParams.get('search') || '',
      type: (searchParams.get('type') as PropertyType) || undefined,
      price: searchParams.get('price') || '',
      size: searchParams.get('size') || '',
      sort: (searchParams.get('sort') as PropertyFilters['sort']) || 'newest',
    });
  }, [searchParams]);

  const updateFilters = (newFilters: Partial<PropertyFilters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);

    const params = new URLSearchParams();
    if (updated.search) params.set('search', updated.search);
    if (updated.type) params.set('type', updated.type);
    if (updated.price) params.set('price', updated.price);
    if (updated.size) params.set('size', updated.size);
    if (updated.sort && updated.sort !== 'newest') params.set('sort', updated.sort);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/98 backdrop-blur-lg border-b border-gp-ink/10 shadow-md"
    >
      <div className="container mx-auto px-4 lg:px-6 py-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative flex-[2] min-w-[200px]"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gp-ink-muted z-10 transition-colors duration-300" />
            <Input
              type="text"
              placeholder="Search by area or city..."
              value={filters.search}
              onChange={(e) => updateFilters({ search: e.target.value })}
              className="pl-12 transition-all duration-300 focus:border-gp-accent focus:ring-2 focus:ring-gp-accent/20 w-full"
            />
          </motion.div>

          {/* Type Filter */}
          <Select
            value={filters.type || ''}
            onChange={(e) => updateFilters({ type: e.target.value as PropertyType || undefined })}
          >
            <option value="">All Types</option>
            <option value="residential-plots">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="retail">Retail</option>
            <option value="hospitality">Hospitality</option>
            <option value="industrial">Industrial</option>
            <option value="farm-plots">Farm Land</option>
            <option value="agricultural-lands">Agricultural Lands</option>
          </Select>

          {/* Price Filter */}
          <Select
            value={filters.price}
            onChange={(e) => updateFilters({ price: e.target.value })}
          >
            <option value="">Any Price</option>
            <option value="0-20">Under ₹ 20 L</option>
            <option value="20-40">₹ 20–40 L</option>
            <option value="40-60">₹ 40–60 L</option>
            <option value="60+">Above ₹ 60 L</option>
          </Select>

          {/* Sort */}
          <Select
            value={filters.sort}
            onChange={(e) => updateFilters({ sort: e.target.value as PropertyFilters['sort'] })}
          >
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Select>

          {/* Reset */}
          <AnimatePresence>
            {(filters.search || filters.type || filters.price || filters.size) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  variant="outline"
                  onClick={() => navigate('/properties')}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <Filter className="h-4 w-4" />
                  Reset
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
