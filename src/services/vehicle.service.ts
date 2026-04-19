import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, isConfigured } from '@/lib/firebase';
import { Vehicle, VehicleFormData, VehicleType } from '@/types';
import { sampleVehicles } from '@/data/sample-data';

export class VehicleService {
  static async createVehicle(
    hostId: string,
    data: VehicleFormData
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');
    const vehicleData = {
      ...data,
      hostId,
      primaryImage: data.images[0] || '',
      availability: {
        defaultAvailable: true,
        customSchedule: {},
      },
      status: 'pending' as const,
      isApproved: false,
      rating: 0,
      totalBookings: 0,
      totalReviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
    return docRef.id;
  }

  static async getVehicle(id: string): Promise<Vehicle | null> {
    if (!db) return null;
    const vehicleDoc = await getDoc(doc(db, 'vehicles', id));
    if (!vehicleDoc.exists()) return null;
    return { id: vehicleDoc.id, ...vehicleDoc.data() } as Vehicle;
  }

  static async getVehicles(
    filters?: {
      type?: VehicleType;
      city?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    pageSize: number = 20,
    lastDoc?: any
  ): Promise<{ vehicles: Vehicle[]; lastDoc: any }> {
    // If Firebase not configured, return sample data
    if (!db) {
      let vehicles = sampleVehicles.map(v => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        type: v.type,
        city: v.city,
        pricePerDay: v.pricePerDay,
        pricePerHour: v.pricePerHour,
        rating: v.rating,
        reviewCount: v.reviewCount,
        images: v.images,
        hostId: 'sample-host',
        hostName: v.hostName,
        hostVerified: v.hostVerified,
        description: v.description,
        features: v.features,
        capacity: v.capacity,
        fuelType: v.fuelType,
        transmission: v.transmission,
        year: v.year,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
      })) as Vehicle[];

      // Apply filters
      if (filters?.type) {
        vehicles = vehicles.filter(v => v.type === filters.type);
      }
      if (filters?.city) {
        vehicles = vehicles.filter(v => v.city?.toLowerCase() === filters.city?.toLowerCase());
      }
      if (filters?.minPrice) {
        vehicles = vehicles.filter(v => (v.pricePerHour ?? 0) >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        vehicles = vehicles.filter(v => (v.pricePerHour ?? Infinity) <= filters.maxPrice!);
      }

      return { vehicles, lastDoc: null };
    }

    let q = query(collection(db, 'vehicles'), where('status', '==', 'approved'));

    if (filters?.type) {
      q = query(q, where('type', '==', filters.type));
    }

    if (filters?.city) {
      q = query(q, where('city', '==', filters.city));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

    if (lastDoc) {
      q = query(q, startAfter(lastDoc));
    }

    const snapshot = await getDocs(q);
    const vehicles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Vehicle[];

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { vehicles, lastDoc: newLastDoc };
  }

  static async getVehiclesByHost(hostId: string): Promise<Vehicle[]> {
    if (!db) return [];
    const q = query(
      collection(db, 'vehicles'),
      where('hostId', '==', hostId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Vehicle[];
  }

  static async updateVehicle(
    id: string,
    data: Partial<VehicleFormData>
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'vehicles', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteVehicle(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await deleteDoc(doc(db, 'vehicles', id));
  }

  static async approveVehicle(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'vehicles', id), {
      status: 'approved',
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  }

  static async rejectVehicle(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'vehicles', id), {
      status: 'rejected',
      isApproved: false,
      updatedAt: serverTimestamp(),
    });
  }

  static async toggleVehicleStatus(id: string, isActive: boolean): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'vehicles', id), {
      status: isActive ? 'approved' : 'inactive',
      updatedAt: serverTimestamp(),
    });
  }

  static async checkAvailability(
    vehicleId: string,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    if (!db) return true;
    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('vehicleId', '==', vehicleId),
      where('status', 'in', ['pending', 'confirmed', 'in_progress'])
    );

    const snapshot = await getDocs(bookingsQuery);
    const startTimestamp = Timestamp.fromDate(startDate);
    const endTimestamp = Timestamp.fromDate(endDate);

    for (const doc of snapshot.docs) {
      const booking = doc.data();
      const bookingStart = booking.startDate;
      const bookingEnd = booking.endDate;

      if (
        (startTimestamp >= bookingStart && startTimestamp <= bookingEnd) ||
        (endTimestamp >= bookingStart && endTimestamp <= bookingEnd) ||
        (startTimestamp <= bookingStart && endTimestamp >= bookingEnd)
      ) {
        return false;
      }
    }

    return true;
  }

  static async uploadImages(
    vehicleId: string,
    files: File[]
  ): Promise<string[]> {
    if (!storage) throw new Error('Firebase not initialized');
    const urls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `vehicles/${vehicleId}/${i}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }

    return urls;
  }

  static async getPopularVehicles(
    limitCount: number = 10
  ): Promise<Vehicle[]> {
    if (!db) {
      return sampleVehicles.slice(0, limitCount).map(v => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        type: v.type,
        city: v.city,
        pricePerDay: v.pricePerDay,
        pricePerHour: v.pricePerHour,
        rating: v.rating,
        reviewCount: v.reviewCount,
        images: v.images,
        hostId: 'sample-host',
        hostName: v.hostName,
        hostVerified: v.hostVerified,
        description: v.description,
        features: v.features,
        capacity: v.capacity,
        fuelType: v.fuelType,
        transmission: v.transmission,
        year: v.year,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
      })) as Vehicle[];
    }

    const q = query(
      collection(db, 'vehicles'),
      where('status', '==', 'approved'),
      orderBy('totalBookings', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Vehicle[];
  }

  static async getFeaturedVehicles(
    limitCount: number = 6
  ): Promise<Vehicle[]> {
    if (!db) {
      return sampleVehicles.slice(0, limitCount).map(v => ({
        id: v.id,
        brand: v.brand,
        model: v.model,
        type: v.type,
        city: v.city,
        pricePerDay: v.pricePerDay,
        pricePerHour: v.pricePerHour,
        rating: v.rating,
        reviewCount: v.reviewCount,
        images: v.images,
        hostId: 'sample-host',
        hostName: v.hostName,
        hostVerified: v.hostVerified,
        description: v.description,
        features: v.features,
        capacity: v.capacity,
        fuelType: v.fuelType,
        transmission: v.transmission,
        year: v.year,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
      })) as Vehicle[];
    }

    const q = query(
      collection(db, 'vehicles'),
      where('status', '==', 'approved'),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Vehicle[];
  }
}
