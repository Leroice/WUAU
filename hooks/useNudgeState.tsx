import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { FlagKey, Flags } from '../types';
import { usePersona } from './usePersona';

// Session-only nudge state.
//   dismissedIds — IDs the user has actively dismissed (X-tap) this session
//   flagOverrides — flips applied during the session (e.g. user taps "Activate
//     Apple Pay" → we override apple_pay_active=true so the nudge auto-hides
//     even though the persona's mock data still says false). On persona switch
//     both reset to empty — fresh demo every time.

interface NudgeStateValue {
  dismissedIds: Set<string>;
  flagOverrides: Flags;
  /** Merged: persona.flags ∪ overrides (overrides win). Read this, not the raw persona. */
  effectiveFlags: Flags;
  dismiss: (id: string) => void;
  setFlag: (key: FlagKey, value: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<NudgeStateValue | null>(null);

export function NudgeProvider({ children }: { children: React.ReactNode }) {
  const { persona } = usePersona();
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => new Set());
  const [flagOverrides, setFlagOverrides] = useState<Flags>({});

  // Persona switch = clean slate. The demo resets nudge state so each scenario
  // starts from its persona's baseline flags.
  useEffect(() => {
    setDismissedIds(new Set());
    setFlagOverrides({});
  }, [persona.id]);

  const dismiss = useCallback((id: string) => {
    setDismissedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const setFlag = useCallback((key: FlagKey, value: boolean) => {
    setFlagOverrides((prev) => ({ ...prev, [key]: value }));
  }, []);

  const reset = useCallback(() => {
    setDismissedIds(new Set());
    setFlagOverrides({});
  }, []);

  const effectiveFlags = useMemo<Flags>(
    () => ({ ...persona.flags, ...flagOverrides }),
    [persona.flags, flagOverrides],
  );

  const value = useMemo<NudgeStateValue>(
    () => ({ dismissedIds, flagOverrides, effectiveFlags, dismiss, setFlag, reset }),
    [dismissedIds, flagOverrides, effectiveFlags, dismiss, setFlag, reset],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useNudgeState(): NudgeStateValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useNudgeState must be used within a NudgeProvider');
  return ctx;
}
