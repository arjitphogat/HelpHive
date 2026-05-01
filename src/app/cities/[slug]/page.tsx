'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import { TrustBadge, InstantBookBadge } from '@/components/ui/TrustBadges';
import {
  MapPin,
  Calendar,
  Users,
  Star,
  Heart,
  ChevronRight,
  Shield,
  Clock,
  Award,
  Trophy,
  Sun,
  ThermometerSun,
  Wind
} from 'lucide-react';

interface CityData {
  name: string;
  slug: string;
  hero: string;
  tagline: string;
  description: string;
  weather: {
    bestTime: string;
    avgTemp: string;
    humidity: string;
  };
  highlights: string[];
  thingsToDo: { title: string; description: string; icon: string }[];
  stats: {
    vehicles: number;
    tours: number;
    tournaments: number;
    experiences: number;
    hosts: number;
  };
  featuredVehicles: {
    id: number;
    title: string;
    type: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    instantBook: boolean;
  }[];
  featuredTours: {
    id: number;
    title: string;
    duration: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
  }[];
  upcomingTournaments: {
    id: number;
    title: string;
    prize: string;
    participants: number;
    daysLeft: number;
    image: string;
  }[];
  localGuides: {
    id: number;
    name: string;
    avatar: string;
    rating: number;
    tours: number;
    bio: string;
  }[];
}

