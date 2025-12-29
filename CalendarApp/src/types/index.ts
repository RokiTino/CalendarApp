// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  createdAt: string;
  lastLoginAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  confirmPassword: string;
}

// Meeting/Event types
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: string; // ISO date string
  endTime: string; // ISO date string
  date: string; // YYYY-MM-DD format
  color?: string;
  location?: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface MeetingFormData {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  color?: string;
  location?: string;
}

// Calendar types
export interface CalendarDay {
  date: Date;
  dateString: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isWeekend: boolean;
  meetings: Meeting[];
}

export interface CalendarMonth {
  year: number;
  month: number;
  days: CalendarDay[];
}

export type CalendarViewMode = 'day' | 'month';

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
  Calendar: undefined;
  Profile: undefined;
};

export type CalendarStackParamList = {
  CalendarHome: undefined;
  MeetingForm: { meeting?: Meeting; date?: string };
  MeetingDetail: { meetingId: string };
};

// Form validation types
export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState<T> {
  values: T;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  isValid: boolean;
  isSubmitting: boolean;
}
