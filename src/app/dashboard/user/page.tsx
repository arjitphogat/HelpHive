'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Badge } from '@/components/ui';
import { BookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { Calendar, MapPin, Clock, Car, Compass, Hotel, Navigation, Camera, CheckCircle, XCircle, AlertCircle, Users } from 'lucide-react';
import { formatCurrency, formatDate, getBookingStatusColor } from '@/lib/utils';

interface BookingItem {
  id: string;
  type: string;
  item: any;
  city: string;
  date: string;
  guests: number;
  hours: number;
  total: number;
  status: string;
  createdAt: string;
}

export default function UserDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'all'>('upcoming');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      // Load from localStorage (demo) and API
      const localBookings = JSON.parse(localStorage.getItem('helphive_bookings') || '[]');

      // If user is logged in, also try to fetch from API
      if (user) {
        try {
          const apiBookings = await BookingService.getUserBookings(user.uid);
          // Merge local and API bookings (local first as they're newer)
          setBookings([...localBookings, ...apiBookings]);
        } catch {
          // If API fails, just use local bookings
          setBookings(localBookings);
        }
      } else {
        setBookings(localBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingBookings = bookings.filter((b) => {
    const bookingDate = new Date(b.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return b.status === 'confirmed' || b.status === 'pending';
  });

  const pastBookings = bookings.filter((b) =>
    b.status === 'completed' || b.status === 'cancelled'
  );

  const displayBookings = activeTab === 'upcoming'
    ? upcomingBookings
    : activeTab === 'past'
    ? pastBookings
    : bookings;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle':
        return <Navigation className="h-5 w-5" />;
      case 'hotel':
        return <Hotel className="h-5 w-5" />;
      case 'experience':
        return <Camera className="h-5 w-5" />;
      default:
        return <Car className="h-5 w-5" />;
    }
  };

  const getItemName = (booking: BookingItem) => {
    if (!booking.item) return 'Unknown';
    return booking.item.name || booking.item.title || `${booking.item.brand} ${booking.item.model}` || 'Item';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-8 w-48 mb-8 bg-gray-200 animate-pulse rounded" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {user?.displayName?.split(' ')[0] || 'Traveler'}!
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your bookings and explore new adventures
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link href="/explore/vehicles">
                <Button variant="primary" leftIcon={<Car className="h-4 w-4" />}>
                  Rent a Vehicle
                </Button>
              </Link>
              <Link href="/explore/experiences">
                <Button variant="secondary" leftIcon={<Compass className="h-4 w-4" />}>
                  Book Experience
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-[#FF5722]">{bookings.length}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-green-500">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-blue-500">
                {pastBookings.filter((b) => b.status === 'completed').length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </Card>
            <Card className="text-center p-6">
              <div className="text-3xl font-bold text-purple-500">
                {formatCurrency(bookings.reduce((sum, b) => sum + (b.total || 0), 0))}
              </div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </Card>
          </div>

          {/* Bookings Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Your Bookings</h2>
              <div className="flex gap-2">
                {[
                  { id: 'upcoming', label: 'Upcoming' },
                  { id: 'past', label: 'Past' },
                  { id: 'all', label: 'All' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-[#FF5722] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 w-full bg-gray-200 animate-pulse rounded-xl" />
                ))}
              </div>
            ) : displayBookings.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'upcoming'
                    ? 'Start exploring vehicles or experiences to make your first booking!'
                    : 'Your completed bookings will appear here.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/explore/vehicles">
                    <Button variant="primary">
                      <Navigation className="h-4 w-4 mr-2" />
                      Rent a Vehicle
                    </Button>
                  </Link>
                  <Link href="/hotels">
                    <Button variant="secondary">
                      <Hotel className="h-4 w-4 mr-2" />
                      Book a Hotel
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {displayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border border-gray-200 hover:border-[#FF5722]/30 transition-colors bg-white"
                  >
                    {/* Item Image/Icon */}
                    <div className="w-full sm:w-24 h-24 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white flex-shrink-0">
                      {getTypeIcon(booking.type)}
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 capitalize">
                              {booking.type} Booking
                            </h3>
                            <Badge
                              variant={
                                booking.status === 'confirmed' ? 'success' :
                                booking.status === 'completed' ? 'info' :
                                booking.status === 'cancelled' ? 'error' :
                                'warning'
                              }
                              size="sm"
                            >
                              {booking.status}
                            </Badge>
                          </div>
                          <p className="font-bold text-lg text-gray-900 mt-1">{getItemName(booking)}</p>
                          <p className="text-sm text-gray-500">
                            Booking ID: {booking.id}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-bold text-[#FF5722]">
                            {formatCurrency(booking.total || booking.item?.price || 0)}
                          </span>
                          <span className="text-sm text-gray-500 block">
                            {booking.type === 'vehicle' ? '/day' : booking.type === 'hotel' ? '/night' : '/person'}
                          </span>
                        </div>
                      </div>

                      {/* Booking Info */}
                      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {booking.date ? new Date(booking.date).toLocaleDateString() : 'Date TBD'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {booking.city?.charAt(0).toUpperCase() + booking.city?.slice(1) || 'City TBD'}
                        </span>
                        {booking.type === 'vehicle' && booking.hours && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {booking.hours} hours
                          </span>
                        )}
                        {(booking.type === 'hotel' || booking.type === 'experience') && booking.guests && (
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center gap-2 sm:items-end justify-between sm:justify-center">
                      {booking.status === 'confirmed' && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
                      {booking.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          Leave Review
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-100 flex items-center justify-center">
                <Car className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Rent Vehicles</h3>
              <p className="text-sm text-gray-500 mb-4">Explore tuk-tuks, bikes, and more</p>
              <Link href="/explore/vehicles">
                <Button variant="outline" size="sm" className="w-full">Browse Vehicles</Button>
              </Link>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-green-100 flex items-center justify-center">
                <Hotel className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Book Hotels</h3>
              <p className="text-sm text-gray-500 mb-4">Find perfect stays in any city</p>
              <Link href="/hotels">
                <Button variant="outline" size="sm" className="w-full">Browse Hotels</Button>
              </Link>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Camera className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Book Experiences</h3>
              <p className="text-sm text-gray-500 mb-4">Discover local tours and adventures</p>
              <Link href="/explore/experiences">
                <Button variant="outline" size="sm" className="w-full">Browse Experiences</Button>
              </Link>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}