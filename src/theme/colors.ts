export interface ColorTheme {
  // Primary Colors
  primary: string;
  primaryDark: string;
  primaryLight: string;
  
  // Background Colors
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  
  // Surface Colors
  surface: string;
  surfaceSecondary: string;
  card: string;
  
  // Text Colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  textPlaceholder: string;
  
  // Border Colors
  border: string;
  borderLight: string;
  divider: string;
  
  // Status Colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Memorial Specific
  memorial: string;
  memorialLight: string;
  memorialDark: string;
  
  // Status Bar
  statusBar: 'dark-content' | 'light-content';
  statusBarBackground: string;
}

export const Colors = {
  // Light Theme
  light: {
    // Primary Colors
    primary: '#4A90E2',
    primaryDark: '#357ABD',
    primaryLight: '#7BB3E8',
    
    // Background Colors
    background: '#FFFFFF',
    backgroundSecondary: '#F8F9FA',
    backgroundTertiary: '#F5F5F5',
    
    // Surface Colors
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',
    card: '#FFFFFF',
    
    // Text Colors
    textPrimary: '#1A1A1A',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textPlaceholder: '#CCCCCC',
    
    // Border Colors
    border: '#E0E0E0',
    borderLight: '#F0F0F0',
    divider: '#EEEEEE',
    
    // Status Colors
    success: '#28A745',
    warning: '#FFC107',
    error: '#DC3545',
    info: '#17A2B8',
    
    // Memorial Specific
    memorial: '#6B73FF',
    memorialLight: '#9C9EFF',
    memorialDark: '#4A52CC',
    
    // Status Bar
    statusBar: 'dark-content' as const,
    statusBarBackground: '#FFFFFF',
  } as ColorTheme,
  
  // Dark Theme
  dark: {
    // Primary Colors
    primary: '#e63737ff',
    primaryDark: '#4A90E2',
    primaryLight: '#7BB3E8',
    
    // Background Colors
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    backgroundTertiary: '#2A2A2A',
    
    // Surface Colors
    surface: '#1E1E1E',
    surfaceSecondary: '#2A2A2A',
    card: '#2A2A2A',
    
    // Text Colors
    textPrimary: '#FFFFFF',
    textSecondary: '#CCCCCC',
    textTertiary: '#999999',
    textPlaceholder: '#666666',
    
    // Border Colors
    border: '#404040',
    borderLight: '#333333',
    divider: '#2A2A2A',
    
    // Status Colors
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#F44336',
    info: '#2196F3',
    
    // Memorial Specific
    memorial: '#7C84FF',
    memorialLight: '#9C9EFF',
    memorialDark: '#5B63E8',
    
    // Status Bar
    statusBar: 'light-content' as const,
    statusBarBackground: '#121212',
  } as ColorTheme,
};