'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header, Footer } from '@/components/layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, Button, Input } from '@/components/ui';
import { HostService } from '@/services/auth.service';
import {
  Car, MapPin, Trophy, Sparkles, CheckCircle,
  Shield, Clock, Star, Users, Award, ChevronRight
} from 'lucide-react';

type HostType = 'vehicle' | 'guide' | 'tournament' | 'experience';

interface HostTypeInfo {
  id: HostType;
  title: string;
  description: string;
  icon: typeof Car;
  color: string;
  benefits: string[];
}

const HOST_TYPES: HostTypeInfo[] = [
  {
    id: 'vehicle',
    title: 'Vehicle Host',
    description: 'List your auto-rickshaw, bike, or scooter and earn by renting it out',
    icon: Car,
    color: 'from-blue-500 to-blue-600',
    benefits: [
      'Set your own prices',
      'Insurance coverage included',
      '24/7 support',
      'Secure payments',
    ],
  },
  {
    id: 'guide',
    title: 'Local Guide',
    description: 'Share your local knowledge and show travelers hidden gems',
    icon: MapPin,
    color: 'from-green-500 to-green-600',
    benefits: [
      'Flexible schedule',
      'Showcase your city',
      'Extra income',
      'Build reputation',
    ],
  },
  {
    id: 'tournament',
    title: 'Tournament Host',
    description: 'Organize exciting competitions and prize pools',
    icon: Trophy,
    color: 'from-purple-500 to-purple-600',
    benefits: [
      'Create prize pools',
      'Sponsor partnerships',
      'Event management',
      'Earn commissions',
    ],
  },
  {
    id: 'experience',
    title: 'Experience Host',
    description: 'Offer unique activities and experiences to travelers',
    icon: Sparkles,
    color: 'from-orange-500 to-orange-600',
    benefits: [
      'Share your passion',
      'Curate unique tours',
      'Local partnerships',
      'Flexible hosting',
    ],
  },
];

const CITIES = [
  'Goa', 'Jaipur', 'Delhi', 'Mumbai', 'Bangalore', 'Udaipur',
  'Varanasi', 'Agra', 'Kerala', 'Rishikesh', 'Manali', 'Shimla'
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam',
  'Marathi', 'Bengali', 'Gujarati', 'Punjabi', 'Portuguese', 'Spanish'
];

const VEHICLE_TYPES = [
  'Auto Rickshaw', 'Motorcycle', 'Scooter', 'Bicycle', 'EV Scooter', 'Van'
];

const EXPERIENCE_CATEGORIES = [
  'Cultural Tours', 'Food & Drink', 'Adventure', 'Sightseeing',
  'Nightlife', 'Wellness', 'Art & Crafts', 'Nature & Wildlife'
];

const SPECIALTIES = [
  'Racing Events', 'City Tours', 'Beach Parties', 'Heritage Walks',
  'Food Tours', 'Adventure Sports', 'Music Events', 'Sports Tournaments'
];

