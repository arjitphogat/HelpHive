'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Star, Fuel, Gauge, Clock } from 'lucide-react';
import { Vehicle } from '@/types';
import { formatCurrency, getVehicleTypeLabel } from '@/lib/utils';
import { Card, Badge, StarRating } from '@/components/ui';
import { cn } from '@/lib/utils';
import { VEHICLE_TYPES } from '@/constants';

interface VehicleCardProps {
  vehicle: Vehicle;
  showHostInfo?: boolean;
  compact?: boolean;
  className?: string;
}

export function VehicleCard({
  vehicle,
  showHostInfo = false,
  compact = false,
  className,
}: VehicleCardProps) {
  const vehicleType = VEHICLE_TYPES.find((t) => t.value === vehicle.type);

  if (compact) {
    return (
      <Link href={`/explore/vehicles/${vehicle.id}`}>
        <Card
          variant="interactive"
          padding="none"
          className={cn('overflow-hidden', className)}
        >
          <div className="relative h-32">
            <Image
              src={vehicle.primaryImage || '/placeholder-vehicle.jpg'}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
            />
            <div className="absolute left-2 top-2">
              <Badge variant="primary" size="sm">
                {vehicleType?.icon} {getVehicleTypeLabel(vehicle.type || '')}
              </Badge>
            </div>
          </div>
          <div className="p-3">
            <h4 className="font-semibold text-[var(--color-text)] truncate">
              {vehicle.brand} {vehicle.model}
            </h4>
            <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
              <MapPin className="h-3 w-3" />
              {vehicle.city}
            </p>
            <div className="flex items-center justify-between mt-2">
              <StarRating rating={vehicle.rating || 0} size="sm" />
              <span className="font-semibold text-[var(--color-primary)]">
                {formatCurrency(vehicle.hourlyRate || vehicle.pricePerHour || vehicle.pricePerDay || 0)}/hr
              </span>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/explore/vehicles/${vehicle.id}`}>
      <Card
        variant="interactive"
        padding="none"
        className={cn('overflow-hidden', className)}
      >
        <div className="relative h-48">
          <Image
            src={vehicle.primaryImage || '/placeholder-vehicle.jpg'}
            alt={`${vehicle.brand} ${vehicle.model}`}
            fill
            className="object-cover"
          />
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge variant="primary">
              {vehicleType?.icon} {getVehicleTypeLabel(vehicle.type || '')}
            </Badge>
          </div>
          {(vehicle.totalBookings ?? 0) > 10 && (
            <Badge variant="success" className="absolute right-3 top-3">
              Popular
            </Badge>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-lg text-[var(--color-text)]">
                {vehicle.brand} {vehicle.model}
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {(vehicle.city || 'Unknown')}, {(vehicle.state || '')}
              </p>
            </div>
            {(vehicle.rating ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                <span className="font-medium">{(vehicle.rating ?? 0).toFixed(1)}</span>
                <span className="text-sm text-[var(--color-text-muted)]">
                  ({vehicle.totalReviews})
                </span>
              </div>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-sm text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {(vehicle.capacity || 0)}
            </span>
            <span className="flex items-center gap-1">
              <Fuel className="h-4 w-4" />
              {(vehicle.fuelType || 'Petrol')}
            </span>
            <span className="flex items-center gap-1">
              <Gauge className="h-4 w-4" />
              {(vehicle.transmission || 'Manual')}
            </span>
          </div>

          <div className="mt-4 flex items-end justify-between border-t border-gray-100 pt-3">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-xl font-bold text-[var(--color-primary)]">
                  {formatCurrency(vehicle.hourlyRate || vehicle.pricePerHour || vehicle.pricePerDay || 0)}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">/hour</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-semibold text-[var(--color-text)]">
                  {formatCurrency(vehicle.pricePerDay || 0)}
                </span>
                <span className="text-sm text-[var(--color-text-muted)]">/day</span>
              </div>
            </div>
            <span className="text-sm text-[var(--color-text-muted)]">
              Min. {(vehicle.minimumDuration || 1)}hr
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface VehicleListProps {
  vehicles: Vehicle[];
  isLoading?: boolean;
  emptyType?: 'no-results' | 'no-vehicles';
  onClearFilters?: () => void;
}

export function VehicleList({
  vehicles,
  isLoading,
  emptyType = 'no-vehicles',
  onClearFilters,
}: VehicleListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} padding="none" className="overflow-hidden">
            <div className="h-48 bg-gray-200 animate-shimmer" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded animate-shimmer w-3/4" />
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-20" />
                <div className="h-4 bg-gray-200 rounded animate-shimmer w-16" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (vehicles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--color-text-muted)]">
          {emptyType === 'no-results'
            ? 'No vehicles match your search criteria.'
            : 'No vehicles available in this area.'}
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 text-[var(--color-primary)] hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
