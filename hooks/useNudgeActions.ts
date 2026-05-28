import { useNudgeState } from './useNudgeState';

/**
 * Imperative handle for nudge state — components fire these on user actions:
 *   dismiss(id)            — user tapped the X on a banner
 *   setFlag(key, value)    — a positive action just completed; flip the flag
 *                            so the corresponding nudge auto-hides and the next
 *                            in the queue takes its slot
 *   reset()                — clear all session state (used by Story page demo)
 *
 * Pure session state — nothing persists. Persona switch = automatic reset.
 */
export const useNudgeActions = () => {
  const { dismiss, setFlag, reset } = useNudgeState();
  return { dismiss, setFlag, reset };
};
