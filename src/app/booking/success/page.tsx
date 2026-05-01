'use client';

// Force dynamic rendering to avoid SSR issues
export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { Button } from '@/components/ui';
import {
  CheckCircle,
  Calendar,
  MapPin,
  Navigation,
  Hotel,
  Camera,
  ArrowRight,
  Home,
  Download,
  Share2,
  Clock,
  Star,
  Users,
  Train,
  Plane,
  Bus,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

function Badge({ variant, size, children }: { variant: string; size?: string; children: React.ReactNode }) {
  const colors = {
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colors[variant as keyof typeof colors] || colors.info} ${sizes[size as keyof typeof sizes] || sizes.sm}`}>
      {children}
    </span>
  );
}

function BookingSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    // Get booking details from URL params or localStorage
    const type = searchParams.get('type') || localStorage.getItem('booking_type');
    const itemName = searchParams.get('item') || localStorage.getItem('booking_item');
    const location = searchParams.get('location') || localStorage.getItem('booking_location');
    const date = searchParams.get('date') || localStorage.getItem('booking_date');
    const total = searchParams.get('total') || localStorage.getItem('booking_total');
    const bookingId = searchParams.get('id') || localStorage.getItem('booking_id') || `BK-${Date.now().toString(36).toUpperCase()}`;

    setBookingDetails({
      id: bookingId,
      type: type,
      itemName: decodeURIComponent(itemName || 'Booking'),
      location: decodeURIComponent(location || 'Location'),
      date: decodeURIComponent(date || new Date().toLocaleDateString()),
      total: parseFloat(total || '0') || 0,
    });

    // Clear stored booking data
    localStorage.removeItem('booking_type');
    localStorage.removeItem('booking_item');
    localStorage.removeItem('booking_location');
    localStorage.removeItem('booking_date');
    localStorage.removeItem('booking_total');
    localStorage.removeItem('booking_id');
  }, [searchParams]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vehicle': return <Navigation className="h-8 w-8" />;
      case 'hotel': return <Hotel className="h-8 w-8" />;
      case 'experience': return <Camera className="h-8 w-8" />;
      case 'train': return <Train className="h-8 w-8" />;
      case 'flight': return <Plane className="h-8 w-8" />;
      case 'bus': return <Bus className="h-8 w-8" />;
      default: return <Calendar className="h-8 w-8" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'vehicle': return 'Vehicle Rental';
      case 'hotel': return 'Hotel Booking';
      case 'experience': return 'Experience Booking';
      case 'train': return 'Train Booking';
      case 'flight': return 'Flight Booking';
      case 'bus': return 'Bus Booking';
      default: return 'Booking';
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 pt-20 lg:pt-24 py-12">
        <div className="max-w-2xl mx-auto px-4">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto rounded-full bg-green-100 flex items-center justify-center animate-bounce">
                <CheckCircle className="h-16 w-16 text-green-500" />
              </div>
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500 animate-ping opacity-75" />
              <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mt-6 mb-2">
              Booking Confirmed!
            </h1>
            <p className="text-gray-500">
              Your booking has been successfully placed. You can check the status in your profile.
            </p>
          </div>

          {/* Booking Details Card */}
          {bookingDetails && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#FF5722] to-[#FF8A65] flex items-center justify-center text-white">
                    {getTypeIcon(bookingDetails.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{getTypeLabel(bookingDetails.type)}</p>
                    <h2 className="text-xl font-bold">{bookingDetails.itemName}</h2>
                  </div>
                </div>
                <Badge variant="success" size="sm">Confirmed</Badge>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span>{bookingDetails.date}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span>{bookingDetails.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>Booking ID: {bookingDetails.id}</span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Total Amount</span>
                  <span className="text-2xl font-bold text-[#FF5722]">
                    {formatCurrency(bookingDetails.total)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="bg-blue-50 rounded-2xl p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">What is Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
                <div>
                  <p className="font-medium">Confirmation Email</p>
                  <p className="text-sm text-gray-500">You will receive a confirmation email shortly</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <div>
                  <p className="font-medium">Provider Contact</p>
                  <p className="text-sm text-gray-500">Your host/provider will reach out with details</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <div>
                  <p className="font-medium">Track Status</p>
                  <p className="text-sm text-gray-500">Monitor your booking status in your profile</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/profile" className="flex-1">
              <Button variant="outline" className="w-full">
                <Calendar className="h-5 w-5 mr-2" />
                View in Profile
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button className="w-full">
                <Home className="h-5 w-5 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">Need help? Contact our support team</p>
            <div className="flex justify-center gap-4">
              <Button variant="ghost" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share Booking
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF5722]" />
        </main>
        <Footer />
      </div>
    }>
      <BookingSuccessContent />
    </Suspense>
  );
}
