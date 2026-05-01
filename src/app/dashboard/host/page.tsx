'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Badge, Avatar, EmptyState, Skeleton } from '@/components/ui';
import { VehicleService } from '@/services/vehicle.service';
import { BookingService } from '@/services/booking.service';
import { Vehicle, Booking } from '@/types';
import { useRouter } from 'next/navigation';
import {
  PlusCircle,
  Car,
  Calendar,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { formatCurrency, formatDate, getBookingStatusColor } from '@/lib/utils';

export default function HostDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVehicles: 0,
    activeBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    thisMonthEarnings: 0,
  });

  useEffect(() => {
    if (!authLoading && userProfile?.role !== 'host' && userProfile?.role !== 'admin') {
      router.push('/dashboard/user');
      return;
    }
    if (user) {
      loadHostData();
    }
  }, [user, userProfile, authLoading]);

  const loadHostData = async () => {
    setIsLoading(true);
    try {
      const [vehicleList, bookingList] = await Promise.all([
        VehicleService.getVehiclesByHost(user!.uid),
        BookingService.getHostBookings(user!.uid),
      ]);

      setVehicles(vehicleList);
      setBookings(bookingList);

      const pendingCount = bookingList.filter((b) => b.status === 'pending').length;
      const activeCount = bookingList.filter((b) => ['confirmed', 'in_progress'].includes(b.status)).length;
      const totalEarnings = bookingList
        .filter((b) => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats({
        totalVehicles: vehicleList.length,
        activeBookings: activeCount,
        pendingBookings: pendingCount,
        totalEarnings,
        thisMonthEarnings: Math.round(totalEarnings * 0.3), // Mock data
      });
    } catch (error) {
      console.error('Error loading host data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmBooking = async (bookingId: string) => {
    try {
      await BookingService.confirmBooking(bookingId);
      loadHostData();
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    try {
      await BookingService.cancelBooking(bookingId);
      loadHostData();
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-48 mb-8" />
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-background)]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text)]">
                Host Dashboard
              </h1>
              <p className="text-[var(--color-text-muted)] mt-1">
                Manage your vehicles and bookings
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-3">
              <Link href="/host/vehicles/new">
                <Button variant="primary" leftIcon={<PlusCircle className="h-4 w-4" />}>
                  Add Vehicle
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {[
              { label: 'Total Vehicles', value: stats.totalVehicles, icon: Car, color: 'text-[var(--color-primary)]' },
              { label: 'Active Bookings', value: stats.activeBookings, icon: Calendar, color: 'text-blue-500' },
              { label: 'Pending', value: stats.pendingBookings, icon: Clock, color: 'text-[var(--color-warning)]' },
              { label: 'Total Earnings', value: formatCurrency(stats.totalEarnings), icon: DollarSign, color: 'text-green-500' },
              { label: 'This Month', value: formatCurrency(stats.thisMonthEarnings), icon: TrendingUp, color: 'text-[var(--color-secondary)]' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* My Vehicles */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text)]">My Vehicles</h3>
                <Link href="/host/vehicles">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : vehicles.length === 0 ? (
                <EmptyState
                  type="no-vehicles"
                  title="No vehicles yet"
                  description="Add your first vehicle to start earning"
                  actionLabel="Add Vehicle"
                  onAction={() => router.push('/host/vehicles/new')}
                />
              ) : (
                <div className="space-y-4">
                  {vehicles.slice(0, 3).map((vehicle) => (
                    <Link
                      key={vehicle.id}
                      href={`/vehicles/${vehicle.id}`}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {vehicle.type === 'tuk-tuk' ? '🛺' : vehicle.type === 'scooter' ? '🛵' : '🏍️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          {vehicle.city} • {formatCurrency(vehicle.hourlyRate || 0)}/hr
                        </div>
                      </div>
                      <Badge
                        variant={
                          vehicle.status === 'approved' ? 'success' :
                          vehicle.status === 'pending' ? 'warning' : 'error'
                        }
                      >
                        {vehicle.status}
                      </Badge>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            {/* Recent Bookings */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text)]">Recent Bookings</h3>
                <Link href="/dashboard/host/bookings">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : bookings.length === 0 ? (
                <EmptyState
                  type="no-bookings"
                  title="No bookings yet"
                  description="Your bookings will appear here"
                />
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 3).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                        {booking.type === 'vehicle' ? '🛺' : '🗺️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">Booking #{booking.id.slice(0, 8)}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">
                          {formatDate(booking.startDate.toDate())} • {formatCurrency(booking.totalAmount)}
                        </div>
                      </div>
                      <Badge className={getBookingStatusColor(booking.status)}>
                        {booking.status.replace('_', ' ')}
                      </Badge>
                      {booking.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Pending Approval Requests */}
          {userProfile?.hostProfile?.isApproved === false && (
            <Card className="mt-6 border-2 border-[var(--color-warning)]">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6 text-[var(--color-warning)]" />
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">Pending Approval</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    Your host account is awaiting admin approval. You'll be able to list vehicles once approved.
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
