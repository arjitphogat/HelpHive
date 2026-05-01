'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Users, Star, Fuel, Gauge, Clock, ChevronLeft, Heart, Share2, Shield, Calendar } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { sampleVehicles } from '@/data/sample-data';
import { Badge } from '@/components/ui';
import { Header, Footer } from '@/components/layout';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [vehicle, setVehicle] = useState<typeof sampleVehicles[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const foundVehicle = sampleVehicles.find(v => v.id === vehicleId);
    setVehicle(foundVehicle || null);
    setIsLoading(false);
  }, [vehicleId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Vehicle not found</h2>
            <p className="text-gray-500 mt-2">The vehicle you're looking for doesn't exist.</p>
            <Link href="/explore/vehicles" className="inline-block mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors">
              Browse Vehicles
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = vehicle.images?.length > 0 ? vehicle.images : [vehicle.image];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/explore/vehicles" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ChevronLeft className="h-5 w-5" />
            Back to vehicles
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={images[selectedImageIndex]}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  fill
                  className="object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:bg-white transition-all"
                    >
                      <ChevronLeft className="h-6 w-6 rotate-180" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index ? 'border-pink-500 ring-2 ring-pink-200' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image src={img} alt={`Image ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>

              {/* Vehicle Info Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-pink-100 text-pink-700">{vehicle.type.replace('_', ' ')}</Badge>
                      {vehicle.hostVerified && (
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {vehicle.brand} {vehicle.model}
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {vehicle.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{vehicle.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({vehicle.reviewCount})</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100 mt-6">
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Capacity</p>
                    <p className="font-semibold">{vehicle.capacity} seats</p>
                  </div>
                  <div className="text-center">
                    <Gauge className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Transmission</p>
                    <p className="font-semibold">{vehicle.transmission}</p>
                  </div>
                  <div className="text-center">
                    <Fuel className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Fuel</p>
                    <p className="font-semibold">{vehicle.fuelType}</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Year</p>
                    <p className="font-semibold">{vehicle.year}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">About this vehicle</h3>
                  <p className="text-gray-600 leading-relaxed">{vehicle.description}</p>
                </div>

                {/* Features */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <span key={index} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex items-center gap-4">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Heart className="h-5 w-5" />
                    <span>Save</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                    <Share2 className="h-5 w-5" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-24">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-pink-500">
                    {formatCurrency(vehicle.pricePerHour)}
                  </span>
                  <span className="text-gray-500">/hour</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-xl font-semibold text-gray-900">
                    {formatCurrency(vehicle.pricePerDay)}
                  </span>
                  <span className="text-gray-500">/day</span>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Min. booking: {vehicle.kilometersIncluded} km included</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Shield className="h-4 w-4" />
                    <span>Extra km: ₹{vehicle.extraKmRate}/km</span>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button onClick={() => router.push(`/book/${vehicleId}`)} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all">
                    Book Now
                  </button>
                  <button className="w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium">
                    Contact Host
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900">Hosted by</h4>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white font-bold text-lg">
                      {vehicle.hostName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vehicle.hostName}</p>
                      {vehicle.hostVerified && (
                        <p className="text-sm text-green-600">Verified Host</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}