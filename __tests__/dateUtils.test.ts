import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isSameDay,
  isToday,
  formatDateToISO,
  parseISODate,
  getMonthName,
  getShortMonthName,
  getDayName,
  getShortDayName,
  formatTime12Hour,
  formatDateDisplay,
  getPreviousMonth,
  getNextMonth,
  sortEventsByTime,
  isValidTime,
  compareTimes,
  generateTimeSlots,
  generateCalendarMonth,
} from '../src/utils/dateUtils';
import { CalendarEvent } from '../src/types';

describe('Date Utilities', () => {
  describe('getDaysInMonth', () => {
    it('should return 31 days for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should return 28 days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });

    it('should return 29 days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return 30 days for April', () => {
      expect(getDaysInMonth(2024, 3)).toBe(30);
    });
  });

  describe('getFirstDayOfMonth', () => {
    it('should return correct day for January 2024', () => {
      // January 1, 2024 is a Monday (1)
      expect(getFirstDayOfMonth(2024, 0)).toBe(1);
    });

    it('should return correct day for December 2024', () => {
      // December 1, 2024 is a Sunday (0)
      expect(getFirstDayOfMonth(2024, 11)).toBe(0);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 15);
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 5, 16);
      expect(isSameDay(date1, date2)).toBe(false);
    });

    it('should return false for same day different month', () => {
      const date1 = new Date(2024, 5, 15);
      const date2 = new Date(2024, 6, 15);
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
  });

  describe('formatDateToISO', () => {
    it('should format date correctly', () => {
      const date = new Date(2024, 5, 15);
      expect(formatDateToISO(date)).toBe('2024-06-15');
    });

    it('should pad single digit months', () => {
      const date = new Date(2024, 0, 5);
      expect(formatDateToISO(date)).toBe('2024-01-05');
    });
  });

  describe('parseISODate', () => {
    it('should parse ISO date string correctly', () => {
      const date = parseISODate('2024-06-15');
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(5);
      expect(date.getDate()).toBe(15);
    });
  });

  describe('getMonthName', () => {
    it('should return January for month 0', () => {
      expect(getMonthName(0)).toBe('January');
    });

    it('should return December for month 11', () => {
      expect(getMonthName(11)).toBe('December');
    });
  });

  describe('getShortMonthName', () => {
    it('should return Jan for month 0', () => {
      expect(getShortMonthName(0)).toBe('Jan');
    });

    it('should return Dec for month 11', () => {
      expect(getShortMonthName(11)).toBe('Dec');
    });
  });

  describe('getDayName', () => {
    it('should return Sunday for day 0', () => {
      expect(getDayName(0)).toBe('Sunday');
    });

    it('should return Saturday for day 6', () => {
      expect(getDayName(6)).toBe('Saturday');
    });
  });

  describe('getShortDayName', () => {
    it('should return Sun for day 0', () => {
      expect(getShortDayName(0)).toBe('Sun');
    });

    it('should return Sat for day 6', () => {
      expect(getShortDayName(6)).toBe('Sat');
    });
  });

  describe('formatTime12Hour', () => {
    it('should format AM time correctly', () => {
      expect(formatTime12Hour('09:30')).toBe('9:30 AM');
    });

    it('should format PM time correctly', () => {
      expect(formatTime12Hour('14:45')).toBe('2:45 PM');
    });

    it('should format noon correctly', () => {
      expect(formatTime12Hour('12:00')).toBe('12:00 PM');
    });

    it('should format midnight correctly', () => {
      expect(formatTime12Hour('00:00')).toBe('12:00 AM');
    });
  });

  describe('formatDateDisplay', () => {
    it('should format date display correctly', () => {
      const date = new Date(2024, 5, 15); // Saturday
      expect(formatDateDisplay(date)).toBe('Saturday, June 15, 2024');
    });
  });

  describe('getPreviousMonth', () => {
    it('should return previous month in same year', () => {
      expect(getPreviousMonth(2024, 5)).toEqual({ year: 2024, month: 4 });
    });

    it('should return December of previous year for January', () => {
      expect(getPreviousMonth(2024, 0)).toEqual({ year: 2023, month: 11 });
    });
  });

  describe('getNextMonth', () => {
    it('should return next month in same year', () => {
      expect(getNextMonth(2024, 5)).toEqual({ year: 2024, month: 6 });
    });

    it('should return January of next year for December', () => {
      expect(getNextMonth(2024, 11)).toEqual({ year: 2025, month: 0 });
    });
  });

  describe('isValidTime', () => {
    it('should return true for valid time', () => {
      expect(isValidTime('09:30')).toBe(true);
      expect(isValidTime('14:45')).toBe(true);
      expect(isValidTime('00:00')).toBe(true);
      expect(isValidTime('23:59')).toBe(true);
    });

    it('should return false for invalid time', () => {
      expect(isValidTime('25:00')).toBe(false);
      expect(isValidTime('12:60')).toBe(false);
      expect(isValidTime('invalid')).toBe(false);
    });
  });

  describe('compareTimes', () => {
    it('should return -1 when time1 is earlier', () => {
      expect(compareTimes('09:00', '10:00')).toBe(-1);
      expect(compareTimes('09:30', '09:45')).toBe(-1);
    });

    it('should return 1 when time1 is later', () => {
      expect(compareTimes('10:00', '09:00')).toBe(1);
      expect(compareTimes('09:45', '09:30')).toBe(1);
    });

    it('should return 0 when times are equal', () => {
      expect(compareTimes('09:30', '09:30')).toBe(0);
    });
  });

  describe('generateTimeSlots', () => {
    it('should generate 48 time slots', () => {
      const slots = generateTimeSlots();
      expect(slots.length).toBe(48);
    });

    it('should start with 00:00', () => {
      const slots = generateTimeSlots();
      expect(slots[0]).toBe('00:00');
    });

    it('should end with 23:30', () => {
      const slots = generateTimeSlots();
      expect(slots[slots.length - 1]).toBe('23:30');
    });
  });

  describe('sortEventsByTime', () => {
    it('should sort events by start time', () => {
      const events: CalendarEvent[] = [
        {
          id: '1',
          userId: 'user1',
          title: 'Event 1',
          description: '',
          date: '2024-06-15',
          startTime: '14:00',
          endTime: '15:00',
          color: '#FF6B6B',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: 'user1',
          title: 'Event 2',
          description: '',
          date: '2024-06-15',
          startTime: '09:00',
          endTime: '10:00',
          color: '#4ECDC4',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const sorted = sortEventsByTime(events);
      expect(sorted[0].id).toBe('2');
      expect(sorted[1].id).toBe('1');
    });
  });

  describe('generateCalendarMonth', () => {
    it('should generate 42 days (6 weeks)', () => {
      const month = generateCalendarMonth(2024, 5, new Date(2024, 5, 15), []);
      expect(month.days.length).toBe(42);
    });

    it('should include correct month metadata', () => {
      const month = generateCalendarMonth(2024, 5, new Date(2024, 5, 15), []);
      expect(month.year).toBe(2024);
      expect(month.month).toBe(5);
    });

    it('should mark selected date correctly', () => {
      const selectedDate = new Date(2024, 5, 15);
      const month = generateCalendarMonth(2024, 5, selectedDate, []);
      const selectedDay = month.days.find(d => d.isSelected);
      expect(selectedDay).toBeDefined();
      expect(selectedDay?.day).toBe(15);
    });
  });
});
