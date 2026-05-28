import { Segment, WalletStatus } from './segment';
import { FlagKey } from './flag';

// Where in the app a nudge can surface. Same nudge object can target different
// touchpoints; the engine filters by touchpoint when components ask for it.
//   home_banner   — the up-to-2 deck below the Home action buttons
//   post_action   — bottom-sheet / toast right after a positive action
//   interstitial  — full-screen take-over (e.g. What's-New for S4)
//   silent        — never shown; the entry only exists for analytics / a hold
export type NudgeTouchpoint = 'home_banner' | 'post_action' | 'interstitial' | 'silent';

// Visual treatment. Three modes — no image-well per the latest Figma direction:
//   image   — full-bleed image with bottom-aligned blur + scrim under the
//             text; headline + body + optional CTA bottom-left, X top-right.
//             This is the default for any nudge with imagery.
//   light   — white card, no image, headline + body + optional CTA. Used for
//             text-only nudges (S6 wallet intro, S5b retry, etc).
//   status  — solid colour background, headline + body + progress bar.
//             Used for status / progress-style nudges (e.g. points earned).
export type NudgeStyle = 'image' | 'light' | 'status';

// Rule grammar for show_when / hide_when. Composable so the catalogue stays
// declarative — `selectNudges` walks the tree without any per-rule branching.
export type NudgeRule =
  | { type: 'flag_true'; key: FlagKey }
  | { type: 'flag_false'; key: FlagKey }
  | { type: 'segment_in'; segments: Segment[] }
  | { type: 'wallet_status_in'; statuses: WalletStatus[] }
  | { type: 'and'; rules: NudgeRule[] }
  | { type: 'or'; rules: NudgeRule[] }
  | { type: 'always' };

// What a dismiss tap does. `permanent` = catalogue-level forever (rare),
// `session` = the default for this demo (cleared on persona switch / reset),
// `snooze_3d` = comes back after 3 days, `escalating` = uses the
// per-nudge cadence rule (e.g. Apple Pay 3rd-load → 24h → 3d).
export type DismissBehaviour = 'permanent' | 'session' | 'snooze_3d' | 'escalating';

// Copy block for a nudge. Character limits from the migration doc:
//   headline ≤ 40, body ≤ 120, cta.label ≤ 24.
export interface NudgeContent {
  headline: string;
  body: string;
  cta?: { label: string; action?: string };
  /** require() target for the right-hand image (light-image style). */
  image?: number;
  /** require() target for the full-bleed background image (image-bg style). */
  bgImage?: number;
  /** Solid colour for the status style; ignored otherwise. */
  bgColor?: string;
  /** Optional 0-1 progress for the status style. */
  progress?: number;
}

// A single catalogue entry. The catalogue is one big array — marketing or
// product can author / swap entries without touching screens. The engine
// filters by touchpoint + segmentScope + show/hide rules, sorts by priority,
// and returns the top N (2 for home_banner).
export interface Nudge {
  id: string;
  touchpoint: NudgeTouchpoint;
  style: NudgeStyle;
  /** 0-100. Higher beats lower for the visible-2 deck. */
  priority: number;
  /** Which segments this nudge is eligible for. */
  segmentScope: Segment[];
  /** Rule that must evaluate true for this nudge to surface. */
  showWhen: NudgeRule;
  /** Optional auto-hide rule — e.g. the inverse of showWhen, or "flag flipped". */
  hideWhen?: NudgeRule;
  dismiss: DismissBehaviour;
  content: NudgeContent;
}
