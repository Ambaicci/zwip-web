// src/theme/index.ts - PROFESSIONAL DESIGN SYSTEM
export const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1440
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px'
};

export const TYPOGRAPHY = {
  h1: {
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '24px',
    fontWeight: 700,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: 1.4
  },
  body: {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: 1.5
  },
  caption: {
    fontSize: '14px',
    fontWeight: 400,
    lineHeight: 1.4
  },
  small: {
    fontSize: '12px',
    fontWeight: 400,
    lineHeight: 1.3
  }
};

export const COLORS = {
  // Primary Brand Colors
  primary: {
    50: '#E6F2F0',
    100: '#CCE4E1',
    200: '#99C9C3',
    300: '#66AEA5',
    400: '#339387',
    500: '#00674F', // Main brand color
    600: '#005240',
    700: '#003E30',
    800: '#002920',
    900: '#001510'
  },
  
  // Neutral Colors
  neutral: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A0',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    900: '#0B0B0B'
  },
  
  // Semantic Colors
  success: {
    light: '#D4EDDA',
    main: '#28A745',
    dark: '#1E7E34'
  },
  warning: {
    light: '#FFF3CD',
    main: '#FFC107',
    dark: '#E0A800'
  },
  error: {
    light: '#F8D7DA',
    main: '#DC2626',
    dark: '#C53030'
  },
  
  // Background Colors
  background: {
    primary: '#000000',
    secondary: '#071010',
    tertiary: '#0B0B0B',
    elevated: '#121212'
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#9AA0A0',
    disabled: '#5F6368',
    inverse: '#000000'
  }
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const BORDER_RADIUS = {
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  full: '50%'
};

export const TRANSITIONS = {
  fast: '0.15s ease',
  normal: '0.3s ease',
  slow: '0.5s ease'
};

// Component-specific themes
export const COMPONENTS = {
  button: {
    primary: {
      background: COLORS.primary[500],
      color: COLORS.text.inverse,
      hover: COLORS.primary[600],
      active: COLORS.primary[700]
    },
    secondary: {
      background: 'transparent',
      color: COLORS.primary[500],
      border: `1px solid ${COLORS.primary[500]}`,
      hover: COLORS.primary[50],
      active: COLORS.primary[100]
    },
    ghost: {
      background: 'transparent',
      color: COLORS.text.secondary,
      hover: COLORS.neutral[800],
      active: COLORS.neutral[700]
    }
  },
  card: {
    background: COLORS.background.tertiary,
    border: `1px solid ${COLORS.neutral[800]}`,
    shadow: SHADOWS.md
  },
  input: {
    background: COLORS.background.secondary,
    border: `1px solid ${COLORS.neutral[700]}`,
    focus: `1px solid ${COLORS.primary[500]}`,
    error: `1px solid ${COLORS.error.main}`
  }
};

// Export legacy theme for backward compatibility
export const THEME = {
  black: COLORS.background.primary,
  panel: COLORS.background.secondary,
  card: COLORS.background.tertiary,
  muted: COLORS.text.secondary,
  green: COLORS.primary[500],
  accentDark: COLORS.primary[700],
  border: COLORS.neutral[800],
  white: COLORS.text.primary,
  emeraldLight: COLORS.primary[400],
  emeraldDark: COLORS.primary[600],
  error: COLORS.error.main
};
