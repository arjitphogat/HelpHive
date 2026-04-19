'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Input, Select, Button, Card } from '@/components/ui';
import { VehicleService } from '@/services/vehicle.service';
import { Vehicle, VehicleType } from '@/types';
import { VEHICLE_TYPES, CITIES } from '@/constants';
import { sampleVehicles } from '@/data/sample-data';
import { Search, SlidersHorizontal, X, Calendar, MapPin, Users } from 'lucide-react';

function ExploreVehiclesContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Read URL params from homepage search
  const urlCity = searchParams.get('city') || '';
  const urlCheckIn = searchParams.get('checkIn');
  const urlCheckOut = searchParams.get('checkOut');
  const urlGuests = searchParams.get('guests');

  const [filters, setFilters] = useState({
    type: '' as VehicleType | '',
    city: urlCity,
    minPrice: '',
    maxPrice: '',
  });

  // Update filters when URL params change
  useEffect(() => {
    if (urlCity) {
      setFilters(prev => ({ ...prev, city: urlCity }));
    }
  }, [urlCity]);

  useEffect(() => {
    loadVehicles();
  }, [filters]);

  const loadVehicles = async () => {
    setIsLoading(true);
    try {
      const data = await VehicleService.getVehicles({
        type: filters.type as VehicleType || undefined,
        city: filters.city || undefined,
        minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      });

      // If no vehicles from Firebase, use sample data
      let displayVehicles = data.vehicles;

      if (displayVehicles.length === 0) {
        // Apply sample data with filters
        displayVehicles = sampleVehicles.map((v, index) => ({
          id: v.id,
          brand: v.brand.trim(),
          model: v.model,
          type: v.type,
          city: v.city,
          pricePerHour: v.pricePerHour,
          pricePerDay: v.pricePerDay,
          hourlyRate: v.pricePerHour,
          rating: v.rating,
          totalReviews: v.reviewCount,
          reviewCount: v.reviewCount,
          totalBookings: Math.floor(Math.random() * 100) + 10,
          primaryImage: v.image,
          images: v.images,
          capacity: v.capacity,
          fuelType: v.fuelType,
          transmission: v.transmission,
          features: v.features,
          hostName: v.hostName,
          hostVerified: v.hostVerified,
          status: 'approved' as const,
          isApproved: true,
          minimumDuration: 1,
        }));

        // Apply city filter to sample data
        if (filters.city) {
          displayVehicles = displayVehicles.filter(v =>
            v.city?.toLowerCase() === filters.city.toLowerCase()
          );
        }

        // Apply type filter
        if (filters.type) {
          displayVehicles = displayVehicles.filter(v =>
            v.type === filters.type
          );
        }

        // Apply price filters
        if (filters.minPrice) {
          displayVehicles = displayVehicles.filter(v =>
            (v.pricePerHour ?? 0) >= Number(filters.minPrice)
          );
        }
        if (filters.maxPrice) {
          displayVehicles = displayVehicles.filter(v =>
            (v.pricePerHour ?? Infinity) <= Number(filters.maxPrice)
          );
        }
      } else {
        // Merge sample data with Firebase data, avoiding duplicates
        const sampleMapped = sampleVehicles.map((v) => ({
          id: v.id,
          brand: v.brand.trim(),
          model: v.model,
          type: v.type,
          city: v.city,
          pricePerHour: v.pricePerHour,
          pricePerDay: v.pricePerDay,
          hourlyRate: v.pricePerHour,
          rating: v.rating,
          totalReviews: v.reviewCount,
          reviewCount: v.reviewCount,
          totalBookings: Math.floor(Math.random() * 100) + 10,
          primaryImage: v.image,
          images: v.images,
          capacity: v.capacity,
          fuelType: v.fuelType,
          transmission: v.transmission,
          features: v.features,
          hostName: v.hostName,
          hostVerified: v.hostVerified,
          status: 'approved' as const,
          isApproved: true,
          minimumDuration: 1,
        }));

        const firebaseIds = new Set(displayVehicles.map(v => v.id));
        const uniqueSamples = sampleMapped.filter(v => !firebaseIds.has(v.id));

        // Apply filters to combined data
        displayVehicles = [...displayVehicles, ...uniqueSamples];

        if (filters.city) {
          displayVehicles = displayVehicles.filter(v =>
            v.city?.toLowerCase() === filters.city.toLowerCase()
          );
        }
        if (filters.type) {
          displayVehicles = displayVehicles.filter(v => v.type === filters.type);
        }
        if (filters.minPrice) {
          displayVehicles = displayVehicles.filter(v =>
            (v.pricePerHour ?? 0) >= Number(filters.minPrice)
          );
        }
        if (filters.maxPrice) {
          displayVehicles = displayVehicles.filter(v =>
            (v.pricePerHour ?? Infinity) <= Number(filters.maxPrice)
          );
        }
      }

      setVehicles(displayVehicles);
    } catch (error) {
      console.error('Error loading vehicles:', error);
      // Fallback to sample data on error
      setVehicles(sampleVehicles.map((v) => ({
        id: v.id,
        brand: v.brand.trim(),
        model: v.model,
        type: v.type,
        city: v.city,
        pricePerHour: v.pricePerHour,
        pricePerDay: v.pricePerDay,
        hourlyRate: v.pricePerHour,
        rating: v.rating,
        totalReviews: v.reviewCount,
        reviewCount: v.reviewCount,
        totalBookings: Math.floor(Math.random() * 100) + 10,
        primaryImage: v.image,
        images: v.images,
        capacity: v.capacity,
        fuelType: v.fuelType,
        transmission: v.transmission,
        features: v.features,
        hostName: v.hostName,
        hostVerified: v.hostVerified,
        status: 'approved' as const,
        isApproved: true,
        minimumDuration: 1,
      })));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      (vehicle.city?.toLowerCase().includes(query) ?? false) ||
      (vehicle.type?.toLowerCase().includes(query) ?? false)
    );
  });

  const clearFilters = () => {
    setFilters({
      type: '',
      city: '',
      minPrice: '',
      maxPrice: '',
    });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');
  const hasSearchParams = urlCity || urlCheckIn || urlGuests;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Summary from Homepage */}
          {hasSearchParams && (
            <div className="mb-6 p-4 bg-gradient-to-r from-[#FF385C]/5 to-purple-500/5 rounded-2xl border border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#FF385C]" />
                  <span className="font-medium">{filters.city || 'All Cities'}</span>
                </div>
                {urlCheckIn && urlCheckOut && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#FF385C]" />
                    <span>
                      {new Date(urlCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(urlCheckOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                {urlGuests && Number(urlGuests) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#FF385C]" />
                    <span>{urlGuests} guest{Number(urlGuests) > 1 ? 's' : ''}</span>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-[#FF385C] hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              {filters.city ? `Vehicles in ${filters.city}` : 'Explore Vehicles'}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} available
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by brand, model, or location..."
                  leftIcon={<Search className="h-4 w-4" />}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                  className="hidden md:flex"
                >
                  Filters
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Select
                    label="Vehicle Type"
                    placeholder="All types"
                    options={[
                      { value: '', label: 'All types' },
                      ...VEHICLE_TYPES.map((t) => ({
                        value: t.value,
                        label: `${t.icon} ${t.label}`,
                      })),
                    ]}
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as VehicleType | '' })}
                  />
                  <Select
                    label="City"
                    placeholder="All cities"
                    options={[
                      { value: '', label: 'All cities' },
                      ...CITIES.map((c) => ({ value: c, label: c })),
                    ]}
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  />
                  <Input
                    label="Min Price (₹/hr)"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  />
                  <Input
                    label="Max Price (₹/hr)"
                    type="number"
                    placeholder="Any"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  />
                </div>
                {hasActiveFilters && (
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-1" />
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.type && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">
                    {VEHICLE_TYPES.find((t) => t.value === filters.type)?.label}
                    <button onClick={() => setFilters({ ...filters, type: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.city && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">
                    {filters.city}
                    <button onClick={() => setFilters({ ...filters, city: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.minPrice && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">
                    Min: ₹{filters.minPrice}/hr
                    <button onClick={() => setFilters({ ...filters, minPrice: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.maxPrice && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-sm">
                    Max: ₹{filters.maxPrice}/hr
                    <button onClick={() => setFilters({ ...filters, maxPrice: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </Card>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              {isLoading ? 'Loading...' : `${filteredVehicles.length} vehicles found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-shimmer" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-shimmer w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-shimmer w-20" />
                      <div className="h-4 bg-gray-200 rounded animate-shimmer w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">No vehicles found</h3>
              <p className="text-[var(--color-text-muted)] mt-2">
                Try adjusting your search or filters
              </p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

// Wrap in Suspense for useSearchParams
export default function ExploreVehiclesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreVehiclesContent />
    </Suspense>
  );
}
