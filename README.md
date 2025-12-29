# CalendarApp

A React Native calendar application with authentication, biometrics support, and meeting management.

## Features

- ✅ User Registration and Sign In
- ✅ Token-based Authentication (AsyncStorage)
- ✅ Biometric Authentication (Face ID / Touch ID / Fingerprint)
- ✅ Custom Calendar Component (no third-party libraries)
- ✅ Month and Day view toggle
- ✅ Create, Edit, and Delete meetings/events
- ✅ Profile screen with logout functionality
- ✅ Proper handling of device notches (Safe Area)
- ✅ Screen transition animations
- ✅ Field validation
- ✅ TypeScript support
- ✅ Unit tests with 5%+ coverage

## Requirements

### Software Versions
- **Node.js**: >= 18.0.0
- **yarn**: >= 9.0.0
- **React Native**: 0.73.2
- **React**: 18.2.0
- **TypeScript**: 5.0.4
- **Java JDK**: 17 (for Android)
- **Xcode**: 15.0+ (for iOS)
- **CocoaPods**: 1.14.0+ (for iOS)

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd CalendarApp
```

### 2. Install dependencies
```bash
yarn install
```

### 3. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

## Running the App

### Start Metro Bundler
```bash
yarn start
```

### Run on Android
```bash
yarn run android
```

### Run on iOS
```bash
yarn run ios
```

## Authentication

The app uses **AsyncStorage** for authentication by default:
- Users are stored locally on the device
- Token-based session management
- Password hashing for security
- Works immediately without any configuration

1. Enable Email/Password authentication
2. Add `google-services.json` to `android/app/`
3. Add `GoogleService-Info.plist` to `ios/CalendarApp/`
4. Update `package.json` to add Firebase dependencies
5. Set `USE_FIREBASE = true` in `src/context/AuthContext.tsx`

## Testing

### Run tests
```bash
yarn test
```

### Run tests with coverage
```bash
yarn run test:coverage
```

## Project Structure

```
CalendarApp/
├── android/              # Android native code
├── ios/                  # iOS native code
├── src/
│   ├── components/       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Calendar.tsx  # Custom calendar (no third-party)
│   │   ├── Header.tsx
│   │   ├── Input.tsx
│   │   ├── MeetingCard.tsx
│   │   └── TimePicker.tsx
│   ├── context/          # React contexts
│   │   ├── AuthContext.tsx
│   │   └── MeetingsContext.tsx
│   ├── navigation/       # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/          # App screens
│   │   ├── CalendarScreen.tsx
│   │   ├── CreateMeetingScreen.tsx
│   │   ├── EditMeetingScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SignInScreen.tsx
│   │   └── SignUpScreen.tsx
│   ├── services/         # External services
│   │   └── biometricService.ts
│   ├── types/            # TypeScript types
│   ├── utils/            # Utility functions
│   └── App.tsx           # App entry
├── package.json
├── tsconfig.json
└── README.md
```

## Screenshots

To capture screenshots after running the app:

- **iOS Simulator**: Press `Cmd + S`
- **Android Emulator**: Press `Cmd + S` (Mac) or `Ctrl + S` (Windows/Linux)

## License

MIT License
