'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Badge, EmptyState, Skeleton } from '@/components/ui';
import { BookingService } from '@/services/booking.service';
import { Booking, BookingStatus } from '@/types';
import { Calendar, MapPin, Clock, Car, Compass } from 'lucide-react';
import { formatCurrency, formatDate, getBookingStatusColor } from '@/lib/utils';

export default function UserDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const data = await BookingService.getUserBookings(user!.uid);
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const upcomingBookings = bookings.filter(
    (b) => ['pending', 'confirmed', 'in_progress'].includes(b.status)
  );
  const pastBookings = bookings.filter((b) =>
    ['completed', 'cancelled'].includes(b.status)
  );

  const displayBookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
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

      <main className="flex-1 py-8 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Welcome back, {user?.displayName?.split(' ')[0] || 'Traveler'}!
              </h1>
              <p className="text-[var(--color-text-muted)] mt-1">
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
            <Card className="text-center">
              <div className="text-3xl font-bold text-[var(--color-primary)]">
                {bookings.length}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">Total Bookings</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-[var(--color-success)]">
                {upcomingBookings.length}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">Upcoming</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-[var(--color-secondary)]">
                {pastBookings.filter((b) => b.status === 'completed').length}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">Completed</div>
            </Card>
            <Card className="text-center">
              <div className="text-3xl font-bold text-[var(--color-accent)]">
                {formatCurrency(
                  pastBookings
                    .filter((b) => b.paymentStatus === 'paid')
                    .reduce((sum, b) => sum + b.totalAmount, 0)
                )}
              </div>
              <div className="text-sm text-[var(--color-text-muted)]">Total Spent</div>
            </Card>
          </div>

          {/* Bookings */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Your Bookings</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'upcoming'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Upcoming ({upcomingBookings.length})
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === 'past'
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Past ({pastBookings.length})
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : displayBookings.length === 0 ? (
              <EmptyState
                type={activeTab === 'upcoming' ? 'no-bookings' : 'no-data'}
                title={activeTab === 'upcoming' ? 'No upcoming bookings' : 'No past bookings'}
                description={
                  activeTab === 'upcoming'
                    ? 'Start exploring vehicles or experiences to make your first booking!'
                    : 'Your completed bookings will appear here.'
                }
                actionLabel={activeTab === 'upcoming' ? 'Explore Now' : undefined}
                onAction={activeTab === 'upcoming' ? () => (window.location.href = '/explore/vehicles') : undefined}
              />
            ) : (
              <div className="space-y-4">
                {displayBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg border border-gray-100 hover:border-[var(--color-primary)]/30 transition-colors"
                  >
                    <div className="w-full sm:w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl">
                      {booking.type === 'vehicle' ? '🛺' : '🗺️'}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-[var(--color-text)] capitalize">
                            {booking.type} Booking
                          </h3>
                          <p className="text-sm text-[var(--color-text-muted)]">
                            Booking ID: {booking.id.slice(0, 8)}...
                          </p>
                        </div>
                        <Badge
                          variant={
                            booking.status === 'completed'
                              ? 'success'
                              : booking.status === 'confirmed'
                              ? 'info'
                              : booking.status === 'cancelled'
                              ? 'error'
                              : 'warning'
                          }
                        >
                          {booking.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(booking.startDate.toDate())}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(booking.endDate.toDate())}
                        </span>
                        {booking.pickupLocation && (
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {booking.pickupLocation}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="font-semibold text-[var(--color-primary)]">
                          {formatCurrency(booking.totalAmount)}
                        </span>
                        <Link href={`/bookings/${booking.id}`}>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
