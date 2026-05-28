import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  SharedValue, useAnimatedStyle, useSharedValue, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { Theme } from '../constants/theme';
import { ActionButton } from './ui';

const BTN_ROW_H = 60;
const COLLAPSE = 60; // scroll distance over which the buttons fade & collapse

export type HeroAction = {
  icon: { ios: string; android: string };
  label: string;
  onPress?: () => void;
};

export type CollapsingHeroProps = {
  c: Theme;
  label: string;
  amount: string;
  /** Optional small text below the amount (account ref, goal, target date, …). */
  subtitle?: string;
  actions: HeroAction[];
  /**
   * Drives the collapse animation on the UI thread. Wire via
   *   const scrollY = useSharedValue(0);
   *   const onScroll = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });
   * and pass to an Animated.ScrollView with stickyHeaderIndices=[0] so the
   * hero itself stays pinned while content scrolls up behind it. Omit to
   * render the static (fully expanded) hero — useful in the library.
   */
  scrollY?: SharedValue<number>;
};

/**
 * Generic collapsing hero — domain-agnostic so it can front any detail screen
 * (account, stack, card insights, etc). Label / amount / subtitle stay pinned
 * when used via stickyHeaderIndices=[0]; the action-button row fades and
 * collapses, masked by the hero's rounded bottom EDGE (overflow:hidden +
 * paddingBottom:0 — the wrapper itself does NOT clip, so the mask is the card
 * frame, not inner padding). A static 16pt sits beneath the buttons even when
 * fully collapsed, so the headline always has breathing room from the edge.
 * All animations run on the UI thread via reanimated — no JS-bridge per frame,
 * smooth on Android.
 *
 * Pair with <CollapsingHeroBacking/> inside the same scroll view to keep the
 * surface colour above the hero on overscroll.
 */
export function CollapsingHero({ c, label, amount, subtitle, actions, scrollY }: CollapsingHeroProps) {
  // Worklets need stable shape, so fall back to a local SharedValue when the
  // caller doesn't drive the collapse (e.g. library previews).
  const fallback = useSharedValue(0);
  const sy = scrollY ?? fallback;

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: interpolate(sy.value, [0, COLLAPSE], [1, 0], Extrapolation.CLAMP),
    height: interpolate(sy.value, [0, COLLAPSE], [BTN_ROW_H, 0], Extrapolation.CLAMP),
    marginTop: interpolate(sy.value, [0, COLLAPSE], [24, 0], Extrapolation.CLAMP),
  }));

  return (
    <View style={[styles.hero, { backgroundColor: c.surface }]}>
      <Text style={[styles.heroLabel, { color: c.muted }]}>{label}</Text>
      <Text style={[styles.heroAmount, { color: c.text }]}>{amount}</Text>
      {subtitle ? <Text style={[styles.heroRef, { color: c.muted }]}>{subtitle}</Text> : null}
      <Animated.View style={[styles.heroButtonsWrap, buttonsStyle]}>
        <View style={styles.heroButtons}>
          {actions.map((a, i) => (
            <ActionButton key={i} icon={a.icon} label={a.label} onPress={a.onPress} />
          ))}
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Surface-coloured backing for the area ABOVE the CollapsingHero on overscroll.
 * Render as a child of the same Animated.ScrollView (absolutely positioned at
 * top:-800 with zIndex:-1) so it scrolls with the content and fills the gap
 * between the sticky hero and the nav bar when the user pulls down.
 */
export function CollapsingHeroBacking({ c }: { c: Theme }) {
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top: -800, left: 0, right: 0, height: 800, backgroundColor: c.surface, zIndex: -1 }}
    />
  );
}

const styles = StyleSheet.create({
  // Hero: paddingBottom:0 + overflow:hidden so the rounded bottom edge IS the
  // mask. The button-row wrapper below sits flush with that edge; when it
  // shrinks the buttons disappear into the edge of the card, not inner padding.
  hero: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  heroLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  heroAmount: { fontSize: 32, fontFamily: 'PPRightGrotesk-WideMedium', textAlign: 'center' },
  heroRef: { fontSize: 12, fontWeight: '500', marginTop: 4, textAlign: 'center' },
  // Wrapper collapses (height + marginTop + opacity all on UI thread). The row
  // itself stays a static 60pt — no per-frame layout on the buttons. The
  // wrapper has NO overflow:hidden — that would clip the buttons 16pt above
  // the hero's edge (at the wrapper's bottom), creating a visible gap during
  // collapse. We let the buttons overflow the wrapper into the 16pt margin so
  // the actual clipper is the HERO's overflow:hidden — i.e. the rounded bottom
  // edge of the card. marginBottom stays static 16 so the balance always has
  // 16pt of breathing room above that edge, including when fully collapsed.
  heroButtonsWrap: { width: '100%', marginBottom: 16 },
  heroButtons: { flexDirection: 'row', gap: 8, height: BTN_ROW_H, width: '100%' },
});
