import React, { createContext, useCallback, useContext, useState } from 'react';
import { WU_YELLOW } from '../constants/theme';

// Live-tunable knobs for the particle balance + tilt physics. Defaults match the
// values the component shipped with.
export type Tweaks = {
  // Springs & tilt
  maxOffset: number;        // px the field leans at full tilt
  smooth: number;           // accelerometer low-pass (lower = smoother/laggier)
  signX: number;            // 1 or -1
  signY: number;            // 1 or -1
  springSpeed: number;      // reform settle speed
  springBounciness: number; // reform settle bounce
  // Particles
  count: number;
  scatter: number;          // max scatter radius
  driftAmount: number;      // float amplitude multiplier
  driftSpeed: number;       // float speed multiplier
  glow: number;             // halo size/opacity multiplier
  sizeMin: number;          // smallest (far) particle radius
  sizeMax: number;          // largest (near) particle radius
  sizeJitter: number;       // 0..1 random per-particle size variation
  blurNoise: number;        // 0..1 breaks the halo into jittered puffs (texture)
  dissolveMs: number;       // hide animation duration
  reformMs: number;         // show animation duration
  // Colour
  accentColor: string;
  baseColor: string;        // '' = use the theme text colour
  accentRatio: number;      // 0..1 share of accent-coloured particles
  // Convert sheet
  pullThreshold: number;    // px of pull-down at the top before the Convert sheet opens
};

// Baked-in particle settings (tuned on device — the tweaks panel has been pruned).
export const DEFAULT_TWEAKS: Tweaks = {
  maxOffset: 100,
  smooth: 0.2,
  signX: 1,
  signY: -1,
  springSpeed: 12,
  springBounciness: 6,
  count: 72,
  scatter: 300,
  driftAmount: 2.5,
  driftSpeed: 0.3,
  glow: 0,
  sizeMin: 1,
  sizeMax: 3,
  sizeJitter: 0.52,
  blurNoise: 0.4,
  dissolveMs: 850,
  reformMs: 600,
  accentColor: WU_YELLOW,
  baseColor: '',
  accentRatio: 0.22,
  pullThreshold: 110,
};

type TweaksContextValue = {
  tweaks: Tweaks;
  set: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void;
  reset: () => void;
};

const TweaksContext = createContext<TweaksContextValue>({
  tweaks: DEFAULT_TWEAKS,
  set: () => {},
  reset: () => {},
});

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [tweaks, setTweaks] = useState<Tweaks>(DEFAULT_TWEAKS);
  const set = useCallback<TweaksContextValue['set']>((key, value) => {
    setTweaks((t) => ({ ...t, [key]: value }));
  }, []);
  const reset = useCallback(() => setTweaks(DEFAULT_TWEAKS), []);
  return <TweaksContext.Provider value={{ tweaks, set, reset }}>{children}</TweaksContext.Provider>;
}

export const useTweaks = () => useContext(TweaksContext);
