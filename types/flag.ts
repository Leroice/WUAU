// Per-user behaviour flags that drive the nudge engine. When a positive action
// completes (first conversion, Apple Pay set up, etc.) the flag flips true and
// the relevant nudge auto-hides via its `hide_when` rule. Reset on each
// session in this demo — production would persist these per user.
export type FlagKey =
  // Card / payments setup
  | 'has_card'
  | 'apple_pay_active'
  | 'direct_deposit_setup'
  // First-time positive actions
  | 'first_conversion_done'
  | 'first_jar_created'
  | 'first_send_done'
  | 'track_used'
  // Onboarding / engagement
  | 'refer_friend_done'
  | 'wallet_intro_dismissed'
  | 'whats_new_seen';

export type Flags = Partial<Record<FlagKey, boolean>>;
