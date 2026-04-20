'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { Input, Select, Button, Card, Badge } from '@/components/ui';
import { Vehicle, VehicleType } from '@/types';
import { formatCurrency, getVehicleTypeLabel } from '@/lib/utils';
import { VEHICLE_TYPES, CITIES } from '@/constants';
import { sampleVehicles, CITIES_DATA } from '@/data/sample-data';
import { Search, SlidersHorizontal, X, Calendar, MapPin, Users, Star } from 'lucide-react';

function ExploreVehiclesContent() {
  const searchParams = useSearchParams();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  useEffect(() => {
    if (urlCity) {
      setFilters(prev => ({ ...prev, city: urlCity }));
    }
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setIsLoading(true);

    // Always use sample data directly - no Firebase dependency
    let displayVehicles = sampleVehicles.map((v) => ({
      id: v.id,
      brand: v.brand.trim(),
      model: v.model,
      type: v.type,
      city: v.city,
      pricePerDay: v.pricePerDay,
      pricePerHour: v.pricePerHour,
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

    // Apply city filter
    if (filters.city) {
      displayVehicles = displayVehicles.filter(v =>
        v.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    // Apply type filter
    if (filters.type) {
      displayVehicles = displayVehicles.filter(v => v.type === filters.type);
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

    setVehicles(displayVehicles);
    setIsLoading(false);
  };

  const filteredVehicles = vehicles.filter((vehicle) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      vehicle.brand.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      (vehicle.city?.toLowerCase().includes(query) ?? false)
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Summary from Homepage */}
          {hasSearchParams && (
            <div className="mb-6 p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl border border-gray-100">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-pink-500" />
                  <span className="font-medium">{filters.city || 'All Cities'}</span>
                </div>
                {urlCheckIn && urlCheckOut && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-pink-500" />
                    <span>
                      {new Date(urlCheckIn).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(urlCheckOut).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                {urlGuests && Number(urlGuests) > 0 && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-pink-500" />
                    <span>{urlGuests} guest{Number(urlGuests) > 1 ? 's' : ''}</span>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  className="ml-auto text-sm text-pink-500 hover:underline"
                >
                  Clear all
                </button>
              </div>
            </div>
          )}

          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {filters.city ? `${filters.city} Vehicles` : 'Explore Vehicles'}
            </h1>
            <p className="text-gray-500 mt-2">
              {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'} available
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-8 shadow-sm border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by brand, model, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Vehicle Type</label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value as VehicleType | '' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">All types</option>
                      {VEHICLE_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="">All cities</option>
                      {CITIES_DATA.map((c) => (
                        <option key={c.slug} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Price (₹/hr)</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Max Price (₹/hr)</label>
                    <input
                      type="number"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
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
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm">
                    {VEHICLE_TYPES.find((t) => t.value === filters.type)?.label}
                    <button onClick={() => setFilters({ ...filters, type: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
                {filters.city && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-sm">
                    {filters.city}
                    <button onClick={() => setFilters({ ...filters, city: '' })}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                )}
              </div>
            )}
          </Card>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {isLoading ? 'Loading...' : `${filteredVehicles.length} vehicles found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <div className="h-48 bg-gray-200 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-20" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <Link key={vehicle.id} href={`/explore/vehicles/${vehicle.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={vehicle.primaryImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80'}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute left-3 top-3">
                        <Badge variant="default" className="bg-white/90 backdrop-blur-sm">
                          {getVehicleTypeLabel(vehicle.type || '')}
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {vehicle.city}
                          </p>
                        </div>
                        {vehicle.rating && (
                          <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium text-sm">{vehicle.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {vehicle.capacity}
                        </span>
                        <span className="flex items-center gap-1">
                          {vehicle.fuelType}
                        </span>
                      </div>

                      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                        <div>
                          <span className="text-xl font-bold text-pink-500">
                            {formatCurrency(vehicle.hourlyRate || vehicle.pricePerHour || 0)}
                          </span>
                          <span className="text-sm text-gray-400">/hour</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(vehicle.pricePerDay || 0)}/day
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
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
        <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <ExploreVehiclesContent />
    </Suspense>
  );
}