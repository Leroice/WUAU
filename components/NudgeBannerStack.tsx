import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '../constants/theme';
import { NudgeBanner } from './NudgeBanner';
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
 * after this." Dismiss (X) on the top card promotes the back card; the engine
 * supplies the next in priority for the back slot.
 *
 * Pagination dots underneath show 1/2 or 2/2. No swipe — the user's spec is
 * tap-to-dismiss reveals next. Pass `style` to add outer margins.
 */
export function NudgeBannerStack({ style }: { style?: any }) {
  const c = useTheme();
  const nudges = useNudges('home_banner'); // engine already caps at 2
  const { dismiss, setFlag } = useNudgeActions();

  const handleCta = useCallback((n: Nudge) => {
    // Demo behaviour: flip the matching flag so the queue advances. In a real
    // build, this also navigates (e.g. open the Apple Pay setup sheet).
    const action = n.content.cta?.action;
    const flag = action ? CTA_FLAG_MAP[action] : undefined;
    if (flag) setFlag(flag, true);
  }, [setFlag]);

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
        <NudgeBanner
          nudge={front}
          onCta={() => handleCta(front)}
          onDismiss={() => dismiss(front.id)}
        />
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
