import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  ReactNode,
} from 'react';
import ReactNativeBiometrics from 'react-native-biometrics';
import { AuthState, User, LoginCredentials, RegisterCredentials } from '../types';
import { authService, FirebaseUser } from '../services/firebase';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  loginWithBiometrics: () => Promise<void>;
  clearError: () => void;
  setBiometricsEnabled: (enabled: boolean) => void;
  isBiometricsEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Helper to convert FirebaseUser to app User type
const mapFirebaseUserToUser = (firebaseUser: FirebaseUser): User => ({
  id: firebaseUser.uid,
  email: firebaseUser.email || '',
  displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
  createdAt: new Date().toISOString(),
  lastLoginAt: new Date().toISOString(),
});

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);

  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log('[Auth] Login attempt for:', credentials.email);
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const firebaseUser = await authService.signIn(credentials.email, credentials.password);
      const user = mapFirebaseUserToUser(firebaseUser);

      console.log('[Auth] Login successful for user:', user.email);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('[Auth] Login error:', error.message);
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many attempts. Please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    console.log('[Auth] Registration attempt for:', credentials.email);
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const firebaseUser = await authService.signUp(credentials.email, credentials.password);
      const user = mapFirebaseUserToUser(firebaseUser);

      console.log('[Auth] Registration successful for user:', user.email);
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      console.error('[Auth] Registration error:', error.message);
      let errorMessage = 'Registration failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Use at least 6 characters';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    console.log('[Auth] Logout initiated');
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.signOut();
      console.log('[Auth] Logout successful');
    } catch (error: any) {
      console.error('[Auth] Logout error:', error.message);
      // Continue with logout even if signOut fails
    } finally {
      // Always clear auth state regardless of signOut result
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const loginWithBiometrics = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const rnBiometrics = new ReactNativeBiometrics();

      // Check if biometrics are available
      const { available } = await rnBiometrics.isSensorAvailable();
      if (!available) {
        throw new Error('Biometrics not available on this device');
      }

      // Prompt for biometric authentication
      const { success } = await rnBiometrics.simplePrompt({
        promptMessage: 'Confirm your identity',
        cancelButtonText: 'Cancel',
      });

      if (!success) {
        throw new Error('Biometric authentication cancelled');
      }

      // Note: In a production app, you would retrieve stored credentials
      // from secure storage (Keychain/Keystore) and use them to authenticate.
      // For now, this verifies the biometric but requires stored credentials
      // to complete the login flow.

      // For demo purposes, we'll just verify the biometric succeeded
      // The actual credential storage/retrieval would be implemented with
      // react-native-keychain or similar secure storage solution

      setState((prev) => ({
        ...prev,
        isLoading: false,
      }));

      throw new Error('Please set up biometric login after signing in with your password');
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Biometric login failed',
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const setBiometricsEnabled = useCallback((enabled: boolean) => {
    setIsBiometricsEnabled(enabled);
    // Note: In production, persist this setting to AsyncStorage
  }, []);

  // Listen to Firebase auth state changes
  useEffect(() => {
    console.log('[Auth] Setting up auth state listener');
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const user = mapFirebaseUserToUser(firebaseUser);
        console.log('[Auth] Auth state changed - User logged in:', user.email);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        console.log('[Auth] Auth state changed - User logged out');
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value: AuthContextType = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      loginWithBiometrics,
      clearError,
      setBiometricsEnabled,
      isBiometricsEnabled,
    }),
    [state, login, register, logout, loginWithBiometrics, clearError, setBiometricsEnabled, isBiometricsEnabled]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
