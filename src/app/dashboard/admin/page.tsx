'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Badge, Avatar, EmptyState, Skeleton } from '@/components/ui';
import { AuthService } from '@/services/auth.service';
import { VehicleService } from '@/services/vehicle.service';
import { ExperienceService } from '@/services/experience.service';
import { BookingService } from '@/services/booking.service';
import { User, Vehicle, Experience, Booking } from '@/types';
import { useRouter } from 'next/navigation';
import {
  Users,
  Car,
  Compass,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function AdminDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [pendingHosts, setPendingHosts] = useState<User[]>([]);
  const [pendingGuides, setPendingGuides] = useState<User[]>([]);
  const [pendingVehicles, setPendingVehicles] = useState<Vehicle[]>([]);
  const [pendingExperiences, setPendingExperiences] = useState<Experience[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVehicles: 0,
    totalExperiences: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingApprovals: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && userProfile?.role !== 'admin') {
      router.push('/dashboard/user');
      return;
    }
    if (user) {
      loadAdminData();
    }
  }, [user, userProfile, authLoading]);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      // Load pending approvals
      const [vehicles, experiences] = await Promise.all([
        VehicleService.getVehicles({}),
        ExperienceService.getExperiences({}),
      ]);

      setPendingVehicles(vehicles.vehicles.filter((v) => v.status === 'pending'));
      setPendingExperiences(experiences.experiences.filter((e) => e.status === 'pending'));

      // Calculate stats
      const pendingCount = vehicles.vehicles.filter((v) => v.status === 'pending').length +
        experiences.experiences.filter((e) => e.status === 'pending').length;
      setStats({
        totalUsers: 0, // Would fetch from admin API
        totalVehicles: vehicles.vehicles.length,
        totalExperiences: experiences.experiences.length,
        totalBookings: 0,
        totalRevenue: 0,
        pendingApprovals: pendingCount,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveVehicle = async (vehicleId: string) => {
    try {
      await VehicleService.approveVehicle(vehicleId);
      setPendingVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (error) {
      console.error('Error approving vehicle:', error);
    }
  };

  const handleRejectVehicle = async (vehicleId: string) => {
    try {
      await VehicleService.rejectVehicle(vehicleId);
      setPendingVehicles((prev) => prev.filter((v) => v.id !== vehicleId));
    } catch (error) {
      console.error('Error rejecting vehicle:', error);
    }
  };

  const handleApproveExperience = async (experienceId: string) => {
    try {
      await ExperienceService.approveExperience(experienceId);
      setPendingExperiences((prev) => prev.filter((e) => e.id !== experienceId));
    } catch (error) {
      console.error('Error approving experience:', error);
    }
  };

  const handleRejectExperience = async (experienceId: string) => {
    try {
      await ExperienceService.rejectExperience(experienceId);
      setPendingExperiences((prev) => prev.filter((e) => e.id !== experienceId));
    } catch (error) {
      console.error('Error rejecting experience:', error);
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
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[var(--color-text)]">Admin Dashboard</h1>
            <p className="text-[var(--color-text-muted)] mt-1">
              Manage listings, users, and platform analytics
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-500' },
              { label: 'Vehicles', value: stats.totalVehicles, icon: Car, color: 'text-[var(--color-primary)]' },
              { label: 'Experiences', value: stats.totalExperiences, icon: Compass, color: 'text-[var(--color-secondary)]' },
              { label: 'Bookings', value: stats.totalBookings, icon: Calendar, color: 'text-purple-500' },
              { label: 'Revenue', value: formatCurrency(stats.totalRevenue), icon: DollarSign, color: 'text-green-500' },
              { label: 'Pending', value: stats.pendingApprovals, icon: Clock, color: 'text-[var(--color-warning)]' },
            ].map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="text-2xl font-bold text-[var(--color-text)]">{stat.value}</div>
                <div className="text-xs text-[var(--color-text-muted)]">{stat.label}</div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-6">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'vehicles', label: 'Vehicles', icon: Car },
                { id: 'experiences', label: 'Experiences', icon: Compass },
                { id: 'users', label: 'Users', icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 pb-3 px-1 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                      : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Pending Approvals */}
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[var(--color-text)]">Pending Approvals</h3>
                  <Badge variant="warning">{pendingVehicles.length + pendingExperiences.length}</Badge>
                </div>
                <div className="space-y-4">
                  {pendingVehicles.slice(0, 3).map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                        🛺
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Vehicle • {vehicle.city}</div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleApproveVehicle(vehicle.id)}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                  ))}
                  {pendingExperiences.slice(0, 3).map((experience) => (
                    <div key={experience.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
                        🗺️
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{experience.title}</div>
                        <div className="text-xs text-[var(--color-text-muted)]">Experience</div>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleApproveExperience(experience.id)}>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </div>
                  ))}
                  {pendingVehicles.length + pendingExperiences.length === 0 && (
                    <div className="text-center py-8 text-[var(--color-text-muted)]">
                      No pending approvals
                    </div>
                  )}
                </div>
              </Card>

              {/* Quick Stats */}
              <Card>
                <h3 className="font-semibold text-[var(--color-text)] mb-4">Platform Growth</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-[var(--color-text-muted)]">New Users This Week</span>
                    <span className="font-semibold text-[var(--color-success)]">+24%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-[var(--color-text-muted)]">New Listings This Week</span>
                    <span className="font-semibold text-[var(--color-success)]">+18%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-[var(--color-text-muted)]">Booking Conversion</span>
                    <span className="font-semibold text-[var(--color-primary)]">68%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-[var(--color-text-muted)]">Avg. Rating</span>
                    <span className="font-semibold text-[var(--color-warning)]">4.8★</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {activeTab === 'vehicles' && (
            <Card>
              <h3 className="font-semibold text-[var(--color-text)] mb-4">Pending Vehicle Approvals</h3>
              {pendingVehicles.length === 0 ? (
                <EmptyState type="no-data" title="No pending vehicles" />
              ) : (
                <div className="space-y-4">
                  {pendingVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        {vehicle.type === 'tuk-tuk' ? '🛺' : vehicle.type === 'scooter' ? '🛵' : '🏍️'}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{vehicle.brand} {vehicle.model}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          {vehicle.city} • Host: {vehicle.hostId?.slice(0, 8) || "HelpHive"}...
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          Added: {formatDate(vehicle.createdAt?.toDate() || new Date())}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleApproveVehicle(vehicle.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleRejectVehicle(vehicle.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'experiences' && (
            <Card>
              <h3 className="font-semibold text-[var(--color-text)] mb-4">Pending Experience Approvals</h3>
              {pendingExperiences.length === 0 ? (
                <EmptyState type="no-data" title="No pending experiences" />
              ) : (
                <div className="space-y-4">
                  {pendingExperiences.map((experience) => (
                    <div key={experience.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center text-2xl">
                        🗺️
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{experience.title}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          {experience.category} • Guide: {experience.hostId?.slice(0, 8) || "HelpHive"}...
                        </div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          Added: {formatDate(new Date().toLocaleDateString())}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="success" onClick={() => handleApproveExperience(experience.id)}>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => handleRejectExperience(experience.id)}>
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}

          {activeTab === 'users' && (
            <Card>
              <h3 className="font-semibold text-[var(--color-text)] mb-4">User Management</h3>
              <div className="text-center py-12 text-[var(--color-text-muted)]">
                User management features coming soon...
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
