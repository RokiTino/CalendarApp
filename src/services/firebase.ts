import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

// Firebase Auth instance
export const firebaseAuth = auth();

// Firebase Firestore instance
export const db = firestore();

// Collections
export const COLLECTIONS = {
  USERS: 'users',
  EVENTS: 'events',
} as const;

// Get current user
export const getCurrentUser = (): FirebaseAuthTypes.User | null => {
  return firebaseAuth.currentUser;
};

// Get users collection reference
export const getUsersCollection = (): FirebaseFirestoreTypes.CollectionReference => {
  return db.collection(COLLECTIONS.USERS);
};

// Get events collection reference
export const getEventsCollection = (): FirebaseFirestoreTypes.CollectionReference => {
  return db.collection(COLLECTIONS.EVENTS);
};

// Get user document reference
export const getUserDoc = (userId: string): FirebaseFirestoreTypes.DocumentReference => {
  return db.collection(COLLECTIONS.USERS).doc(userId);
};

// Get event document reference
export const getEventDoc = (eventId: string): FirebaseFirestoreTypes.DocumentReference => {
  return db.collection(COLLECTIONS.EVENTS).doc(eventId);
};

// Firestore timestamp
export const serverTimestamp = firestore.FieldValue.serverTimestamp;

// Generate unique ID
export const generateId = (): string => {
  return db.collection(COLLECTIONS.EVENTS).doc().id;
};

export default {
  auth: firebaseAuth,
  db,
  getCurrentUser,
  getUsersCollection,
  getEventsCollection,
  getUserDoc,
  getEventDoc,
  serverTimestamp,
  generateId,
};
