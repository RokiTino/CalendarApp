import AuthService from '../src/services/AuthService';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BiometricService from '../src/services/BiometricService';

// Mock dependencies
jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn(),
    currentUser: null,
  })),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('../src/services/BiometricService', () => ({
  deleteCredentials: jest.fn(),
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('signUp', () => {
    it('creates user with email and password', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        getIdToken: jest.fn().mockResolvedValue('test-token'),
      };
      
      const mockAuth = auth();
      (mockAuth.createUserWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await AuthService.signUp('test@example.com', 'password123');
      
      expect(mockAuth.createUserWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(result).toEqual(mockUser);
    });

    it('throws error when signup fails', async () => {
      const mockAuth = auth();
      (mockAuth.createUserWithEmailAndPassword as jest.Mock).mockRejectedValue(
        new Error('Email already in use')
      );

      await expect(
        AuthService.signUp('test@example.com', 'password123')
      ).rejects.toThrow('Email already in use');
    });
  });

  describe('signIn', () => {
    it('signs in user with email and password', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        getIdToken: jest.fn().mockResolvedValue('test-token'),
      };
      
      const mockAuth = auth();
      (mockAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      const result = await AuthService.signIn('test@example.com', 'password123');
      
      expect(mockAuth.signInWithEmailAndPassword).toHaveBeenCalledWith(
        'test@example.com',
        'password123'
      );
      expect(result).toEqual(mockUser);
    });

    it('stores token after successful sign in', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        getIdToken: jest.fn().mockResolvedValue('test-token'),
      };
      
      const mockAuth = auth();
      (mockAuth.signInWithEmailAndPassword as jest.Mock).mockResolvedValue({
        user: mockUser,
      });

      await AuthService.signIn('test@example.com', 'password123');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@auth_token',
        'test-token'
      );
    });

    it('throws error when sign in fails', async () => {
      const mockAuth = auth();
      (mockAuth.signInWithEmailAndPassword as jest.Mock).mockRejectedValue(
        new Error('Invalid credentials')
      );

      await expect(
        AuthService.signIn('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('signOut', () => {
    it('signs out user and clears storage', async () => {
      const mockAuth = auth();
      (mockAuth.signOut as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);

      await AuthService.signOut();
      
      expect(mockAuth.signOut).toHaveBeenCalled();
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });

    it('deletes biometric credentials on sign out', async () => {
      const mockAuth = auth();
      (mockAuth.signOut as jest.Mock).mockResolvedValue(undefined);
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
      (BiometricService.deleteCredentials as jest.Mock).mockResolvedValue(undefined);

      await AuthService.signOut();
      
      expect(BiometricService.deleteCredentials).toHaveBeenCalled();
    });
  });

  describe('getStoredToken', () => {
    it('returns stored token', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('stored-token');

      const token = await AuthService.getStoredToken();
      
      expect(token).toBe('stored-token');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('@auth_token');
    });

    it('returns null when no token stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const token = await AuthService.getStoredToken();
      
      expect(token).toBeNull();
    });
  });

  describe('enableBiometricAuth', () => {
    it('stores credentials for biometric auth', async () => {
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

      await AuthService.enableBiometricAuth('test@example.com', 'password123');
      
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        '@biometric_enabled',
        'true'
      );
    });
  });

  describe('disableBiometricAuth', () => {
    it('removes biometric credentials', async () => {
      (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
      (BiometricService.deleteCredentials as jest.Mock).mockResolvedValue(undefined);

      await AuthService.disableBiometricAuth();
      
      expect(BiometricService.deleteCredentials).toHaveBeenCalled();
      expect(AsyncStorage.multiRemove).toHaveBeenCalled();
    });
  });

  describe('isBiometricEnabled', () => {
    it('returns true when biometric is enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('true');

      const result = await AuthService.isBiometricEnabled();
      
      expect(result).toBe(true);
    });

    it('returns false when biometric is not enabled', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await AuthService.isBiometricEnabled();
      
      expect(result).toBe(false);
    });
  });

  describe('onAuthStateChanged', () => {
    it('subscribes to auth state changes', () => {
      const callback = jest.fn();
      const mockAuth = auth();
      const mockUnsubscribe = jest.fn();
      (mockAuth.onAuthStateChanged as jest.Mock).mockReturnValue(mockUnsubscribe);

      const unsubscribe = AuthService.onAuthStateChanged(callback);
      
      expect(mockAuth.onAuthStateChanged).toHaveBeenCalledWith(callback);
      expect(unsubscribe).toBe(mockUnsubscribe);
    });
  });
});
