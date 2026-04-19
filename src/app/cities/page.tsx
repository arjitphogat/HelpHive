'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Search } from 'lucide-react';

interface CityData {
  name: string;
  slug: string;
  image: string;
  status: 'live' | 'upcoming';
  tagline: string;
  stats: {
    vehicles: number;
    tours: number;
    tournaments: number;
    experiences: number;
  };
  startingPrice: number;
  highlights: string[];
}

const citiesData: CityData[] = [
  {
    name: 'Goa',
    slug: 'goa',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Beach vibes, sunset rides & treasure hunt tournaments',
    stats: { vehicles: 156, tours: 89, tournaments: 12, experiences: 234 },
    startingPrice: 299,
    highlights: ['Beach Rides', 'Sunset Tours', 'Night Markets'],
  },
  {
    name: 'Jaipur',
    slug: 'jaipur',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Royal heritage tours & Pink City adventures',
    stats: { vehicles: 134, tours: 76, tournaments: 8, experiences: 189 },
    startingPrice: 399,
    highlights: ['Heritage Walks', 'Palace Tours', 'Local Cuisine'],
  },
  {
    name: 'Rishikesh',
    slug: 'rishikesh',
    image: 'https://images.unsplash.com/photo-1600100195362-63369f3d0e5a?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Adventure sports, yoga & river rafting',
    stats: { vehicles: 98, tours: 67, tournaments: 6, experiences: 156 },
    startingPrice: 349,
    highlights: ['River Rafting', 'Yoga Camps', 'Temple Tours'],
  },
  {
    name: 'Udaipur',
    slug: 'udaipur',
    image: 'https://images.unsplash.com/photo-1622896784083-fd1e3c69e8e9?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Lake City luxury & romantic boat rides',
    stats: { vehicles: 112, tours: 58, tournaments: 5, experiences: 143 },
    startingPrice: 449,
    highlights: ['Lake Pichola', 'Royal Palaces', 'Food Trails'],
  },
  {
    name: 'Delhi',
    slug: 'delhi',
    image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Historic monuments & modern street food',
    stats: { vehicles: 245, tours: 134, tournaments: 18, experiences: 312 },
    startingPrice: 199,
    highlights: ['Red Fort', 'Street Food', 'Old Delhi Tours'],
  },
  {
    name: 'Manali',
    slug: 'manali',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&h=600&fit=crop',
    status: 'upcoming',
    tagline: 'Mountain adventures & snow-capped peaks',
    stats: { vehicles: 0, tours: 0, tournaments: 0, experiences: 0 },
    startingPrice: 0,
    highlights: ['Solang Valley', 'Rohtang Pass', 'Hadimba Temple'],
  },
  {
    name: 'Varanasi',
    slug: 'varanasi',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Ancient ghats, spirituality & boat rides',
    stats: { vehicles: 78, tours: 45, tournaments: 4, experiences: 98 },
    startingPrice: 249,
    highlights: ['Ganga Aarti', 'Ghats Walk', 'Temple Tours'],
  },
  {
    name: 'Pushkar',
    slug: 'pushkar',
    image: 'https://images.unsplash.com/photo-1600611877978-e53e2b56e7e2?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Sacred lakes, fairs & desert adventures',
    stats: { vehicles: 67, tours: 38, tournaments: 3, experiences: 87 },
    startingPrice: 279,
    highlights: ['Pushkar Lake', 'Camel Fair', 'Desert Safari'],
  },
  {
    name: 'Pondicherry',
    slug: 'pondicherry',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'French colonial charm & beach bliss',
    stats: { vehicles: 89, tours: 52, tournaments: 6, experiences: 112 },
    startingPrice: 329,
    highlights: ['Promenade Beach', 'French Quarter', 'Auroville'],
  },
  {
    name: 'Mumbai',
    slug: 'mumbai',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'City of dreams, Bollywood & street food',
    stats: { vehicles: 198, tours: 112, tournaments: 15, experiences: 267 },
    startingPrice: 249,
    highlights: ['Marine Drive', 'Bollywood Tours', 'Street Food'],
  },
  {
    name: 'Bangalore',
    slug: 'bangalore',
    image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800&h=600&fit=crop',
    status: 'upcoming',
    tagline: 'Tech hub, craft beer & garden city',
    stats: { vehicles: 0, tours: 0, tournaments: 0, experiences: 0 },
    startingPrice: 0,
    highlights: ['Lalbagh', 'Microbreweries', 'MG Road'],
  },
  {
    name: 'Agra',
    slug: 'agra',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&h=600&fit=crop',
    status: 'live',
    tagline: 'Taj Mahal magic & Mughal heritage',
    stats: { vehicles: 112, tours: 78, tournaments: 7, experiences: 145 },
    startingPrice: 349,
    highlights: ['Taj Mahal', 'Agra Fort', 'Mughal Heritage'],
  },
];

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'live' | 'upcoming'>('all');

  const filteredCities = citiesData.filter((city) => {
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || city.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const liveCount = citiesData.filter(c => c.status === 'live').length;
  const upcomingCount = citiesData.filter(c => c.status === 'upcoming').length;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-16 lg:pt-[72px]">
        {/* Hero */}
        <section className="relative bg-gradient-to-b from-[var(--color-surface-muted)] to-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-5xl font-bold text-[var(--color-text)] mb-4">
                Explore India's Best Cities
              </h1>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                From beach adventures in Goa to heritage tours in Jaipur. Discover authentic experiences in {liveCount} cities across India.
              </p>
            </div>

            {/* Search & Filter */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search cities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-[var(--radius-full)] border border-[var(--color-border)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent shadow-sm"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-[var(--color-text)] text-white'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  All ({citiesData.length})
                </button>
                <button
                  onClick={() => setStatusFilter('live')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'live'
                      ? 'bg-[var(--color-text)] text-white'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                  Live ({liveCount})
                </button>
                <button
                  onClick={() => setStatusFilter('upcoming')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    statusFilter === 'upcoming'
                      ? 'bg-[var(--color-text)] text-white'
                      : 'bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                  Coming Soon ({upcomingCount})
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Cities Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredCities.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-[var(--color-text-secondary)]">No cities found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCities.map((city, index) => (
                  <Link
                    key={city.slug}
                    href={city.status === 'live' ? `/cities/${city.slug}` : '#'}
                    className={`group block animate-fade-in-up ${city.status === 'upcoming' ? 'opacity-70' : ''}`}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="relative rounded-[var(--radius-xl)] overflow-hidden bg-white border border-[var(--color-border-light)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
                      {/* Image */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={city.image}
                          alt={city.name}
                          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                            city.status === 'upcoming' ? 'grayscale' : ''
                          }`}
                        />

                        {/* Status Badge */}
                        <div className="absolute top-3 left-3">
                          {city.status === 'live' ? (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
                              <span className="text-xs font-semibold text-[var(--color-text)]">Live</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full">
                              <span className="w-2 h-2 rounded-full bg-[var(--color-warning)]" />
                              <span className="text-xs font-semibold text-[var(--color-text)]">Coming Soon</span>
                            </div>
                          )}
                        </div>

                        {/* Favorite Button */}
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            // Toggle favorite
                          }}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-[var(--color-text)]">{city.name}</h3>
                          {city.startingPrice > 0 && (
                            <div className="text-right">
                              <span className="text-sm font-semibold text-[var(--color-text)]">₹{city.startingPrice}</span>
                              <span className="text-xs text-[var(--color-text-muted)]"> / day</span>
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-2">
                          {city.tagline}
                        </p>

                        {city.status === 'live' && (
                          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--color-border-light)]">
                            <div className="text-center">
                              <p className="text-sm font-bold text-[var(--color-text)]">{city.stats.vehicles}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">Vehicles</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-[var(--color-text)]">{city.stats.tours}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">Tours</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-[var(--color-text)]">{city.stats.tournaments}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">Events</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-bold text-[var(--color-text)]">{city.stats.experiences}</p>
                              <p className="text-[10px] text-[var(--color-text-muted)]">Exp.</p>
                            </div>
                          </div>
                        )}

                        {city.status === 'live' && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {city.highlights.map((highlight) => (
                              <span
                                key={highlight}
                                className="px-2 py-0.5 text-[10px] font-medium bg-[var(--color-surface-muted)] text-[var(--color-text-secondary)] rounded"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-[var(--color-surface-muted)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-4">
              Don't see your city?
            </h2>
            <p className="text-[var(--color-text-secondary)] mb-6">
              We're expanding fast! Join our waitlist and be the first to know when we launch in your city.
            </p>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white rounded-[var(--radius-lg)] transition-colors"
              style={{ background: 'var(--color-primary)' }}
            >
              Join the Waitlist
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
