import React, { createContext, useCallback, useContext, useState } from 'react';

// ─── Live design tokens ──────────────────────────────────────────────────────
// Tweakable at runtime via the Component Library screen. Core shared components
// read from here so design changes apply live across the whole app.

export type FontWeight = '400' | '500' | '600' | '700' | '800';
export const WEIGHTS: FontWeight[] = ['400', '500', '600', '700', '800'];

export type DesignTokens = {
  surfaceRadius: number;
  widgetRadius: number;
  widgetHeaderPad: number;
  listIcon: number;
  listPadV: number;
  listLabelSize: number;
  listLabelWeight: FontWeight;
  actionRadius: number;
  actionIcon: number;
  actionLabelSize: number;
  cardRadius: number;
};

export const DEFAULT_DESIGN: DesignTokens = {
  surfaceRadius: 24,
  widgetRadius: 24,
  widgetHeaderPad: 16,
  listIcon: 40,
  listPadV: 12,
  listLabelSize: 15,
  listLabelWeight: '600',
  actionRadius: 16,
  actionIcon: 24,
  actionLabelSize: 12,
  cardRadius: 14,
};

export type Control =
  | { key: keyof DesignTokens; label: string; type: 'number'; min: number; max: number; step: number }
  | { key: keyof DesignTokens; label: string; type: 'weight' };

export type ComponentDef = { name: string; blurb: string; controls: Control[] };

// The library: every tweakable component and its controls.
export const COMPONENT_LIBRARY: ComponentDef[] = [
  {
    name: 'Widget Card',
    blurb: 'Bordered container with the section header inside. The base of every Level-1 widget.',
    controls: [
      { key: 'widgetRadius', label: 'Corner radius', type: 'number', min: 0, max: 40, step: 2 },
      { key: 'widgetHeaderPad', label: 'Header padding', type: 'number', min: 8, max: 28, step: 2 },
    ],
  },
  {
    name: 'List Row',
    blurb: 'Icon pill + label + chevron. Used in Settings and grouped lists.',
    controls: [
      { key: 'listIcon', label: 'Icon size', type: 'number', min: 28, max: 56, step: 2 },
      { key: 'listPadV', label: 'Vertical padding', type: 'number', min: 6, max: 24, step: 2 },
      { key: 'listLabelSize', label: 'Label size', type: 'number', min: 12, max: 20, step: 1 },
      { key: 'listLabelWeight', label: 'Label weight', type: 'weight' },
    ],
  },
  {
    name: 'Action Button',
    blurb: 'Yellow icon-over-label button. Quick actions on Home, Cards, Payments.',
    controls: [
      { key: 'actionRadius', label: 'Corner radius', type: 'number', min: 0, max: 30, step: 2 },
      { key: 'actionIcon', label: 'Icon size', type: 'number', min: 16, max: 32, step: 2 },
      { key: 'actionLabelSize', label: 'Label size', type: 'number', min: 10, max: 16, step: 1 },
    ],
  },
  {
    name: 'Surface',
    blurb: 'Elevated rounded panel. Backs banners and grouped content.',
    controls: [
      { key: 'surfaceRadius', label: 'Corner radius', type: 'number', min: 0, max: 40, step: 2 },
    ],
  },
  {
    name: 'Wallet Card',
    blurb: 'The card hero. Flips on tap and floats with the gyro.',
    controls: [
      { key: 'cardRadius', label: 'Corner radius', type: 'number', min: 0, max: 28, step: 2 },
    ],
  },
];

type Ctx = {
  tokens: DesignTokens;
  set: <K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => void;
  reset: () => void;
};

const DesignCtx = createContext<Ctx>({ tokens: DEFAULT_DESIGN, set: () => {}, reset: () => {} });

export function DesignProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<DesignTokens>(DEFAULT_DESIGN);
  const set = useCallback(<K extends keyof DesignTokens>(key: K, value: DesignTokens[K]) => {
    setTokens((t) => ({ ...t, [key]: value }));
  }, []);
  const reset = useCallback(() => setTokens(DEFAULT_DESIGN), []);
  return <DesignCtx.Provider value={{ tokens, set, reset }}>{children}</DesignCtx.Provider>;
}

export const useDesign = () => useContext(DesignCtx);