export default function HostOnboardingPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<'select-type' | 'vehicle' | 'guide' | 'tournament' | 'experience'>('select-type');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent SSR rendering issues
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col bg-[var(--color-surface-muted)]">
        <div className="h-20" />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)]" />
        </main>
      </div>
    );
  }

  // Form states
  const [vehicleData, setVehicleData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    licenseNumber: '',
    vehicleTypes: [] as string[],
    serviceAreas: [] as string[],
    description: '',
  });

  const [guideData, setGuideData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    city: '',
    languages: [] as string[],
    categories: [] as string[],
    bio: '',
    experience: '',
    hourlyRate: 500,
  });

  const [tournamentData, setTournamentData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    experience: '',
    specialties: [] as string[],
    certifications: [] as string[],
    description: '',
  });

  const [experienceData, setExperienceData] = useState({
    displayName: user?.displayName || '',
    phone: '',
    categories: [] as string[],
    description: '',
    experienceTypes: [] as string[],
  });

  const handleTypeSelect = (type: HostType) => {
    setStep(type);
  };

  const handleSubmit = async () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      switch (step) {
        case 'vehicle':
          await HostService.registerAsVehicleHost(user.uid, user.email || '', vehicleData);
          break;
        case 'guide':
          await HostService.registerAsLocalGuide(user.uid, user.email || '', guideData);
          break;
        case 'tournament':
          await HostService.registerAsTournamentHost(user.uid, user.email || '', tournamentData);
          break;
        case 'experience':
          await HostService.registerAsExperienceHost(user.uid, user.email || '', experienceData);
          break;
      }
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayItem = (arr: string[], item: string) => {
    if (arr.includes(item)) {
      return arr.filter(i => i !== item);
    }
    return [...arr, item];
  };

  if (!isAuthenticated) {
    router.push('/auth/login');
    return null;
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="max-w-md mx-auto text-center px-4 animate-fade-in-up">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-[var(--color-success)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--color-text)] mb-4">
              Application Submitted!
            </h1>
            <p className="text-[var(--color-text-muted)] mb-8">
              Thank you for applying to become a {step === 'select-type' ? 'Host' : `${HOST_TYPES.find(t => t.id === step)?.title}!`} We'll review your application and get back to you within 24-48 hours.
            </p>
            <Button onClick={() => router.push('/dashboard/user')} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-surface-muted)]">
      <Header />

      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-4">
              <span className="text-2xl">🐝</span>
              <span className="text-sm font-medium text-[var(--color-text)]">HelpHive</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-text)]">
              {step === 'select-type' ? 'Become a Host' : `${HOST_TYPES.find(t => t.id === step)?.title} Application`}
            </h1>
            <p className="text-[var(--color-text-muted)] mt-2 max-w-xl mx-auto">
              {step === 'select-type'
                ? 'Choose how you want to earn with HelpHive. Each host type offers unique benefits.'
                : `Fill out the details below to apply as a ${HOST_TYPES.find(t => t.id === step)?.title.toLowerCase()}.`
              }
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/20 text-center">
              <p className="text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}

          {/* Back Button */}
          {step !== 'select-type' && (
            <button
              onClick={() => setStep('select-type')}
              className="mb-6 flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to host types
            </button>
          )}

          {/* Host Type Selection */}
          {step === 'select-type' && (
            <div className="grid md:grid-cols-2 gap-6">
              {HOST_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type.id)}
                  className="group text-left bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-transparent hover:border-[var(--color-primary)]"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <type.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{type.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">{type.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {type.benefits.slice(0, 2).map((benefit) => (
                      <span key={benefit} className="inline-flex items-center gap-1 text-xs bg-[var(--color-surface-muted)] px-2 py-1 rounded-full">
                        <CheckCircle className="w-3 h-3 text-[var(--color-success)]" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-[var(--color-primary)] font-medium text-sm group-hover:gap-2 transition-all">
                    Apply now
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Vehicle Host Form */}
          {step === 'vehicle' && (
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Vehicle Host</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">List your vehicles and start earning</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Full Name"
                  value={vehicleData.displayName}
                  onChange={(e) => setVehicleData({ ...vehicleData, displayName: e.target.value })}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={vehicleData.phone}
                  onChange={(e) => setVehicleData({ ...vehicleData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
                <Input
                  label="License Number"
                  value={vehicleData.licenseNumber}
                  onChange={(e) => setVehicleData({ ...vehicleData, licenseNumber: e.target.value })}
                  placeholder="DL-12-1234567890"
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Vehicle Types</label>
                  <div className="flex flex-wrap gap-2">
                    {VEHICLE_TYPES.map((type) => (
                      <button
                        key={type}
                        onClick={() => setVehicleData({
                          ...vehicleData,
                          vehicleTypes: toggleArrayItem(vehicleData.vehicleTypes, type)
                        })}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          vehicleData.vehicleTypes.includes(type)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Service Areas</label>
                  <div className="flex flex-wrap gap-2">
                    {CITIES.map((city) => (
                      <button
                        key={city}
                        onClick={() => setVehicleData({
                          ...vehicleData,
                          serviceAreas: toggleArrayItem(vehicleData.serviceAreas, city)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          vehicleData.serviceAreas.includes(city)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description</label>
                  <textarea
                    value={vehicleData.description}
                    onChange={(e) => setVehicleData({ ...vehicleData, description: e.target.value })}
                    placeholder="Tell us about your vehicles and service..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Submit Application
                </Button>
              </div>
            </Card>
          )}

          {/* Local Guide Form */}
          {step === 'guide' && (
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Local Guide</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Share your local expertise</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Full Name"
                  value={guideData.displayName}
                  onChange={(e) => setGuideData({ ...guideData, displayName: e.target.value })}
                  placeholder="Enter your full name"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={guideData.phone}
                  onChange={(e) => setGuideData({ ...guideData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Primary City</label>
                  <select
                    value={guideData.city}
                    onChange={(e) => setGuideData({ ...guideData, city: e.target.value })}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Languages Spoken</label>
                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setGuideData({
                          ...guideData,
                          languages: toggleArrayItem(guideData.languages, lang)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          guideData.languages.includes(lang)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Tour Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGuideData({
                          ...guideData,
                          categories: toggleArrayItem(guideData.categories, cat)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          guideData.categories.includes(cat)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <Input
                  label="Hourly Rate (₹)"
                  type="number"
                  value={guideData.hourlyRate.toString()}
                  onChange={(e) => setGuideData({ ...guideData, hourlyRate: Number(e.target.value) })}
                  placeholder="500"
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Bio</label>
                  <textarea
                    value={guideData.bio}
                    onChange={(e) => setGuideData({ ...guideData, bio: e.target.value })}
                    placeholder="Tell travelers about yourself and your expertise..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Experience Level</label>
                  <select
                    value={guideData.experience}
                    onChange={(e) => setGuideData({ ...guideData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">Beginner (0-1 years)</option>
                    <option value="intermediate">Intermediate (1-3 years)</option>
                    <option value="experienced">Experienced (3-5 years)</option>
                    <option value="expert">Expert (5+ years)</option>
                  </select>
                </div>

                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Submit Application
                </Button>
              </div>
            </Card>
          )}

          {/* Tournament Host Form */}
          {step === 'tournament' && (
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Tournament Host</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Organize exciting competitions</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Organization/Individual Name"
                  value={tournamentData.displayName}
                  onChange={(e) => setTournamentData({ ...tournamentData, displayName: e.target.value })}
                  placeholder="Enter your name or organization"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={tournamentData.phone}
                  onChange={(e) => setTournamentData({ ...tournamentData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Specialties</label>
                  <div className="flex flex-wrap gap-2">
                    {SPECIALTIES.map((spec) => (
                      <button
                        key={spec}
                        onClick={() => setTournamentData({
                          ...tournamentData,
                          specialties: toggleArrayItem(tournamentData.specialties, spec)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          tournamentData.specialties.includes(spec)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Experience Level</label>
                  <select
                    value={tournamentData.experience}
                    onChange={(e) => setTournamentData({ ...tournamentData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)]"
                  >
                    <option value="">Select experience level</option>
                    <option value="beginner">First time organizer</option>
                    <option value="intermediate">Organized 1-5 events</option>
                    <option value="experienced">Organized 5-20 events</option>
                    <option value="expert">Professional organizer (20+ events)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Certifications (if any)</label>
                  <div className="flex flex-wrap gap-2">
                    {['FMSCI License', 'State Tourism Board', 'ISSF Certified', 'RTO Registered', 'Other'].map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => setTournamentData({
                          ...tournamentData,
                          certifications: tournamentData.certifications.includes(cert)
                            ? tournamentData.certifications.filter(c => c !== cert)
                            : [...tournamentData.certifications, cert]
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          tournamentData.certifications.includes(cert)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description</label>
                  <textarea
                    value={tournamentData.description}
                    onChange={(e) => setTournamentData({ ...tournamentData, description: e.target.value })}
                    placeholder="Tell us about your tournament hosting capabilities and past events..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Submit Application
                </Button>
              </div>
            </Card>
          )}

          {/* Experience Host Form */}
          {step === 'experience' && (
            <Card className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--color-text)]">Experience Host</h2>
                  <p className="text-sm text-[var(--color-text-muted)]">Share unique activities</p>
                </div>
              </div>

              <div className="space-y-6">
                <Input
                  label="Your Name / Company Name"
                  value={experienceData.displayName}
                  onChange={(e) => setExperienceData({ ...experienceData, displayName: e.target.value })}
                  placeholder="Enter your name or company"
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  value={experienceData.phone}
                  onChange={(e) => setExperienceData({ ...experienceData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Experience Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setExperienceData({
                          ...experienceData,
                          categories: toggleArrayItem(experienceData.categories, cat)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          experienceData.categories.includes(cat)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Experience Types</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Walking Tours', 'Food Tours', 'Cooking Classes', 'Art Workshops',
                      'Adventure Activities', 'Photography Tours', 'Music & Dance', 'Yoga & Wellness'
                    ].map((type) => (
                      <button
                        key={type}
                        onClick={() => setExperienceData({
                          ...experienceData,
                          experienceTypes: toggleArrayItem(experienceData.experienceTypes, type)
                        })}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          experienceData.experienceTypes.includes(type)
                            ? 'bg-[var(--color-primary)] text-white'
                            : 'bg-[var(--color-surface-muted)] text-[var(--color-text)] hover:bg-[var(--color-border-light)]'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text)] mb-2">Description</label>
                  <textarea
                    value={experienceData.description}
                    onChange={(e) => setExperienceData({ ...experienceData, description: e.target.value })}
                    placeholder="Describe the experiences you want to offer. What makes them unique? What's included? What will guests learn or do?"
                    rows={5}
                    className="w-full px-4 py-3 rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-text)] resize-none"
                  />
                </div>

                <Button
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  className="w-full"
                  size="lg"
                >
                  Submit Application
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
