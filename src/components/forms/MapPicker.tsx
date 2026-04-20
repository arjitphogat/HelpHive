'use client';

import { useState, useEffect, useCallback } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { Input, Button } from '@/components/ui';
import { cn } from '@/lib/utils';

interface MapPickerProps {
  value?: { lat: number; lng: number; address?: string };
  onChange: (value: { lat: number; lng: number; address?: string }) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

interface PlaceResult {
  description: string;
  place_id: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare global {
  interface Window {
    google: any;
    initGoogleMaps: () => void;
  }
}

export function MapPicker({
  value,
  onChange,
  placeholder = 'Search for a location...',
  className,
  error,
}: MapPickerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value?.address || '');
  const [predictions, setPredictions] = useState<PlaceResult[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!window.google && !document.getElementById('google-maps-script')) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query || !mapLoaded) return;

      try {
        const autocompleteService = new window.google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
          { input: query, types: ['address'] },
          (predictions: any[] | null) => {
            if (predictions) {
              setPredictions(
                predictions.map((p) => ({
                  description: p.description,
                  place_id: p.place_id,
                  geometry: {
                    location: {
                      lat: 0,
                      lng: 0,
                    },
                  },
                }))
              );
              setShowPredictions(true);
            }
          }
        );
      } catch (error) {
        console.error('Error searching places:', error);
      }
    },
    [mapLoaded]
  );

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      } else {
        setPredictions([]);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, handleSearch]);

  const handleSelectPlace = async (prediction: PlaceResult) => {
    setIsLoading(true);
    try {
      const placesService = new window.google.maps.places.PlacesService(
        document.createElement('div')
      );

      placesService.getDetails(
        { placeId: prediction.place_id, fields: ['geometry', 'formatted_address'] },
        (place: any) => {
          if (place?.geometry?.location) {
            onChange({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
              address: place.formatted_address || prediction.description,
            });
            setSearchQuery(place.formatted_address || prediction.description);
          }
        }
      );
    } catch (error) {
      console.error('Error getting place details:', error);
    } finally {
      setIsLoading(false);
      setShowPredictions(false);
    }
  };

  const clearLocation = () => {
    onChange({ lat: 0, lng: 0, address: '' });
    setSearchQuery('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setShowPredictions(true)}
          placeholder={placeholder}
          className="pl-10"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={clearLocation}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border overflow-hidden">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              onClick={() => handleSelectPlace(prediction)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-start gap-3"
            >
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{prediction.description}</span>
            </button>
          ))}
        </div>
      )}

      {value?.lat && value?.lng && (
        <div className="mt-2 h-40 rounded-lg overflow-hidden bg-gray-100">
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Map preview (requires Google Maps API key)
          </div>
        </div>
      )}

      {error && <p className="text-sm text-[var(--color-error)] mt-1">{error}</p>}
    </div>
  );
}
