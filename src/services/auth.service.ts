import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { auth, db, storage, isConfigured } from '@/lib/firebase';
import { User as UserType, UserRole } from '@/types';

export class AuthService {
  static async register(
    email: string,
    password: string,
    displayName: string,
    role: UserRole = 'user'
  ): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });

    const userData: Omit<UserType, 'id'> = {
      email,
      displayName,
      role,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };

    await setDoc(doc(db!, 'users', userCredential.user.uid), userData);

    return userCredential.user;
  }

  static async login(email: string, password: string): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }

  static async logout(): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await signOut(auth);
  }

  static async resetPassword(email: string): Promise<void> {
    if (!auth) throw new Error('Firebase not initialized');
    await sendPasswordResetEmail(auth, email);
  }

  static async signInWithGoogle(): Promise<User> {
    if (!auth) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    // Check if user exists in Firestore, if not create profile
    const userDoc = await getDoc(doc(db!, 'users', result.user.uid));
    if (!userDoc.exists()) {
      const userData: Omit<UserType, 'id'> = {
        email: result.user.email || '',
        displayName: result.user.displayName || 'User',
        role: 'user',
        createdAt: serverTimestamp() as any,
        updatedAt: serverTimestamp() as any,
      };
      await setDoc(doc(db!, 'users', result.user.uid), userData);
    }

    return result.user;
  }

  static async getUserProfile(uid: string): Promise<UserType | null> {
    if (!db) return null;
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;
    return { id: userDoc.id, ...userDoc.data() } as UserType;
  }

  static async updateUserProfile(
    uid: string,
    data: Partial<UserType>
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', uid), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  static async uploadAvatar(
    uid: string,
    file: File
  ): Promise<string> {
    if (!auth || !db || !storage) throw new Error('Firebase not initialized');
    const storageRef = ref(storage, `avatars/${uid}`);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    await updateProfile(auth.currentUser!, { photoURL: downloadURL });
    await updateDoc(doc(db, 'users', uid), { photoURL: downloadURL });
    return downloadURL;
  }

  static onAuthChange(callback: (user: User | null) => void): () => void {
    if (!auth) {
      callback(null);
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser(): User | null {
    return auth?.currentUser || null;
  }

  static async upgradeToHost(uid: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', uid), {
      role: 'host',
      hostProfile: {
        isApproved: false,
        vehicles: [],
        totalEarnings: 0,
        rating: 0,
        responseRate: 100,
      },
      updatedAt: serverTimestamp(),
    });
  }

  static async upgradeToGuide(uid: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', uid), {
      role: 'guide',
      guideProfile: {
        isApproved: false,
        tours: [],
        languages: [],
        categories: [],
        bio: '',
        rating: 0,
      },
      updatedAt: serverTimestamp(),
    });
  }

  static async approveHost(uid: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', uid), {
      'hostProfile.isApproved': true,
      updatedAt: serverTimestamp(),
    });
  }

  static async approveGuide(uid: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    await updateDoc(doc(db, 'users', uid), {
      'guideProfile.isApproved': true,
      updatedAt: serverTimestamp(),
    });
  }
}

// Vehicle Host Types
export interface VehicleHostProfile {
  isApproved: boolean;
  vehicles: string[];
  totalEarnings: number;
  rating: number;
  responseRate: number;
  vehicleTypes: string[];
  licenseNumber?: string;
  vehicleCount: number;
  serviceAreas: string[];
}

export interface LocalGuideProfile {
  isApproved: boolean;
  bio: string;
  languages: string[];
  categories: string[];
  tours: string[];
  totalTours: number;
  rating: number;
  reviews: number;
  hourlyRate: number;
  experience: string;
  certifications: string[];
}

export interface TournamentHostProfile {
  isApproved: boolean;
  tournamentsHosted: number;
  totalPrizePool: number;
  rating: number;
  specialties: string[];
  experience: string;
  certifications: string[];
}

export interface ExperienceHostProfile {
  isApproved: boolean;
  experiences: string[];
  totalBookings: number;
  rating: number;
  categories: string[];
  totalEarnings: number;
  experienceTypes: string[];
}

