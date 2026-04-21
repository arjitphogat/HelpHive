'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui';
import { Badge } from '@/components/ui';
import { Search, MapPin, Calendar, Users, ArrowRight, Star, Zap, Shield, Trophy, TrendingUp, ChevronRight } from 'lucide-react';
import { sampleVehicles, sampleExperiences, CITIES_DATA } from '@/data/sample-data';
import { formatCurrency } from '@/lib/utils';

// Stats data
const STATS = [
  { value: '50K+', label: 'Happy Explorers' },
  { value: '15', label: 'Cities' },
  { value: '4.9', label: 'Avg Rating' },
  { value: '10K+', label: 'Adventures' },
];

// Features
const FEATURES = [
  { icon: Shield, title: 'Verified Hosts', desc: 'All hosts are background checked' },
  { icon: Zap, title: 'Instant Booking', desc: 'Book in seconds, ride today' },
  { icon: Trophy, title: 'Rewards Program', desc: 'Earn points & unlock perks' },
  { icon: TrendingUp, title: 'Weekly Tournaments', desc: 'Compete & win prizes' },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  // Get featured vehicles (top rated)
  const featuredVehicles = [...sampleVehicles]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  // Get featured experiences
  const featuredExperiences = [...sampleExperiences]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore/vehicles?city=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/explore/vehicles');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />

      <main>
        {/* HERO SECTION - Bold & Premium */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24">
          {/* Dynamic Background */}
          <div className="absolute inset-0">
            {/* Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#2D2D44]" />

            {/* Animated Gradient Orbs */}
            <div className="absolute top-[-200px] left-[-200px] w-[900px] h-[900px] bg-[#FF5722]/20 rounded-full blur-[200px] animate-pulse" />
            <div className="absolute bottom-[-200px] right-[-200px] w-[700px] h-[700px] bg-[#C6FF00]/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-[#00BCD4]/5 rounded-full blur-[250px] animate-pulse" style={{ animationDelay: '2s' }} />

            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }} />

            {/* Floating Elements */}
            <div className="absolute top-40 right-[15%] text-8xl opacity-10 animate-float hidden lg:block">🛵</div>
            <div className="absolute bottom-48 left-[10%] text-7xl opacity-10 animate-float hidden lg:block" style={{ animationDelay: '1.5s' }}>🏍️</div>
            <div className="absolute top-1/3 right-[25%] text-6xl opacity-8 animate-float hidden lg:block" style={{ animationDelay: '0.8s' }}>🚗</div>
            <div className="absolute bottom-1/3 left-[20%] text-5xl opacity-6 animate-float hidden lg:block" style={{ animationDelay: '2s' }}>⚡</div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full mb-10 border border-white/10 animate-fade-in">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C6FF00] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#C6FF00]"></span>
              </span>
              <span className="text-white/90 text-sm font-medium tracking-wide">India's Premier TukTuk & Ride Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.05] animate-fade-in-up" style={{ fontFamily: 'Sora, sans-serif' }}>
              <span className="block mb-3">Ride Cities.</span>
              <span className="block mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#FF5722] to-[#FFD700]">Win Adventures.</span>
              <span className="block">Discover India.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl lg:text-2xl text-white/70 mb-12 max-w-3xl mx-auto animate-fade-in-up leading-relaxed" style={{ animationDelay: '0.1s' }}>
              Explore India's most vibrant cities with TukTuks, bikes, and local experiences.
              Earn rewards. Compete in tournaments. Make every ride unforgettable.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-14 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden">
                <div className="flex-1 flex items-center px-8 py-5">
                  <MapPin className="h-6 w-6 text-[#FF5722] shrink-0" />
                  <input
                    type="text"
                    placeholder="Where do you want to explore?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-5 py-2 bg-transparent text-[#1A1A2E] placeholder:text-gray-400 outline-none text-lg"
                  />
                </div>
                <button
                  type="submit"
                  className="m-2 mr-2 px-10 py-5 bg-gradient-to-r from-[#FF5722] to-[#FF8A65] text-white font-bold rounded-full hover:shadow-[0_0_40px_rgba(255,87,34,0.5)] transition-all duration-300 flex items-center gap-3 text-lg"
                >
                  <Search className="h-6 w-6" />
                  <span className="hidden sm:inline">Explore</span>
                </button>
              </div>
            </form>

            {/* Quick City Pills */}
            <div className="flex flex-wrap justify-center gap-4 mb-16 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {['Goa', 'Jaipur', 'Mumbai', 'Delhi', 'Bangalore'].map((city) => (
                <button
                  key={city}
                  onClick={() => router.push(`/explore/vehicles?city=${city}`)}
                  className="px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white/90 rounded-full text-base font-medium border border-white/10 hover:bg-white/20 hover:border-white/20 transition-all"
                >
                  {city}
                </button>
              ))}
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-12 sm:gap-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>{stat.value}</p>
                  <p className="text-white/60 text-base mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-white/60 rounded-full animate-pulse" />
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E] mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Why Choose HELPHIVE?
              </h2>
              <p className="text-[#4A4A6A] text-lg max-w-2xl mx-auto">
                We're not just another ride platform. We're building a community of explorers who earn, compete, and discover together.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-3xl bg-[#FAFAFA] hover:bg-gradient-to-br hover:from-[#FF5722]/5 hover:to-[#FF8A65]/5 transition-all duration-300 border border-transparent hover:border-[#FF5722]/20"
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A2E] mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>{feature.title}</h3>
                  <p className="text-[#4A4A6A]">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CITIES SECTION */}
        <section className="py-20 lg:py-28 bg-[#FAFAFA]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="accent" size="sm" className="mb-3">EXPLORE</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Explore Top Cities
                </h2>
                <p className="text-[#4A4A6A] mt-2">Handpicked destinations with the best rides & experiences</p>
              </div>
              <Link href="/cities" className="hidden sm:flex items-center gap-2 text-[#FF5722] font-semibold hover:gap-3 transition-all">
                View all cities <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {CITIES_DATA.slice(0, 6).map((city, index) => (
                <Link
                  key={city.slug}
                  href={`/explore/vehicles?city=${city.name}`}
                  className={`group relative rounded-3xl overflow-hidden ${index === 0 ? 'col-span-2 row-span-2 aspect-square lg:aspect-auto' : 'aspect-[4/3]'}`}
                >
                  <Image
                    src={city.image}
                    alt={city.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 lg:bottom-6 lg:left-6 right-4">
                    <h3 className="text-white text-xl lg:text-2xl font-bold" style={{ fontFamily: 'Sora, sans-serif' }}>{city.name}</h3>
                    <p className="text-white/80 text-sm mt-1">{city.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-white/90 text-sm">{city.vehicleCount} vehicles</span>
                      <span className="text-white/90 text-sm">{city.experienceCount} experiences</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center group-hover:bg-[#FF5722] transition-colors">
                      <ArrowRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED VEHICLES SECTION */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="primary" size="sm" className="mb-3">VEHICLES</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Top Rated Rides
                </h2>
                <p className="text-[#4A4A6A] mt-2">Premium vehicles with verified hosts</p>
              </div>
              <Link href="/explore/vehicles" className="hidden sm:flex items-center gap-2 text-[#FF5722] font-semibold hover:gap-3 transition-all">
                View all <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/explore/vehicles/${vehicle.id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_12px_40px_rgba(26,26,46,0.12)] transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge variant="primary" size="sm" className="absolute top-3 left-3">{vehicle.type.replace('_', ' ')}</Badge>
                    {vehicle.hostVerified && (
                      <Badge variant="success" size="sm" className="absolute top-3 right-3">
                        <Shield className="h-3 w-3" /> Verified
                      </Badge>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold text-[#1A1A2E] text-lg" style={{ fontFamily: 'Sora, sans-serif' }}>{vehicle.brand} {vehicle.model}</h3>
                        <p className="text-[#4A4A6A] text-sm mt-1 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {vehicle.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                        <span className="font-semibold text-sm">{vehicle.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-sm text-[#4A4A6A]">
                      <span className="flex items-center gap-1"><Users className="h-4 w-4" />{vehicle.capacity}</span>
                      <span>{vehicle.transmission}</span>
                      <span>{vehicle.fuelType}</span>
                    </div>
                    <div className="flex items-end justify-between mt-4 pt-4 border-t border-[#F0F0F5]">
                      <div>
                        <span className="text-2xl font-bold text-[#FF5722]">{formatCurrency(vehicle.pricePerHour)}</span>
                        <span className="text-[#4A4A6A] text-sm">/hour</span>
                      </div>
                      <span className="text-sm text-[#4A4A6A]">{vehicle.reviewCount} reviews</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED EXPERIENCES SECTION */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#2D2D44] relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FF5722]/10 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C6FF00]/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <Badge variant="accent" size="sm" className="mb-3">EXPERIENCES</Badge>
                <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Local Adventures
                </h2>
                <p className="text-white/60 mt-2">Curated experiences with passionate local guides</p>
              </div>
              <Link href="/explore/experiences" className="hidden sm:flex items-center gap-2 text-[#C6FF00] font-semibold hover:gap-3 transition-all">
                View all <ChevronRight className="h-5 w-5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredExperiences.map((exp) => (
                <Link
                  key={exp.id}
                  href={`/explore/experiences/${exp.id}`}
                  className="group bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={exp.image}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <Badge variant="primary" size="sm" className="absolute top-3 left-3">{exp.category}</Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 text-white/80 text-sm">
                        <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                        <span>{exp.rating}</span>
                        <span className="text-white/50">({exp.reviewCount})</span>
                      </div>
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2" style={{ fontFamily: 'Sora, sans-serif' }}>{exp.title}</h3>
                    <p className="text-white/60 text-sm mb-4 flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {exp.city} • {exp.duration}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <span className="text-xl font-bold text-[#C6FF00]">{formatCurrency(exp.price)}</span>
                      <span className="text-white/60 text-sm">/person</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-20 lg:py-28 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="relative p-12 lg:p-16 rounded-[2rem] overflow-hidden bg-gradient-to-br from-[#FF5722] to-[#FF8A65]">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-full h-full">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl" />
              </div>

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                  Ready to Start Exploring?
                </h2>
                <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
                  Join thousands of explorers discovering India. List your vehicle or guide experiences and start earning today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/explore/vehicles">
                    <Button size="xl" variant="glass" className="w-full sm:w-auto bg-white text-[#FF5722] hover:bg-white/90">
                      Find a Ride <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/host/onboarding">
                    <Button size="xl" variant="accent" className="w-full sm:w-auto">
                      Become a Host
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL STATS */}
        <section className="py-16 border-t border-[#F0F0F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {STATS.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl lg:text-4xl font-bold text-[#FF5722]" style={{ fontFamily: 'Sora, sans-serif' }}>{stat.value}</p>
                  <p className="text-[#4A4A6A] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-[#F0F0F5] md:hidden z-40">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-[#1A1A2E]">HELPHIVE</p>
            <p className="text-sm text-[#4A4A6A]">India's #1 Ride Platform</p>
          </div>
          <Link href="/explore/vehicles">
            <Button size="lg">Explore Now</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
