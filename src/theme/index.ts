import { Theme } from '../types';

export const theme: Theme = {
  colors: {
    primary: '#4A90D9',
    secondary: '#6C5CE7',
    background: '#F8F9FA',
    surface: '#FFFFFF',
    text: '#2D3436',
    textSecondary: '#636E72',
    border: '#DFE6E9',
    error: '#E74C3C',
    success: '#27AE60',
    warning: '#F39C12',
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    full: 9999,
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
    },
    h3: {
      fontSize: 18,
      fontWeight: '600',
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
    },
    caption: {
      fontSize: 12,
      fontWeight: '400',
    },
  },
};

export default theme;
