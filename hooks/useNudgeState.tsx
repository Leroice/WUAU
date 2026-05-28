import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FlagKey, Flags } from '../types';
import { usePersona } from './usePersona';

// Per-nudge escalating snooze state. Tracks how many times the user has
// dismissed an `escalating` nudge and on which app-load they did it last,
// so the engine can compute when to bring it back per the cadence rules.
// Apple Pay's rule: 0–3 dismisses → every 3rd load; 4–6 → every load
// (≈24h); 7+ → every 3 loads (≈3 days).
export interface EscalationState {
  dismissCount: number;
  /** appLoads value at the moment of the last dismiss. */
  lastDismissedLoad: number;
}

// Session-only nudge state.
//   dismissedIds — IDs the user has X-tap dismissed this session (permanent /
//     snooze_3d / session entries; once in, stays in until reset)
//   escalations — per-id tracking for `escalating` nudges (Apple Pay).
//     Re-shown on its own schedule.
//   flagOverrides — flips applied during the session (e.g. user taps "Activate
//     Apple Pay" → we override apple_pay_active=true so the nudge auto-hides)
//   appLoads — counter incremented every time the provider mounts (≈ app
//     launches in a real build; persona switches in this demo). Used by the
//     escalation cadence rules.
//
// On persona switch all of the above reset to baseline — fresh demo every time.

interface NudgeStateValue {
  dismissedIds: Set<string>;
  escalations: Record<string, EscalationState>;
  appLoads: number;
  flagOverrides: Flags;
  /** Merged: persona.flags ∪ overrides (overrides win). Read this, not the raw persona. */
  effectiveFlags: Flags;
  dismiss: (id: string, behaviour?: 'permanent' | 'session' | 'snooze_3d' | 'escalating') => void;
  setFlag: (key: FlagKey, value: boolean) => void;
  reset: () => void;
  /** Manually bump the app-load counter — used by the Story page to walk the demo cadence. */
  simulateAppLoad: () => void;
}

const Ctx = createContext<NudgeStateValue | null>(null);

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  const { persona } = usePersona();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const [escalations, setEscalations] = useState<Record<string, EscalationState>>({});
  const [flagOverrides, setFlagOverrides] = useState<Flags>({});
  const [appLoads, setAppLoads] = useState<number>(1); // current session counts as 1

  // Persona switch = clean slate. The demo resets nudge state so each scenario
  // starts from its persona's baseline flags + load counter.
  useEffect(() => {
    setDismissedIds(new Set());
    setEscalations({});
    setFlagOverrides({});
    setAppLoads(1);
  }, [persona.id]);

  const dismiss = useCallback((id: string, behaviour?: 'permanent' | 'session' | 'snooze_3d' | 'escalating') => {
    if (behaviour === 'escalating') {
      // Don't add to dismissedIds — the engine instead consults the
      // escalation state to compute next-show eligibility.
      setEscalations((prev) => ({
        ...prev,
        [id]: {
          dismissCount: (prev[id]?.dismissCount ?? 0) + 1,
          lastDismissedLoad: appLoads,
        },
      }));
      return;
    }
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, [appLoads]);

  const setFlag = useCallback((key: FlagKey, value: boolean) => {
    setFlagOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setDismissedIds(new Set());
    setEscalations({});
    setFlagOverrides({});
    setAppLoads(1);
  }, []);

  const simulateAppLoad = useCallback(() => {
    setAppLoads((n) => n + 1);
  }, []);

  const effectiveFlags = useMemo<Flags>(
    () => ({ ...persona.flags, ...flagOverrides }),
    [persona.flags, flagOverrides],
  );

  const value = useMemo<NudgeStateValue>(
    () => ({
      dismissedIds, escalations, appLoads, flagOverrides, effectiveFlags,
      dismiss, setFlag, reset, simulateAppLoad,
    }),
    [dismissedIds, escalations, appLoads, flagOverrides, effectiveFlags, dismiss, setFlag, reset, simulateAppLoad],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNudgeState(): NudgeStateValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNudgeState must be used within a NudgeProvider');
  return ctx;
}
