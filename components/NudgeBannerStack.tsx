import React, { useCallback, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../constants/theme';
import { NudgeBanner } from './NudgeBanner';
import { DismissibleSlot } from './DismissibleSlot';
import { useNudges } from '../hooks/useNudges';
import { useNudgeActions } from '../hooks/useNudgeActions';
import type { FlagKey, Nudge } from '../types';

// Map a content.cta.action key → a flag flip. When the user taps the CTA, the
// corresponding flag flips true so the nudge auto-hides and the next entry in
// the priority queue takes its place. In a real build, these would also fire
// navigations (e.g. "Order card" → routes.OrderCard) — for the demo we just
// short-circuit to the post-action state so you can see the queue advance.
const CTA_FLAG_MAP: Record<string, FlagKey> = {
  apple_pay_setup: 'apple_pay_active',
  order_card: 'has_card',
  add_money: 'first_send_done',
  add_jar: 'first_jar_created',
  refer_friend: 'refer_friend_done',
  s7a_value_prop: 'wallet_intro_dismissed', // S6 → S7a moves the user out of S6 scope
};

// Visual offset for the peeked "back card" — small enough to be a hint, big
// enough to read as a stacked deck.
const PEEK_Y = 8;
const PEEK_SCALE = 0.97;

/**
 * NudgeBannerStack — the Home-page nudge deck. Up to two cards stacked; the
 * back card peeks ~8pt below + 0.97 scaled so it reads as "there's one more
 * after this." Dismiss (X) on the top card animates the slot to zero height
 * (DismissibleSlot — same primitive as the Cards-screen Apple Pay banner) so
 * everything below slides up smoothly. Once the collapse completes, the
 * engine drops the entry; the next priority pick promotes to the front and
 * the next-after becomes the new peeked back.
 *
 * Pagination dots underneath show position. Pass `style` to add outer margins.
 */
export function NudgeBannerStack({ style }: { style?: any }) {
  const c = useTheme();
  const nudges = useNudges('home_banner'); // engine already caps at 2
  const { dismiss, setFlag } = useNudgeActions();

  // Local dismiss state — the slot animates while we hold the engine's
  // dismiss() until the collapse finishes. Otherwise the nudge would vanish
  // instantly and the slot wouldn't be able to play its exit.
  const [dismissingId, setDismissingId] = useState<string | null>(null);

  const handleCta = useCallback((n: Nudge) => {
    const action = n.content.cta?.action;
    const flag = action ? CTA_FLAG_MAP[action] : undefined;
    if (flag) setFlag(flag, true);
  }, [setFlag]);

  const handleDismiss = useCallback((n: Nudge) => {
    setDismissingId(n.id);
  }, []);

  const onCollapsed = useCallback((n: Nudge) => {
    dismiss(n.id, n.dismiss);
    setDismissingId(null);
  }, [dismiss]);

  if (nudges.length === 0) return null;

  const front = nudges[0];
  const back = nudges[1];

  return (
    <View style={style}>
      <View style={styles.deck}>
        {back && (
          <View style={[styles.backCard, { transform: [{ translateY: PEEK_Y }, { scale: PEEK_SCALE }] }]} pointerEvents="none">
            <NudgeBanner nudge={back} />
          </View>
        )}
        <DismissibleSlot
          dismissed={dismissingId === front.id}
          onCollapsed={() => onCollapsed(front)}
          remeasureKey={front.id}
        >
          <NudgeBanner
            nudge={front}
            onCta={() => handleCta(front)}
            onDismiss={() => handleDismiss(front)}
          />
        </DismissibleSlot>
      </View>
      {nudges.length > 1 && (
        <View style={styles.dots}>
          {nudges.map((n, i) => (
            <View
              key={n.id}
              style={[styles.dot, { backgroundColor: i === 0 ? c.text : c.border }]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  deck: {
    // Reserve space for the peek so the back card doesn't overflow the deck.
    paddingBottom: PEEK_Y,
  },
  backCard: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
    marginTop: 10,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
});
