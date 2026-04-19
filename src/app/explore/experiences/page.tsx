'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { ExperienceService, Experience } from '@/services/experience.service';
import { Card, Button, Input, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Search, SlidersHorizontal, Clock, Users, Star, X } from 'lucide-react';

const EXPERIENCE_CATEGORIES = [
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'food', label: 'Food & Drink' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'art', label: 'Art & Culture' },
  { value: 'water_sports', label: 'Water Sports' },
  { value: 'heritage', label: 'Heritage' },
  { value: 'social_impact', label: 'Social Impact' },
];

export default function ExploreExperiencesPage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    city: '',
    maxPrice: '',
  });

  useEffect(() => {
    loadExperiences();
  }, [filters]);

  const loadExperiences = async () => {
    setIsLoading(true);
    try {
      const data = await ExperienceService.getExperiences({
        category: filters.category || undefined,
        city: filters.city || undefined,
        maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      });
      setExperiences(data.experiences);
    } catch (error) {
      console.error('Error loading experiences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExperiences = experiences.filter((exp) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      exp.title.toLowerCase().includes(query) ||
      exp.description.toLowerCase().includes(query) ||
      exp.category.toLowerCase().includes(query) ||
      exp.city.toLowerCase().includes(query)
    );
  });

  const clearFilters = () => {
    setFilters({ category: '', city: '', maxPrice: '' });
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== '');

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              Local Experiences
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2">
              Discover authentic adventures with local guides
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
                  <input
                    type="text"
                    placeholder="Search experiences..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] transition-all focus:outline-none focus:border-[var(--color-text)]"
                  />
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
              >
                Filters
              </Button>
            </div>

            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Category</label>
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
                    >
                      <option value="">All categories</option>
                      {EXPERIENCE_CATEGORIES.map((c) => (
                        <option key={c.value} value={c.value}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">City</label>
                    <select
                      value={filters.city}
                      onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
                    >
                      <option value="">All cities</option>
                      <option value="Goa">Goa</option>
                      <option value="Jaipur">Jaipur</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Bangalore">Bangalore</option>
                      <option value="Udaipur">Udaipur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Max Price (₹)</label>
                    <input
                      type="number"
                      placeholder="Any"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
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
          </Card>

          {/* Categories Pills */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {EXPERIENCE_CATEGORIES.map((category) => (
              <button
                key={category.value}
                onClick={() => setFilters({ ...filters, category: category.value === filters.category ? '' : category.value })}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filters.category === category.value
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-white text-[var(--color-text)] border border-gray-200 hover:border-[var(--color-primary)]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-[var(--color-text-muted)]">
              {isLoading ? 'Loading...' : `${filteredExperiences.length} experiences found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          ) : filteredExperiences.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-[var(--color-text)]">No experiences found</h3>
              <p className="text-[var(--color-text-muted)] mt-2">Try adjusting your search or filters</p>
              {hasActiveFilters && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((experience) => (
                <Link key={experience.id} href={`/experiences/${experience.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer h-full flex flex-col">
                    <div className="relative h-48">
                      <Image
                        src={experience.image || '/placeholder-experience.jpg'}
                        alt={experience.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute left-3 top-3 bg-white text-[var(--color-text)]">
                        {EXPERIENCE_CATEGORIES.find((c) => c.value === experience.category)?.label || experience.category}
                      </Badge>
                      {experience.hostVerified && (
                        <div className="absolute right-3 top-3 bg-[var(--color-success)] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verified
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-[var(--color-text-muted)]">{experience.city}</span>
                      </div>
                      <h3 className="font-semibold text-lg text-[var(--color-text)] line-clamp-1">
                        {experience.title}
                      </h3>
                      <p className="text-sm text-[var(--color-text-muted)] mt-1 line-clamp-2 flex-1">
                        {experience.description}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {experience.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {experience.groupSize}
                        </span>
                      </div>
                      <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-[var(--color-primary)] text-[var(--color-primary)]" />
                          <span className="font-medium">{experience.rating.toFixed(1)}</span>
                          <span className="text-sm text-[var(--color-text-muted)]">
                            ({experience.reviewCount})
                          </span>
                        </div>
                        <div>
                          <span className="text-xl font-bold text-[var(--color-primary)]">
                            ₹{experience.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-[var(--color-text-muted)]">/person</span>
                        </div>
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
