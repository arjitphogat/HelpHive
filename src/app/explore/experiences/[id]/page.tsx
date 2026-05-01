'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Clock, Users, Star, Shield, Calendar, ArrowLeft, Check, X, Heart, Share2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { sampleExperiences } from '@/data/sample-data';
import { Badge } from '@/components/ui';
import { Header, Footer } from '@/components/layout';

export default function ExperienceDetailPage() {
  const params = useParams();
  const experienceId = params.id as string;
  const [experience, setExperience] = useState<typeof sampleExperiences[0] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const foundExperience = sampleExperiences.find(e => e.id === experienceId);
    setExperience(foundExperience || null);
    setIsLoading(false);
  }, [experienceId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!experience) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Experience not found</h2>
            <p className="text-gray-500 mt-2">The experience you're looking for doesn't exist.</p>
            <Link href="/explore/experiences" className="inline-block mt-4 px-6 py-3 bg-pink-500 text-white rounded-xl font-medium hover:bg-pink-600 transition-colors">
              Browse Experiences
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const images = experience.images?.length > 0 ? experience.images : [experience.image];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Link href="/explore/experiences" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-6">
            <ArrowLeft className="h-5 w-5" />
            Back to experiences
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Images & Info */}
            <div className="lg:col-span-2 space-y-4">
              {/* Main Image */}
              <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                <Image
                  src={images[selectedImageIndex]}
                  alt={experience.title}
                  fill
                  className="object-cover"
                />
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

              {/* Experience Info Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-purple-100 text-purple-700">{experience.category}</Badge>
                      {experience.hostVerified && (
                        <Badge className="bg-green-100 text-green-700">Verified</Badge>
                      )}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {experience.title}
                    </h1>
                    <p className="text-gray-500 flex items-center gap-2 mt-2">
                      <MapPin className="h-4 w-4" />
                      {experience.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-full">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-lg">{experience.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({experience.reviewCount})</span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-t border-b border-gray-100 mt-6">
                  <div className="text-center">
                    <Clock className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Duration</p>
                    <p className="font-semibold">{experience.duration}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Group Size</p>
                    <p className="font-semibold">{experience.groupSize}</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Difficulty</p>
                    <p className="font-semibold capitalize">{experience.difficulty}</p>
                  </div>
                  <div className="text-center">
                    <Calendar className="h-6 w-6 mx-auto text-pink-500" />
                    <p className="text-sm text-gray-500 mt-1">Languages</p>
                    <p className="font-semibold">{experience.languages.length}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-3">About this experience</h3>
                  <p className="text-gray-600 leading-relaxed">{experience.description}</p>
                </div>

                {/* Highlights */}
                {experience.highlights && experience.highlights.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Highlights</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {experience.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Included */}
                {experience.included && experience.included.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">What's included</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {experience.included.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Not Included */}
                {experience.notIncluded && experience.notIncluded.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Not included</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {experience.notIncluded.map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Cancellation Policy */}
                {experience.cancellationPolicy && (
                  <div className="mt-6 p-4 bg-green-50 rounded-xl">
                    <h3 className="font-semibold text-gray-900 mb-1">Cancellation policy</h3>
                    <p className="text-gray-600">{experience.cancellationPolicy}</p>
                  </div>
                )}

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
                    {formatCurrency(experience.price)}
                  </span>
                  <span className="text-gray-500">/person</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{experience.duration}</span>
                  <span className="mx-2">•</span>
                  <Users className="h-4 w-4" />
                  <span>{experience.groupSize}</span>
                </div>

                <div className="mt-6 space-y-3">
                  <button className="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all">
                    Book Experience
                  </button>
                  <button className="w-full py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors font-medium">
                    Contact Guide
                  </button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h4 className="font-semibold text-gray-900">Hosted by</h4>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
                      {experience.hostName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{experience.hostName}</p>
                      {experience.hostVerified && (
                        <p className="text-sm text-green-600">Verified Guide</p>
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