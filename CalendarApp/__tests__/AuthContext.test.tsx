import React, { useEffect, useState } from 'react';
import TestRenderer, { act } from 'react-test-renderer';
import { Text, View } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { authService } from '../src/services/firebase';

// Mock the firebase service
jest.mock('../src/services/firebase', () => ({
  authService: {
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChanged: jest.fn((callback) => {
      // Initially no user
      callback(null);
      return jest.fn(); // unsubscribe
    }),
    getCurrentUser: jest.fn(() => null),
  },
}));

const mockAuthService = authService as jest.Mocked<typeof authService>;

// Test component to capture auth state
interface TestComponentProps {
  onAuthState?: (state: any) => void;
  testAction?: string;
  credentials?: { email: string; password: string; confirmPassword?: string };
}

const TestComponent: React.FC<TestComponentProps> = ({ onAuthState, testAction, credentials }) => {
  const auth = useAuth();
  const [actionPerformed, setActionPerformed] = useState(false);

  useEffect(() => {
    if (onAuthState) {
      onAuthState(auth);
    }
  }, [auth, onAuthState]);

  useEffect(() => {
    const performAction = async () => {
      if (testAction && credentials && !actionPerformed) {
        setActionPerformed(true);
        try {
          if (testAction === 'login') {
            await auth.login(credentials);
          } else if (testAction === 'register') {
            await auth.register({ ...credentials, confirmPassword: credentials.confirmPassword || credentials.password });
          } else if (testAction === 'logout') {
            await auth.logout();
          }
        } catch (e) {
          // Error is handled in context
        }
      }
    };
    performAction();
  }, [testAction, credentials, auth, actionPerformed]);

  return (
    <View>
      <Text testID="loading">{String(auth.isLoading)}</Text>
      <Text testID="authenticated">{String(auth.isAuthenticated)}</Text>
      <Text testID="error">{auth.error || 'none'}</Text>
      <Text testID="email">{auth.user?.email || 'none'}</Text>
    </View>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset onAuthStateChanged to return no user by default
    mockAuthService.onAuthStateChanged.mockImplementation((callback) => {
      callback(null);
      return jest.fn();
    });
  });

  describe('useAuth hook', () => {
    it('should throw error when used outside AuthProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        TestRenderer.create(<TestComponent />);
      }).toThrow('useAuth must be used within an AuthProvider');

      consoleSpy.mockRestore();
    });

    it('should provide initial state', async () => {
      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent onAuthState={(state) => { authState = state; }} />
          </AuthProvider>
        );
      });

      expect(authState).not.toBeNull();
      expect(authState.isLoading).toBe(false);
      expect(authState.user).toBeNull();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.error).toBeNull();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };

      mockAuthService.signIn.mockResolvedValueOnce(mockUser);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="login"
              credentials={{ email: 'test@example.com', password: 'password123' }}
            />
          </AuthProvider>
        );
      });

      // Wait for login to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(authState.isAuthenticated).toBe(true);
      expect(authState.user?.email).toBe('test@example.com');
    });

    it('should handle user not found error', async () => {
      const error = { code: 'auth/user-not-found', message: 'User not found' };
      mockAuthService.signIn.mockRejectedValueOnce(error);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="login"
              credentials={{ email: 'notfound@example.com', password: 'password123' }}
            />
          </AuthProvider>
        );
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(authState.error).toBe('No account found with this email');
      expect(authState.isAuthenticated).toBe(false);
    });

    it('should handle wrong password error', async () => {
      const error = { code: 'auth/wrong-password', message: 'Wrong password' };
      mockAuthService.signIn.mockRejectedValueOnce(error);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="login"
              credentials={{ email: 'test@example.com', password: 'wrongpassword' }}
            />
          </AuthProvider>
        );
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(authState.error).toBe('Incorrect password');
    });
  });

  describe('register', () => {
    it('should register successfully with valid credentials', async () => {
      const mockUser = {
        uid: 'new-user-uid',
        email: 'newuser@example.com',
        displayName: null,
      };

      mockAuthService.signUp.mockResolvedValueOnce(mockUser);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="register"
              credentials={{ email: 'newuser@example.com', password: 'password123', confirmPassword: 'password123' }}
            />
          </AuthProvider>
        );
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockAuthService.signUp).toHaveBeenCalledWith('newuser@example.com', 'password123');
      expect(authState.isAuthenticated).toBe(true);
    });

    it('should handle email already in use error', async () => {
      const error = { code: 'auth/email-already-in-use', message: 'Email in use' };
      mockAuthService.signUp.mockRejectedValueOnce(error);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="register"
              credentials={{ email: 'existing@example.com', password: 'password123', confirmPassword: 'password123' }}
            />
          </AuthProvider>
        );
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(authState.error).toBe('An account with this email already exists');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      // First login
      const mockUser = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
      };
      mockAuthService.signIn.mockResolvedValueOnce(mockUser);
      mockAuthService.signOut.mockResolvedValueOnce(undefined);

      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent
              onAuthState={(state) => { authState = state; }}
              testAction="logout"
              credentials={{ email: '', password: '' }}
            />
          </AuthProvider>
        );
      });

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
      });

      expect(mockAuthService.signOut).toHaveBeenCalled();
      expect(authState.isAuthenticated).toBe(false);
      expect(authState.user).toBeNull();
    });
  });

  describe('biometrics', () => {
    it('should have isBiometricsEnabled default to false', async () => {
      let authState: any = null;

      await act(async () => {
        TestRenderer.create(
          <AuthProvider>
            <TestComponent onAuthState={(state) => { authState = state; }} />
          </AuthProvider>
        );
      });

      expect(authState.isBiometricsEnabled).toBe(false);
    });
  });
});
