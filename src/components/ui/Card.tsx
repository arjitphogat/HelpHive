'use client';

import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'interactive';
}

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, padding = 'none', variant = 'default', ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-[var(--radius-lg)] bg-white overflow-hidden',
        paddingStyles[padding],
        variant === 'interactive' && 'hover:shadow-[var(--shadow-card-hover)] transition-shadow cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

// Airbnb-style Listing Card
interface ListingCardProps extends HTMLAttributes<HTMLDivElement> {
  image: string;
  title: string;
  location?: string;
  price: number;
  rating?: number;
  reviewCount?: number;
  badge?: string;
  onSave?: () => void;
  isSaved?: boolean;
}

const ListingCard = forwardRef<HTMLDivElement, ListingCardProps>(
  ({ className, image, title, location, price, rating, reviewCount, badge, onSave, isSaved, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('group cursor-pointer', className)}
        {...props}
      >
        {/* Image Container - Airbnb Style */}
        <div className="relative aspect-[4/3] rounded-[var(--radius-lg)] overflow-hidden bg-[var(--color-surface-muted)] img-zoom mb-2">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />

          {/* Badge */}
          {badge && (
            <div className="absolute top-3 left-3">
              <span className="badge badge-primary font-medium">{badge}</span>
            </div>
          )}

          {/* Save Button - Airbnb Style */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSave?.();
            }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition heart-btn"
          >
            <svg
              className={cn(
                'w-5 h-5 transition',
                isSaved ? 'fill-current text-[var(--color-primary)]' : 'text-[var(--color-text)]'
              )}
              fill={isSaved ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        </div>

        {/* Info - Airbnb Style */}
        <div className="px-0.5">
          {/* Rating & Location Row */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-[var(--color-text)] line-clamp-1">{title}</h3>
            {rating && (
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                {reviewCount && (
                  <span className="text-sm text-[var(--color-text-muted)]">({reviewCount})</span>
                )}
              </div>
            )}
          </div>

          {/* Location */}
          {location && (
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">{location}</p>
          )}

          {/* Price */}
          <p className="text-sm">
            <span className="font-semibold text-[var(--color-text)]">₹{price.toLocaleString()}</span>
            <span className="text-[var(--color-text-secondary)]"> / day</span>
          </p>
        </div>
      </div>
    );
  }
);
ListingCard.displayName = 'ListingCard';

export { Card, ListingCard };