// Host Registration Service
export class HostService {
  static async registerAsVehicleHost(
    uid: string,
    email: string,
    data: {
      displayName: string;
      phone: string;
      licenseNumber: string;
      vehicleTypes: string[];
      serviceAreas: string[];
      description: string;
    }
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const hostData = {
      uid,
      email,
      type: 'vehicle',
      displayName: data.displayName,
      phone: data.phone,
      licenseNumber: data.licenseNumber,
      vehicleTypes: data.vehicleTypes,
      serviceAreas: data.serviceAreas,
      description: data.description,
      isApproved: false,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'hosts', uid), hostData);
    await AuthService.updateUserProfile(uid, {
      role: 'host',
      hostType: 'vehicle',
    });
  }

  static async registerAsLocalGuide(
    uid: string,
    email: string,
    data: {
      displayName: string;
      phone: string;
      city: string;
      languages: string[];
      categories: string[];
      bio: string;
      experience: string;
      hourlyRate: number;
    }
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const guideData = {
      uid,
      email,
      type: 'guide',
      displayName: data.displayName,
      phone: data.phone,
      city: data.city,
      languages: data.languages,
      categories: data.categories,
      bio: data.bio,
      experience: data.experience,
      hourlyRate: data.hourlyRate,
      isApproved: false,
      rating: 0,
      totalTours: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'guides', uid), guideData);
    await AuthService.updateUserProfile(uid, {
      role: 'guide',
      hostType: 'guide',
    });
  }

  static async registerAsTournamentHost(
    uid: string,
    email: string,
    data: {
      displayName: string;
      phone: string;
      experience: string;
      specialties: string[];
      certifications: string[];
      description: string;
    }
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const tournamentHostData = {
      uid,
      email,
      type: 'tournament',
      displayName: data.displayName,
      phone: data.phone,
      experience: data.experience,
      specialties: data.specialties,
      certifications: data.certifications,
      description: data.description,
      isApproved: false,
      tournamentsHosted: 0,
      totalPrizePool: 0,
      rating: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'tournament_hosts', uid), tournamentHostData);
    await AuthService.updateUserProfile(uid, {
      role: 'host',
      hostType: 'tournament',
    });
  }

  static async registerAsExperienceHost(
    uid: string,
    email: string,
    data: {
      displayName: string;
      phone: string;
      categories: string[];
      description: string;
      experienceTypes: string[];
    }
  ): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const experienceHostData = {
      uid,
      email,
      type: 'experience',
      displayName: data.displayName,
      phone: data.phone,
      categories: data.categories,
      description: data.description,
      experienceTypes: data.experienceTypes,
      isApproved: false,
      totalBookings: 0,
      totalEarnings: 0,
      rating: 0,
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'experience_hosts', uid), experienceHostData);
    await AuthService.updateUserProfile(uid, {
      role: 'host',
      hostType: 'experience',
    });
  }

  static async getAllHosts(): Promise<any[]> {
    if (!db) return [];

    const hostsSnapshot = await getDocs(collection(db, 'hosts'));
    const guidesSnapshot = await getDocs(collection(db, 'guides'));
    const tournamentHostsSnapshot = await getDocs(collection(db, 'tournament_hosts'));
    const experienceHostsSnapshot = await getDocs(collection(db, 'experience_hosts'));

    const hosts = [
      ...hostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
      ...guidesSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
      ...tournamentHostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
      ...experienceHostsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })),
    ];

    return hosts;
  }

  static async approveHost(hostId: string, hostType: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const collectionMap: Record<string, string> = {
      vehicle: 'hosts',
      guide: 'guides',
      tournament: 'tournament_hosts',
      experience: 'experience_hosts',
    };

    const collectionName = collectionMap[hostType] || 'hosts';
    await updateDoc(doc(db, collectionName, hostId), {
      isApproved: true,
      updatedAt: serverTimestamp(),
    });
  }

  static async rejectHost(hostId: string, hostType: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');

    const collectionMap: Record<string, string> = {
      vehicle: 'hosts',
      guide: 'guides',
      tournament: 'tournament_hosts',
      experience: 'experience_hosts',
    };

    const collectionName = collectionMap[hostType] || 'hosts';
    await updateDoc(doc(db, collectionName, hostId), {
      isApproved: false,
      rejected: true,
      updatedAt: serverTimestamp(),
    });
  }
}

// Analytics Service for Admin
export class AnalyticsService {
  static async getUserStats(): Promise<{
    totalUsers: number;
    hosts: number;
    guides: number;
    regularUsers: number;
    newThisMonth: number;
  }> {
    if (!db) return { totalUsers: 0, hosts: 0, guides: 0, regularUsers: 0, newThisMonth: 0 };

    const usersSnapshot = await getDocs(collection(db, 'users'));
    const users = usersSnapshot.docs.map(d => d.data());

    const hosts = users.filter(u => u.role === 'host' || u.hostType === 'vehicle').length;
    const guides = users.filter(u => u.role === 'guide').length;

    return {
      totalUsers: users.length,
      hosts,
      guides,
      regularUsers: users.length - hosts - guides,
      newThisMonth: users.length, // Simplified
    };
  }

  static async getBookingStats(): Promise<{
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    thisMonthRevenue: number;
  }> {
    // Simplified - in production would query bookings collection
    return {
      totalBookings: 0,
      activeBookings: 0,
      totalRevenue: 0,
      thisMonthRevenue: 0,
    };
  }

  static async getRecentUsers(limitCount: number = 10): Promise<UserType[]> {
    if (!db) return [];

    const q = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserType));
  }

  static async getAllUsers(): Promise<UserType[]> {
    if (!db) return [];

    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UserType));
  }

  static async deleteUser(uid: string): Promise<void> {
    if (!db) throw new Error('Firebase not initialized');
    // In production, would also delete from Auth
    await updateDoc(doc(db, 'users', uid), {
      deleted: true,
      deletedAt: serverTimestamp(),
    });
  }
}
