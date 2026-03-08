// Color palette inspired by Universal AutoMarket
export const COLORS = {
  // Primary - Neon Red
  primary: '#FF0000',
  primaryDark: '#CC0000',
  primaryLight: '#FF3333',
  neonRed: '#FF0000',
  
  // Dark theme
  background: '#000000',
  backgroundDark: '#0a0a0a',
  backgroundCard: '#1a1a1a',
  backgroundLight: '#2d2d2d',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  textMuted: '#999999',
  
  // Accent colors
  success: '#00FF00',
  warning: '#FFA500',
  error: '#FF0000',
  
  // UI Elements
  border: '#333333',
  shadow: '#000000',
  overlay: 'rgba(0, 0, 0, 0.7)',
  
  // Rating/Stars
  star: '#FFD700',
  
  // Featured badge
  featured: '#FF0000',
};

export const SHADOWS = {
  small: {
    shadowColor: COLORS.neonRed,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  medium: {
    shadowColor: COLORS.neonRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  neonGlow: {
    shadowColor: COLORS.neonRed,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
};
