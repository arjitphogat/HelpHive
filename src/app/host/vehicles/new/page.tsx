'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronLeft, ChevronRight, Upload, X, MapPin, Check } from 'lucide-react';
import { Button, Card, Input, Select } from '@/components/ui';
import { cn } from '@/lib/utils';
import { VEHICLE_TYPES } from '@/constants';
import { useAuth } from '@/contexts/AuthContext';

const vehicleSchema = z.object({
  type: z.string().min(1, 'Vehicle type is required'),
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().min(1).max(new Date().getFullYear()),
  capacity: z.number().min(1).max(20),
  transmission: z.string().min(1, 'Transmission is required'),
  fuelType: z.string().min(1, 'Fuel type is required'),
  hourlyRate: z.number().min(0, 'Hourly rate is required'),
  dailyRate: z.number().min(0, 'Daily rate is required'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  pincode: z.string().min(1, 'Pincode is required'),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

const steps = [
  { id: 1, title: 'Basic Info', description: 'Vehicle type and details' },
  { id: 2, title: 'Photos', description: 'Upload vehicle images' },
  { id: 3, title: 'Features', description: 'Add features and amenities' },
  { id: 4, title: 'Pricing', description: 'Set your rates' },
  { id: 5, title: 'Location', description: 'Pickup location' },
  { id: 6, title: 'Review', description: 'Confirm and submit' },
];

const featureOptions = [
  'Air Conditioning',
  'Heating',
  'GPS',
  'Bluetooth',
  'USB Charging',
  'Luggage Space',
  'Child Seat',
  'Music System',
  'Emergency Kit',
  'First Aid',
];

export default function NewVehiclePage() {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      year: new Date().getFullYear(),
      capacity: 4,
      transmission: 'automatic',
      fuelType: 'petrol',
      hourlyRate: 0,
      dailyRate: 0,
    },
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages([...images, ...newImages].slice(0, 10));
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const nextStep = async () => {
    const stepFields: Record<number, (keyof VehicleFormData)[]> = {
      1: ['type', 'brand', 'model', 'year', 'capacity', 'transmission', 'fuelType'],
      2: [],
      3: [],
      4: ['hourlyRate', 'dailyRate'],
      5: ['address', 'city', 'state', 'pincode'],
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

  const onSubmit = async (data: VehicleFormData) => {
    setIsSubmitting(true);
    try {
      if (!userProfile?.id) throw new Error('User not authenticated');

      const vehicleData = {
        ...data,
        images,
        features: selectedFeatures,
      };

      const { VehicleService } = await import('@/services/vehicle.service');
      await VehicleService.createVehicle(userProfile.id, vehicleData as any);

      router.push('/dashboard/host?success=true');
    } catch (error) {
      console.error('Error creating vehicle:', error);
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

        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">List a New Vehicle</h1>
        <p className="text-[var(--color-text-muted)] mb-8">Share your vehicle with the Helphive community</p>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm',
                    currentStep >= step.id
                      ? 'bg-[var(--color-primary)] text-white'
                      : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'h-1 w-16 sm:w-24 mx-1',
                      currentStep > step.id ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
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
                  currentStep >= step.id ? 'text-[var(--color-primary)]' : 'text-gray-400'
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
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Basic Information</h2>

              <Select
                label="Vehicle Type"
                {...register('type')}
                error={errors.type?.message}
                options={VEHICLE_TYPES.map((t) => ({ value: t.value, label: `${t.icon} ${t.label}` }))}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Brand"
                  {...register('brand')}
                  error={errors.brand?.message}
                  placeholder="e.g., Bajaj, TVS"
                />
                <Input
                  label="Model"
                  {...register('model')}
                  error={errors.model?.message}
                  placeholder="e.g., RE"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  error={errors.year?.message}
                />
                <Input
                  label="Capacity"
                  type="number"
                  {...register('capacity', { valueAsNumber: true })}
                  error={errors.capacity?.message}
                />
                <Select
                  label="Transmission"
                  {...register('transmission')}
                  options={[
                    { value: 'automatic', label: 'Automatic' },
                    { value: 'manual', label: 'Manual' },
                  ]}
                />
              </div>

              <Select
                label="Fuel Type"
                {...register('fuelType')}
                options={[
                  { value: 'petrol', label: 'Petrol' },
                  { value: 'electric', label: 'Electric' },
                  { value: 'cng', label: 'CNG' },
                ]}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Vehicle Photos</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Add up to 10 photos. The first photo will be the cover image.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                    <img src={img} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-[var(--color-primary)] text-white text-xs rounded">
                        Cover
                      </span>
                    )}
                  </div>
                ))}

                {images.length < 10 && (
                  <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[var(--color-primary)]">
                    <Upload className="h-8 w-8 text-gray-400" />
                    <span className="text-sm text-gray-500 mt-2">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Features</h2>
              <p className="text-sm text-[var(--color-text-muted)]">
                Select the features available in your vehicle.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {featureOptions.map((feature) => (
                  <button
                    key={feature}
                    type="button"
                    onClick={() => toggleFeature(feature)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-colors',
                      selectedFeatures.includes(feature)
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
                        : 'border-gray-200'
                    )}
                  >
                    <span className="text-sm">{feature}</span>
                    {selectedFeatures.includes(feature) && (
                      <Check className="h-4 w-4 text-[var(--color-primary)] mt-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Pricing</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Hourly Rate (₹)"
                  type="number"
                  {...register('hourlyRate', { valueAsNumber: true })}
                  error={errors.hourlyRate?.message}
                  placeholder="0"
                />
                <Input
                  label="Daily Rate (₹)"
                  type="number"
                  {...register('dailyRate', { valueAsNumber: true })}
                  error={errors.dailyRate?.message}
                  placeholder="0"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-[var(--color-text-muted)]">
                  Platform fee: 15% per booking. You keep 85% of the earnings.
                </p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Location</h2>

              <Input
                label="Address"
                {...register('address')}
                error={errors.address?.message}
                placeholder="Street address"
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  {...register('city')}
                  error={errors.city?.message}
                  placeholder="City"
                />
                <Input
                  label="State"
                  {...register('state')}
                  error={errors.state?.message}
                  placeholder="State"
                />
                <Input
                  label="Pincode"
                  {...register('pincode')}
                  error={errors.pincode?.message}
                  placeholder="Pincode"
                />
              </div>

              <div className="p-4 bg-gray-50 rounded-lg flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[var(--color-text-muted)] mt-0.5" />
                <p className="text-sm text-[var(--color-text-muted)]">
                  Users will see the general area. Exact location shared after booking confirmation.
                </p>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Review & Submit</h2>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Vehicle Details</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {watch('brand')} {watch('model')} ({watch('year')})
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-[var(--color-text)] mb-2">Photos</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">{images.length} photo(s) added</p>
                  </div>
                )}

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Features</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {selectedFeatures.length > 0 ? selectedFeatures.join(', ') : 'No features selected'}
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Pricing</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    ₹{watch('hourlyRate')}/hour • ₹{watch('dailyRate')}/day
                  </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-[var(--color-text)] mb-2">Location</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {watch('address')}, {watch('city')}, {watch('state')} - {watch('pincode')}
                  </p>
                </div>
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
                Submit for Review
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
