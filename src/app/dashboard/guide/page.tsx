'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Star, Users, Clock, TrendingUp, Plus, MapPin, Globe, Award } from 'lucide-react';
import { Button, Card, Badge } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

interface Tour {
  id: string;
  title: string;
  image: string;
  bookings: number;
  rating: number;
  price: number;
  status: 'active' | 'inactive';
}

interface Booking {
  id: string;
  experienceTitle: string;
  userName: string;
  date: Date;
  participants: number;
  amount: number;
  status: string;
}

export default function GuideDashboardPage() {
  const { userProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!userProfile || (userProfile.role !== 'guide' && userProfile.role !== 'admin'))) {
      router.push('/auth/login');
    } else if (!authLoading) {
      setIsLoading(false);
    }
  }, [userProfile, authLoading, router]);

  const stats = {
    totalBookings: 24,
    totalEarnings: 45600,
    averageRating: 4.8,
    upcomingTours: 3,
  };

  const myTours: Tour[] = [
    {
      id: '1',
      title: 'Old City Food Tour',
      image: '/images/tour-1.jpg',
      bookings: 45,
      rating: 4.9,
      price: 1500,
      status: 'active',
    },
    {
      id: '2',
      title: 'Heritage Walking Tour',
      image: '/images/tour-2.jpg',
      bookings: 32,
      rating: 4.7,
      price: 800,
      status: 'active',
    },
    {
      id: '3',
      title: 'Sunset Beach Experience',
      image: '/images/tour-3.jpg',
      bookings: 28,
      rating: 4.8,
      price: 1200,
      status: 'active',
    },
  ];

  const recentBookings: Booking[] = [
    {
      id: '1',
      experienceTitle: 'Old City Food Tour',
      userName: 'Priya S.',
      date: new Date('2026-04-25'),
      participants: 2,
      amount: 3000,
      status: 'confirmed',
    },
    {
      id: '2',
      experienceTitle: 'Heritage Walking Tour',
      userName: 'Rahul M.',
      date: new Date('2026-04-26'),
      participants: 4,
      amount: 3200,
      status: 'pending',
    },
  ];

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Guide Dashboard</h1>
            <p className="text-[var(--color-text-muted)] mt-1">Manage your experiences and bookings</p>
          </div>
          <Link href="/guide/onboarding">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Experience
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Total Bookings</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.totalBookings}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-[var(--color-primary)]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Total Earnings</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{formatCurrency(stats.totalEarnings)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[var(--color-success)]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Average Rating</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.averageRating}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[var(--color-warning)]/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-[var(--color-warning)]" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">Upcoming Tours</p>
                <p className="text-2xl font-bold text-[var(--color-text)] mt-1">{stats.upcomingTours}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[var(--color-secondary)]/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-[var(--color-secondary)]" />
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">My Experiences</h2>
              <div className="space-y-4">
                {myTours.map((tour) => (
                  <div key={tour.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-16 w-16 rounded-lg bg-gray-200 overflow-hidden flex-shrink-0">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-experience.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--color-text)] truncate">{tour.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-[var(--color-text-muted)]">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {tour.bookings} bookings
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-[var(--color-warning)]" />
                          {tour.rating}
                        </span>
                        <span>{formatCurrency(tour.price)}/person</span>
                      </div>
                    </div>
                    <Badge variant={tour.status === 'active' ? 'success' : 'warning'}>
                      {tour.status === 'active' ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Bookings</h2>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-medium">
                      {booking.userName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-[var(--color-text)]">{booking.experienceTitle}</h3>
                      <p className="text-sm text-[var(--color-text-muted)]">
                        {booking.userName} - {booking.participants} participants - {booking.date.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-[var(--color-text)]">{formatCurrency(booking.amount)}</p>
                      <Badge
                        variant={booking.status === 'confirmed' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Guide Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-16 w-16 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xl font-bold">
                    {userProfile?.displayName?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{userProfile?.displayName || 'Guide'}</p>
                    <p className="text-sm text-[var(--color-text-muted)]">{userProfile?.email}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="h-4 w-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-muted)]">Verified Guide</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Globe className="h-4 w-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-muted)]">English, Hindi</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-[var(--color-text-muted)]" />
                    <span className="text-[var(--color-text-muted)]">Mumbai, India</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link href="/guide/onboarding">
                  <Button variant="secondary" className="w-full justify-start">
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Experience
                  </Button>
                </Link>
                <Button variant="secondary" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Availability
                </Button>
                <Button variant="secondary" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  View Schedule
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
