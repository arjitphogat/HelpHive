'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { MapPin, Clock, Users, Star, Languages, Shield, MessageCircle, ChevronLeft, ChevronRight, Heart, Share2, Check, X } from 'lucide-react';
import { Experience } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Button, Card, Badge } from '@/components/ui';

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const experienceId = params.id as string;
  const [experience, setExperience] = useState<Experience | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchExperience = async () => {
      setIsLoading(true);
      try {
        const { ExperienceService } = await import('@/services/experience.service');
        const data = await ExperienceService.getExperience(experienceId);
        setExperience(data);
      } catch (error) {
        console.error('Error fetching experience:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (experienceId) {
      fetchExperience();
    }
  }, [experienceId]);

  const images = experience?.images?.length ? experience.images : experience?.image ? [experience.image] : ['/placeholder-experience.jpg'];

  const handleBooking = () => {
    router.push(`/book/experience/${experienceId}`);
  };

  const handleContact = () => {
    router.push(`/chat?experienceId=${experienceId}`);
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

  if (!experience) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[var(--color-text)]">Experience not found</h2>
          <p className="text-[var(--color-text-muted)] mt-2">The experience you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/explore/experiences')} className="mt-4">
            Browse Experiences
          </Button>
        </div>
      </div>
    );
  }

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
                alt={experience.title}
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
                    <Badge variant="primary">{experience.category}</Badge>
                    {(experience.status === 'approved' || experience.isApproved) && (
                      <Badge variant="success">Verified</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl font-bold text-[var(--color-text)] mt-2">
                    {experience.title}
                  </h1>
                  <p className="text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                    <MapPin className="h-4 w-4" />
                    {experience.city}
                  </p>
                </div>
                {experience.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                    <span className="text-xl font-bold">{experience.rating.toFixed(1)}</span>
                    <span className="text-[var(--color-text-muted)]">({experience.totalReviews} reviews)</span>
                  </div>
                )}
              </div>

              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100">
                {experience.duration && (
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Duration</p>
                    <p className="font-semibold">{experience.duration}</p>
                  </div>
                )}
                {experience.groupSize && (
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Group Size</p>
                    <p className="font-semibold">{experience.groupSize}</p>
                  </div>
                )}
                {experience.difficulty && (
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Difficulty</p>
                    <p className="font-semibold capitalize">{experience.difficulty}</p>
                  </div>
                )}
                {experience.languages?.length > 0 && (
                  <div className="text-center">
                    <Languages className="h-6 w-6 mx-auto text-[var(--color-primary)]" />
                    <p className="text-sm text-[var(--color-text-muted)] mt-1">Languages</p>
                    <p className="font-semibold">{experience.languages.length} languages</p>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-lg text-[var(--color-text)]">About this experience</h3>
                <p className="mt-3 text-[var(--color-text-muted)]">{experience.description}</p>
              </div>

              {experience.highlights && experience.highlights.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-[var(--color-text)]">Highlights</h3>
                  <ul className="mt-3 space-y-2">
                    {experience.highlights.map((highlight, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-[var(--color-success)] mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.notIncluded && experience.notIncluded.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-[var(--color-text)]">Not included</h3>
                  <ul className="mt-3 space-y-2">
                    {experience.notIncluded.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <X className="h-5 w-5 text-[var(--color-error)] mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.cancellationPolicy && (
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-[var(--color-text)]">Cancellation policy</h3>
                  <p className="mt-2 text-[var(--color-text-muted)]">{experience.cancellationPolicy}</p>
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
                  {formatCurrency(experience.price)}
                </span>
                <span className="text-[var(--color-text-muted)]">/person</span>
              </div>

              <div className="mt-6 space-y-3">
                <Button onClick={handleBooking} className="w-full" size="lg">
                  Book Experience
                </Button>
                <Button onClick={handleContact} variant="secondary" className="w-full">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact Guide
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-semibold text-[var(--color-text)]">Hosted by</h4>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-[var(--color-secondary)] flex items-center justify-center text-white font-semibold">
                    {experience.hostName?.charAt(0).toUpperCase() || 'G'}
                  </div>
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{experience.hostName || 'Guide'}</p>
                    {experience.hostVerified && (
                      <p className="text-sm text-[var(--color-success)]">Verified Guide</p>
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
