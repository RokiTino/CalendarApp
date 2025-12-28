import { ValidationResult, SignInCredentials, SignUpCredentials, CreateEventInput } from '../types';
import { isValidTime, compareTimes } from './dateUtils';

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
export const isValidPassword = (password: string): boolean => {
  if (password.length < 8) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[0-9]/.test(password)) return false;
  return true;
};

/**
 * Get password validation errors
 */
export const getPasswordErrors = (password: string): string[] => {
  const errors: string[] = [];
  if (password.length < 8) errors.push('Password must be at least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('Password must contain an uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('Password must contain a lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('Password must contain a number');
  return errors;
};

/**
 * Validate sign in form
 */
export const validateSignIn = (credentials: SignInCredentials): ValidationResult => {
  const errors: { [key: string]: string } = {};

  if (!credentials.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(credentials.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate sign up form
 */
export const validateSignUp = (credentials: SignUpCredentials): ValidationResult => {
  const errors: { [key: string]: string } = {};

  if (!credentials.email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(credentials.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!credentials.password) {
    errors.password = 'Password is required';
  } else if (!isValidPassword(credentials.password)) {
    const passwordErrors = getPasswordErrors(credentials.password);
    errors.password = passwordErrors[0];
  }

  if (!credentials.confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (credentials.password !== credentials.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate event form
 */
export const validateEvent = (event: CreateEventInput): ValidationResult => {
  const errors: { [key: string]: string } = {};

  if (!event.title.trim()) {
    errors.title = 'Title is required';
  } else if (event.title.length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }

  if (event.description && event.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }

  if (!event.date) {
    errors.date = 'Date is required';
  }

  if (!event.startTime) {
    errors.startTime = 'Start time is required';
  } else if (!isValidTime(event.startTime)) {
    errors.startTime = 'Invalid start time format';
  }

  if (!event.endTime) {
    errors.endTime = 'End time is required';
  } else if (!isValidTime(event.endTime)) {
    errors.endTime = 'Invalid end time format';
  }

  if (event.startTime && event.endTime && isValidTime(event.startTime) && isValidTime(event.endTime)) {
    if (compareTimes(event.startTime, event.endTime) >= 0) {
      errors.endTime = 'End time must be after start time';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Sanitize input string
 */
export const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};
