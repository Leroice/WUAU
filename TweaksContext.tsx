import React, { createContext, useCallback, useContext, useState } from 'react';

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
  // Pull-to-reveal & swap
  pullThreshold: number;    // px of pull needed to pop
  expandGap: number;        // px the content slides down on pop
  popBounce: number;        // bounciness of the pop spring
  collapseSwipe: number;    // px of upward swipe needed to collapse (higher = less sensitive)
  swapMs: number;           // swap animation duration
};

const WU_YELLOW = '#F5A623';

export const DEFAULT_TWEAKS: Tweaks = {
  maxOffset: 48,
  smooth: 0.2,
  signX: 1,
  signY: -1,
  springSpeed: 12,
  springBounciness: 6,
  count: 72,
  scatter: 240,
  driftAmount: 1,
  driftSpeed: 1,
  glow: 1,
  sizeMin: 2,
  sizeMax: 7,
  sizeJitter: 0.4,
  blurNoise: 0.4,
  dissolveMs: 850,
  reformMs: 600,
  accentColor: WU_YELLOW,
  baseColor: '',
  accentRatio: 0.22,
  pullThreshold: 110,
  expandGap: 120,
  popBounce: 16,
  collapseSwipe: 80,
  swapMs: 420,
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
