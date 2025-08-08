/**
 * Global Color System
 *
 * This file exports color constants that map to CSS custom properties
 * defined in GlobalStyle.ts. Use these constants in styled-components
 * and TypeScript files for consistent color usage across the project.
 */

export const colors = {
  // Primary colors
  primary: 'var(--primary-color)',
  primaryHover: 'var(--primary-hover)',
  primaryLight: 'var(--primary-light)',
  primaryDark: 'var(--primary-dark)',

  // Secondary colors
  secondary: 'var(--secondary-color)',
  accent: 'var(--accent-color)',

  // Status colors
  success: 'var(--success-color)',
  successLight: 'var(--success-light)',
  successDark: 'var(--success-dark)',
  warning: 'var(--warning-color)',
  warningLight: 'var(--warning-light)',
  warningDark: 'var(--warning-dark)',
  error: 'var(--error-color)',
  errorLight: 'var(--error-light)',
  errorDark: 'var(--error-dark)',
  info: 'var(--info-color)',
  infoLight: 'var(--info-light)',
  infoDark: 'var(--info-dark)',

  // Text colors
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
  textLight: 'var(--text-light)',

  // Background colors
  background: 'var(--background)',
  backgroundSecondary: 'var(--background-secondary)',
  backgroundTertiary: 'var(--background-tertiary)',
  backgroundDark: 'var(--background-dark)',

  // Border colors
  border: 'var(--border-color)',
  borderLight: 'var(--border-light)',
  borderDark: 'var(--border-dark)',

  // Semantic backgrounds (with transparency)
  primaryBg: 'var(--primary-bg)',
  primaryBorder: 'var(--primary-border)',
  successBg: 'var(--success-bg)',
  successBorder: 'var(--success-border)',
  warningBg: 'var(--warning-bg)',
  warningBorder: 'var(--warning-border)',
  errorBg: 'var(--error-bg)',
  errorBorder: 'var(--error-border)',
  infoBg: 'var(--info-bg)',
  infoBorder: 'var(--info-border)',
} as const;

// Type for color keys
export type ColorKey = keyof typeof colors;

// Helper function to get color value
export const getColor = (colorKey: ColorKey): string => colors[colorKey];

// Raw hex values (for use in contexts where CSS variables aren't available)
export const rawColors = {
  primary: '#2563eb',
  primaryHover: '#1d4ed8',
  primaryLight: '#3b82f6',
  primaryDark: '#1e40af',
  secondary: '#64748b',
  accent: '#06b6d4',
  success: '#10b981',
  successLight: '#34d399',
  successDark: '#059669',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  warningDark: '#d97706',
  error: '#ef4444',
  errorLight: '#f87171',
  errorDark: '#dc2626',
  info: '#06b6d4',
  infoLight: '#22d3ee',
  infoDark: '#0891b2',
  textPrimary: '#1e293b',
  textSecondary: '#64748b',
  textMuted: '#94a3b8',
  textLight: '#cbd5e1',
  background: '#ffffff',
  backgroundSecondary: '#f8fafc',
  backgroundTertiary: '#f1f5f9',
  backgroundDark: '#0f172a',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderDark: '#334155',
} as const;

export default colors;
