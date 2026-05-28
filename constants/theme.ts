import { useColorScheme } from 'react-native';

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
// Single source of truth for the component framework. New screens/components
// read from here; legacy screens (App/Settings) still hold local copies pending
// migration. Values mirror the Figma "WU Beta App" variable set.

export type Theme = {
  bg: string;
  card: string;
  surface: string; // elevated white surface
  text: string;
  muted: string;
  accent: string;
  border: string;
  divider: string; // stronger hairline for in-list separators (Figma #BFBFBF)
  pill: string;
  // semantic / status
  warning: string; // "Pending"
  info: string; // "In progress"
  error: string;
  success: string;
};

// brand/primary (Figma) — true WU yellow. Single source of WU_YELLOW app-wide.
export const WU_YELLOW = '#FFDD00';

export const LIGHT: Theme = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#6E6E6E',
  accent: '#1A6FD4',
  border: '#E2E8F0',
  divider: '#C6C6C8',
  pill: '#F1F5F9',
  warning: '#EA7E00',
  info: '#239AF6',
  error: '#DC2626',
  success: '#1A8A4A',
};

export const DARK: Theme = {
  bg: '#000000',
  card: '#1C1C1E',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  muted: '#8E8E93',
  accent: '#4DA3FF',
  border: '#2C2C2E',
  divider: '#3A3A3C',
  pill: '#2C2C2E',
  warning: '#EA7E00',
  info: '#239AF6',
  error: '#FF6B6B',
  success: '#30D158',
};

// Spacing scale (Figma spacing tokens: 4 / 8 / 12 / 16 / 24).
export const SPACING = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const RADIUS = { md: 12, lg: 16, xl: 24 } as const;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? DARK : LIGHT;
}
