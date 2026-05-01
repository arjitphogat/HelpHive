'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Badge, Input } from '@/components/ui';
import { Search, MapPin, Calendar, Star, Filter, ChevronDown, Wifi, Car, Coffee, Phone, Clock, Users, ArrowRight, Shield } from 'lucide-react';

interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  originalPrice?: number;
  image: string;
  amenities: string[];
  type: string;
  description: string;
}

const HOTELS: Hotel[] = [
  {
    id: '1',
    name: 'Taj Exotica Resort & Spa',
    location: 'Goa, Benaulim Beach',
    rating: 4.9,
    reviewCount: 2341,
    price: 12500,
    originalPrice: 15000,
    image: 'https://picsum.photos/seed/hotel1/800/600',
    amenities: ['wifi', 'pool', 'spa', 'restaurant', 'gym', 'beach'],
    type: 'Luxury Resort',
    description: 'Premium beachfront resort with stunning ocean views and world-class amenities.',
  },
  {
    id: '2',
    name: 'Marriott Suites',
    location: 'Jaipur, MI Road',
    rating: 4.7,
    reviewCount: 1876,
    price: 8500,
    originalPrice: 10000,
    image: 'https://picsum.photos/seed/hotel2/800/600',
    amenities: ['wifi', 'pool', 'gym', 'restaurant', 'parking'],
    type: '5 Star Hotel',
    description: 'Modern luxury in the heart of the Pink City with traditional Rajasthani hospitality.',
  },
  {
    id: '3',
    name: 'Radisson Blu Plaza',
    location: 'Delhi, Aero City',
    rating: 4.6,
    reviewCount: 3102,
    price: 7200,
    originalPrice: 8500,
    image: 'https://picsum.photos/seed/hotel3/800/600',
    amenities: ['wifi', 'pool', 'gym', 'restaurant', 'spa', 'airport-shuttle'],
    type: 'Business Hotel',
    description: 'Perfect for business travelers with premium facilities and airport connectivity.',
  },
  {
    id: '4',
    name: 'The St. Regis Mumbai',
    location: 'Mumbai, Lower Parel',
    rating: 4.8,
    reviewCount: 1523,
    price: 15000,
    originalPrice: 18000,
    image: 'https://picsum.photos/seed/hotel4/800/600',
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'bar', 'butler'],
    type: 'Luxury Hotel',
    description: 'Iconic luxury hotel overlooking the Arabian Sea with impeccable service.',
  },
  {
    id: '5',
    name: 'ITC Grand Chola',
    location: 'Chennai, Guindy',
    rating: 4.7,
    reviewCount: 2890,
    price: 9500,
    originalPrice: 11000,
    image: 'https://picsum.photos/seed/hotel5/800/600',
    amenities: ['wifi', 'pool', 'spa', 'gym', 'restaurant', 'heritage'],
    type: 'Heritage Hotel',
    description: "India's largest LEED Platinum certified hotel with traditional South Indian art.",
  },
  {
    id: '6',
    name: 'Hyatt Regency',
    location: 'Bangalore, MG Road',
    rating: 4.5,
    reviewCount: 2100,
    price: 6800,
    originalPrice: 8000,
    image: 'https://picsum.photos/seed/hotel6/800/600',
    amenities: ['wifi', 'pool', 'gym', 'restaurant', 'business-center'],
    type: 'Business Hotel',
    description: 'Contemporary hotel in the tech hub with excellent meeting facilities.',
  },
];

const AMENITIES = [
  { id: 'wifi', icon: Wifi, label: 'Free WiFi' },
  { id: 'pool', icon: Coffee, label: 'Pool' },
  { id: 'parking', icon: Car, label: 'Free Parking' },
  { id: 'restaurant', icon: Coffee, label: 'Restaurant' },
  { id: 'gym', icon: Users, label: 'Gym' },
  { id: 'spa', icon: Phone, label: 'Spa' },
];

