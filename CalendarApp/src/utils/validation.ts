import { ValidationError } from '../types';

export const validateEmail = (email: string): string | null => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return null;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword) {
    return 'Please confirm your password';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }
  return null;
};

export const validateRequired = (
  value: string,
  fieldName: string
): string | null => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return null;
};

export const validateMeetingForm = (
  title: string,
  date: string,
  startTime: string,
  endTime: string
): ValidationError[] => {
  const errors: ValidationError[] = [];

  const titleError = validateRequired(title, 'Title');
  if (titleError) {
    errors.push({ field: 'title', message: titleError });
  }

  const dateError = validateRequired(date, 'Date');
  if (dateError) {
    errors.push({ field: 'date', message: dateError });
  }

  const startTimeError = validateRequired(startTime, 'Start time');
  if (startTimeError) {
    errors.push({ field: 'startTime', message: startTimeError });
  }

  const endTimeError = validateRequired(endTime, 'End time');
  if (endTimeError) {
    errors.push({ field: 'endTime', message: endTimeError });
  }

  // Check if end time is after start time
  if (startTime && endTime && startTime >= endTime) {
    errors.push({
      field: 'endTime',
      message: 'End time must be after start time',
    });
  }

  return errors;
};
