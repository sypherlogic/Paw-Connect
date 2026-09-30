import React, { useState, useMemo } from 'react';
import { listProviders } from '@/api/pawconnect';
import { useQuery } from '@tanstack/react-query';
import SearchFilters from '@/components/directory/SearchFilters';
import ProviderCard from '@/components/directory/ProviderCard';
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LayoutGrid, List, SlidersHorizontal } from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Directory() {
  const urlParams = new URLSearchParams(window.location.search);
  
  const [filters, setFilters] = useState({
    search: urlParams.get('search') || '',
    serviceType: urlParams.get('serviceType') || 'all',
    location: 'all',
    experience: 'all',
    maxPrice: 200
  });
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');

  const { data: providers = [], isLoading } = useQuery({
    queryKey: ['providers'],
    queryFn: listProviders
  });

  const filteredProviders = useMemo(() => {
    let result = [...providers];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(p => 
        p.name?.toLowerCase().includes(searchLower) ||
        p.bio?.toLowerCase().includes(searchLower) ||
        p.location?.toLowerCase().includes(searchLower) ||
        p.certifications?.some(c => c.toLowerCase().includes(searchLower))
      );
    }

    // Service type filter
    if (filters.serviceType !== 'all') {
      result = result.filter(p => p.service_type === filters.serviceType);
    }

    // Location filter
    if (filters.location !== 'all') {
      result = result.filter(p => p.location === filters.location);
    }

    // Experience filter
    if (filters.experience !== 'all') {
      const minYears = parseInt(filters.experience);
      result = result.filter(p => (p.years_experience || 0) >= minYears);
    }

    // Price filter
    result = result.filter(p => {
      if (!p.services_offered?.length) return true;
      const minPrice = Math.min(...p.services_offered.map(s => s.price));
      return minPrice <= filters.maxPrice;
    });

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'reviews':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'experience':
          return (b.years_experience || 0) - (a.years_experience || 0);
        case 'price_low':
          const aMin = a.services_offered?.length ? Math.min(...a.services_offered.map(s => s.price)) : 0;
          const bMin = b.services_offered?.length ? Math.min(...b.services_offered.map(s => s.price)) : 0;
          return aMin - bMin;
        case 'price_high':
          const aMax = a.services_offered?.length ? Math.max(...a.services_offered.map(s => s.price)) : 0;
          const bMax = b.services_offered?.length ? Math.max(...b.services_offered.map(s => s.price)) : 0;
          return bMax - aMax;
        default:
          return 0;
      }
    });

    return result;
  }, [providers, filters, sortBy]);

  const clearFilters = () => {
    setFilters({
      search: '',
      serviceType: 'all',
      location: 'all',
      experience: 'all',
      maxPrice: 200
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <SearchFilters 
        filters={filters} 
        setFilters={setFilters} 
        onClearFilters={clearFilters}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {filters.serviceType !== 'all' 
                ? `${filters.serviceType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}s`
                : 'All Providers'
              }
            </h1>
            <p className="text-slate-500 mt-1">
              {filteredProviders.length} provider{filteredProviders.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 bg-white">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-slate-400" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="experience">Most Experienced</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="hidden sm:flex items-center border rounded-lg bg-white overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === 'grid' ? 'bg-slate-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <LayoutGrid className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-none ${viewMode === 'list' ? 'bg-slate-100' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {isLoading ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-100">
                <div className="flex gap-4">
                  <Skeleton className="w-20 h-20 rounded-2xl" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-40" />
                  </div>
                </div>
                <Skeleton className="h-12 w-full mt-4" />
              </div>
            ))}
          </div>
        ) : filteredProviders.length > 0 ? (
          <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {filteredProviders.map(provider => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No providers found</h3>
            <p className="text-slate-500 mb-6">Try adjusting your filters or search query</p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}