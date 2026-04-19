import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'host' | 'guide' | 'admin';
export type VehicleType = 'tuk-tuk' | 'scooter' | 'bike' | 'auto_rickshaw' | 'motorcycle';
export type TransmissionType = 'automatic' | 'manual';
export type FuelType = 'petrol' | 'electric' | 'cng';
export type BookingType = 'vehicle' | 'experience';
export type BookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';
export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'inactive';
export type TournamentStatus = 'upcoming' | 'active' | 'completed';
export type ChallengeMetric = 'rides' | 'rating' | 'onTime' | 'distance';
export type MessageType = 'text' | 'image' | 'location' | 'template';
export type TemplateType = 'arrived' | 'onway' | 'help';

export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  hostProfile?: HostProfile;
  guideProfile?: GuideProfile;
  stats?: UserStats;
  hostType?: 'vehicle' | 'guide' | 'tournament' | 'experience';
}

export interface HostProfile {
  isApproved: boolean;
  vehicles: string[];
  totalEarnings: number;
  rating: number;
  responseRate: number;
}

export interface GuideProfile {
  isApproved: boolean;
  tours: string[];
  languages: string[];
  categories: string[];
  bio: string;
  rating: number;
}

export interface UserStats {
  totalRides: number;
  averageRating: number;
  onTimePercentage: number;
  distanceCovered: number;
  tournamentPoints: number;
}

export interface Vehicle {
  id: string;
  hostId?: string;
  hostName?: string;
  hostVerified?: boolean;
  type?: VehicleType | string;
  brand: string;
  model: string;
  year?: number;
  capacity?: number;
  transmission?: TransmissionType | string;
  fuelType?: FuelType | string;
  images?: string[];
  primaryImage?: string;
  city?: string;
  hourlyRate?: number;
  pricePerHour?: number;
  pricePerDay?: number;
  address?: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  availability?: VehicleAvailability;
  status?: ListingStatus | string;
  isApproved?: boolean;
  rating?: number;
  reviewCount?: number;
  totalBookings?: number;
  totalReviews?: number;
  minimumDuration?: number;
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
}

export interface VehicleAvailability {
  defaultAvailable: boolean;
  customSchedule?: Record<string, boolean>;
}

export interface VehicleFormData {
  type: VehicleType;
  brand: string;
  model: string;
  year: number;
  capacity: number;
  transmission: TransmissionType;
  fuelType: FuelType;
  images: string[];
  hourlyRate: number;
  dailyRate: number;
  weeklyRate: number;
  minimumDuration: number;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude?: number;
  longitude?: number;
  features: string[];
}

export interface Experience {
  id: string;
  title: string;
  city: string;
  category: string;
  duration: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  hostId?: string;
  hostName: string;
  hostVerified: boolean;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  groupSize: string;
  difficulty: string;
  languages: string[];
  cancellationPolicy: string;
  status: ListingStatus;
  isApproved: boolean;
  totalBookings: number;
  totalReviews: number;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

export interface ExperienceAvailability {
  availableDays: number[];
  customSchedule?: Record<string, boolean>;
}

export interface ExperienceFormData {
  title: string;
  description: string;
  category: string;
  duration: number;
  maxParticipants: number;
  languages: string[];
  images: string[];
  meetingPoint: string;
  latitude?: number;
  longitude?: number;
  pricePerPerson: number;
  pricePerGroup: number;
  includes: string[];
  itinerary: string[];
  availableDays: number[];
}

export interface Booking {
  id: string;
  userId: string;
  hostId: string;
  guideId?: string;
  type: BookingType;
  vehicleId?: string;
  experienceId?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  baseAmount: number;
  serviceFee: number;
  taxes: number;
  discount: number;
  totalAmount: number;
  currency: 'INR';
  status: BookingStatus;
  paymentId?: string;
  paymentStatus: PaymentStatus;
  razorpayOrderId?: string;
  pickupLocation?: string;
  returnLocation?: string;
  purpose?: string;
  participants?: number;
  hasReview: boolean;
  reviewId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  confirmedAt?: Timestamp;
  completedAt?: Timestamp;
}

export interface BookingFormData {
  type: BookingType;
  vehicleId?: string;
  experienceId?: string;
  startDate: Date;
  endDate: Date;
  pickupLocation?: string;
  returnLocation?: string;
  purpose?: string;
  participants?: number;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  vehicleId?: string;
  experienceId?: string;
  type: 'vehicle' | 'experience';
  overallRating: number;
  categoryRatings?: {
    cleanliness?: number;
    condition?: number;
    communication?: number;
    value?: number;
  };
  text: string;
  images?: string[];
  wouldRecommend: boolean;
  response?: {
    text: string;
    respondedAt: Timestamp;
  };
  isVerifiedBooking: boolean;
  createdAt: Timestamp;
}

export interface ReviewFormData {
  overallRating: number;
  categoryRatings?: {
    cleanliness?: number;
    condition?: number;
    communication?: number;
    value?: number;
  };
  text: string;
  images?: string[];
  wouldRecommend: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly' | 'special';
  startDate: Timestamp;
  endDate: Timestamp;
  status: TournamentStatus;
  challenges: Challenge[];
  rewards: {
    bronze: TournamentReward;
    silver: TournamentReward;
    gold: TournamentReward;
  };
  createdAt: Timestamp;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  metric: ChallengeMetric;
  target: number;
}

export interface TournamentReward {
  badge: string;
  feeDiscount: number;
  cashBonus?: number;
  featuredListing?: boolean;
}

export interface LeaderboardEntry {
  odinal: string;
  rank: number;
  points: number;
  metrics: {
    totalRides: number;
    averageRating: number;
    onTimePercentage: number;
    distanceCovered: number;
  };
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: Timestamp;
  unreadCount: Record<string, number>;
  bookingId?: string;
  vehicleId?: string;
  experienceId?: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  type: MessageType;
  imageUrl?: string;
  latitude?: number;
  longitude?: number;
  templateType?: TemplateType;
  readBy: string[];
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'booking' | 'payment' | 'review' | 'tournament' | 'chat';
  isRead: boolean;
  data?: Record<string, string>;
  createdAt: Timestamp;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: Timestamp;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
