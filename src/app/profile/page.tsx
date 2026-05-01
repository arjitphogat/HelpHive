'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Badge, Avatar } from '@/components/ui';
import { BookingService } from '@/services/booking.service';
import { AuthService } from '@/services/auth.service';
import { User, Booking } from '@/types';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Settings,
  CreditCard,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Navigation,
  Hotel,
  Camera,
  ChevronRight,
  Edit,
  Shield,
  Award,
  Globe,
  MessageSquare,
  LogOut,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';

interface BookingDisplay {
  id: string;
  type: string;
  title: string;
  image: string;
  date: string;
  total: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  location: string;
  provider: string;
}

export default function UserProfilePage() {
  const { user, userProfile, isLoading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<BookingDisplay[]>([]);
  const [localBookings, setLocalBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) {
      loadUserData();
    }
  }, [user, authLoading]);

  const loadUserData = async () => {
    setIsLoadingBookings(true);
    try {
      // Load Firebase bookings
      let firebaseBookings: Booking[] = [];
      try {
        firebaseBookings = await BookingService.getUserBookings(user!.uid);
      } catch (error) {
        console.log('Firebase bookings unavailable, using local storage');
      }

      // Load local storage bookings
      const storedBookings = JSON.parse(localStorage.getItem('helphive_bookings') || '[]');

      // Combine and format bookings
      const allBookings = [
        ...storedBookings.map((b: any) => ({
          id: b.id,
          type: b.type || 'unknown',
          title: b.item?.name || b.item?.title || b.item?.brand + ' ' + b.item?.model || 'Booking',
          image: b.item?.image || '',
          date: b.date || new Date(b.createdAt).toLocaleDateString(),
          total: b.total || b.item?.price || 0,
          status: b.status === 'confirmed' ? 'confirmed' : b.status === 'completed' ? 'completed' : b.status === 'cancelled' ? 'cancelled' : 'pending',
          location: b.city || 'Unknown',
          provider: b.item?.hostName || 'HelpHive',
        })),
        ...firebaseBookings.map((b: any) => ({
          id: b.id,
          type: b.type || 'vehicle',
          title: b.vehicleId ? 'Vehicle Booking' : b.experienceId ? 'Experience Booking' : 'Booking',
          image: '',
          date: b.startDate?.toDate?.().toLocaleDateString() || 'N/A',
          total: b.totalAmount || 0,
          status: b.status || 'pending',
          location: b.pickupLocation || 'N/A',
          provider: 'HelpHive',
        })),
      ];

      setLocalBookings(allBookings);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { color: string; icon: any; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, label: 'Pending' },
      confirmed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, label: 'Confirmed' },
      completed: { color: 'bg-blue-100 text-blue-700', icon: CheckCircle, label: 'Completed' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, label: 'Cancelled' },
    };
    const { color, icon: Icon, label } = config[status] || config.pending;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        <Icon className="h-3 w-3" />
        {label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Navigation className="h-5 w-5" />;
      case 'hotel': return <Hotel className="h-5 w-5" />;
      case 'experience': return <Camera className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const upcomingBookings = localBookings.filter(b => b.status === 'pending' || b.status === 'confirmed');
  const pastBookings = localBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  if (authLoading) {
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-20 lg:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {user.photoURL ? (
                  <Image
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    width={120}
                    height={120}
                    className="w-28 h-28 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white text-4xl font-bold">
                    {user.displayName?.[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#FF5722] rounded-full flex items-center justify-center text-white shadow-lg">
                  <Edit className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-900">{user.displayName || 'User'}</h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Joined {user.metadata?.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'Recently'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {localBookings.length} Bookings
                  </span>
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full">
                    <Shield className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-[#FF5722]">{localBookings.length}</div>
              <div className="text-sm text-gray-500">Total Bookings</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{upcomingBookings.length}</div>
              <div className="text-sm text-gray-500">Upcoming</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-500">{pastBookings.filter(b => b.status === 'completed').length}</div>
              <div className="text-sm text-gray-500">Completed</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-500">
                {formatCurrency(localBookings.reduce((sum, b) => sum + b.total, 0))}
              </div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'bookings', icon: Calendar, label: 'My Bookings' },
              { id: 'saved', icon: Heart, label: 'Saved Items' },
              { id: 'settings', icon: Settings, label: 'Settings' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FF5722] text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === 'bookings' && (
            <div>
              {/* Upcoming Section */}
              {upcomingBookings.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Upcoming Bookings</h2>
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id} className="p-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-32 h-24 rounded-lg bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white">
                            {getTypeIcon(booking.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{booking.title}</h3>
                                <p className="text-sm text-gray-500">{booking.location}</p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {booking.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {booking.location}
                              </span>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t">
                              <span className="font-bold text-lg">{formatCurrency(booking.total)}</span>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Past Bookings */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Past Bookings</h2>
                {pastBookings.length === 0 ? (
                  <Card className="p-8 text-center">
                    <Calendar className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="font-semibold text-gray-900 mb-2">No past bookings</h3>
                    <p className="text-gray-500 mb-4">Your completed and cancelled bookings will appear here</p>
                    <Link href="/explore/vehicles">
                      <Button>Explore Vehicles</Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <Card key={booking.id} className="p-4 opacity-75">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="w-full sm:w-32 h-24 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                            {getTypeIcon(booking.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-semibold text-lg">{booking.title}</h3>
                                <p className="text-sm text-gray-500">{booking.date}</p>
                              </div>
                              {getStatusBadge(booking.status)}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                              <span className="font-bold">{formatCurrency(booking.total)}</span>
                              {booking.status === 'completed' && (
                                <Button variant="outline" size="sm">
                                  Leave Review
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <Card className="p-8 text-center">
              <Heart className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No saved items</h3>
              <p className="text-gray-500 mb-4">Save your favorite vehicles, hotels, and experiences</p>
              <div className="flex gap-4 justify-center">
                <Link href="/explore/vehicles">
                  <Button variant="outline">Browse Vehicles</Button>
                </Link>
                <Link href="/hotels">
                  <Button variant="outline">Browse Hotels</Button>
                </Link>
              </div>
            </Card>
          )}

          {activeTab === 'settings' && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Account Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Display Name</p>
                      <p className="text-sm text-gray-500">{user.displayName}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-500">{userProfile?.phone || 'Not added'}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Add</Button>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium">Home City</p>
                      <p className="text-sm text-gray-500">Not set</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Set</Button>
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