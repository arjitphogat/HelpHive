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
  Hotel,
  Navigation,
  Camera,
  Eye,
  X,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface UserWithBookings extends User {
  bookings: BookingDisplay[];
}

interface BookingDisplay {
  id: string;
  type: string;
  title: string;
  date: string;
  total: number;
  status: string;
  location: string;
}

export default function AdminDashboard() {
  const { user, userProfile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [activeBookingsTab, setActiveBookingsTab] = useState<'all' | 'vehicles' | 'hotels' | 'experiences'>('all');
  const [pendingHosts, setPendingHosts] = useState<User[]>([]);
  const [pendingGuides, setPendingGuides] = useState<User[]>([]);
  const [pendingVehicles, setPendingVehicles] = useState<Vehicle[]>([]);
  const [pendingExperiences, setPendingExperiences] = useState<Experience[]>([]);
  const [allUsers, setAllUsers] = useState<UserWithBookings[]>([]);
  const [allBookings, setAllBookings] = useState<BookingDisplay[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithBookings | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
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

      // Load all users from localStorage (demo)
      const storedUsers = JSON.parse(localStorage.getItem('helphive_users') || '[]');
      const storedBookings = JSON.parse(localStorage.getItem('helphive_bookings') || '[]') as BookingDisplay[];

      // Transform bookings to display format
      const transformedBookings: BookingDisplay[] = storedBookings.map((b: any) => ({
        id: b.id,
        type: b.type || 'vehicle',
        title: b.item?.name || b.item?.title || `${b.item?.brand || ''} ${b.item?.model || ''}`.trim() || 'Booking',
        date: b.date,
        total: b.total || b.item?.price || 0,
        status: b.status || 'pending',
        location: b.city || b.location || 'Unknown',
      }));

      setAllBookings(transformedBookings);

      // Combine users with their bookings
      const usersWithBookings: UserWithBookings[] = storedUsers.map((u: User) => ({
        ...u,
        bookings: transformedBookings.filter((b) => b.id.includes(u.id?.slice(0, 8) || 'demo')),
      }));

      setAllUsers(usersWithBookings);

      // Also add demo bookings to the list
      if (transformedBookings.length > 0 && allBookings.length === 0) {
        setAllBookings(transformedBookings);
      }

      // Calculate stats
      const pendingCount = vehicles.vehicles.filter((v) => v.status === 'pending').length +
        experiences.experiences.filter((e) => e.status === 'pending').length;
      setStats({
        totalUsers: storedUsers.length || 1,
        totalVehicles: vehicles.vehicles.length,
        totalExperiences: experiences.experiences.length,
        totalBookings: transformedBookings.length || storedBookings.length || 0,
        totalRevenue: transformedBookings.reduce((sum: number, b: BookingDisplay) => sum + (b.total || 0), 0),
        pendingApprovals: pendingCount,
      });
    } catch (error) {
      console.error('Error loading admin data:', error);
      // Fallback: show demo data
      setStats({
        totalUsers: 1,
        totalVehicles: 0,
        totalExperiences: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingApprovals: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const viewUserDetails = (userData: UserWithBookings) => {
    setSelectedUser(userData);
    setShowUserModal(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="success">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="info">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="error">Cancelled</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      default:
        return <Badge variant="info">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Navigation className="h-4 w-4" />;
      case 'hotel': return <Hotel className="h-4 w-4" />;
      case 'experience': return <Camera className="h-4 w-4" />;
      default: return <Calendar className="h-4 w-4" />;
    }
  };

  const getBookingTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Navigation className="h-5 w-5" />;
      case 'hotel': return <Hotel className="h-5 w-5" />;
      case 'experience': return <Camera className="h-5 w-5" />;
      default: return <Car className="h-5 w-5" />;
    }
  };

  const filteredBookings = activeBookingsTab === 'all'
    ? allBookings
    : allBookings.filter((b) => b.type === activeBookingsTab);

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
                { id: 'bookings', label: 'Bookings', icon: Calendar },
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
                  {tab.id === 'bookings' && stats.totalBookings > 0 && (
                    <Badge variant="info" size="sm">{stats.totalBookings}</Badge>
                  )}
                  {tab.id === 'users' && stats.totalUsers > 0 && (
                    <Badge variant="info" size="sm">{stats.totalUsers}</Badge>
                  )}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text)]">User Management</h3>
                <Badge variant="info">{allUsers.length} Users</Badge>
              </div>
              {allUsers.length === 0 ? (
                <EmptyState type="no-data" title="No registered users" description="Users will appear here once they sign up" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-text-muted)]">User</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-text-muted)]">Email</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-text-muted)]">Role</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-text-muted)]">Bookings</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-[var(--color-text-muted)]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allUsers.map((u) => (
                        <tr key={u.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar fallback={u.displayName || 'User'} size="sm" />
                              <span className="font-medium">{u.displayName || 'Anonymous'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-[var(--color-text-muted)]">{u.email || 'N/A'}</td>
                          <td className="py-3 px-4">
                            <Badge variant={u.role === 'admin' ? 'error' : u.role === 'host' ? 'warning' : 'info'}>
                              {u.role || 'user'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-semibold">{u.bookings?.length || 0}</span>
                          </td>
                          <td className="py-3 px-4">
                            <Button size="sm" variant="ghost" onClick={() => viewUserDetails(u)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {activeTab === 'bookings' && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-[var(--color-text)]">All Bookings</h3>
                <div className="flex gap-2">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'vehicles', label: 'Vehicles' },
                    { id: 'hotels', label: 'Hotels' },
                    { id: 'experiences', label: 'Experiences' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveBookingsTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        activeBookingsTab === tab.id
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-gray-100 text-[var(--color-text-muted)] hover:bg-gray-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
              {filteredBookings.length === 0 ? (
                <EmptyState type="no-data" title="No bookings found" description="Bookings will appear here when users make them" />
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-lg">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white">
                        {getBookingTypeIcon(booking.type)}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold">{booking.title}</div>
                        <div className="text-sm text-[var(--color-text-muted)]">
                          {booking.location} • {formatDate(booking.date)} • ID: {booking.id}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[var(--color-primary)]">{formatCurrency(booking.total)}</div>
                        {getStatusBadge(booking.status)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </main>

      <Footer />

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{selectedUser.displayName || 'User'}</h2>
                <p className="text-sm text-[var(--color-text-muted)]">{selectedUser.email}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowUserModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar fallback={selectedUser.displayName || 'User'} size="lg" />
                  <div>
                    <Badge variant={selectedUser.role === 'admin' ? 'error' : selectedUser.role === 'host' ? 'warning' : 'info'}>
                      {selectedUser.role || 'user'}
                    </Badge>
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Member since {formatDate(new Date().toLocaleDateString())}</p>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-4">Booking History ({selectedUser.bookings?.length || 0})</h3>
              {selectedUser.bookings && selectedUser.bookings.length > 0 ? (
                <div className="space-y-3">
                  {selectedUser.bookings.map((booking) => (
                    <div key={booking.id} className="p-3 border border-gray-100 rounded-lg">
                      <div className="flex items-center gap-3 mb-2">
                        {getTypeIcon(booking.type)}
                        <span className="font-medium">{booking.title}</span>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="text-sm text-[var(--color-text-muted)]">
                        {booking.location} • {formatDate(booking.date)}
                      </div>
                      <div className="text-sm font-semibold text-[var(--color-primary)] mt-1">
                        {formatCurrency(booking.total)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-[var(--color-text-muted)]">No bookings yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
