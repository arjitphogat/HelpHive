'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Users, Star, Fuel, Gauge, Clock, ChevronLeft, ChevronRight, Heart, Share2, Shield, MessageCircle, Calendar } from 'lucide-react';
import { Vehicle } from '@/types';
import { formatCurrency, getVehicleTypeLabel, cn } from '@/lib/utils';
import { Button, Card, Badge, StarRating } from '@/components/ui';
import { VEHICLE_TYPES } from '@/constants';

export default function VehicleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const vehicleId = params.id as string;
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchVehicle = async () => {
      setIsLoading(true);
      try {
        const { VehicleService } = await import('@/services/vehicle.service');
        const data = await VehicleService.getVehicle(vehicleId);
        setVehicle(data);
      } catch (error) {
        console.error('Error fetching vehicle:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicle();
    }
  }, [vehicleId]);

  const images = vehicle?.images?.length ? vehicle.images : vehicle?.primaryImage ? [vehicle.primaryImage] : ['/placeholder-vehicle.jpg'];

  const handleBooking = () => {
    router.push(`/book/${vehicleId}`);
  };

  const handleContact = () => {
    router.push(`/chat?vehicleId=${vehicleId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="aspect-video bg-gray-200 rounded-xl animate-shimmer" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-video bg-gray-200 rounded-lg animate-shimmer" />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded animate-shimmer" />
              <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/2" />
              <div className="h-24 bg-gray-200 rounded animate-shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Vehicle not found</h2>
          <p className="text-[var(--color-text-muted)] mt-2">The vehicle you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/explore/vehicles')} className="mt-4">
            Browse Vehicles
          </Button>
        </div>
      </div>
    );
  }

  const vehicleType = VEHICLE_TYPES.find((t) => t.value === vehicle.type);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
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
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-4 gap-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={cn(
                    'aspect-video rounded-lg overflow-hidden border-2',
                    selectedImageIndex === index ? 'border-[var(--color-primary)]' : 'border-transparent'
                  )}
                >
                  <Image
                    src={img}
                    alt={`Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>

            <Card className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">
                      {vehicleType?.icon} {getVehicleTypeLabel(vehicle.type || '')}
                    </Badge>
                    {(vehicle.status === 'approved' || vehicle.isApproved) && (
                      <Badge variant="success">Verified</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[var(--color-text)] mt-2">
                    {vehicle.brand} {vehicle.model}
                  </h1>
                  <p className="text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {vehicle.city}, {vehicle.state}
                  </p>
                </div>
                {(vehicle.rating ?? 0) > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                    <span className="text-xl font-bold">{(vehicle.rating ?? 0).toFixed(1)}</span>
                    <span className="text-[var(--color-text-muted)]">({vehicle.totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                {vehicle.capacity && (
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Capacity</p>
                    <p className="font-semibold">{vehicle.capacity} seats</p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="text-center">
                    <Gauge className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Transmission</p>
                    <p className="font-semibold capitalize">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.fuelType && (
                  <div className="text-center">
                    <Fuel className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Fuel</p>
                    <p className="font-semibold capitalize">{vehicle.fuelType}</p>
                  </div>
                )}
                {vehicle.year && (
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Year</p>
                    <p className="font-semibold">{vehicle.year}</p>
                  </div>
                )}
              </div>

              {vehicle.features && vehicle.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-[var(--color-text)]">Features</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vehicle.features.map((feature, index) => (
                      <Badge key={index} variant="secondary">{feature}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg border',
                    isFavorite ? 'border-[var(--color-error)] text-[var(--color-error)]' : 'border-gray-300'
                  )}
                >
                  <Heart className={cn('h-5 w-5', isFavorite && 'fill-current')} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300">
                  <Share2 className="h-5 w-5" />
                  Share
                </button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-[var(--color-primary)]">
                  {formatCurrency(vehicle.hourlyRate || vehicle.pricePerHour || vehicle.pricePerDay || 0)}
                </span>
                <span className="text-[var(--color-text-muted)]">/hour</span>
              </div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-semibold text-[var(--color-text)]">
                  {formatCurrency(vehicle.pricePerDay || 0)}
                </span>
                <span className="text-[var(--color-text-muted)]">/day</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                  <Calendar className="h-4 w-4" />
                  <span>Min. booking: {vehicle.minimumDuration || 1} hour(s)</span>
                </div>
                {vehicle.totalBookings && vehicle.totalBookings > 0 && (
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <Shield className="h-4 w-4" />
                    <span>{vehicle.totalBookings} bookings</span>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handleBooking} className="w-full" size="lg">
                  Book Now
                </Button>
                <Button onClick={handleContact} variant="secondary" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Host
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-[var(--color-text)]">Hosted by</h4>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-semibold">
                    {vehicle.hostName?.charAt(0).toUpperCase() || 'H'}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{vehicle.hostName || 'Host'}</p>
                    {vehicle.hostVerified && (
                      <p className="text-sm text-[var(--color-success)]">Verified Host</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
