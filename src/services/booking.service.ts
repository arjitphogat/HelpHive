import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
  writeBatch,
  runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Booking, BookingFormData, BookingStatus } from '@/types';
import { VehicleService } from './vehicle.service';
import { calculateServiceFee, calculateTaxes } from '@/lib/utils';

export class BookingService {
  static async createBooking(
    userId: string,
    hostId: string,
    guideId: string | undefined,
    data: BookingFormData
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    let baseAmount = 0;
    let serviceFee = 0;
    let taxes = 0;

    if (data.type === 'vehicle') {
      const vehicle = await VehicleService.getVehicle(data.vehicleId!);
      if (!vehicle) throw new Error('Vehicle not found');

      const hours = Math.ceil(
        (data.endDate.getTime() - data.startDate.getTime()) / (1000 * 60 * 60)
      );

      if (hours < (vehicle.minimumDuration ?? 1)) {
        throw new Error(`Minimum booking duration is ${vehicle.minimumDuration ?? 1} hours`);
      }

      baseAmount = hours <= 8 ? (vehicle.hourlyRate ?? 0) * hours : (vehicle.pricePerDay ?? 0);
    }

    serviceFee = calculateServiceFee(baseAmount);
    taxes = calculateTaxes(baseAmount + serviceFee);

    const bookingData = {
      userId,
      hostId,
      guideId,
      type: data.type,
      vehicleId: data.vehicleId,
      experienceId: data.experienceId,
      startDate: Timestamp.fromDate(data.startDate),
      endDate: Timestamp.fromDate(data.endDate),
      baseAmount,
      serviceFee,
      taxes,
      discount: 0,
      totalAmount: baseAmount + serviceFee + taxes,
      currency: 'INR',
      status: 'pending' as BookingStatus,
      paymentStatus: 'pending' as const,
      pickupLocation: data.pickupLocation,
      returnLocation: data.returnLocation,
      purpose: data.purpose,
      participants: data.participants,
      hasReview: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  }

  static async getBooking(id: string): Promise<Booking | null> {
    if (!db) return null;
    const bookingDoc = await getDoc(doc(db, 'bookings', id));
    if (!bookingDoc.exists()) return null;
    return { id: bookingDoc.id, ...bookingDoc.data() } as Booking;
  }

  static async getBookings(
    filters?: {
      userId?: string;
      hostId?: string;
      type?: 'vehicle' | 'experience';
      status?: BookingStatus;
    },
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<{ bookings: Booking[]; lastDoc: any }> {
    if (!db) return { bookings: [], lastDoc: undefined };

    let q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));

    if (filters?.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters?.hostId) {
      q = query(q, where('hostId', '==', filters.hostId));
    }

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }

    if (filters?.status) {
      q = query(q, where('status', '==', filters.status));
    }

    q = query(q, limit(pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const bookings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Booking[];

    return {
      bookings,
      lastDoc: snapshot.docs[snapshot.docs.length - 1],
    };
  }

  static async getUserBookings(
    userId: string,
    status?: BookingStatus
  ): Promise<Booking[]> {
    if (!db) return [];

    let q = query(
      collection(db, 'bookings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Booking[];
  }

  static async getHostBookings(
    hostId: string,
    status?: BookingStatus
  ): Promise<Booking[]> {
    if (!db) return [];

    let q = query(
      collection(db, 'bookings'),
      where('hostId', '==', hostId),
      orderBy('createdAt', 'desc')
    );

    if (status) {
      q = query(q, where('status', '==', status));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Booking[];
  }

  static async updateBookingStatus(
    id: string,
    status: BookingStatus
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const updateData: Record<string, any> = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (status === 'confirmed') {
      updateData.confirmedAt = serverTimestamp();
    }

    if (status === 'completed') {
      updateData.completedAt = serverTimestamp();
    }

    await updateDoc(doc(db, 'bookings', id), updateData);
  }

  static async updatePaymentStatus(
    id: string,
    paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed',
    paymentId?: string,
    razorpayOrderId?: string
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    await updateDoc(doc(db, 'bookings', id), {
      paymentStatus,
      paymentId,
      razorpayOrderId,
      updatedAt: serverTimestamp(),
    });
  }

  static async cancelBooking(id: string): Promise<void> {
    await this.updateBookingStatus(id, 'cancelled');
  }

  static async confirmBooking(id: string): Promise<void> {
    const booking = await this.getBooking(id);
    if (!booking) throw new Error('Booking not found');

    if (booking.type === 'vehicle' && booking.vehicleId) {
      const available = await VehicleService.checkAvailability(
        booking.vehicleId,
        booking.startDate.toDate(),
        booking.endDate.toDate()
      );

      if (!available) {
        throw new Error('Vehicle is no longer available for these dates');
      }
    }

    await this.updateBookingStatus(id, 'confirmed');
    await this.updatePaymentStatus(id, 'paid');
  }

  static async completeBooking(id: string): Promise<void> {
    const booking = await this.getBooking(id);
    if (!booking) throw new Error('Booking not found');

    await this.updateBookingStatus(id, 'completed');
  }

  static async applyCoupon(
    bookingId: string,
    discountAmount: number
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    await updateDoc(doc(db, 'bookings', bookingId), {
      discount: discountAmount,
      updatedAt: serverTimestamp(),
    });
  }

  static async getBookingStats(hostId: string): Promise<{
    totalBookings: number;
    pendingBookings: number;
    completedBookings: number;
    totalEarnings: number;
  }> {
    const bookings = await this.getHostBookings(hostId);

    return {
      totalBookings: bookings.length,
      pendingBookings: bookings.filter((b) => b.status === 'pending').length,
      completedBookings: bookings.filter((b) => b.status === 'completed').length,
      totalEarnings: bookings
        .filter((b) => b.paymentStatus === 'paid')
        .reduce((sum, b) => sum + b.totalAmount, 0),
    };
  }
}
