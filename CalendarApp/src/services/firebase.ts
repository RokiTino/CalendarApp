/**
 * Firebase Service
 *
 * This file contains Firebase service implementations for authentication,
 * Firestore database, and biometrics.
 *
 * Required Firebase packages:
 * - @react-native-firebase/app
 * - @react-native-firebase/auth
 * - @react-native-firebase/firestore
 *
 * For Biometrics:
 * - react-native-biometrics
 */

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// =============================================================================
// AUTH SERVICE
// =============================================================================

export interface FirebaseUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export const authService = {
  /**
   * Initialize Firebase Auth
   * Firebase auto-initializes from GoogleService-Info.plist (iOS) and google-services.json (Android)
   */
  initialize: async (): Promise<void> => {
    // Firebase auto-initializes with native config files
    console.log('Auth service initialized');
  },

  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
  },

  /**
   * Create a new user account
   */
  signUp: async (email: string, password: string): Promise<FirebaseUser> => {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      displayName: userCredential.user.displayName,
    };
  },

  /**
   * Sign out the current user
   */
  signOut: async (): Promise<void> => {
    await auth().signOut();
  },

  /**
   * Get the current user
   */
  getCurrentUser: (): FirebaseUser | null => {
    const user = auth().currentUser;
    if (!user) return null;
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    };
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged: (callback: (user: FirebaseUser | null) => void): (() => void) => {
    return auth().onAuthStateChanged((user: { uid: string; email: string | null; displayName: string | null } | null) => {
      if (!user) {
        callback(null);
      } else {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });
  },
};

// =============================================================================
// FIRESTORE SERVICE
// =============================================================================

export interface MeetingDocument {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  location?: string;
  color?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

const MEETINGS_COLLECTION = 'meetings';

export const firestoreService = {
  /**
   * Get all meetings for a user
   */
  getMeetings: async (userId: string): Promise<MeetingDocument[]> => {
    const snapshot = await firestore()
      .collection(MEETINGS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('date')
      .get();
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MeetingDocument));
  },

  /**
   * Add a new meeting
   */
  addMeeting: async (meeting: Omit<MeetingDocument, 'id'>): Promise<MeetingDocument> => {
    const docRef = await firestore().collection(MEETINGS_COLLECTION).add(meeting);
    return { id: docRef.id, ...meeting };
  },

  /**
   * Update an existing meeting
   */
  updateMeeting: async (id: string, data: Partial<MeetingDocument>): Promise<void> => {
    await firestore().collection(MEETINGS_COLLECTION).doc(id).update(data);
  },

  /**
   * Delete a meeting
   */
  deleteMeeting: async (id: string): Promise<void> => {
    await firestore().collection(MEETINGS_COLLECTION).doc(id).delete();
  },

  /**
   * Listen to real-time meeting updates
   */
  onMeetingsChange: (
    userId: string,
    callback: (meetings: MeetingDocument[]) => void
  ): (() => void) => {
    return firestore()
      .collection(MEETINGS_COLLECTION)
      .where('userId', '==', userId)
      .orderBy('date')
      .onSnapshot(snapshot => {
        const meetings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MeetingDocument));
        callback(meetings);
      });
  },
};

// =============================================================================
// BIOMETRICS SERVICE
// Requires: react-native-biometrics package
// =============================================================================

export const biometricsService = {
  /**
   * Check if biometrics are available
   * Note: Requires react-native-biometrics to be installed
   */
  isAvailable: async (): Promise<boolean> => {
    // Uncomment after installing react-native-biometrics:
    // import ReactNativeBiometrics from 'react-native-biometrics';
    // const { available } = await ReactNativeBiometrics.isSensorAvailable();
    // return available;
    return false;
  },

  /**
   * Prompt for biometric authentication
   * Note: Requires react-native-biometrics to be installed
   */
  authenticate: async (_promptMessage: string): Promise<boolean> => {
    // Uncomment after installing react-native-biometrics:
    // import ReactNativeBiometrics from 'react-native-biometrics';
    // const { success } = await ReactNativeBiometrics.simplePrompt({ promptMessage: _promptMessage });
    // return success;
    throw new Error('Biometrics not configured. Install react-native-biometrics package.');
  },

  /**
   * Store credentials securely (for biometric login)
   * Note: Implement with Keychain or encrypted AsyncStorage
   */
  storeCredentials: async (_email: string, _token: string): Promise<void> => {
    // Implement secure storage
    console.log('Store credentials - not implemented');
  },

  /**
   * Retrieve stored credentials
   * Note: Implement with Keychain or encrypted AsyncStorage
   */
  getCredentials: async (): Promise<{ email: string; token: string } | null> => {
    // Implement secure retrieval
    return null;
  },
};
