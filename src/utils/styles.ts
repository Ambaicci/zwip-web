// src/utils/styles.ts
import { THEME } from '../theme';

// Utility function to merge styles
export const mergeStyles = (...styles: any[]) => {
  return Object.assign({}, ...styles);
};

// Quick access to theme values
export const colors = THEME;

// Common style patterns
export const commonStyles = {
  screenContainer: {
    fontFamily: 'system-ui, sans-serif',
    padding: '20px',
    backgroundColor: THEME.black,
    minHeight: '100vh',
    color: THEME.white,
    paddingBottom: '90px',
    boxSizing: 'border-box',
    position: 'relative',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },

  centerContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
};
