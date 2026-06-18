import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const COLORS = {
  light: {
    background: '#F8FAFC',
    card: '#FFFFFF',
    text: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    primary: '#6366F1', // Indigo
    primaryLight: '#EEF2FF',
    accent: '#EC4899', // Pink / Rose
    success: '#10B981', // Emerald
    error: '#EF4444', // Red
    border: '#E2E8F0',
    inputBackground: '#F1F5F9',
    placeholder: '#94A3B8',
    cardShadow: 'rgba(148, 163, 184, 0.1)',
    glassBackground: 'rgba(255, 255, 255, 0.8)',
    buttonText: '#FFFFFF',
  },
  dark: {
    background: '#090D16', // Deep Slate Black
    card: '#131A26', // Deep Graphite Card
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#818CF8', // Neon Indigo
    primaryLight: '#1E1B4B',
    accent: '#F472B6', // Light Pink
    success: '#34D399', // Bright Emerald
    error: '#F87171', // Bright Red
    border: '#1E293B',
    inputBackground: '#1A2333',
    placeholder: '#475569',
    cardShadow: 'rgba(0, 0, 0, 0.3)',
    glassBackground: 'rgba(19, 26, 38, 0.7)',
    buttonText: '#090D16',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

export const SIZES = {
  width,
  height,
  isSmallDevice: width < 375,
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
  caption: {
    fontSize: 11,
    fontWeight: '500' as const,
    lineHeight: 14,
    letterSpacing: 0.5,
  },
};

export const BORDER_RADIUS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
};

export const SHADOWS = {
  light: {
    shadowColor: '#475569',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  dark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
};
export type ThemeColors = typeof COLORS.light;
