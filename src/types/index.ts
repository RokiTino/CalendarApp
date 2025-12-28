// User types
export interface User {
  uid: string;
  email: string;
  displayName?: string;
  createdAt?: Date;
}

// Event/Meeting types
export interface CalendarEvent {
  id: string;
  userId: string;
  title: string;
  description: string;
  date: string; // ISO date string YYYY-MM-DD
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEventInput {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  color?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  id: string;
}

// Calendar types
export interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
  events: CalendarEvent[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

// Auth types
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

export type MainTabParamList = {
  CalendarTab: undefined;
  ProfileTab: undefined;
};

export type CalendarStackParamList = {
  CalendarHome: undefined;
  CreateEvent: { date?: string };
  EditEvent: { eventId: string };
};

// Theme types
export interface Theme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
    white: string;
    black: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    full: number;
  };
  typography: {
    h1: {
      fontSize: number;
      fontWeight: string;
    };
    h2: {
      fontSize: number;
      fontWeight: string;
    };
    h3: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
}

// Biometric types
export interface BiometricResult {
  available: boolean;
  biometryType?: string;
  error?: string;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: { [key: string]: string };
}

// Event colors
export const EVENT_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#96CEB4', // Green
  '#FFEAA7', // Yellow
  '#DDA0DD', // Plum
  '#98D8C8', // Mint
  '#F7DC6F', // Gold
] as const;

export type EventColor = typeof EVENT_COLORS[number];
