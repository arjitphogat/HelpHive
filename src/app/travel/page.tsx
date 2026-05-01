'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { Button, Badge, Input } from '@/components/ui';
import { Search, MapPin, Calendar, Train, Plane, Bus, ArrowRight, Star, Clock, Shield, Users, ChevronDown, Wifi } from 'lucide-react';

interface TrainOption {
  id: string;
  name: string;
  number: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  class: string;
  rating: number;
  seatsAvailable: number;
}

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  originalPrice?: number;
  stops: number;
  class: string;
  rating: number;
}

interface BusOption {
  id: string;
  operator: string;
  busType: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  rating: number;
  seatsAvailable: number;
  amenities: string[];
}

const TRAINS: TrainOption[] = [
  { id: '1', name: 'Rajdhani Express', number: '12951', from: 'Mumbai', to: 'Delhi', departure: '20:35', arrival: '08:25', duration: '11h 50m', price: 1850, class: 'AC 2 Tier', rating: 4.6, seatsAvailable: 45 },
  { id: '2', name: 'Garib Rath Express', number: '12510', from: 'Mumbai', to: 'Jaipur', departure: '22:15', arrival: '10:30', duration: '12h 15m', price: 950, class: 'Sleeper', rating: 4.2, seatsAvailable: 120 },
  { id: '3', name: 'Duronto Express', number: '12239', from: 'Mumbai', to: 'Bangalore', departure: '23:00', arrival: '07:45', duration: '8h 45m', price: 2150, class: 'AC 3 Tier', rating: 4.5, seatsAvailable: 30 },
  { id: '4', name: 'Shatabdi Express', number: '12010', from: 'Delhi', to: 'Jaipur', departure: '06:05', arrival: '10:35', duration: '4h 30m', price: 850, class: 'Executive', rating: 4.7, seatsAvailable: 60 },
];

const FLIGHTS: FlightOption[] = [
  { id: '1', airline: 'IndiGo', flightNumber: '6E-2341', from: 'Mumbai', to: 'Delhi', departure: '06:30', arrival: '08:45', duration: '2h 15m', price: 4850, originalPrice: 6500, stops: 0, class: 'Economy', rating: 4.3 },
  { id: '2', airline: 'Air India', flightNumber: 'AI-101', from: 'Mumbai', to: 'Bangalore', departure: '09:15', arrival: '11:30', duration: '2h 15m', price: 5200, originalPrice: 7200, stops: 0, class: 'Economy', rating: 4.5 },
  { id: '3', airline: 'SpiceJet', flightNumber: 'SG-890', from: 'Delhi', to: 'Goa', departure: '14:00', arrival: '16:30', duration: '2h 30m', price: 4500, originalPrice: 5800, stops: 1, class: 'Economy', rating: 4.1 },
  { id: '4', airline: 'Vistara', flightNumber: 'UK-778', from: 'Bangalore', to: 'Mumbai', departure: '18:45', arrival: '20:55', duration: '2h 10m', price: 6500, originalPrice: 8500, stops: 0, class: 'Premium Economy', rating: 4.7 },
  { id: '5', airline: 'Air India Express', flightNumber: 'IX-342', from: 'Jaipur', to: 'Mumbai', departure: '11:20', arrival: '13:40', duration: '2h 20m', price: 3800, originalPrice: 5200, stops: 0, class: 'Economy', rating: 4.2 },
];

const BUSES: BusOption[] = [
  { id: '1', operator: 'RedBus Premium', busType: 'AC Sleeper', from: 'Mumbai', to: 'Goa', departure: '20:30', arrival: '06:30', duration: '10h', price: 1200, rating: 4.5, seatsAvailable: 24, amenities: ['wifi', 'charging', 'ac'] },
  { id: '2', operator: 'VRL Travels', busType: 'Volvo AC', from: 'Bangalore', to: 'Chennai', departure: '22:00', arrival: '06:00', duration: '8h', price: 950, rating: 4.3, seatsAvailable: 36, amenities: ['wifi', 'ac', 'video'] },
  { id: '3', operator: 'SRS Travels', busType: 'AC Seater', from: 'Delhi', to: 'Jaipur', departure: '07:00', arrival: '13:00', duration: '6h', price: 550, rating: 4.1, seatsAvailable: 42, amenities: ['ac', 'charging'] },
  { id: '4', operator: 'Shivneri Bus', busType: 'Luxury Coach', from: 'Pune', to: 'Mumbai', departure: '06:00', arrival: '09:00', duration: '3h', price: 450, rating: 4.6, seatsAvailable: 18, amenities: ['wifi', 'ac', 'entertainment'] },
  { id: '5', operator: 'IntrCity SmartBus', busType: 'AC Sleeper', from: 'Jaipur', to: 'Udaipur', departure: '19:00', arrival: '03:30', duration: '8h 30m', price: 850, rating: 4.4, seatsAvailable: 28, amenities: ['wifi', 'charging', 'food'] },
];

const CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Goa', 'Jaipur', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Kochi', 'Varanasi'];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export default function TravelPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<'trains' | 'flights' | 'buses'>('trains');
  const [fromCity, setFromCity] = useState('');
  const [toCity, setToCity] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');

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

  const handleSearch = () => {
    if (!fromCity || !toCity || !travelDate) {
      alert('Please fill in all required fields');
      return;
    }
    console.log('Searching:', { fromCity, toCity, travelDate, returnDate });
  };

  const renderTrains = () => (
    <div className="space-y-4">
      {TRAINS.map(train => (
        <div key={train.id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_8px_30px_rgba(26,26,46,0.1)] transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] flex items-center justify-center">
                <Train className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E]">{train.name}</h3>
                <p className="text-[#4A4A6A] text-sm">Train #{train.number} • {train.class}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{train.departure}</p>
                <p className="text-[#4A4A6A] text-sm">{train.from}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-[#4A4A6A] mb-1">{train.duration}</p>
                <div className="w-24 h-0.5 bg-[#E0E0E0] relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#8B5CF6]" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{train.arrival}</p>
                <p className="text-[#4A4A6A] text-sm">{train.to}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                  <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                  <span className="font-semibold text-sm">{train.rating}</span>
                </div>
                <p className="text-sm text-[#4A4A6A] mt-1">{train.seatsAvailable} seats</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF5722]">{formatCurrency(train.price)}</p>
                <p className="text-xs text-[#4A4A6A]">per person</p>
              </div>
              <Button>Book Now</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFlights = () => (
    <div className="space-y-4">
      {FLIGHTS.map(flight => (
        <div key={flight.id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_8px_30px_rgba(26,26,46,0.1)] transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E]">{flight.airline}</h3>
                <p className="text-[#4A4A6A] text-sm">{flight.flightNumber} • {flight.class}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{flight.departure}</p>
                <p className="text-[#4A4A6A] text-sm">{flight.from}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-[#4A4A6A] mb-1">{flight.duration}</p>
                <div className="w-24 flex items-center">
                  <div className="flex-1 h-0.5 bg-[#E0E0E0]" />
                  {flight.stops > 0 && (
                    <div className="px-2 py-1 bg-[#FFF8E1] text-xs text-[#FF9800] rounded">
                      {flight.stops} stop
                    </div>
                  )}
                  <div className="flex-1 h-0.5 bg-[#E0E0E0]" />
                </div>
                <p className="text-xs text-[#4A4A6A] mt-1">{flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{flight.arrival}</p>
                <p className="text-[#4A4A6A] text-sm">{flight.to}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="font-semibold text-sm">{flight.rating}</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF5722]">{formatCurrency(flight.price)}</p>
                {flight.originalPrice && (
                  <p className="text-sm text-[#4A4A6A] line-through">{formatCurrency(flight.originalPrice)}</p>
                )}
              </div>
              <Button>Book Now</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderBuses = () => (
    <div className="space-y-4">
      {BUSES.map(bus => (
        <div key={bus.id} className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(26,26,46,0.06)] hover:shadow-[0_8px_30px_rgba(26,26,46,0.1)] transition-all">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4CAF50] to-[#8BC34A] flex items-center justify-center">
                <Bus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-[#1A1A2E]">{bus.operator}</h3>
                <p className="text-[#4A4A6A] text-sm">{bus.busType}</p>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{bus.departure}</p>
                <p className="text-[#4A4A6A] text-sm">{bus.from}</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-[#4A4A6A] mb-1">{bus.duration}</p>
                <div className="w-24 h-0.5 bg-[#E0E0E0] relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4CAF50]" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#4CAF50]" />
                </div>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-[#1A1A2E]">{bus.arrival}</p>
                <p className="text-[#4A4A6A] text-sm">{bus.to}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-[#FFF8E1] px-2 py-1 rounded-full">
                <Star className="h-4 w-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="font-semibold text-sm">{bus.rating}</span>
              </div>
              <div className="flex gap-1">
                {bus.amenities.includes('wifi') && <Wifi className="h-4 w-4 text-[#4A4A6A]" />}
                {bus.amenities.includes('ac') && <span className="text-xs">AC</span>}
                {bus.amenities.includes('charging') && <span className="text-xs">⚡</span>}
              </div>
              <div>
                <p className="text-2xl font-bold text-[#FF5722]">{formatCurrency(bus.price)}</p>
                <p className="text-xs text-[#4A4A6A]">{bus.seatsAvailable} seats left</p>
              </div>
              <Button>Book Now</Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Header />

      <main className="flex-1 pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#2D2D44]">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#4CAF50]/20 rounded-full blur-[200px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FF5722]/20 rounded-full blur-[150px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <Badge variant="success" size="sm" className="mb-4">TRAVEL BOOKING</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{ fontFamily: 'Sora, sans-serif' }}>
                Book Your Journey
              </h1>
              <p className="text-white/70 text-lg max-w-2xl mx-auto">
                Compare prices across trains, flights, and buses. Find the best deals for your trip.
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-2xl p-4 shadow-2xl max-w-5xl mx-auto">
              {/* Travel Type Tabs */}
              <div className="flex gap-2 mb-4 border-b pb-3">
                {[
                  { id: 'trains', icon: Train, label: 'Trains' },
                  { id: 'flights', icon: Plane, label: 'Flights' },
                  { id: 'buses', icon: Bus, label: 'Buses' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#FF5722] text-white'
                        : 'bg-[#FAFAFA] text-[#4A4A6A] hover:bg-[#F0F0F5]'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="relative">
                  <label className="block text-xs text-[#4A4A6A] mb-1 ml-1">From</label>
                  <div className="flex items-center px-4 py-3 bg-[#FAFAFA] rounded-xl">
                    <MapPin className="h-5 w-5 text-[#FF5722] shrink-0" />
                    <select
                      value={fromCity}
                      onChange={(e) => setFromCity(e.target.value)}
                      className="w-full px-3 bg-transparent outline-none"
                    >
                      <option value="">Select city</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs text-[#4A4A6A] mb-1 ml-1">To</label>
                  <div className="flex items-center px-4 py-3 bg-[#FAFAFA] rounded-xl">
                    <MapPin className="h-5 w-5 text-[#8B5CF6] shrink-0" />
                    <select
                      value={toCity}
                      onChange={(e) => setToCity(e.target.value)}
                      className="w-full px-3 bg-transparent outline-none"
                    >
                      <option value="">Select city</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs text-[#4A4A6A] mb-1 ml-1">Travel Date</label>
                  <div className="flex items-center px-4 py-3 bg-[#FAFAFA] rounded-xl">
                    <Calendar className="h-5 w-5 text-[#4CAF50] shrink-0" />
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      className="w-full px-3 bg-transparent outline-none"
                    />
                  </div>
                </div>
                <div className="relative">
                  <label className="block text-xs text-[#4A4A6A] mb-1 ml-1">Return (Optional)</label>
                  <div className="flex items-center px-4 py-3 bg-[#FAFAFA] rounded-xl">
                    <Calendar className="h-5 w-5 text-[#4A4A6A] shrink-0" />
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full px-3 bg-transparent outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-center">
                <Button size="lg" onClick={handleSearch} className="px-12">
                  <Search className="h-5 w-5 mr-2" />
                  Search {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E]" style={{ fontFamily: 'Sora, sans-serif' }}>
                  {activeTab === 'trains' && `${TRAINS.length} Trains Available`}
                  {activeTab === 'flights' && `${FLIGHTS.length} Flights Available`}
                  {activeTab === 'buses' && `${BUSES.length} Buses Available`}
                </h2>
                <p className="text-[#4A4A6A] mt-1">
                  {fromCity && toCity ? `${fromCity} → ${toCity}` : 'Select your route to see options'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select className="px-4 py-2 bg-white rounded-lg border border-[#E0E0E0] outline-none cursor-pointer">
                  <option value="price">Sort by Price</option>
                  <option value="time">Sort by Time</option>
                  <option value="rating">Sort by Rating</option>
                </select>
              </div>
            </div>

            {/* Results */}
            {activeTab === 'trains' && renderTrains()}
            {activeTab === 'flights' && renderFlights()}
            {activeTab === 'buses' && renderBuses()}

            {/* Load More */}
            <div className="text-center mt-12">
              <Button variant="secondary" size="lg">
                Load More Options
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
                The HelpHive Travel Promise
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Shield, title: 'Secure Booking', desc: '100% safe & secure payments' },
                { icon: Clock, title: 'Instant Confirmation', desc: 'Get tickets instantly' },
                { icon: Star, title: 'Best Prices', desc: 'Guaranteed best rates' },
                { icon: Users, title: '24/7 Support', desc: 'Help whenever you need' },
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