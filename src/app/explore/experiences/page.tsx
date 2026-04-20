'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { Card, Badge, Button } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { sampleExperiences } from '@/data/sample-data';
import { Search, Clock, Users, Star, MapPin, Filter } from 'lucide-react';

const EXPERIENCE_CATEGORIES = [
  { value: 'all', label: 'All' },
  { value: 'cultural', label: 'Cultural' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'Food & Drink', label: 'Food & Drink' },
  { value: 'sightseeing', label: 'Sightseeing' },
  { value: 'Nightlife', label: 'Nightlife' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'Water Sports', label: 'Water Sports' },
  { value: 'heritage', label: 'Heritage' },
  { value: 'Social Impact', label: 'Social Impact' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Art & Culture', label: 'Art & Culture' },
  { value: 'City Tour', label: 'City Tour' },
];

export default function ExploreExperiencesPage() {
  const [experiences] = useState(sampleExperiences);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCity, setSelectedCity] = useState('all');

  const filteredExperiences = experiences.filter((exp) => {
    const matchesSearch = !searchQuery ||
      exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      exp.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      exp.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesCity = selectedCity === 'all' ||
      exp.city.toLowerCase() === selectedCity.toLowerCase();

    return matchesSearch && matchesCategory && matchesCity;
  });

  const cities = [...new Set(experiences.map(e => e.city))];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-white">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Local Experiences
            </h1>
            <p className="text-gray-500 mt-2">
              Discover authentic adventures with local guides
            </p>
          </div>

          {/* Search and Filter Bar */}
          <Card className="mb-8 shadow-sm border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                leftIcon={<Filter className="h-4 w-4" />}
              >
                Filters
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      {EXPERIENCE_CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    >
                      <option value="all">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Category Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {EXPERIENCE_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </Card>

          {/* Results */}
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              {filteredExperiences.length} experiences found
            </p>
          </div>

          {filteredExperiences.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Search className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No experiences found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedCity('all');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => (
                <Link key={exp.id} href={`/explore/experiences/${exp.id}`}>
                  <div className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={exp.image}
                        alt={exp.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute left-3 top-3">
                        <Badge className="bg-white/90 backdrop-blur-sm">
                          {exp.category}
                        </Badge>
                      </div>
                      <div className="absolute right-3 top-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium text-sm">{exp.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({exp.reviewCount})</span>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="h-4 w-4" />
                        {exp.city}
                      </div>

                      <h3 className="font-semibold text-lg text-gray-900 mb-2">
                        {exp.title}
                      </h3>

                      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                        {exp.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {exp.highlights.slice(0, 3).map((highlight, i) => (
                          <span key={i} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                            {highlight}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {exp.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {exp.groupSize.replace('Up to ', '').replace(' people', '')}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-pink-500">
                            {formatCurrency(exp.price)}
                          </span>
                          <span className="text-sm text-gray-400">/person</span>
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