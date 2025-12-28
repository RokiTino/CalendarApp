import {
  validateEmail,
  validatePassword,
  validateSignIn,
  validateSignUp,
  validateEvent,
  sanitizeInput,
} from '../src/utils/validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('returns valid for correct email formats', () => {
      expect(validateEmail('test@example.com').isValid).toBe(true);
      expect(validateEmail('user.name@domain.org').isValid).toBe(true);
      expect(validateEmail('user+tag@example.co.uk').isValid).toBe(true);
    });

    it('returns invalid for incorrect email formats', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('notanemail').isValid).toBe(false);
      expect(validateEmail('missing@domain').isValid).toBe(false);
      expect(validateEmail('@nodomain.com').isValid).toBe(false);
      expect(validateEmail('spaces in@email.com').isValid).toBe(false);
    });

    it('returns appropriate error messages', () => {
      expect(validateEmail('').error).toBe('Email is required');
      expect(validateEmail('invalid').error).toBe('Please enter a valid email address');
    });
  });

  describe('validatePassword', () => {
    it('returns valid for strong passwords', () => {
      expect(validatePassword('Password123').isValid).toBe(true);
      expect(validatePassword('MyStr0ngP@ss').isValid).toBe(true);
      expect(validatePassword('Abcdef1234').isValid).toBe(true);
    });

    it('returns invalid for weak passwords', () => {
      expect(validatePassword('').isValid).toBe(false);
      expect(validatePassword('short').isValid).toBe(false);
      expect(validatePassword('alllowercase123').isValid).toBe(false);
      expect(validatePassword('ALLUPPERCASE123').isValid).toBe(false);
      expect(validatePassword('NoNumbers').isValid).toBe(false);
    });

    it('returns appropriate error messages', () => {
      expect(validatePassword('').error).toBe('Password is required');
      expect(validatePassword('short').error).toContain('at least 8 characters');
    });
  });

  describe('validateSignIn', () => {
    it('returns valid for correct credentials format', () => {
      const result = validateSignIn({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });

    it('returns errors for missing email', () => {
      const result = validateSignIn({
        email: '',
        password: 'password123',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });

    it('returns errors for missing password', () => {
      const result = validateSignIn({
        email: 'test@example.com',
        password: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    it('returns multiple errors when both fields invalid', () => {
      const result = validateSignIn({
        email: '',
        password: '',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
      expect(result.errors.password).toBeDefined();
    });
  });

  describe('validateSignUp', () => {
    it('returns valid for correct signup data', () => {
      const result = validateSignUp({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.isValid).toBe(true);
    });

    it('returns error for mismatched passwords', () => {
      const result = validateSignUp({
        email: 'test@example.com',
        password: 'Password123',
        confirmPassword: 'DifferentPassword123',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.confirmPassword).toContain('match');
    });

    it('returns error for weak password', () => {
      const result = validateSignUp({
        email: 'test@example.com',
        password: 'weak',
        confirmPassword: 'weak',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.password).toBeDefined();
    });

    it('returns error for invalid email', () => {
      const result = validateSignUp({
        email: 'invalid-email',
        password: 'Password123',
        confirmPassword: 'Password123',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeDefined();
    });
  });

  describe('validateEvent', () => {
    const validEvent = {
      title: 'Test Event',
      description: 'A test event description',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      color: '#4A90D9',
    };

    it('returns valid for correct event data', () => {
      const result = validateEvent(validEvent);
      expect(result.isValid).toBe(true);
    });

    it('returns error for missing title', () => {
      const result = validateEvent({ ...validEvent, title: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toBeDefined();
    });

    it('returns error for title too long', () => {
      const result = validateEvent({
        ...validEvent,
        title: 'A'.repeat(101),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.title).toContain('100 characters');
    });

    it('returns error for description too long', () => {
      const result = validateEvent({
        ...validEvent,
        description: 'A'.repeat(501),
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.description).toContain('500 characters');
    });

    it('returns error for missing date', () => {
      const result = validateEvent({ ...validEvent, date: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.date).toBeDefined();
    });

    it('returns error for missing start time', () => {
      const result = validateEvent({ ...validEvent, startTime: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.startTime).toBeDefined();
    });

    it('returns error for missing end time', () => {
      const result = validateEvent({ ...validEvent, endTime: '' });
      expect(result.isValid).toBe(false);
      expect(result.errors.endTime).toBeDefined();
    });

    it('returns error when end time is before start time', () => {
      const result = validateEvent({
        ...validEvent,
        startTime: '10:00',
        endTime: '09:00',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.endTime).toContain('after');
    });

    it('returns error when start and end time are equal', () => {
      const result = validateEvent({
        ...validEvent,
        startTime: '10:00',
        endTime: '10:00',
      });
      expect(result.isValid).toBe(false);
      expect(result.errors.endTime).toBeDefined();
    });

    it('allows optional description', () => {
      const result = validateEvent({ ...validEvent, description: '' });
      expect(result.isValid).toBe(true);
    });
  });

  describe('sanitizeInput', () => {
    it('trims whitespace', () => {
      expect(sanitizeInput('  hello  ')).toBe('hello');
    });

    it('removes HTML tags', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('');
      expect(sanitizeInput('<b>bold</b>')).toBe('bold');
    });

    it('handles empty input', () => {
      expect(sanitizeInput('')).toBe('');
    });

    it('handles null/undefined', () => {
      expect(sanitizeInput(null as any)).toBe('');
      expect(sanitizeInput(undefined as any)).toBe('');
    });

    it('preserves normal text', () => {
      expect(sanitizeInput('Hello World')).toBe('Hello World');
    });

    it('handles special characters', () => {
      expect(sanitizeInput('Test & Event @ 10:00')).toBe('Test & Event @ 10:00');
    });
  });
});
