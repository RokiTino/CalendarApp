// Jest setup file for React Native

// Mock React Native modules
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    NativeModules: {
      ...RN.NativeModules,
      RNFBAppModule: {
        NATIVE_FIREBASE_APPS: [],
        FIREBASE_RAW_JSON: '{}',
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
      RNFBAuthModule: {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
      RNFBFirestoreModule: {
        addListener: jest.fn(),
        removeListeners: jest.fn(),
      },
    },
  };
});

// Mock Firebase Auth
jest.mock('@react-native-firebase/auth', () => {
  const mockUser = {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
  };

  const mockAuth = {
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn(); // unsubscribe function
    }),
    currentUser: null,
  };

  return () => mockAuth;
});

// Mock Firebase Firestore
jest.mock('@react-native-firebase/firestore', () => {
  const mockFirestore = {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({ data: () => ({}), exists: true })),
        set: jest.fn(() => Promise.resolve()),
        update: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
      })),
      add: jest.fn(() => Promise.resolve({ id: 'mock-doc-id' })),
      where: jest.fn(() => ({
        orderBy: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({ docs: [] })),
          onSnapshot: jest.fn((callback) => {
            callback({ docs: [] });
            return jest.fn();
          }),
        })),
      })),
    })),
  };

  return () => mockFirestore;
});

// Mock react-native-vector-icons
jest.mock('react-native-vector-icons/Ionicons', () => 'Icon');
jest.mock('react-native-vector-icons/MaterialIcons', () => 'Icon');
jest.mock('react-native-vector-icons/FontAwesome', () => 'Icon');

// Mock @react-navigation
jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      goBack: jest.fn(),
      setOptions: jest.fn(),
    }),
    useRoute: () => ({
      params: {},
    }),
    useFocusEffect: jest.fn(),
  };
});

// Silence console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
