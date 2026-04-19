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
  serverTimestamp,
  increment,
  average,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Review, ReviewFormData } from '@/types';

export class ReviewService {
  static async createReview(
    bookingId: string,
    reviewerId: string,
    revieweeId: string,
    data: ReviewFormData,
    vehicleId?: string,
    experienceId?: string
  ): Promise<string> {
    if (!db) throw new Error('Firebase not initialized');

    const reviewData = {
      bookingId,
      reviewerId,
      revieweeId,
      vehicleId,
      experienceId,
      type: vehicleId ? 'vehicle' : 'experience',
      overallRating: data.overallRating,
      categoryRatings: data.categoryRatings,
      text: data.text,
      images: data.images || [],
      wouldRecommend: data.wouldRecommend,
      isVerifiedBooking: true,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'reviews'), reviewData);

    await updateDoc(doc(db, 'bookings', bookingId), {
      hasReview: true,
      reviewId: docRef.id,
    });

    await this.updateRevieweeRating(
      revieweeId,
      vehicleId,
      experienceId,
      data.overallRating
    );

    return docRef.id;
  }

  static async getReview(id: string): Promise<Review | null> {
    if (!db) return null;

    const reviewDoc = await getDoc(doc(db, 'reviews', id));
    if (!reviewDoc.exists()) return null;
    return { id: reviewDoc.id, ...reviewDoc.data() } as Review;
  }

  static async getReviewsForVehicle(
    vehicleId: string,
    pageSize: number = 20
  ): Promise<Review[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'reviews'),
      where('vehicleId', '==', vehicleId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  }

  static async getReviewsForExperience(
    experienceId: string,
    pageSize: number = 20
  ): Promise<Review[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'reviews'),
      where('experienceId', '==', experienceId),
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  }

  static async getReviewsByUser(userId: string): Promise<Review[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'reviews'),
      where('reviewerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Review[];
  }

  static async respondToReview(
    reviewId: string,
    revieweeId: string,
    responseText: string
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    await updateDoc(doc(db, 'reviews', reviewId), {
      response: {
        text: responseText,
        respondedAt: serverTimestamp(),
      },
    });
  }

  static async getVehicleRatingStats(
    vehicleId: string
  ): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await this.getReviewsForVehicle(vehicleId, 100);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.overallRating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.overallRating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  static async getExperienceRatingStats(
    experienceId: string
  ): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    const reviews = await this.getReviewsForExperience(experienceId, 100);

    if (reviews.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      };
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.overallRating, 0);
    const averageRating = totalRating / reviews.length;

    const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      ratingDistribution[r.overallRating]++;
    });

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
      ratingDistribution,
    };
  }

  private static async updateRevieweeRating(
    revieweeId: string,
    vehicleId: string | undefined,
    experienceId: string | undefined,
    newRating: number
  ): Promise<void> {
    if (!db) return;

    if (vehicleId) {
      const reviews = await this.getReviewsForVehicle(vehicleId);
      const totalRating = reviews.reduce((sum, r) => sum + r.overallRating, 0);
      const averageRating = totalRating / reviews.length;

      await updateDoc(doc(db, 'vehicles', vehicleId), {
        rating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      });
    }

    if (experienceId) {
      const reviews = await this.getReviewsForExperience(experienceId);
      const totalRating = reviews.reduce((sum, r) => sum + r.overallRating, 0);
      const averageRating = totalRating / reviews.length;

      await updateDoc(doc(db, 'experiences', experienceId), {
        rating: Math.round(averageRating * 10) / 10,
        totalReviews: reviews.length,
      });
    }
  }

  static async getGuideRating(guideId: string): Promise<number> {
    if (!db) return 0;

    const experiencesQuery = query(
      collection(db, 'experiences'),
      where('guideId', '==', guideId)
    );
    const experiencesSnapshot = await getDocs(experiencesQuery);
    const experienceIds = experiencesSnapshot.docs.map((doc) => doc.id);

    if (experienceIds.length === 0) return 0;

    let totalRating = 0;
    let totalReviews = 0;

    for (const expId of experienceIds) {
      const reviews = await this.getReviewsForExperience(expId);
      totalRating += reviews.reduce((sum, r) => sum + r.overallRating, 0);
      totalReviews += reviews.length;
    }

    return totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;
  }

  static async getHostRating(hostId: string): Promise<number> {
    if (!db) return 0;

    const vehiclesQuery = query(
      collection(db, 'vehicles'),
      where('hostId', '==', hostId)
    );
    const vehiclesSnapshot = await getDocs(vehiclesQuery);
    const vehicleIds = vehiclesSnapshot.docs.map((doc) => doc.id);

    if (vehicleIds.length === 0) return 0;

    let totalRating = 0;
    let totalReviews = 0;

    for (const vehicleId of vehicleIds) {
      const reviews = await this.getReviewsForVehicle(vehicleId);
      totalRating += reviews.reduce((sum, r) => sum + r.overallRating, 0);
      totalReviews += reviews.length;
    }

    return totalReviews > 0 ? Math.round((totalRating / totalReviews) * 10) / 10 : 0;
  }
}
