export const Colors = {
  // Primary colors
  primary: '#4A90D9',
  primaryDark: '#357ABD',
  primaryLight: '#6BA3E0',

  // Secondary colors
  secondary: '#5C6BC0',
  secondaryDark: '#3949AB',
  secondaryLight: '#7986CB',

  // Background colors
  background: '#FFFFFF',
  backgroundSecondary: '#F5F7FA',
  surface: '#FFFFFF',

  // Text colors
  textPrimary: '#1A1A2E',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  textInverse: '#FFFFFF',

  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',

  // Calendar specific
  calendarToday: '#4A90D9',
  calendarSelected: '#357ABD',
  calendarEvent: '#5C6BC0',
  calendarWeekend: '#F3F4F6',

  // Misc
  overlay: 'rgba(0, 0, 0, 0.5)',
  shadow: 'rgba(0, 0, 0, 0.1)',
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
};

export type ColorType = keyof typeof Colors;