const CITIES = ['Goa', 'Jaipur', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Udaipur', 'Varanasi', 'Manali', 'Kerala'];
const PROPERTY_TYPES = ['All', 'Hotels', 'Resorts', 'Homestays', 'Villas'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function HotelsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [selectedType, setSelectedType] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722]" />
        </main>
        <Footer />
      </div>
    );
  }

  const filteredHotels = HOTELS.filter(hotel => {
    const matchesSearch = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = !selectedCity || hotel.location.includes(selectedCity);
    const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1];
    return matchesSearch && matchesCity && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#2D2D44]">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF5722]/20 rounded-full blur-[200px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B5CF6]/20 rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="accent" size="sm" className="mb-4">HOTELS & STAYS</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Find Your Perfect Stay
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Discover handpicked hotels, resorts, and homestays across India's most exciting destinations.
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 py-3 bg-[#FAFAFA] rounded-xl">
                    <Search className="h-5 w-5 text-[#8B5CF6] shrink-0" />
                    <input
                      type="text"
                      placeholder="Search hotels, locations..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 bg-transparent outline-none text-[#1A1A2E]"
                    />
                  </div>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-4 py-3 bg-[#FAFAFA] rounded-xl text-[#1A1A2E] outline-none cursor-pointer"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                  <Button size="lg" className="px-8">
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {PROPERTY_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                    selectedType === type
                      ? 'bg-[#FF5722] text-white'
                      : 'bg-white/10 text-white/80 hover:bg-white/20'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Hotels Grid */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {filteredHotels.length} Properties Found
                </h2>
                <p className="text-[#4A4A6A] mt-1">in {selectedCity || 'All Cities'}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-[#E0E0E0] hover:border-[#FF5722] transition-colors"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-white rounded-lg border border-[#E0E0E0] outline-none cursor-pointer"
                >
                  <option value="rating">Sort by Rating</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="bg-white rounded-2xl p-6 mb-8 shadow-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A2E] mb-3">Price Range</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg outline-none focus:border-[#FF5722]"
                      />
                      <span className="text-[#4A4A6A]">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg outline-none focus:border-[#FF5722]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#1A1A2E] mb-3">Amenities</label>
                    <div className="flex flex-wrap gap-2">
                      {AMENITIES.map(amenity => (
                        <span key={amenity.id} className="px-3 py-1 bg-[#FAFAFA] rounded-full text-sm text-[#4A4A6A]">
                          {amenity.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHotels.map(hotel => (
                <Link
                  key={hotel.id}
                  href={`/hotels/${hotel.id}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_12px_40px_rgba(26,26,46,0.12)] transition-all duration-300"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={hotel.image}
                      alt={hotel.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge variant="primary" size="sm" className="absolute top-3 left-3">
                      {hotel.type}
                    </Badge>
                    {hotel.originalPrice && (
                      <div className="absolute top-3 right-3 bg-[#FF5722] text-white px-2 py-1 rounded-lg text-xs font-semibold">
                        {Math.round((1 - hotel.price / hotel.originalPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-[#1A1A2E] text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>
                          {hotel.name}
                        </h3>
                        <p className="text-[#4A4A6A] text-sm mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {hotel.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                        <span className="font-semibold text-sm">{hotel.rating}</span>
                      </div>
                    </div>
                    <p className="text-[#4A4A6A] text-sm mb-4 line-clamp-2">{hotel.description}</p>
                    <div className="flex items-center gap-2 mb-4">
                      {hotel.amenities.slice(0, 4).map(amenity => (
                        <span key={amenity} className="px-2 py-1 bg-[#FAFAFA] rounded text-xs text-[#4A4A6A]">
                          {amenity}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs text-[#4A4A6A]">+{hotel.amenities.length - 4}</span>
                      )}
                    </div>
                    <div className="flex items-end justify-between pt-4 border-t border-[#F0F0F5]">
                      <div>
                        <span className="text-2xl font-bold text-[#FF5722]">{formatCurrency(hotel.price)}</span>
                        <span className="text-[#4A4A6A] text-sm">/night</span>
                        {hotel.originalPrice && (
                          <span className="text-[#4A4A6A] text-sm line-through ml-2">
                            {formatCurrency(hotel.originalPrice)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-[#4A4A6A]">{hotel.reviewCount} reviews</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="secondary" size="lg">
                Load More Properties
                <ChevronDown className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Why Book With Us */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge variant="primary" size="sm" className="mb-3">WHY BOOK WITH US</Badge>
              <h2 className="text-3xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                The HelpHive Hotel Promise
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Best Prices', desc: 'Guaranteed lowest rates' },
                { icon: Clock, title: 'Free Cancellation', desc: 'Flexible booking options' },
                { icon: Star, title: 'Verified Reviews', desc: 'Real guest feedback' },
                { icon: Phone, title: '24/7 Support', desc: 'Help whenever you need' },
              ].map(item => (
                <div key={item.title} className="text-center p-6 bg-[#FAFAFA] rounded-2xl">
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center">
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-bold text-[#1A1A2E] mb-1">{item.title}</h3>
                  <p className="text-[#4A4A6A] text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}