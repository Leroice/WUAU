import { useMemo } from 'react';
import { selectNudges } from '../services/nudges';
import type { Nudge, NudgeTouchpoint } from '../types';
import { usePersona } from './usePersona';
import { useNudgeState } from './useNudgeState';

/**
 * Read the currently-eligible nudges for a touchpoint. Re-evaluates whenever
 * the active persona, the session's effective flags, or the dismissed set
 * change — so flipping a flag (via setFlag) auto-hides the relevant nudge and
 * the next one in the priority queue takes its slot.
 */
export const useNudges = (touchpoint: NudgeTouchpoint): Nudge[] => {
  const { persona } = usePersona();
  const { effectiveFlags, dismissedIds, escalations, appLoads } = useNudgeState();
  return useMemo(
    () => selectNudges({ persona, touchpoint, flags: effectiveFlags, dismissedIds, escalations, appLoads }),
    [persona, touchpoint, effectiveFlags, dismissedIds, escalations, appLoads],
  );
};
