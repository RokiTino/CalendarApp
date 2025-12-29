import {
  formatDateString,
  parseDate,
  isSameDay,
  isToday,
  isWeekend,
  formatTime,
  formatDisplayDate,
  getTimeSlots,
  generateId,
  getMonthDays,
  DAYS_OF_WEEK,
  MONTHS,
} from '../src/utils/dateUtils';

describe('dateUtils', () => {
  describe('constants', () => {
    it('should have correct days of week', () => {
      expect(DAYS_OF_WEEK).toEqual(['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
      expect(DAYS_OF_WEEK).toHaveLength(7);
    });

    it('should have correct months', () => {
      expect(MONTHS).toHaveLength(12);
      expect(MONTHS[0]).toBe('January');
      expect(MONTHS[11]).toBe('December');
    });
  });

  describe('formatDateString', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date(2024, 0, 15); // January 15, 2024
      expect(formatDateString(date)).toBe('2024-01-15');
    });

    it('should pad single digit months and days', () => {
      const date = new Date(2024, 2, 5); // March 5, 2024
      expect(formatDateString(date)).toBe('2024-03-05');
    });

    it('should handle end of year dates', () => {
      const date = new Date(2024, 11, 31); // December 31, 2024
      expect(formatDateString(date)).toBe('2024-12-31');
    });
  });

  describe('parseDate', () => {
    it('should parse YYYY-MM-DD string to Date', () => {
      const result = parseDate('2024-01-15');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getDate()).toBe(15);
    });

    it('should handle different months correctly', () => {
      const result = parseDate('2024-12-25');
      expect(result.getMonth()).toBe(11); // December
      expect(result.getDate()).toBe(25);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2024, 5, 15, 10, 30);
      const date2 = new Date(2024, 5, 15, 18, 45);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different months', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 6, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for different years', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2025, 5, 15);
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isToday', () => {
    it('should return true for today', () => {
      const today = new Date();
      expect(isToday(today)).toBe(true);
    });

    it('should return false for yesterday', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      expect(isToday(yesterday)).toBe(false);
    });

    it('should return false for tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      expect(isToday(tomorrow)).toBe(false);
    });
  });

  describe('isWeekend', () => {
    it('should return true for Saturday', () => {
      const saturday = new Date(2024, 0, 6); // January 6, 2024 is Saturday
      expect(isWeekend(saturday)).toBe(true);
    });

    it('should return true for Sunday', () => {
      const sunday = new Date(2024, 0, 7); // January 7, 2024 is Sunday
      expect(isWeekend(sunday)).toBe(true);
    });

    it('should return false for weekdays', () => {
      const monday = new Date(2024, 0, 8); // January 8, 2024 is Monday
      const wednesday = new Date(2024, 0, 10);
      const friday = new Date(2024, 0, 12);
      expect(isWeekend(monday)).toBe(false);
      expect(isWeekend(wednesday)).toBe(false);
      expect(isWeekend(friday)).toBe(false);
    });
  });

  describe('formatTime', () => {
    it('should format morning time correctly', () => {
      expect(formatTime('09:30')).toBe('9:30 AM');
      expect(formatTime('00:00')).toBe('12:00 AM');
      expect(formatTime('11:59')).toBe('11:59 AM');
    });

    it('should format afternoon/evening time correctly', () => {
      expect(formatTime('12:00')).toBe('12:00 PM');
      expect(formatTime('13:30')).toBe('1:30 PM');
      expect(formatTime('23:59')).toBe('11:59 PM');
    });

    it('should pad minutes correctly', () => {
      expect(formatTime('09:05')).toBe('9:05 AM');
      expect(formatTime('14:00')).toBe('2:00 PM');
    });
  });

  describe('formatDisplayDate', () => {
    it('should format date for display', () => {
      const date = new Date(2024, 0, 15); // Monday, January 15, 2024
      expect(formatDisplayDate(date)).toBe('Mon, January 15, 2024');
    });

    it('should handle different days of week', () => {
      const saturday = new Date(2024, 0, 6);
      expect(formatDisplayDate(saturday)).toContain('Sat');
    });
  });

  describe('getTimeSlots', () => {
    it('should generate 48 time slots (30 min intervals for 24 hours)', () => {
      const slots = getTimeSlots();
      expect(slots).toHaveLength(48);
    });

    it('should start with 00:00', () => {
      const slots = getTimeSlots();
      expect(slots[0]).toBe('00:00');
    });

    it('should end with 23:30', () => {
      const slots = getTimeSlots();
      expect(slots[slots.length - 1]).toBe('23:30');
    });

    it('should include noon', () => {
      const slots = getTimeSlots();
      expect(slots).toContain('12:00');
      expect(slots).toContain('12:30');
    });
  });

  describe('generateId', () => {
    it('should generate unique ids', () => {
      const id1 = generateId();
      const id2 = generateId();
      expect(id1).not.toBe(id2);
    });

    it('should generate string ids', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
    });

    it('should contain a hyphen', () => {
      const id = generateId();
      expect(id).toContain('-');
    });
  });

  describe('getMonthDays', () => {
    it('should return 42 days (6 weeks grid)', () => {
      const days = getMonthDays(2024, 0, null, []); // January 2024
      expect(days).toHaveLength(42);
    });

    it('should mark current month days correctly', () => {
      const days = getMonthDays(2024, 0, null, []); // January 2024
      const currentMonthDays = days.filter(d => d.isCurrentMonth);
      expect(currentMonthDays.length).toBe(31); // January has 31 days
    });

    it('should mark selected date correctly', () => {
      const selectedDate = new Date(2024, 0, 15);
      const days = getMonthDays(2024, 0, selectedDate, []);
      const selectedDay = days.find(d => d.isSelected);
      expect(selectedDay).toBeDefined();
      expect(selectedDay?.day).toBe(15);
    });

    it('should mark weekends correctly', () => {
      const days = getMonthDays(2024, 0, null, []); // January 2024
      const weekendDays = days.filter(d => d.isWeekend);
      expect(weekendDays.length).toBeGreaterThan(0);
    });

    it('should attach meetings to correct days', () => {
      const meetings = [
        {
          id: '1',
          title: 'Test Meeting',
          date: '2024-01-15',
          startTime: '09:00',
          endTime: '10:00',
          userId: 'user1',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01',
        },
      ];
      const days = getMonthDays(2024, 0, null, meetings);
      const dayWithMeeting = days.find(d => d.dateString === '2024-01-15');
      expect(dayWithMeeting?.meetings).toHaveLength(1);
    });
  });
});
