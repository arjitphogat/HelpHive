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
  serverTimestamp,
} from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { sampleExperiences } from '@/data/sample-data';

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
  hostId: string;
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
  status: 'pending' | 'approved' | 'rejected';
  isApproved: boolean;
  totalBookings: number;
  totalReviews: number;
}

export interface ExperienceFormData {
  title: string;
  city: string;
  category: string;
  duration: string;
  price: number;
  images: string[];
  hostName: string;
  description: string;
  highlights: string[];
  included: string[];
  notIncluded: string[];
  groupSize: string;
  difficulty: string;
  languages: string[];
  cancellationPolicy: string;
}

export class ExperienceService {
  static async createExperience(
    hostId: string,
    data: ExperienceFormData
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');
    const experienceData = {
      ...data,
      hostId,
      primaryImage: data.images[0] || '',
      status: 'pending' as const,
      isApproved: false,
      rating: 0,
      totalBookings: 0,
      totalReviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'experiences'), experienceData);
    return docRef.id;
  }

  static async getExperience(id: string): Promise<Experience | null> {
    if (!db) return null;
    const docRef = await getDoc(doc(db, 'experiences', id));
    if (!docRef.exists()) return null;
    return { id: docRef.id, ...docRef.data() } as Experience;
  }

  static async getExperiences(
    filters?: {
      category?: string;
      city?: string;
      minPrice?: number;
      maxPrice?: number;
    },
    pageSize: number = 20
  ): Promise<{ experiences: Experience[]; lastDoc: any }> {
    // If Firebase not configured, return sample data
    if (!db) {
      const sampleDate = new Date();
      let experiences = sampleExperiences.map(e => ({
        id: e.id,
        title: e.title,
        city: e.city,
        category: e.category,
        duration: e.duration,
        price: e.price,
        rating: e.rating,
        reviewCount: e.reviewCount,
        image: e.image,
        images: e.images,
        hostId: 'sample-host',
        hostName: e.hostName,
        hostVerified: e.hostVerified,
        description: e.description,
        highlights: e.highlights,
        included: e.included,
        notIncluded: e.notIncluded,
        groupSize: e.groupSize,
        difficulty: e.difficulty,
        languages: e.languages,
        cancellationPolicy: e.cancellationPolicy,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
        createdAt: sampleDate,
        updatedAt: sampleDate,
      })) as Experience[];

      // Apply filters
      if (filters?.category) {
        experiences = experiences.filter(e =>
          e.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      if (filters?.city) {
        experiences = experiences.filter(e =>
          e.city.toLowerCase() === filters.city?.toLowerCase()
        );
      }
      if (filters?.minPrice) {
        experiences = experiences.filter(e => e.price >= filters.minPrice!);
      }
      if (filters?.maxPrice) {
        experiences = experiences.filter(e => e.price <= filters.maxPrice!);
      }

      return { experiences, lastDoc: null };
    }

    let q = query(collection(db, 'experiences'), where('status', '==', 'approved'));

    if (filters?.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters?.city) {
      q = query(q, where('city', '==', filters.city));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(pageSize));

    const snapshot = await getDocs(q);
    const experiences = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Experience[];

    const newLastDoc = snapshot.docs[snapshot.docs.length - 1];

    return { experiences, lastDoc: newLastDoc };
  }

  static async getExperiencesByHost(hostId: string): Promise<Experience[]> {
    if (!db) return [];
    const q = query(
      collection(db, 'experiences'),
      where('hostId', '==', hostId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Experience[];
  }

  static async getPopularExperiences(limitCount: number = 10): Promise<Experience[]> {
    if (!db) {
      return sampleExperiences.slice(0, limitCount).map(e => ({
        id: e.id,
        title: e.title,
        city: e.city,
        category: e.category,
        duration: e.duration,
        price: e.price,
        rating: e.rating,
        reviewCount: e.reviewCount,
        image: e.image,
        images: e.images,
        hostId: 'sample-host',
        hostName: e.hostName,
        hostVerified: e.hostVerified,
        description: e.description,
        highlights: e.highlights,
        included: e.included,
        notIncluded: e.notIncluded,
        groupSize: e.groupSize,
        difficulty: e.difficulty,
        languages: e.languages,
        cancellationPolicy: e.cancellationPolicy,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
      })) as Experience[];
    }

    const q = query(
      collection(db, 'experiences'),
      where('status', '==', 'approved'),
      orderBy('totalBookings', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Experience[];
  }

  static async getFeaturedExperiences(limitCount: number = 6): Promise<Experience[]> {
    if (!db) {
      return sampleExperiences.slice(0, limitCount).map(e => ({
        id: e.id,
        title: e.title,
        city: e.city,
        category: e.category,
        duration: e.duration,
        price: e.price,
        rating: e.rating,
        reviewCount: e.reviewCount,
        image: e.image,
        images: e.images,
        hostId: 'sample-host',
        hostName: e.hostName,
        hostVerified: e.hostVerified,
        description: e.description,
        highlights: e.highlights,
        included: e.included,
        notIncluded: e.notIncluded,
        groupSize: e.groupSize,
        difficulty: e.difficulty,
        languages: e.languages,
        cancellationPolicy: e.cancellationPolicy,
        status: 'approved' as const,
        isApproved: true,
        totalBookings: 0,
        totalReviews: 0,
      })) as Experience[];
    }

    const q = query(
      collection(db, 'experiences'),
      where('status', '==', 'approved'),
      orderBy('rating', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Experience[];
  }

  static async approveExperience(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'experiences', id), {
      status: 'approved',
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  }

  static async rejectExperience(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'experiences', id), {
      status: 'rejected',
      isApproved: false,
      updatedAt: serverTimestamp(),
    });
  }

  static async deleteExperience(id: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await deleteDoc(doc(db, 'experiences', id));
  }
}
