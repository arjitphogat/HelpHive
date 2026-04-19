'use client';

import { Shield, Clock, Heart, CheckCircle, Star, MapPin, Award, Zap, Users } from 'lucide-react';

interface TrustBadge {
  icon: typeof Shield;
  label: string;
  description: string;
  color: string;
}

const trustBadges: TrustBadge[] = [
  { icon: Shield, label: 'Verified Fleet', description: 'Background checked & quality verified', color: '#008A05' },
  { icon: CheckCircle, label: 'Sanitized', description: 'Professional hygiene standards', color: '#0070C5' },
  { icon: Heart, label: 'Safety Gear', description: 'Helmets & protection included', color: '#FF385C' },
  { icon: Award, label: 'Insurance', description: 'Comprehensive coverage', color: '#C45A00' },
];

const hostBadges = [
  { label: 'Superhost', color: '#FF385C', icon: Star },
  { label: 'Quick Response', color: '#008A05', icon: Zap },
  { label: 'Experienced', color: '#0070C5', icon: Users },
  { label: 'Local Expert', color: '#C45A00', icon: MapPin },
];

interface TrustBadgeProps {
  type?: 'vehicle' | 'experience' | 'host';
  size?: 'sm' | 'md' | 'lg';
  showAll?: boolean;
}

export function TrustBadge({ type = 'vehicle', size = 'md', showAll = false }: TrustBadgeProps) {
  const badges = type === 'host' ? hostBadges : trustBadges;
  const displayBadges = showAll ? badges : badges.slice(0, size === 'sm' ? 1 : size === 'md' ? 2 : 4);

  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badge, index) => (
        <div
          key={index}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-[var(--color-surface-muted)] border border-[var(--color-border-light)]"
        >
          <badge.icon className="h-3.5 w-3.5" style={{ color: badge.color }} />
          <span className="text-xs font-medium text-[var(--color-text)]">{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

interface TrustIndicatorProps {
  rating?: number;
  reviews?: number;
  responseTime?: string;
  bookings?: number;
  joined?: string;
}

export function TrustIndicator({ rating, reviews, responseTime, bookings, joined }: TrustIndicatorProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-secondary)]">
      {rating && (
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 fill-[var(--color-primary)]" style={{ color: 'var(--color-primary)' }} />
          <span className="font-semibold text-[var(--color-text)]">{rating.toFixed(1)}</span>
          {reviews && <span>({reviews})</span>}
        </div>
      )}
      {bookings && (
        <div>{bookings}+ trips completed</div>
      )}
      {responseTime && (
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>Responds {responseTime}</span>
        </div>
      )}
      {joined && (
        <div>Member since {joined}</div>
      )}
    </div>
  );
}

interface SafetyBadgeProps {
  children: React.ReactNode;
}

export function SafetyBadge({ children }: SafetyBadgeProps) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-2 bg-[var(--color-success-light)] text-[var(--color-success)] rounded-[var(--radius-md)] text-sm font-medium">
      <Shield className="h-4 w-4" />
      {children}
    </div>
  );
}

interface EmergencyButtonProps {
  className?: string;
}

export function EmergencyButton({ className }: EmergencyButtonProps) {
  return (
    <button
      className={`flex items-center justify-center gap-2 px-4 py-2 bg-[var(--color-error)] text-white rounded-full font-semibold text-sm hover:opacity-90 transition-opacity ${className || ''}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
      SOS Emergency
    </button>
  );
}

interface InstantBookBadgeProps {}

export function InstantBookBadge({}: InstantBookBadgeProps) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[var(--color-primary)] text-white rounded text-xs font-semibold">
      <Zap className="h-3 w-3" />
      Instant Book
    </div>
  );
}
