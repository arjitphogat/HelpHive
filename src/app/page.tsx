'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Search, SlidersHorizontal, MapPin, Calendar, Users, ChevronDown, X, ArrowRight } from 'lucide-react';
import { CITIES } from '@/constants';

// City data with images and counts
const CITIES_DATA = [
  { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=400&h=300&fit=crop', count: 156, description: 'The City of Dreams' },
  { name: 'Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&h=300&fit=crop', count: 203, description: 'Historic Capital' },
  { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400&h=300&fit=crop', count: 178, description: 'Garden City' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&h=300&fit=crop', count: 234, description: 'Beach Paradise' },
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=400&h=300&fit=crop', count: 189, description: 'Pink City' },
  { name: 'Udaipur', image: 'https://images.unsplash.com/photo-1622896784083-fd1e3c69e8e9?w=400&h=300&fit=crop', count: 143, description: 'City of Lakes' },
  { name: 'Varanasi', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=400&h=300&fit=crop', count: 98, description: 'Spiritual Capital' },
  { name: 'Rishikesh', image: 'https://images.unsplash.com/photo-1600100195362-63369f3d0e5a?w=400&h=300&fit=crop', count: 156, description: 'Yoga Capital' },
  { name: 'Agra', image: 'https://images.unsplash.com/photo-1580578578468-3bc5a4c2b6d5?w=400&h=300&fit=crop', count: 112, description: 'City of Taj' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=400&h=300&fit=crop', count: 167, description: 'God\'s Own Country' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=400&h=300&fit=crop', count: 134, description: 'Mountain Haven' },
  { name: 'Pune', image: 'https://images.unsplash.com/photo-1580077941997-a5898749d2a3?w=400&h=300&fit=crop', count: 145, description: 'Oxford of the East' },
  { name: 'Chennai', image: 'https://images.unsplash.com/photo-1587370560942-ad2a04eabb6d?w=400&h=300&fit=crop', count: 132, description: 'Detroit of India' },
  { name: 'Kolkata', image: 'https://images.unsplash.com/photo-1550960282-c1a5c23b8e21?w=400&h=300&fit=crop', count: 98, description: 'City of Joy' },
  { name: 'Hyderabad', image: 'https://images.unsplash.com/photo-1573352868081-b33749d05ffd?w=400&h=300&fit=crop', count: 156, description: 'City of Pearls' },
];

// Animated text words
const ANIMATED_WORDS = ['Adventure', 'Freedom', 'Exploration', 'Memories', 'Journey'];

const categories = [
  { icon: '🚗', label: 'TukTuks', active: true },
  { icon: '🛵', label: 'Scooters', active: false },
  { icon: '🏍️', label: 'Bikes', active: false },
  { icon: '🚙', label: 'Cars', active: false },
  { icon: '🗺️', label: 'Tours', active: false },
  { icon: '🎯', label: 'Experiences', active: false },
  { icon: '🏆', label: 'Tournaments', active: false },
];

const featuredVehicles = [
  { id: 1, title: 'Premium Tuk-Tuk with AC', location: 'Goa', price: 899, rating: 4.92, reviews: 128, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', instantBook: true },
  { id: 2, title: 'Royal Enfield Himalayan', location: 'Rishikesh', price: 699, rating: 4.88, reviews: 94, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop', instantBook: true },
  { id: 3, title: 'Vespa Style Scooter', location: 'Pondicherry', price: 499, rating: 4.95, reviews: 67, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop', instantBook: false },
  { id: 4, title: 'Adventure ATV Buggy', location: 'Jaipur', price: 1299, rating: 4.78, reviews: 45, image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop', instantBook: true },
];

const topExperiences = [
  { id: 1, title: 'Sunset Beach Tuk-Tuk Tour', location: 'Goa', price: 799, rating: 4.96, reviews: 234, image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&h=400&fit=crop', category: 'City Tour' },
  { id: 2, title: 'Heritage Walk & Food Trail', location: 'Jaipur', price: 999, rating: 4.91, reviews: 189, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop', category: 'Culture' },
  { id: 3, title: 'River Rafting Adventure', location: 'Rishikesh', price: 1499, rating: 4.87, reviews: 312, image: 'https://images.unsplash.com/photo-1600100195362-63369f3d0e5a?w=600&h=400&fit=crop', category: 'Adventure' },
  { id: 4, title: 'French Quarter Cycling', location: 'Pondicherry', price: 599, rating: 4.93, reviews: 156, image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop', category: 'Cycling' },
];

const testimonials = [
  { name: 'Priya S.', location: 'Mumbai', avatar: 'PS', rating: 5, text: 'Best experience ever! The tuk-tuk tour in Goa was incredible. Our guide was knowledgeable and friendly.' },
  { name: 'Rahul M.', location: 'Delhi', avatar: 'RM', rating: 5, text: 'Rented a Royal Enfield from HelpHive for my Rishikesh trip. Process was seamless and bike was in perfect condition.' },
  { name: 'Anita K.', location: 'Bangalore', avatar: 'AK', rating: 5, text: 'Won the Heritage Trail tournament and earned ₹5,000 credit! The gamification is so addictive. Love this platform.' },
];

export default function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('TukTuks');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchCity, setSearchCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Animate words
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentWordIndex((prev) => (prev + 1) % ANIMATED_WORDS.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCityDropdown(false);
        setShowDatePicker(false);
        setShowGuestPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCities = CITIES_DATA.filter(city =>
    city.name.toLowerCase().includes(searchCity.toLowerCase()) ||
    city.description.toLowerCase().includes(searchCity.toLowerCase())
  );

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCity) params.set('city', selectedCity);
    if (checkIn) params.set('checkIn', checkIn.toISOString());
    if (checkOut) params.set('checkOut', checkOut.toISOString());
    params.set('guests', String(guests.adults + guests.children));
    router.push(`/explore/vehicles?${params.toString()}`);
  };

  const selectCity = (cityName: string) => {
    setSelectedCity(cityName);
    setSearchCity(cityName);
    setShowCityDropdown(false);
  };

  const handleDateChange = (type: 'checkIn' | 'checkOut', date: Date) => {
    if (type === 'checkIn') {
      setCheckIn(date);
      if (checkOut && date > checkOut) setCheckOut(null);
    } else {
      setCheckOut(date);
    }
  };

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* NEW ATTRACTIVE HERO SECTION - Eye Catching with Animations */}
        <section className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f3460]">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Floating Shapes */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-[#FF385C]/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-[#E61E4D]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }} />

            {/* Floating Icons */}
            <div className="absolute top-32 right-20 text-6xl opacity-20 animate-bounce" style={{ animationDuration: '3s' }}>🛵</div>
            <div className="absolute bottom-40 left-20 text-5xl opacity-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🚗</div>
            <div className="absolute top-1/3 right-1/4 text-4xl opacity-15 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🏍️</div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Animated Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 animate-fade-in">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/90 text-sm font-medium">India's #1 Local Explorer Platform</span>
            </div>

            {/* Main Headline with Animated Words */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Discover the Joy of
              <span className="block mt-4">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-[#FF385C] to-[#E61E4D] bg-clip-text text-transparent">
                    {ANIMATED_WORDS[currentWordIndex]}
                  </span>
                  <span className={`absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-[#FF385C] to-[#E61E4D] rounded-full transition-opacity duration-300 ${isAnimating ? 'opacity-0' : 'opacity-100'}`} />
                </span>
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
              Rent iconic tuk-tuks, explore hidden gems, and create unforgettable memories across India's most vibrant destinations
            </p>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-12 animate-fade-in" style={{ animationDelay: '0.5s' }}>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">50K+</p>
                <p className="text-white/60 text-sm">Happy Users</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">15</p>
                <p className="text-white/60 text-sm">Cities</p>
              </div>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white">4.9</p>
                <p className="text-white/60 text-sm">Avg Rating</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.7s' }}>
              <Link
                href="/explore/vehicles"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-semibold rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-[#FF385C]/25"
              >
                Explore Now
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/host/onboarding"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-semibold rounded-full transition-all duration-300 border border-white/20"
              >
                Become a Host
              </Link>
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* SECONDARY HERO - Airbnb Style Search (Moved Below) */}
        <section className="relative -mt-8 lg:-mt-12 z-20">
          {/* Airbnb-style Search Bar */}
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.15)] p-2 flex flex-col lg:flex-row" ref={dropdownRef}>
              {/* Where - City Selector */}
              <div className="relative flex-1 lg:border-r border-gray-200">
                <button
                  onClick={() => { setShowCityDropdown(!showCityDropdown); setShowDatePicker(false); setShowGuestPicker(false); }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 rounded-full lg:rounded-none lg:rounded-l-full transition-colors"
                >
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">Where</label>
                  <input
                    type="text"
                    placeholder="Search destinations"
                    value={searchCity}
                    onChange={(e) => { setSearchCity(e.target.value); setShowCityDropdown(true); }}
                    onClick={() => setShowCityDropdown(true)}
                    className="w-full text-sm text-gray-600 placeholder:text-gray-400 bg-transparent outline-none"
                    readOnly
                  />
                </button>

                {/* City Dropdown */}
                {showCityDropdown && (
                  <div className="absolute top-full left-0 lg:left-0 mt-2 w-full lg:w-[400px] bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                    <div className="p-3 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search cities..."
                        value={searchCity}
                        onChange={(e) => setSearchCity(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                        autoFocus
                      />
                    </div>
                    <div className="p-2">
                      {filteredCities.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No cities found</p>
                      ) : (
                        filteredCities.map((city) => (
                          <button
                            key={city.name}
                            onClick={() => selectCity(city.name)}
                            className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                          >
                            <img src={city.image} alt={city.name} className="w-14 h-14 rounded-xl object-cover" />
                            <div className="flex-1 text-left">
                              <p className="font-semibold text-gray-900">{city.name}</p>
                              <p className="text-sm text-gray-500">{city.description}</p>
                            </div>
                            <span className="text-sm text-gray-400">{city.count} rides</span>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* When - Date Picker */}
              <div className="relative flex-1 lg:border-r border-gray-200">
                <button
                  onClick={() => { setShowDatePicker(!showDatePicker); setShowCityDropdown(false); setShowGuestPicker(false); }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">When</label>
                  <span className="text-sm text-gray-600">
                    {checkIn && checkOut
                      ? `${formatDate(checkIn)} - ${formatDate(checkOut)}`
                      : checkIn
                        ? `${formatDate(checkIn)} - Add date`
                        : 'Add dates'}
                  </span>
                </button>

                {/* Date Picker Dropdown */}
                {showDatePicker && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 w-[320px]">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-900 mb-2">Check-in</label>
                        <input
                          type="date"
                          min={today.toISOString().split('T')[0]}
                          value={checkIn ? checkIn.toISOString().split('T')[0] : ''}
                          onChange={(e) => handleDateChange('checkIn', new Date(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-900 mb-2">Check-out</label>
                        <input
                          type="date"
                          min={checkIn ? new Date(checkIn.getTime() + 86400000).toISOString().split('T')[0] : tomorrow.toISOString().split('T')[0]}
                          value={checkOut ? checkOut.toISOString().split('T')[0] : ''}
                          onChange={(e) => handleDateChange('checkOut', new Date(e.target.value))}
                          className="w-full px-4 py-3 bg-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#FF385C]/20"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Who - Guest Selector */}
              <div className="relative flex-1">
                <button
                  onClick={() => { setShowGuestPicker(!showGuestPicker); setShowCityDropdown(false); setShowDatePicker(false); }}
                  className="w-full px-6 py-4 text-left hover:bg-gray-50 lg:rounded-none lg:rounded-r-full transition-colors"
                >
                  <label className="block text-xs font-semibold text-gray-900 mb-0.5">Who</label>
                  <span className="text-sm text-gray-600">
                    {guests.adults + guests.children > 1
                      ? `${guests.adults} adults${guests.children > 0 ? `, ${guests.children} children` : ''}`
                      : 'Add guests'}
                  </span>
                </button>

                {/* Guest Picker Dropdown */}
                {showGuestPicker && (
                  <div className="absolute top-full right-0 lg:right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 w-[300px]">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Adults</p>
                          <p className="text-sm text-gray-500">Ages 13+</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setGuests({ ...guests, adults: Math.max(1, guests.adults - 1) })}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                            disabled={guests.adults <= 1}
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-medium">{guests.adults}</span>
                          <button
                            onClick={() => setGuests({ ...guests, adults: guests.adults + 1 })}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">Children</p>
                          <p className="text-sm text-gray-500">Ages 2-12</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setGuests({ ...guests, children: Math.max(0, guests.children - 1) })}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400 disabled:opacity-50"
                            disabled={guests.children <= 0}
                          >
                            -
                          </button>
                          <span className="w-6 text-center font-medium">{guests.children}</span>
                          <button
                            onClick={() => setGuests({ ...guests, children: guests.children + 1 })}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-400"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-[#FF385C] hover:bg-[#E61E4D] text-white font-semibold rounded-full lg:rounded-none lg:rounded-r-full transition-all mx-2 lg:mx-0 mt-2 lg:mt-0"
              >
                <Search className="h-5 w-5" />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>
        </section>

        {/* Categories - Airbnb Style Horizontal Scroll */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map((cat) => (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`category-pill flex-shrink-0 ${activeCategory === cat.label ? 'active' : ''}`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
              <button className="category-pill flex-shrink-0 ml-auto">
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </section>

        {/* All Cities Grid - Live Cities with Data */}
        <section className="py-8 lg:py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--color-text)]">Explore All Cities</h2>
              <span className="text-sm text-[var(--color-text-secondary)]">{CITIES_DATA.length} destinations</span>
            </div>

            {/* City Grid - Responsive */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {CITIES_DATA.map((city, index) => (
                <Link
                  key={city.name}
                  href={`/explore/vehicles?city=${encodeURIComponent(city.name)}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-2 img-zoom">
                    <img
                      src={city.image}
                      alt={city.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-semibold text-white text-lg">{city.name}</h3>
                      <p className="text-white/80 text-sm">{city.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--color-text)]">{city.count} rides</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Explore →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vehicles - Airbnb Card Grid */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Featured Vehicles</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Premium rides for your next adventure</p>
              </div>
              <Link href="/explore/vehicles" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                View all
              </Link>
            </div>

            {/* Airbnb Grid - 4 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle, index) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card">
                    {/* Image Container */}
                    <div className="relative aspect-[4/3] img-zoom">
                      <img
                        src={vehicle.image}
                        alt={vehicle.title}
                        className="w-full h-full object-cover"
                      />
                      {vehicle.instantBook && (
                        <div className="absolute top-3 left-3">
                          <span className="badge badge-primary font-medium">Instant Book</span>
                        </div>
                      )}
                      {/* Heart Button */}
                      <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition heart-btn">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">{vehicle.title}</h3>
                        <div className="flex items-center gap-1">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                          <span className="text-sm font-medium">{vehicle.rating}</span>
                          <span className="text-sm text-[var(--color-text-muted)]">({vehicle.reviews})</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-2">{vehicle.location}</p>
                      <p className="text-sm font-semibold">
                        <span className="text-[var(--color-text)]">₹{vehicle.price}</span>
                        <span className="font-normal text-[var(--color-text-secondary)]"> / day</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Top Experiences */}
        <section className="py-8 lg:py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-[var(--color-text)]">Top Experiences</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Curated tours with local experts</p>
              </div>
              <Link href="/explore/experiences" className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
                View all
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topExperiences.map((exp, index) => (
                <Link
                  key={exp.id}
                  href={`/experiences/${exp.id}`}
                  className="group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="card">
                    <div className="relative aspect-[4/3] img-zoom">
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="badge badge-primary font-medium">{exp.category}</span>
                      </div>
                      <button className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition heart-btn">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div className="p-3">
                      <div className="flex items-center gap-1 mb-1">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        <span className="text-sm font-medium">{exp.rating}</span>
                        <span className="text-sm text-[var(--color-text-muted)]">({exp.reviews})</span>
                      </div>
                      <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">{exp.title}</h3>
                      <p className="text-sm text-[var(--color-text-secondary)] mb-2">{exp.location}</p>
                      <p className="text-sm font-semibold">
                        <span className="text-[var(--color-text)]">₹{exp.price}</span>
                        <span className="font-normal text-[var(--color-text-secondary)]"> / person</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner - Airbnb Style */}
        <section className="py-8 lg:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/cities" className="block relative rounded-[var(--radius-2xl)] overflow-hidden group">
              <div className="aspect-[3/1] bg-gradient-to-r from-[#FF385C] to-[#FF5A5F]">
                <img
                  src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&h=400&fit=crop"
                  alt="Explore cities"
                  className="w-full h-full object-cover mix-blend-overlay opacity-40"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-2xl lg:text-4xl font-semibold mb-2">Explore India's Best Cities</h2>
                    <p className="text-lg text-white/80 mb-4">From beach vibes to heritage trails - find your next adventure</p>
                    <span className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[var(--color-text)] rounded-[var(--radius-md)] font-semibold group-hover:bg-white/90 transition">
                      Start Exploring
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Testimonials - Airbnb Style */}
        <section className="py-8 lg:py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">What Our Users Say</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className="p-6 bg-white rounded-[var(--radius-lg)] animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24" style={{ color: 'var(--color-text)' }}>
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>

                  <p className="text-[var(--color-text-secondary)] mb-4">"{testimonial.text}"</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{ background: 'var(--color-primary)' }}>
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--color-text)]">{testimonial.name}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 border-t border-[var(--color-border-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)]">50K+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Happy Users</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)]">15</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Cities</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)]">4.9</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Average Rating</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-semibold text-[var(--color-text)]">10K+</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Listings</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Sticky CTA - Airbnb Style */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--color-border-light)] md:hidden z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--color-text)]">India's #1 Local Explorer</p>
            <p className="text-sm text-[var(--color-text-secondary)]">50K+ happy users</p>
          </div>
          <Link
            href="/explore/vehicles"
            className="px-6 py-3 bg-[var(--color-primary)] text-white rounded-[var(--radius-md)] font-semibold text-sm"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
}
