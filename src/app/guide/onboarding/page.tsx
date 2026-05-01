'use client';

// Force dynamic rendering to avoid SSR issues with Firebase/auth
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Check, Globe, MapPin, FileText } from 'lucide-react';
import { Button, Card, Input, Textarea, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const guideSchema = z.object({
  displayName: z.string().min(2, 'Name is required'),
  bio: z.string().min(50, 'Bio must be at least 50 characters').max(500),
  languages: z.array(z.string()).min(1, 'Select at least one language'),
  categories: z.array(z.string()).min(1, 'Select at least one category'),
  city: z.string().min(1, 'City is required'),
  experience: z.string().min(1, 'Experience level is required'),
});

type GuideFormData = z.infer<typeof guideSchema>;

const steps = [
  { id: 1, title: 'Personal Info', description: 'About you' },
  { id: 2, title: 'Languages', description: 'Languages you speak' },
  { id: 3, title: 'Categories', description: 'Experience categories' },
  { id: 4, title: 'Location', description: 'Where you operate' },
  { id: 5, title: 'Verification', description: 'Identity verification' },
  { id: 6, title: 'Review', description: 'Confirm submission' },
];

const languageOptions = [
  { value: 'english', label: 'English' },
  { value: 'hindi', label: 'Hindi' },
  { value: 'marathi', label: 'Marathi' },
  { value: 'tamil', label: 'Tamil' },
  { value: 'telugu', label: 'Telugu' },
  { value: 'bengali', label: 'Bengali' },
  { value: 'gujarati', label: 'Gujarati' },
  { value: 'punjabi', label: 'Punjabi' },
];

const categoryOptions = [
  { value: 'food', label: 'Food & Culinary' },
  { value: 'culture', label: 'Culture & Heritage' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'nature', label: 'Nature & Wildlife' },
  { value: 'nightlife', label: 'Nightlife' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'art', label: 'Art & Crafts' },
  { value: 'wellness', label: 'Wellness & Yoga' },
];

const experienceLevels = [
  { value: 'beginner', label: 'Beginner (1-2 years)' },
  { value: 'intermediate', label: 'Intermediate (3-5 years)' },
  { value: 'expert', label: 'Expert (5+ years)' },
];

export default function GuideOnboardingPage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
  } = useForm<GuideFormData>({
    resolver: zodResolver(guideSchema),
    defaultValues: {
      languages: [],
      categories: [],
      experience: '',
    },
  });

  const selectedLanguages = watch('languages');
  const selectedCategories = watch('categories');

  const toggleLanguage = (lang: string) => {
    const current = selectedLanguages || [];
    if (current.includes(lang)) {
      setValue('languages', current.filter((l) => l !== lang));
    } else {
      setValue('languages', [...current, lang]);
    }
  };

  const toggleCategory = (cat: string) => {
    const current = selectedCategories || [];
    if (current.includes(cat)) {
      setValue('categories', current.filter((c) => c !== cat));
    } else {
      setValue('categories', [...current, cat]);
    }
  };

  const nextStep = async () => {
    const stepFields: Record<number, (keyof GuideFormData)[]> = {
      1: ['displayName', 'bio', 'experience'],
      2: ['languages'],
      3: ['categories'],
      4: ['city'],
    };

    const fields = stepFields[currentStep];
    if (fields && fields.length > 0) {
      const valid = await trigger(fields);
      if (!valid) return;
    }

    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: GuideFormData) => {
    setIsSubmitting(true);
    try {
      if (!userProfile?.id) throw new Error('User not authenticated');

      const guideData = {
        role: 'guide' as const,
        displayName: data.displayName,
        guideProfile: {
          isApproved: false,
          bio: data.bio,
          languages: data.languages,
          categories: data.categories,
          tours: [],
          rating: 0,
        },
      };

      const { AuthService } = await import('@/services/auth.service');
      await AuthService.updateUserProfile(userProfile.id, guideData);

      router.push('/dashboard/guide?success=true');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] mb-6"
        >
          <ChevronLeft className="h-5 w-5" />
          Back
        </button>

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Become a Guide</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Share your expertise and create memorable experiences</p>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    currentStep >= step.id
                      ? 'bg-[var(--color-secondary)] text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-1 w-16 sm:w-24 mx-1',
                      currentStep > step.id ? 'bg-[var(--color-secondary)]' : 'bg-gray-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="hidden sm:flex justify-between mt-2">
            {steps.map((step) => (
              <span
                key={step.id}
                className={cn(
                  'text-xs',
                  currentStep >= step.id ? 'text-[var(--color-secondary)]' : 'text-gray-400'
                )}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        <Card className="p-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Personal Information</h2>

              <Input
                label="Display Name"
                {...register('displayName')}
                error={errors.displayName?.message}
                placeholder="Your public name"
              />

              <Textarea
                label="Bio"
                {...register('bio')}
                error={errors.bio?.message}
                placeholder="Tell travelers about yourself, your background, and what makes your tours unique..."
                rows={5}
              />

              <Select
                label="Experience Level"
                {...register('experience')}
                error={errors.experience?.message}
                options={experienceLevels}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Languages</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Select the languages you can communicate in during tours.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => toggleLanguage(lang.value)}
                    className={cn(
                      'p-3 rounded-lg border flex items-center gap-2 transition-colors',
                      selectedLanguages?.includes(lang.value)
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
                        : 'border-gray-200'
                    )}
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm">{lang.label}</span>
                    {selectedLanguages?.includes(lang.value) && (
                      <Check className="h-4 w-4 text-[var(--color-secondary)]" />
                    )}
                  </button>
                ))}
              </div>

              {errors.languages && (
                <p className="text-sm text-[var(--color-error)]">{errors.languages.message}</p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Experience Categories</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Select the types of experiences you specialize in.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-colors',
                      selectedCategories?.includes(cat.value)
                        ? 'border-[var(--color-secondary)] bg-[var(--color-secondary)]/5'
                        : 'border-gray-200'
                    )}
                  >
                    <span className="text-sm">{cat.label}</span>
                    {selectedCategories?.includes(cat.value) && (
                      <Check className="h-4 w-4 text-[var(--color-secondary)] mt-1" />
                    )}
                  </button>
                ))}
              </div>

              {errors.categories && (
                <p className="text-sm text-[var(--color-error)]">{errors.categories.message}</p>
              )}
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Location</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Where are you based? This helps travelers find your experiences.
              </p>

              <Input
                label="City"
                {...register('city')}
                error={errors.city?.message}
                placeholder="e.g., Mumbai, Delhi, Jaipur"
              />

              <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-text-muted)] mt-0.5" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  You can operate in multiple cities, but we'll use this as your primary location.
                  Travelers will see experiences near you first.
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Identity Verification</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                To ensure trust and safety, we verify all guides. Please upload a government-issued ID.
              </p>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <FileText className="h-12 w-12 mx-auto text-gray-400" />
                <p className="mt-4 text-sm text-gray-500">
                  Upload your ID (Aadhaar, Passport, or Driver's License)
                </p>
                <Button variant="secondary" className="mt-4">
                  Choose File
                </Button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Your ID is stored securely and only used for verification purposes. We never share your
                  personal documents with third parties.
                </p>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Review & Submit</h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Personal Info</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {watch('displayName')} - {watch('experience')} guide
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)] mt-2">{watch('bio')}</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Languages</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {selectedLanguages?.map((l) => languageOptions.find((opt) => opt.value === l)?.label).join(', ')}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Categories</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {selectedCategories?.map((c) => categoryOptions.find((opt) => opt.value === c)?.label).join(', ')}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Location</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">{watch('city')}</p>
                </div>
              </div>

              <div className="p-4 bg-[var(--color-secondary)]/10 rounded-lg">
                <p className="text-sm text-[var(--color-secondary)]">
                  Once approved, you can start creating experiences and accepting bookings from travelers.
                  Approval typically takes 24-48 hours.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-between mt-6 pt-6 border-t border-gray-100">
            {currentStep > 1 ? (
              <Button variant="secondary" onClick={prevStep}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 6 ? (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleSubmit(onSubmit)} isLoading={isSubmitting}>
                Submit Application
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
