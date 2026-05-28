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
  // ─── CollapsingHero ─────────────────────────────────────────────────────
  // All three balance-card screens (Accounts, AccountDetail, JarDetail) read
  // these. Tweaking any value updates every CollapsingHero instance live.
  heroPadTop: number;
  heroLabelSize: number;
  heroAmountSize: number;
  heroRefSize: number;
  heroBtnRowH: number;
  heroBtnMarginTop: number;     // gap between text block (or extras) and buttons
  heroBtnMarginBottom: number;  // breathing room beneath buttons before the card edge
  heroCollapseRange: number;    // scroll distance over which buttons fade & clip
  heroStretchScale: number;     // max scale at -220pt pull (1.0 = no stretch)
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
  heroPadTop: 8,
  heroLabelSize: 14,
  heroAmountSize: 32,
  heroRefSize: 12,
  heroBtnRowH: 60,
  heroBtnMarginTop: 24,
  heroBtnMarginBottom: 16,
  heroCollapseRange: 60,
  heroStretchScale: 1.16,
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
  {
    name: 'Collapsing Hero',
    blurb: 'The shared header on Accounts, Account detail, and Jar detail. Tweak any value and all three screens update live.',
    controls: [
      { key: 'heroPadTop', label: 'Top padding', type: 'number', min: 0, max: 24, step: 1 },
      { key: 'heroLabelSize', label: 'Label size', type: 'number', min: 10, max: 20, step: 1 },
      { key: 'heroAmountSize', label: 'Amount size', type: 'number', min: 20, max: 56, step: 2 },
      { key: 'heroRefSize', label: 'Subtitle size', type: 'number', min: 9, max: 18, step: 1 },
      { key: 'heroBtnRowH', label: 'Button row height', type: 'number', min: 40, max: 80, step: 2 },
      { key: 'heroBtnMarginTop', label: 'Gap above buttons', type: 'number', min: 0, max: 48, step: 2 },
      { key: 'heroBtnMarginBottom', label: 'Bottom breathing room', type: 'number', min: 0, max: 32, step: 2 },
      { key: 'heroCollapseRange', label: 'Collapse range', type: 'number', min: 30, max: 200, step: 10 },
      { key: 'heroStretchScale', label: 'Max stretch scale', type: 'number', min: 1, max: 1.4, step: 0.02 },
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
