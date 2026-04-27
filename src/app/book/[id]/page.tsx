'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Star, Fuel, Gauge, Clock, ArrowLeft, Calendar, Shield } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { sampleVehicles } from '@/data/sample-data';
import { Button } from '@/components/ui';

export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [vehicle, setVehicle] = useState<typeof sampleVehicles[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly');

  useEffect(() => {
    const foundVehicle = sampleVehicles.find(v => v.id === vehicleId);
    setVehicle(foundVehicle || null);
    setIsLoading(false);
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Vehicle not found</h2>
          <p className="text-gray-500 mt-2">The vehicle you're looking for doesn't exist.</p>
          <Link href="/explore/vehicles" className="inline-block mt-4 px-6 py-3 bg-[#8B5CF6] text-white rounded-xl font-medium hover:bg-[#7C3AED]">
            Browse Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href={`/explore/vehicles/${vehicleId}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back to vehicle</span>
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#1A1A2E] mb-8" style={{ fontFamily: 'Sora, sans-serif' }}>
          Book Your Ride
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Summary */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(26,26,46,0.06)]">
            <div className="relative aspect-[16/10]">
              <Image
                src={vehicle.image}
                alt={`${vehicle.brand} ${vehicle.model}`}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">{vehicle.brand} {vehicle.model}</h2>
              <p className="text-gray-500 flex items-center gap-2 mb-4">
                <MapPin className="h-4 w-4" />
                {vehicle.city}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {vehicle.capacity} seats</span>
                <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {vehicle.fuelType}</span>
                <span className="flex items-center gap-1"><Gauge className="h-4 w-4" /> {vehicle.transmission}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-[#FFD700] text-[#FFD700]" />
                  <span className="font-bold">{vehicle.rating}</span>
                  <span className="text-gray-500">({vehicle.reviewCount} reviews)</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Hosted by</span>
                  <p className="font-semibold">{vehicle.hostName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-3xl p-6 shadow-[0_4px_20px_rgba(26,26,46,0.06)]">
            <h3 className="text-lg font-bold text-[#1A1A2E] mb-6">Booking Details</h3>

            {/* Booking Type Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setBookingType('hourly')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  bookingType === 'hourly'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Hourly
              </button>
              <button
                onClick={() => setBookingType('daily')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  bookingType === 'daily'
                    ? 'bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Daily
              </button>
            </div>

            {/* Date Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="h-4 w-4 inline mr-2" />
                {bookingType === 'hourly' ? 'Select Date' : 'Start Date'}
              </label>
              <input
                type="date"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B5CF6] outline-none"
              />
            </div>

            {/* Time Selection (for hourly) */}
            {bookingType === 'hourly' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B5CF6] outline-none">
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>12:00 PM</option>
                    <option>1:00 PM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                    <option>5:00 PM</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#8B5CF6] outline-none">
                    <option>1 hour</option>
                    <option>2 hours</option>
                    <option>3 hours</option>
                    <option>4 hours</option>
                    <option>6 hours</option>
                    <option>8 hours</option>
                  </select>
                </div>
              </div>
            )}

            {/* Price Calculation */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Rate</span>
                <span className="font-semibold">
                  {formatCurrency(bookingType === 'hourly' ? vehicle.pricePerHour : vehicle.pricePerDay)}
                  <span className="text-gray-500 text-sm">/{bookingType === 'hourly' ? 'hour' : 'day'}</span>
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Included km</span>
                <span>{vehicle.kilometersIncluded} km</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>Extra km charge</span>
                <span>₹{vehicle.extraKmRate}/km</span>
              </div>
            </div>

            {/* Safety Features */}
            <div className="flex flex-wrap gap-3 mb-6">
              {vehicle.insuranceValid && (
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Insurance
                </span>
              )}
              {vehicle.licenseIncluded && (
                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                  License Included
                </span>
              )}
              {vehicle.helmetIncluded && (
                <span className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
                  Helmet Provided
                </span>
              )}
            </div>

            {/* Book Button */}
            <Button
              className="w-full"
              size="xl"
              onClick={() => alert('Demo - Booking would proceed to payment gateway')}
            >
              Proceed to Book
            </Button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Free cancellation up to 24 hours before
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
