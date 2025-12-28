import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, AuthState, SignInCredentials, SignUpCredentials } from '../types';
import AuthService from '../services/AuthService';
import BiometricService from '../services/BiometricService';

interface AuthContextType extends AuthState {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithBiometrics: () => Promise<boolean>;
  checkBiometricAvailability: () => Promise<boolean>;
  enableBiometrics: () => Promise<void>;
  disableBiometrics: () => Promise<void>;
  isBiometricsEnabled: boolean;
  biometryType: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });
  const [isBiometricsEnabled, setIsBiometricsEnabled] = useState(false);
  const [biometryType, setBiometryType] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check biometric availability
        const biometricResult = await BiometricService.checkBiometricAvailability();
        if (biometricResult.available) {
          setBiometryType(biometricResult.biometryType || null);
        }

        // Check if biometrics is enabled
        const biometricEnabled = await AuthService.isBiometricEnabled();
        setIsBiometricsEnabled(biometricEnabled);

        // Get stored user
        const storedUser = await AuthService.getStoredUser();
        
        if (storedUser) {
          setState({
            user: storedUser,
            isLoading: false,
            isAuthenticated: true,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Subscribe to auth state changes
    const unsubscribe = AuthService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
        };
        setState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          error: null,
        });
      } else {
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
          error: null,
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = useCallback(async (credentials: SignInCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await AuthService.signIn(credentials);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const signUp = useCallback(async (credentials: SignUpCredentials) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await AuthService.signUp(credentials);
      setState({
        user,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    try {
      await AuthService.signOut();
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
      throw error;
    }
  }, []);

  const checkBiometricAvailability = useCallback(async () => {
    const result = await BiometricService.checkBiometricAvailability();
    if (result.available) {
      setBiometryType(result.biometryType || null);
    }
    return result.available;
  }, []);

  const signInWithBiometrics = useCallback(async () => {
    if (!isBiometricsEnabled) {
      return false;
    }

    const storedUser = await AuthService.getStoredUser();
    if (!storedUser) {
      return false;
    }

    const success = await BiometricService.authenticateWithBiometrics(
      'Sign in to Calendar App'
    );

    if (success) {
      setState({
        user: storedUser,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
    }

    return success;
  }, [isBiometricsEnabled]);

  const enableBiometrics = useCallback(async () => {
    await AuthService.enableBiometric();
    await BiometricService.createBiometricKeys();
    setIsBiometricsEnabled(true);
  }, []);

  const disableBiometrics = useCallback(async () => {
    await AuthService.disableBiometric();
    await BiometricService.deleteBiometricKeys();
    setIsBiometricsEnabled(false);
  }, []);

  const value: AuthContextType = {
    ...state,
    signIn,
    signUp,
    signOut,
    signInWithBiometrics,
    checkBiometricAvailability,
    enableBiometrics,
    disableBiometrics,
    isBiometricsEnabled,
    biometryType,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
