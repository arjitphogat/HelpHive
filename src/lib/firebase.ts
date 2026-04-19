import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, FirebaseStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isConfigured = !!(firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.authDomain);

// Initialize Firebase app - only if properly configured
let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let dbInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

if (isConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);

  // Connect to emulators in development if needed
  if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
    connectAuthEmulator(authInstance, 'http://localhost:9099');
    connectFirestoreEmulator(dbInstance, 'localhost', 8080);
    connectStorageEmulator(storageInstance, 'localhost', 9199);
  }
}

// Safe auth exports with null checks
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;
export { isConfigured, app };

// Helper function to get db or throw
export function getDb(): Firestore {
  if (!dbInstance) {
    throw new Error('Firebase not initialized');
  }
  return dbInstance;
}

// Helper function to get storage or throw
export function getStorageRef(): FirebaseStorage {
  if (!storageInstance) {
    throw new Error('Firebase Storage not initialized');
  }
  return storageInstance;
}