const cityData: Record<string, CityData> = {
  goa: {
    name: 'Goa',
    slug: 'goa',
    hero: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1920&h=800&fit=crop',
    tagline: 'Beach vibes, sunset rides & adventure',
    description: 'India\'s party capital transforms into an explorer\'s paradise. Cruise along coastal roads, discover hidden beaches, and experience the unique blend of Portuguese heritage and Indian culture.',
    weather: {
      bestTime: 'October - March',
      avgTemp: '28°C',
      humidity: '65%',
    },
    highlights: ['Beach Rides', 'Sunset Tours', 'Night Markets', 'Water Sports', 'Heritage Walks', 'Trekking'],
    thingsToDo: [
      { title: 'Coastal Tuk-Tuk Tours', description: 'Explore the beautiful coastline', icon: '🛺' },
      { title: 'Spice Plantation Visits', description: 'Learn about Goan spices', icon: '🌿' },
      { title: 'Sunset Beach Parties', description: 'Experience vibrant nightlife', icon: '🌅' },
      { title: 'Heritage Walks', description: 'Portuguese architecture', icon: '🏛️' },
    ],
    stats: { vehicles: 156, tours: 89, tournaments: 12, experiences: 234, hosts: 45 },
    featuredVehicles: [
      { id: 1, title: 'Premium AC Tuk-Tuk', type: 'Tuk-Tuk', price: 899, rating: 4.92, reviews: 128, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop', instantBook: true },
      { id: 2, title: 'Royal Enfield', type: 'Bike', price: 699, rating: 4.88, reviews: 94, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop', instantBook: true },
      { id: 3, title: 'Vespa Style Scooter', type: 'Scooter', price: 499, rating: 4.95, reviews: 67, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop', instantBook: false },
      { id: 4, title: 'Luxury SUV', type: 'Car', price: 2499, rating: 4.78, reviews: 45, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop', instantBook: true },
    ],
    featuredTours: [
      { id: 1, title: 'North Goa Beach Hopping', duration: '6 hours', price: 999, rating: 4.96, reviews: 234, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
      { id: 2, title: 'Spice Plantation Tour', duration: '4 hours', price: 799, rating: 4.91, reviews: 156, image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=400&fit=crop' },
      { id: 3, title: 'Sunset Cruise Experience', duration: '3 hours', price: 1299, rating: 4.88, reviews: 189, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop' },
    ],
    upcomingTournaments: [
      { id: 1, title: 'Beach Run Championship', prize: '₹25,000', participants: 89, daysLeft: 3, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop' },
      { id: 2, title: 'Sunset Ride Challenge', prize: '₹15,000', participants: 67, daysLeft: 7, image: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=600&h=300&fit=crop' },
    ],
    localGuides: [
      { id: 1, name: 'Carlos D\'Costa', avatar: 'CD', rating: 4.97, tours: 234, bio: 'Born & raised in Goa. 10+ years hosting.' },
      { id: 2, name: 'Priya Naik', avatar: 'PN', rating: 4.95, tours: 189, bio: 'Heritage enthusiast & foodie.' },
      { id: 3, name: 'Rahul Shet', avatar: 'RS', rating: 4.92, tours: 156, bio: 'Adventure specialist.' },
    ],
  },
  jaipur: {
    name: 'Jaipur',
    slug: 'jaipur',
    hero: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1920&h=800&fit=crop',
    tagline: 'Royal heritage tours & Pink City adventures',
    description: 'Experience the magic of Rajasthan\'s capital. From majestic forts to bustling bazaars, explore the Pink City in authentic tuk-tuks and discover centuries of royal heritage.',
    weather: {
      bestTime: 'October - March',
      avgTemp: '25°C',
      humidity: '55%',
    },
    highlights: ['Heritage Walks', 'Palace Tours', 'Local Cuisine', 'Shopping', 'Elephant Sanctuary', 'Hot Air Balloon'],
    thingsToDo: [
      { title: 'Fort Exploring', description: 'Amber Fort & City Palace', icon: '🏰' },
      { title: 'Local Food Trails', description: 'Authentic Rajasthani cuisine', icon: '🍛' },
      { title: 'Bazaar Shopping', description: 'Traditional crafts & textiles', icon: '🛍️' },
      { title: 'Cultural Shows', description: 'Dinner with folk performances', icon: '💃' },
    ],
    stats: { vehicles: 134, tours: 76, tournaments: 8, experiences: 189, hosts: 38 },
    featuredVehicles: [
      { id: 5, title: 'Royal Tuk-Tuk Tour', type: 'Tuk-Tuk', price: 799, rating: 4.90, reviews: 112, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop', instantBook: true },
      { id: 6, title: 'Royal Enfield Himalayan', type: 'Bike', price: 899, rating: 4.85, reviews: 89, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop', instantBook: true },
      { id: 7, title: 'JEEP Wrangler', type: 'Jeep', price: 1999, rating: 4.92, reviews: 56, image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&h=400&fit=crop', instantBook: false },
      { id: 8, title: 'Classic Ambassador', type: 'Car', price: 1499, rating: 4.78, reviews: 78, image: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=600&h=400&fit=crop', instantBook: true },
    ],
    featuredTours: [
      { id: 4, title: 'Amber Fort Sunrise Tour', duration: '5 hours', price: 1299, rating: 4.98, reviews: 312, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop' },
      { id: 5, title: 'Old City Food Walk', duration: '4 hours', price: 899, rating: 4.95, reviews: 234, image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?w=600&h=400&fit=crop' },
      { id: 6, title: 'Palace & Museum Tour', duration: '6 hours', price: 1499, rating: 4.91, reviews: 178, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop' },
    ],
    upcomingTournaments: [
      { id: 3, title: 'Heritage Trail Challenge', prize: '₹30,000', participants: 120, daysLeft: 5, image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=300&fit=crop' },
    ],
    localGuides: [
      { id: 4, name: 'Ravi Sharma', avatar: 'RS', rating: 4.96, tours: 289, bio: 'Heritage expert & licensed guide.' },
      { id: 5, name: 'Meera Jain', avatar: 'MJ', rating: 4.94, tours: 212, bio: 'Food tour specialist.' },
      { id: 6, name: 'Vikram Singh', avatar: 'VS', rating: 4.91, tours: 178, bio: 'Photography enthusiast.' },
    ],
  },
  delhi: {
    name: 'Delhi',
    slug: 'delhi',
    hero: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1920&h=800&fit=crop',
    tagline: 'Historic monuments & modern street food',
    description: 'From the grandeur of Mughal-era forts to the chaos of Karol Bagh markets. Explore India\'s capital city with our curated tuk-tuk tours through Old Delhi\'s narrow lanes.',
    weather: {
      bestTime: 'October - March',
      avgTemp: '22°C',
      humidity: '60%',
    },
    highlights: ['Red Fort', 'Street Food', 'Old Delhi Tours', 'India Gate', 'Qutub Minar', 'Shopping'],
    thingsToDo: [
      { title: 'Old Delhi Food Tour', description: 'Chandni Chowk delicacies', icon: '🍛' },
      { title: 'Heritage Monuments', description: 'Red Fort, Qutub Minar', icon: '🏛️' },
      { title: 'Market Shopping', description: 'Spices, textiles & more', icon: '🛍️' },
      { title: 'Evening Aarti', description: 'River Ganga ceremony', icon: '🕉️' },
    ],
    stats: { vehicles: 245, tours: 134, tournaments: 18, experiences: 312, hosts: 67 },
    featuredVehicles: [
      { id: 9, title: 'Delhi Tuk-Tuk Express', type: 'Tuk-Tuk', price: 599, rating: 4.88, reviews: 156, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop', instantBook: true },
      { id: 10, title: 'Activa Scooter', type: 'Scooter', price: 399, rating: 4.82, reviews: 234, image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=600&h=400&fit=crop', instantBook: true },
      { id: 11, title: 'Premium SUV', type: 'Car', price: 1999, rating: 4.90, reviews: 89, image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop', instantBook: true },
      { id: 12, title: 'Royal Enfield Classic', type: 'Bike', price: 799, rating: 4.85, reviews: 167, image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop', instantBook: false },
    ],
    featuredTours: [
      { id: 7, title: 'Old Delhi Food Trail', duration: '5 hours', price: 899, rating: 4.97, reviews: 456, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop' },
      { id: 8, title: 'Monuments Tour', duration: '8 hours', price: 1599, rating: 4.92, reviews: 234, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop' },
      { id: 9, title: 'Street Photography Walk', duration: '4 hours', price: 699, rating: 4.89, reviews: 178, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=400&fit=crop' },
    ],
    upcomingTournaments: [
      { id: 4, title: 'Delhi Food Run', prize: '₹40,000', participants: 156, daysLeft: 2, image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&h=300&fit=crop' },
      { id: 5, title: 'Monuments Marathon', prize: '₹25,000', participants: 98, daysLeft: 10, image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=300&fit=crop' },
    ],
    localGuides: [
      { id: 7, name: 'Amit Kumar', avatar: 'AK', rating: 4.98, tours: 412, bio: 'Old Delhi specialist.' },
      { id: 8, name: 'Priya Singh', avatar: 'PS', rating: 4.95, tours: 356, bio: 'History buff & foodie.' },
      { id: 9, name: 'Suresh Mehta', avatar: 'SM', rating: 4.92, tours: 289, bio: 'Photography expert.' },
    ],
  },
};

export default function CityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const city = cityData[slug];

  if (!city) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">City Not Found</h1>
          <Link href="/cities">
            <Button>View All Cities</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative h-[60vh] min-h-[500px]">
          <img
            src={city.hero}
            alt={city.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-[var(--color-success)] text-white text-xs font-semibold rounded-full">
                  Live
                </span>
                <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                  {city.stats.vehicles} vehicles available
                </span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">{city.name}</h1>
              <p className="text-xl text-white/80 mb-6 max-w-2xl">{city.tagline}</p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2 text-white">
                  <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                  <span className="font-semibold">{city.localGuides[0].rating}</span>
                  <span className="text-white/70">avg rating</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">{city.stats.hosts}+</span>
                  <span className="text-white/70">verified hosts</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <Trophy className="h-5 w-5" />
                  <span className="font-semibold">{city.stats.tournaments}</span>
                  <span className="text-white/70">active tournaments</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Weather & Best Time */}
        <section className="py-6 bg-[var(--color-surface-muted)] border-b border-[var(--color-border-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-[var(--color-warning)]" />
                <span className="font-medium">Best time:</span>
                <span>{city.weather.bestTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThermometerSun className="h-5 w-5 text-[var(--color-error)]" />
                <span className="font-medium">Avg Temp:</span>
                <span>{city.weather.avgTemp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-[var(--color-info)]" />
                <span className="font-medium">Humidity:</span>
                <span>{city.weather.humidity}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Things to Do */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-[var(--color-text)] mb-8">Things to Do in {city.name}</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {city.thingsToDo.map((thing, index) => (
                <div
                  key={thing.title}
                  className="p-4 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)] hover:shadow-lg transition-shadow cursor-pointer animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-3xl mb-2">{thing.icon}</div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-1">{thing.title}</h3>
                  <p className="text-xs text-[var(--color-text-secondary)]">{thing.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Vehicles */}
        <section className="py-12 bg-[var(--color-surface-muted)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Available Vehicles</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">{city.stats.vehicles} vehicles to choose from</p>
              </div>
              <Link href={`/explore/vehicles?city=${city.slug}`}>
                <Button variant="outline" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {city.featuredVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/explore/vehicles/${vehicle.id}`}
                  className="group bg-white rounded-[var(--radius-xl)] overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={vehicle.image}
                      alt={vehicle.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {vehicle.instantBook && (
                      <div className="absolute top-3 left-3">
                        <InstantBookBadge />
                      </div>
                    )}
                    <button
                      onClick={(e) => e.preventDefault()}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center hover:bg-white"
                    >
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 fill-[var(--color-primary)]" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-sm font-semibold">{vehicle.rating}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">({vehicle.reviews})</span>
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">{vehicle.title}</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{vehicle.type}</p>
                    <p className="mt-2 font-semibold">
                      <span className="text-[var(--color-text)]">₹{vehicle.price}</span>
                      <span className="text-sm text-[var(--color-text-secondary)]"> / day</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Tours */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Top Tours</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Guided by local experts</p>
              </div>
              <Link href={`/explore/experiences?city=${city.slug}`}>
                <Button variant="outline" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {city.featuredTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/explore/experiences/${tour.id}`}
                  className="group bg-white rounded-[var(--radius-xl)] overflow-hidden border border-[var(--color-border-light)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded text-xs font-semibold">
                      {tour.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-1 mb-1">
                      <Star className="h-3.5 w-3.5 fill-[var(--color-primary)]" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-sm font-semibold">{tour.rating}</span>
                      <span className="text-xs text-[var(--color-text-muted)]">({tour.reviews} reviews)</span>
                    </div>
                    <h3 className="font-semibold text-[var(--color-text)]">{tour.title}</h3>
                    <p className="mt-2 font-semibold">
                      <span className="text-[var(--color-text)]">₹{tour.price}</span>
                      <span className="text-sm text-[var(--color-text-secondary)]"> / person</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Tournaments */}
        {city.upcomingTournaments.length > 0 && (
          <section className="py-12 bg-[var(--color-surface-muted)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[var(--color-text)]">Upcoming Tournaments</h2>
                  <p className="text-sm text-[var(--color-text-secondary)]">Compete & win exciting prizes</p>
                </div>
                <Link href="/tournament">
                  <Button variant="outline" size="sm">View All <ChevronRight className="h-4 w-4 ml-1" /></Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {city.upcomingTournaments.map((tournament) => (
                  <Link
                    key={tournament.id}
                    href="/tournament"
                    className="group relative rounded-[var(--radius-xl)] overflow-hidden"
                  >
                    <img
                      src={tournament.image}
                      alt={tournament.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded text-xs font-semibold text-white">
                          {tournament.daysLeft} days left
                        </span>
                        <span className="text-lg font-bold text-[var(--color-warning)]">{tournament.prize}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-1">{tournament.title}</h3>
                      <p className="text-sm text-white/70">{tournament.participants} participants</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Local Guides */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[var(--color-text)]">Top Local Guides</h2>
                <p className="text-sm text-[var(--color-text-secondary)]">Book with verified experts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {city.localGuides.map((guide) => (
                <div
                  key={guide.id}
                  className="p-6 rounded-[var(--radius-xl)] bg-[var(--color-surface-muted)]"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white" style={{ background: 'var(--color-primary)' }}>
                      {guide.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-[var(--color-primary)]" style={{ color: 'var(--color-primary)' }} />
                        <span className="font-semibold">{guide.rating}</span>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)]">{guide.tours} tours</p>
                    </div>
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)] mb-2">{guide.name}</h3>
                  <p className="text-sm text-[var(--color-text-secondary)] mb-4">{guide.bio}</p>
                  <Button variant="outline" size="sm" className="w-full">View Profile</Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* City Stats */}
        <section className="py-12 bg-[var(--color-text)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-white">{city.stats.vehicles}+</p>
                <p className="text-white/70">Vehicles</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-white">{city.stats.tours}+</p>
                <p className="text-white/70">Tours</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-white">{city.stats.experiences}+</p>
                <p className="text-white/70">Experiences</p>
              </div>
              <div>
                <p className="text-3xl lg:text-4xl font-bold text-white">{city.stats.hosts}+</p>
                <p className="text-white/70">Hosts</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-4xl font-bold text-[var(--color-text)] mb-4">
              Ready to Explore {city.name}?
            </h2>
            <p className="text-lg text-[var(--color-text-secondary)] mb-8">
              Book your perfect ride or tour and discover all that {city.name} has to offer.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/explore/vehicles?city=${city.slug}`}>
                <Button size="lg">Rent a Vehicle</Button>
              </Link>
              <Link href={`/explore/experiences?city=${city.slug}`}>
                <Button size="lg" variant="outline">Book a Tour</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
