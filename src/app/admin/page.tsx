'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button, Input, Card, Badge, Avatar } from '@/components/ui';
import {
  Users,
  Car,
  Compass,
  Calendar,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  Search,
  Bell,
  ChevronDown,
  ArrowRight,
  Star,
  ShoppingCart,
  MessageCircle,
  FileText,
  Settings,
  LogOut,
  Activity,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { VehicleService } from '@/services/vehicle.service';
import { ExperienceService } from '@/services/experience.service';
import { BookingService } from '@/services/booking.service';
import { User, Vehicle, Experience, Booking } from '@/types';

interface StatCard {
  title: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ElementType;
  color: string;
}

interface PendingItem {
  id: string;
  type: 'host' | 'guide' | 'vehicle' | 'experience';
  name: string;
  email: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  image?: string;
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Live data states
  const [users, setUsers] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Stats
  const [stats, setStats] = useState<StatCard[]>([
    { title: 'Total Users', value: '0', change: '+0%', changeType: 'up', icon: Users, color: 'from-blue-500 to-indigo-500' },
    { title: 'Total Bookings', value: '0', change: '+0%', changeType: 'up', icon: ShoppingCart, color: 'from-emerald-500 to-teal-500' },
    { title: 'Revenue', value: '₹0', change: '+0%', changeType: 'up', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
    { title: 'Vehicles Listed', value: '0', change: '+0%', changeType: 'up', icon: Car, color: 'from-pink-500 to-rose-500' },
  ]);

  const [pendingApprovals, setPendingApprovals] = useState<PendingItem[]>([]);

  // Check admin auth on mount
  useEffect(() => {
    const adminSession = sessionStorage.getItem('adminAuth');
    if (adminSession === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Load live data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, refreshKey]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Fetch users directly from Firestore
      const getAllUsers = async () => {
        if (!db) return [];
        const snapshot = await getDocs(collection(db, 'users'));
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as User));
      };

      // Fetch all data in parallel
      const [usersData, vehiclesData, experiencesData, bookingsData] = await Promise.all([
        getAllUsers(),
        VehicleService.getVehicles().then(r => (r.vehicles as Vehicle[])).catch(() => []),
        ExperienceService.getExperiences().then(r => (r.experiences as Experience[])).catch(() => []),
        BookingService.getBookings().then(r => (r.bookings as Booking[])).catch(() => []),
      ]);

      setUsers(usersData as User[]);
      setVehicles(vehiclesData as Vehicle[]);
      setExperiences(experiencesData as Experience[]);
      setBookings(bookingsData as Booking[]);

      // Calculate stats
      const totalRevenue = bookingsData
        .filter(b => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0);

      setStats([
        { title: 'Total Users', value: formatNumber(usersData.length), change: '+12%', changeType: 'up', icon: Users, color: 'from-blue-500 to-indigo-500' },
        { title: 'Total Bookings', value: formatNumber(bookingsData.length), change: '+23%', changeType: 'up', icon: ShoppingCart, color: 'from-emerald-500 to-teal-500' },
        { title: 'Revenue', value: formatCurrency(totalRevenue), change: '+18%', changeType: 'up', icon: DollarSign, color: 'from-amber-500 to-orange-500' },
        { title: 'Vehicles Listed', value: formatNumber(vehiclesData.length), change: '+8%', changeType: 'up', icon: Car, color: 'from-pink-500 to-rose-500' },
      ]);

      // Build pending approvals from data
      const pending: PendingItem[] = [];

      // Add pending hosts/guides
      usersData.forEach(user => {
        if (user.role === 'host' && !user.hostProfile?.isApproved) {
          pending.push({
            id: user.id,
            type: 'host',
            name: user.displayName || 'Unknown',
            email: user.email,
            date: user.createdAt?.toDate?.().toLocaleDateString() || 'Unknown',
            status: 'pending',
          });
        }
      });

      // Add pending vehicles
      vehiclesData.forEach(vehicle => {
        if (vehicle.status !== 'approved') {
          pending.push({
            id: vehicle.id,
            type: 'vehicle',
            name: `${vehicle.brand} ${vehicle.model}`,
            email: vehicle.hostName || 'Unknown Host',
            date: vehicle.createdAt?.toDate?.().toLocaleDateString() || 'Unknown',
            status: vehicle.status as 'pending' | 'approved' | 'rejected',
          });
        }
      });

      // Add pending experiences
      experiencesData.forEach(exp => {
        if (exp.status !== 'approved') {
          pending.push({
            id: exp.id,
            type: 'experience',
            name: exp.title,
            email: exp.hostName || 'Unknown Host',
            date: exp.createdAt?.toDate?.().toLocaleDateString() || 'Unknown',
            status: exp.status as 'pending' | 'approved' | 'rejected',
          });
        }
      });

      setPendingApprovals(pending.slice(0, 10));
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatCurrency = (num: number): string => {
    if (num >= 100000) return '₹' + (num / 100000).toFixed(1) + 'L';
    if (num >= 1000) return '₹' + (num / 1000).toFixed(1) + 'K';
    return '₹' + num.toString();
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Demo mode or actual login
    if (adminEmail === 'admin@helphive.com' && adminPassword === 'admin123') {
      sessionStorage.setItem('adminAuth', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use admin@helphive.com / admin123');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    setIsAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  const handleApprove = async (item: PendingItem) => {
    try {
      if (item.type === 'vehicle') {
        await VehicleService.approveVehicle(item.id);
      } else if (item.type === 'experience') {
        await ExperienceService.approveExperience(item.id);
      }
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error approving:', error);
    }
  };

  const handleReject = async (item: PendingItem) => {
    try {
      if (item.type === 'vehicle') {
        await VehicleService.rejectVehicle(item.id);
      } else if (item.type === 'experience') {
        await ExperienceService.rejectExperience(item.id);
      }
      setRefreshKey(k => k + 1);
    } catch (error) {
      console.error('Error rejecting:', error);
    }
  };

  // Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 mb-4 shadow-2xl">
              <span className="text-white font-bold text-3xl">H</span>
            </div>
            <h1 className="text-3xl font-bold text-white">HelpHive Admin</h1>
            <p className="text-slate-400 mt-2">Sign in to access the dashboard</p>
          </div>

          {/* Login Card */}
          <Card className="p-8">
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="admin@helphive.com"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                required
              />
              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                required
              />

              {loginError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {loginError}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>

              <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-sm text-amber-800">
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@helphive.com<br />
                  Password: admin123
                </p>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold">H</span>
              </div>
              <span className="text-xl font-bold text-slate-900">HelpHive</span>
              <Badge variant="primary" size="sm">Admin</Badge>
            </Link>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search users, vehicles, bookings..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-sm"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors"
                title="Refresh Data"
              >
                <RefreshCw className={`h-5 w-5 text-slate-500 ${isLoading ? 'animate-spin' : ''}`} />
              </button>

              <button className="relative p-2 rounded-xl hover:bg-slate-100 transition-colors">
                <Bell className="h-5 w-5 text-slate-500" />
                {pendingApprovals.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                    {pendingApprovals.length}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <Avatar fallback="AD" size="sm" className="ring-2 ring-indigo-500/20" />
                  <span className="hidden sm:block text-sm font-medium text-slate-700">Admin</span>
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden">
                      <div className="p-3 border-b border-slate-100">
                        <p className="font-medium text-sm">admin@helphive.com</p>
                        <p className="text-xs text-slate-500">Administrator</p>
                      </div>
                      <div className="p-2">
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-slate-50"
                        >
                          <Settings className="h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500 mt-1">
              {isLoading ? 'Loading data...' : `Monitoring ${users.length} users, ${vehicles.length} vehicles, ${experiences.length} experiences`}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" leftIcon={<FileText className="h-4 w-4" />}>
              Export Report
            </Button>
            <Button leftIcon={<Activity className="h-4 w-4" />}>
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <span className={`text-xs font-medium ${stat.changeType === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-400">vs last month</span>
                  </div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Pending Approvals */}
          <Card className="lg:col-span-2 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Pending Approvals</h2>
              <Badge variant={pendingApprovals.length > 0 ? 'warning' : 'success'}>
                {pendingApprovals.length} pending
              </Badge>
            </div>

            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : pendingApprovals.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">All caught up!</p>
                <p className="text-sm text-slate-500">No pending approvals</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((item) => (
                  <div
                    key={`${item.type}-${item.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      item.type === 'host' ? 'bg-blue-100 text-blue-600' :
                      item.type === 'guide' ? 'bg-purple-100 text-purple-600' :
                      item.type === 'vehicle' ? 'bg-amber-100 text-amber-600' :
                      'bg-emerald-100 text-emerald-600'
                    }`}>
                      {item.type === 'host' && <Users className="h-5 w-5" />}
                      {item.type === 'guide' && <Compass className="h-5 w-5" />}
                      {item.type === 'vehicle' && <Car className="h-5 w-5" />}
                      {item.type === 'experience' && <Compass className="h-5 w-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{item.name}</p>
                      <p className="text-sm text-slate-500 truncate">{item.email}</p>
                    </div>
                    <span className="text-xs text-slate-400 hidden sm:block">{item.date}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(item)}
                        className="p-2 rounded-lg bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-colors"
                        title="Approve"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleReject(item)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                        title="Reject"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Link href="/admin/approvals">
              <Button variant="ghost" className="w-full mt-4" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All Approvals
              </Button>
            </Link>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Platform Overview</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Total Users</span>
                </div>
                <span className="font-bold text-slate-900">{users.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Car className="h-5 w-5 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Vehicles</span>
                </div>
                <span className="font-bold text-slate-900">{vehicles.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Experiences</span>
                </div>
                <span className="font-bold text-slate-900">{experiences.length}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <ShoppingCart className="h-5 w-5 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700">Bookings</span>
                </div>
                <span className="font-bold text-slate-900">{bookings.length}</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <Link href="/admin/users" className="block">
                <Button variant="outline" className="w-full" leftIcon={<Users className="h-4 w-4" />}>
                  Manage Users
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Users */}
        <Card className="mt-6 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Recent Users</h2>
            <Link href="/admin/users" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.slice(0, 5).map((user) => (
                  <tr key={user.id} className="text-sm">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <Avatar fallback={user.displayName?.slice(0, 2).toUpperCase() || 'U'} size="sm" />
                        <span className="font-medium text-slate-900">{user.displayName || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-500">{user.email}</td>
                    <td className="py-3 pr-4">
                      <Badge variant={user.role === 'admin' ? 'primary' : user.role === 'host' ? 'success' : 'default'} size="sm">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-500">Active</span>
                      </div>
                    </td>
                    <td className="py-3">
                      <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500">
                      No users found. Configure Firebase to see live data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
