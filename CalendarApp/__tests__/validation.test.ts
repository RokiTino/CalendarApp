import {
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateRequired,
  validateMeetingForm,
} from '../src/utils/validation';

describe('validation utilities', () => {
  describe('validateEmail', () => {
    it('should return error when email is empty', () => {
      expect(validateEmail('')).toBe('Email is required');
    });

    it('should return error for invalid email format', () => {
      expect(validateEmail('invalid')).toBe('Please enter a valid email address');
      expect(validateEmail('invalid@')).toBe('Please enter a valid email address');
      expect(validateEmail('@domain.com')).toBe('Please enter a valid email address');
      expect(validateEmail('no spaces@domain.com')).toBe('Please enter a valid email address');
    });

    it('should return null for valid email', () => {
      expect(validateEmail('test@example.com')).toBeNull();
      expect(validateEmail('user.name@domain.co.uk')).toBeNull();
      expect(validateEmail('user+tag@example.org')).toBeNull();
    });
  });

  describe('validatePassword', () => {
    it('should return error when password is empty', () => {
      expect(validatePassword('')).toBe('Password is required');
    });

    it('should return error when password is too short', () => {
      expect(validatePassword('12345')).toBe('Password must be at least 6 characters');
      expect(validatePassword('abc')).toBe('Password must be at least 6 characters');
    });

    it('should return null for valid password', () => {
      expect(validatePassword('123456')).toBeNull();
      expect(validatePassword('securePassword123!')).toBeNull();
    });
  });

  describe('validateConfirmPassword', () => {
    it('should return error when confirm password is empty', () => {
      expect(validateConfirmPassword('password', '')).toBe('Please confirm your password');
    });

    it('should return error when passwords do not match', () => {
      expect(validateConfirmPassword('password1', 'password2')).toBe('Passwords do not match');
    });

    it('should return null when passwords match', () => {
      expect(validateConfirmPassword('password', 'password')).toBeNull();
      expect(validateConfirmPassword('SecurePass123!', 'SecurePass123!')).toBeNull();
    });
  });

  describe('validateRequired', () => {
    it('should return error when value is empty', () => {
      expect(validateRequired('', 'Title')).toBe('Title is required');
      expect(validateRequired('   ', 'Description')).toBe('Description is required');
    });

    it('should return null when value is provided', () => {
      expect(validateRequired('Some value', 'Title')).toBeNull();
      expect(validateRequired('  trimmed  ', 'Field')).toBeNull();
    });
  });

  describe('validateMeetingForm', () => {
    it('should return errors for empty fields', () => {
      const errors = validateMeetingForm('', '', '', '');
      expect(errors).toHaveLength(4);
      expect(errors).toContainEqual({ field: 'title', message: 'Title is required' });
      expect(errors).toContainEqual({ field: 'date', message: 'Date is required' });
      expect(errors).toContainEqual({ field: 'startTime', message: 'Start time is required' });
      expect(errors).toContainEqual({ field: 'endTime', message: 'End time is required' });
    });

    it('should return error when end time is before start time', () => {
      const errors = validateMeetingForm('Meeting', '2024-01-15', '14:00', '13:00');
      expect(errors).toContainEqual({
        field: 'endTime',
        message: 'End time must be after start time',
      });
    });

    it('should return error when end time equals start time', () => {
      const errors = validateMeetingForm('Meeting', '2024-01-15', '14:00', '14:00');
      expect(errors).toContainEqual({
        field: 'endTime',
        message: 'End time must be after start time',
      });
    });

    it('should return empty array for valid meeting form', () => {
      const errors = validateMeetingForm('Team Meeting', '2024-01-15', '09:00', '10:00');
      expect(errors).toHaveLength(0);
    });
  });
});
