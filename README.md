# React Native Calendar App

A React Native application with authentication, biometrics, and a custom calendar component for managing meetings/events.

## Screenshots

### Authentication Screens
| Sign In | Sign Up | Biometric |
|---------|---------|-----------|
| Email/Password login | Create new account | Fingerprint/Face ID |

### Main Screens
| Calendar (Month View) | Calendar (Day View) | Profile |
|----------------------|---------------------|---------|
| Monthly overview | Daily events list | User info & logout |

### Event Management
| Create Event | Edit Event |
|--------------|------------|
| New meeting form | Modify existing |

## Software Versions

| Software | Version |
|----------|---------|
| Node.js | 18.x or 20.x LTS |
| npm | 9.x or 10.x |
| React Native | 0.73.6 |
| React | 18.2.0 |
| TypeScript | 5.0.4 |
| Java JDK | 17 |
| Android Studio | Hedgehog or newer |
| Xcode | 15.0+ (for iOS) |
| CocoaPods | 1.14.0+ |
| Ruby | 2.7.0+ |

## Prerequisites

### For macOS (iOS & Android)
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node@18

# Install Watchman
brew install watchman

# Install CocoaPods
sudo gem install cocoapods

# Install Java 17
brew install openjdk@17
```

### For Windows/Linux (Android only)
```bash
# Install Node.js from https://nodejs.org/
# Install Java JDK 17 from https://adoptium.net/
# Install Android Studio from https://developer.android.com/studio
```

### Android Studio Setup
1. Install Android Studio
2. Open SDK Manager
3. Install:
   - Android SDK Platform 34
   - Android SDK Build-Tools 34.0.0
   - Android Emulator
   - Android SDK Platform-Tools

4. Set environment variables:
```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd CalendarApp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication with Email/Password
4. Enable Firestore Database

#### For Android:
1. Add Android app in Firebase Console
2. Download `google-services.json`
3. Place it in `android/app/`

#### For iOS:
1. Add iOS app in Firebase Console
2. Download `GoogleService-Info.plist`
3. Place it in `ios/CalendarApp/`

### 4. iOS Setup (macOS only)
```bash
cd ios
pod install
cd ..
```

### 5. Run the application

#### Android
```bash
# Start Metro bundler
npm start

# In another terminal
npm run android
```

#### iOS (macOS only)
```bash
# Start Metro bundler
npm start

# In another terminal
npm run ios
```

## Project Structure

```
CalendarApp/
├── __tests__/                 # Test files
│   ├── App.test.tsx
│   ├── Calendar.test.tsx
│   ├── AuthService.test.ts
│   ├── EventService.test.ts
│   └── utils.test.ts
├── android/                   # Android native code
├── ios/                       # iOS native code
├── src/
│   ├── components/            # Reusable components
│   │   ├── Calendar/
│   │   │   ├── Calendar.tsx
│   │   │   ├── CalendarDay.tsx
│   │   │   ├── CalendarHeader.tsx
│   │   │   └── styles.ts
│   │   ├── EventCard/
│   │   │   ├── EventCard.tsx
│   │   │   └── styles.ts
│   │   ├── Header/
│   │   │   ├── Header.tsx
│   │   │   └── styles.ts
│   │   ├── Input/
│   │   │   ├── Input.tsx
│   │   │   └── styles.ts
│   │   └── Button/
│   │       ├── Button.tsx
│   │       └── styles.ts
│   ├── navigation/            # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── screens/               # Screen components
│   │   ├── Auth/
│   │   │   ├── SignInScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── styles.ts
│   │   ├── Calendar/
│   │   │   ├── CalendarScreen.tsx
│   │   │   └── styles.ts
│   │   ├── Event/
│   │   │   ├── CreateEventScreen.tsx
│   │   │   ├── EditEventScreen.tsx
│   │   │   └── styles.ts
│   │   └── Profile/
│   │       ├── ProfileScreen.tsx
│   │       └── styles.ts
│   ├── services/              # Business logic
│   │   ├── AuthService.ts
│   │   ├── BiometricService.ts
│   │   ├── EventService.ts
│   │   └── firebase.ts
│   ├── context/               # React Context
│   │   ├── AuthContext.tsx
│   │   └── EventContext.tsx
│   ├── hooks/                 # Custom hooks
│   │   ├── useAuth.ts
│   │   └── useEvents.ts
│   ├── types/                 # TypeScript types
│   │   └── index.ts
│   ├── utils/                 # Utility functions
│   │   ├── dateUtils.ts
│   │   └── validation.ts
│   └── theme/                 # Theme configuration
│       └── index.ts
├── App.tsx                    # App entry point
├── index.js                   # React Native entry
├── package.json
├── tsconfig.json
├── babel.config.js
├── metro.config.js
├── jest.config.js
└── README.md
```

## Features

### ✅ Authentication
- Email/Password Sign Up
- Email/Password Sign In
- Biometric Authentication (Face ID / Fingerprint)
- Secure token storage
- Auto sign-in with biometrics

### ✅ Calendar
- Custom-built calendar component (no third-party library)
- Month view with day selection
- Day view with event list
- Smooth animations between views
- Current day highlighting

### ✅ Events/Meetings
- Create new events with title, description, date, time
- Edit existing events
- Delete events
- View events for selected day
- Color-coded events

### ✅ Profile
- View user information
- Logout functionality
- Biometric settings toggle

### ✅ UI/UX
- Custom UI components
- Safe area handling for notches
- Header and bottom navigation bar
- Screen transition animations
- Responsive design

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- Calendar.test.tsx
```

## Test Coverage

The project maintains minimum 5% test coverage as required:
- Unit tests for utility functions
- Component tests for Calendar
- Service tests for Authentication
- Service tests for Events

## Troubleshooting

### Metro bundler issues
```bash
npm start -- --reset-cache
```

### Android build issues
```bash
cd android
./gradlew clean
cd ..
npm run android
```

### iOS build issues
```bash
cd ios
pod deintegrate
pod install
cd ..
npm run ios
```

### Firebase connection issues
- Verify `google-services.json` is in `android/app/`
- Verify `GoogleService-Info.plist` is in `ios/CalendarApp/`
- Check Firebase Console for correct package name/bundle ID

## License

MIT License

## Author

Developed as a React Native developer assessment task.
