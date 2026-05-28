import type { Nudge, NudgeRule, NudgeTouchpoint, Persona, Flags } from '../types';

// ─── Rule engine ─────────────────────────────────────────────────────────────
// Pure recursive evaluator. The rule tree describes when a nudge should show
// (or hide); the engine walks it with no per-rule branching in screens or
// catalogue authoring.

function evaluate(rule: NudgeRule, persona: Persona, flags: Flags): boolean {
  switch (rule.type) {
    case 'always':
      return true;
    case 'flag_true':
      return flags[rule.key] === true;
    case 'flag_false':
      return flags[rule.key] !== true;
    case 'segment_in':
      return rule.segments.includes(persona.segment);
    case 'wallet_status_in':
      return rule.statuses.includes(persona.walletStatus);
    case 'and':
      return rule.rules.every((r) => evaluate(r, persona, flags));
    case 'or':
      return rule.rules.some((r) => evaluate(r, persona, flags));
  }
}

// ─── Selector ────────────────────────────────────────────────────────────────
// `selectNudges` is the only function components consume (via the hooks). It
// filters the catalogue down to the entries eligible right now, sorts by
// priority, and slices to the touchpoint's max-visible count.

const MAX_VISIBLE: Partial<Record<NudgeTouchpoint, number>> = {
  home_banner: 2, // user spec: a deck of up to two; dismiss-to-next from queue
};

export interface SelectNudgesOpts {
  persona: Persona;
  touchpoint: NudgeTouchpoint;
  /** Merged persona.flags + session overrides (overrides win). */
  flags: Flags;
  /** IDs the user has dismissed in this session. */
  dismissedIds: Set<string>;
}

export function selectNudges({ persona, touchpoint, flags, dismissedIds }: SelectNudgesOpts): Nudge[] {
  const cap = MAX_VISIBLE[touchpoint];
  const eligible = CATALOGUE
    .filter((n) => n.touchpoint === touchpoint)
    .filter((n) => n.segmentScope.includes(persona.segment))
    .filter((n) => !dismissedIds.has(n.id))
    .filter((n) => evaluate(n.showWhen, persona, flags))
    .filter((n) => !n.hideWhen || !evaluate(n.hideWhen, persona, flags))
    .sort((a, b) => b.priority - a.priority);
  return cap != null ? eligible.slice(0, cap) : eligible;
}

// ─── Catalogue ───────────────────────────────────────────────────────────────
// Everything lives here. Add / swap / re-prioritise entries and the engine
// picks them up — no screen changes. In a real build, this would be a CMS.

export const CATALOGUE: Nudge[] = [
  // ── Apple Pay (Apple-required reappearance; cadence rule added in #19) ──
  {
    id: 'apple_pay_setup',
    touchpoint: 'home_banner',
    style: 'light-image',
    priority: 100,
    segmentScope: ['S1'],
    showWhen: {
      type: 'and',
      rules: [
        { type: 'flag_true', key: 'has_card' },
        { type: 'flag_false', key: 'apple_pay_active' },
      ],
    },
    hideWhen: { type: 'flag_true', key: 'apple_pay_active' },
    dismiss: 'escalating',
    content: {
      headline: 'Setup Apple Pay',
      body: 'Take your card with you and pay in local currency.',
      cta: { label: 'Set up', action: 'apple_pay_setup' },
    },
  },

  // ── Order Card (S1 wallet users without a card) ──
  {
    id: 'order_card',
    touchpoint: 'home_banner',
    style: 'light-image',
    priority: 90,
    segmentScope: ['S1'],
    showWhen: { type: 'flag_false', key: 'has_card' },
    hideWhen: { type: 'flag_true', key: 'has_card' },
    dismiss: 'snooze_3d',
    content: {
      headline: 'Order your card today',
      body: 'Spend like a local around the world, wherever Visa is accepted.',
      cta: { label: 'Order card', action: 'order_card' },
    },
  },

  // ── Add funds (no money in the wallet yet) ──
  {
    id: 'add_funds',
    touchpoint: 'home_banner',
    style: 'light-image',
    priority: 75,
    segmentScope: ['S1'],
    showWhen: { type: 'flag_false', key: 'first_send_done' },
    dismiss: 'session',
    content: {
      headline: 'Add AUD to start sending',
      body: 'Fund your account to send money internationally in minutes.',
      cta: { label: 'Add money', action: 'add_money' },
    },
  },

  // ── First Jar (S1 + no jars yet) ──
  {
    id: 'first_jar',
    touchpoint: 'home_banner',
    style: 'image-bg',
    priority: 65,
    segmentScope: ['S1'],
    showWhen: { type: 'flag_false', key: 'first_jar_created' },
    hideWhen: { type: 'flag_true', key: 'first_jar_created' },
    dismiss: 'session',
    content: {
      headline: 'Hold JPY, send when ready',
      body: 'Convert when the rate moves. No fee to hold.',
      cta: { label: 'Add JPY account', action: 'add_jar' },
    },
  },

  // ── S6 wallet intro (IMT-only user; soft offer per migration doc) ──
  {
    id: 'wallet_intro_s6',
    touchpoint: 'home_banner',
    style: 'light',
    priority: 70,
    segmentScope: ['S6'],
    showWhen: { type: 'flag_false', key: 'wallet_intro_dismissed' },
    hideWhen: { type: 'flag_true', key: 'wallet_intro_dismissed' },
    dismiss: 'snooze_3d',
    content: {
      headline: 'Do more with your money.',
      body: 'Hold currencies, lock in rates, and pay with a WU debit card.',
      cta: { label: 'Learn more', action: 's7a_value_prop' },
    },
  },

  // ── S7a value prop (mid wallet upgrade — entry point) ──
  {
    id: 'value_prop_s7a',
    touchpoint: 'home_banner',
    style: 'light-image',
    priority: 100,
    segmentScope: ['S7a'],
    showWhen: { type: 'always' },
    dismiss: 'session',
    content: {
      headline: 'Your money, working harder.',
      body: 'Hold up to 30 currencies. Convert when the rate is right.',
      cta: { label: 'Get started', action: 's7b_eligibility' },
    },
  },

  // ── S5b retry KYC (non-dismissible) ──
  {
    id: 'retry_kyc_s5b',
    touchpoint: 'home_banner',
    style: 'light',
    priority: 100,
    segmentScope: ['S5b'],
    showWhen: { type: 'always' },
    dismiss: 'permanent', // can't dismiss; only completing the action clears it
    content: {
      headline: 'We couldn’t verify your identity.',
      body: 'Try again with updated documents — only takes a few minutes.',
      cta: { label: 'Try again', action: 'retry_kyc' },
    },
  },

  // ── S4 abandoned R4 (Resume / What's New) ──
  {
    id: 'whats_new_s4',
    touchpoint: 'home_banner',
    style: 'light-image',
    priority: 100,
    segmentScope: ['S4'],
    showWhen: { type: 'always' },
    dismiss: 'session',
    content: {
      headline: 'We’ve upgraded your experience.',
      body: 'Pick up where you left off — verify your identity in a few minutes.',
      cta: { label: 'Get started', action: 'resume_onboarding' },
    },
  },

  // ── Track transfer (always available for IMT-flavoured users) ──
  {
    id: 'track_transfer_s4',
    touchpoint: 'home_banner',
    style: 'light',
    priority: 50,
    segmentScope: ['S4'],
    showWhen: { type: 'always' },
    dismiss: 'session',
    content: {
      headline: 'Track a transfer.',
      body: 'Got a tracking number? Check the status — no account needed.',
      cta: { label: 'Track transfer', action: 'track_transfer' },
    },
  },
];
