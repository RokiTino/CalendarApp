import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, SignInCredentials, SignUpCredentials } from '../types';
import { getUserDoc, serverTimestamp } from './firebase';

// Storage keys
const AUTH_TOKEN_KEY = '@auth_token';
const USER_DATA_KEY = '@user_data';
const BIOMETRIC_ENABLED_KEY = '@biometric_enabled';

/**
 * Sign up with email and password
 */
export const signUp = async (credentials: SignUpCredentials): Promise<User> => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    const user = userCredential.user;

    // Create user document in Firestore
    await getUserDoc(user.uid).set({
      email: user.email,
      createdAt: serverTimestamp(),
    });

    const userData: User = {
      uid: user.uid,
      email: user.email || credentials.email,
      createdAt: new Date(),
    };

    // Store user data
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    // Store auth token
    const token = await user.getIdToken();
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

    return userData;
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

/**
 * Sign in with email and password
 */
export const signIn = async (credentials: SignInCredentials): Promise<User> => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );

    const user = userCredential.user;

    const userData: User = {
      uid: user.uid,
      email: user.email || credentials.email,
    };

    // Store user data
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));

    // Store auth token
    const token = await user.getIdToken();
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);

    return userData;
  } catch (error: any) {
    throw handleAuthError(error);
  }
};

/**
 * Sign out
 */
export const signOut = async (): Promise<void> => {
  try {
    await auth().signOut();
    await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, USER_DATA_KEY]);
  } catch (error: any) {
    throw new Error('Failed to sign out. Please try again.');
  }
};

/**
 * Get stored user data
 */
export const getStoredUser = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

/**
 * Get stored auth token
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch {
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getAuthToken();
  const currentUser = auth().currentUser;
  return !!token && !!currentUser;
};

/**
 * Enable biometric login
 */
export const enableBiometric = async (): Promise<void> => {
  await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');
};

/**
 * Disable biometric login
 */
export const disableBiometric = async (): Promise<void> => {
  await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false');
};

/**
 * Check if biometric is enabled
 */
export const isBiometricEnabled = async (): Promise<boolean> => {
  const enabled = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
  return enabled === 'true';
};

/**
 * Subscribe to auth state changes
 */
export const onAuthStateChanged = (
  callback: (user: FirebaseAuthTypes.User | null) => void
): (() => void) => {
  return auth().onAuthStateChanged(callback);
};

/**
 * Handle Firebase auth errors
 */
const handleAuthError = (error: any): Error => {
  const errorCode = error.code;

  switch (errorCode) {
    case 'auth/email-already-in-use':
      return new Error('This email is already registered. Please sign in.');
    case 'auth/invalid-email':
      return new Error('Please enter a valid email address.');
    case 'auth/weak-password':
      return new Error('Password should be at least 6 characters.');
    case 'auth/user-not-found':
      return new Error('No account found with this email.');
    case 'auth/wrong-password':
      return new Error('Incorrect password. Please try again.');
    case 'auth/too-many-requests':
      return new Error('Too many failed attempts. Please try again later.');
    case 'auth/network-request-failed':
      return new Error('Network error. Please check your connection.');
    case 'auth/invalid-credential':
      return new Error('Invalid credentials. Please check your email and password.');
    default:
      return new Error(error.message || 'An error occurred. Please try again.');
  }
};

export default {
  signUp,
  signIn,
  signOut,
  getStoredUser,
  getAuthToken,
  isAuthenticated,
  enableBiometric,
  disableBiometric,
  isBiometricEnabled,
  onAuthStateChanged,
};
