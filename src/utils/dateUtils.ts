import { CalendarDay, CalendarEvent, CalendarMonth } from '../types';

/**
 * Get the number of days in a month
 */
export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

/**
 * Get the day of the week for the first day of the month (0 = Sunday, 6 = Saturday)
 */
export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

/**
 * Format date to ISO string (YYYY-MM-DD)
 */
export const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Parse ISO date string to Date object
 */
export const parseISODate = (dateString: string): Date => {
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Get month name from month number (0-11)
 */
export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month];
};

/**
 * Get short month name
 */
export const getShortMonthName = (month: number): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  return months[month];
};

/**
 * Get day name from day number (0-6)
 */
export const getDayName = (day: number): string => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[day];
};

/**
 * Get short day name
 */
export const getShortDayName = (day: number): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[day];
};

/**
 * Format time string (HH:MM) to 12-hour format
 */
export const formatTime12Hour = (time: string): string => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

/**
 * Format date to display string
 */
export const formatDateDisplay = (date: Date): string => {
  const dayName = getDayName(date.getDay());
  const monthName = getMonthName(date.getMonth());
  const day = date.getDate();
  const year = date.getFullYear();
  return `${dayName}, ${monthName} ${day}, ${year}`;
};

/**
 * Generate calendar month data
 */
export const generateCalendarMonth = (
  year: number,
  month: number,
  selectedDate: Date,
  events: CalendarEvent[]
): CalendarMonth => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = getFirstDayOfMonth(year, month);
  const today = new Date();
  
  const days: CalendarDay[] = [];
  
  // Add days from previous month
  const prevMonth = month === 0 ? 11 : month - 1;
  const prevMonthYear = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
  
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(prevMonthYear, prevMonth, day);
    const dateISO = formatDateToISO(date);
    const dayEvents = events.filter(e => e.date === dateISO);
    
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
    });
  }
  
  // Add days of current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateISO = formatDateToISO(date);
    const dayEvents = events.filter(e => e.date === dateISO);
    
    days.push({
      date,
      day,
      isCurrentMonth: true,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
    });
  }
  
  // Add days from next month to complete the grid (always 42 days = 6 rows)
  const remainingDays = 42 - days.length;
  const nextMonth = month === 11 ? 0 : month + 1;
  const nextMonthYear = month === 11 ? year + 1 : year;
  
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(nextMonthYear, nextMonth, day);
    const dateISO = formatDateToISO(date);
    const dayEvents = events.filter(e => e.date === dateISO);
    
    days.push({
      date,
      day,
      isCurrentMonth: false,
      isToday: isToday(date),
      isSelected: isSameDay(date, selectedDate),
      hasEvents: dayEvents.length > 0,
      events: dayEvents,
    });
  }
  
  return {
    year,
    month,
    days,
  };
};

/**
 * Get previous month and year
 */
export const getPreviousMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 0) {
    return { year: year - 1, month: 11 };
  }
  return { year, month: month - 1 };
};

/**
 * Get next month and year
 */
export const getNextMonth = (year: number, month: number): { year: number; month: number } => {
  if (month === 11) {
    return { year: year + 1, month: 0 };
  }
  return { year, month: month + 1 };
};

/**
 * Sort events by start time
 */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    const timeA = a.startTime.replace(':', '');
    const timeB = b.startTime.replace(':', '');
    return parseInt(timeA, 10) - parseInt(timeB, 10);
  });
};

/**
 * Check if a time is valid (HH:MM format)
 */
export const isValidTime = (time: string): boolean => {
  const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return regex.test(time);
};

/**
 * Compare two times (returns -1 if time1 < time2, 0 if equal, 1 if time1 > time2)
 */
export const compareTimes = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(':').map(Number);
  const [h2, m2] = time2.split(':').map(Number);
  
  if (h1 < h2 || (h1 === h2 && m1 < m2)) return -1;
  if (h1 > h2 || (h1 === h2 && m1 > m2)) return 1;
  return 0;
};

/**
 * Generate time slots for picker (every 30 minutes)
 */
export const generateTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      slots.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    }
  }
  return slots;
};
