import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  SharedValue, useAnimatedStyle, useSharedValue, interpolate, Extrapolation,
} from 'react-native-reanimated';
import { Theme } from '../constants/theme';
import { useDesign } from '../hooks/useDesign';
import { ActionButton } from './ui';

const STRETCH_RANGE = 220;   // pull-down distance to reach max scale (token: heroStretchScale controls the magnitude)

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
  /**
   * Optional visual prefix rendered ABOVE the label/amount/subtitle stack —
   * e.g. a jar doughnut, an avatar, a small chart. When stretchOnPull is on
   * AND headline is provided, only the headline scales (matches the
   * familiar pull-the-doughnut behaviour). When stretchOnPull is on without
   * a headline, the whole text block scales together.
   */
  headline?: React.ReactNode;
  /**
   * Optional inline metadata rendered BELOW the subtitle and ABOVE the
   * buttons — e.g. a target-date chip, a status badge, a small row of
   * tags. Never scales with stretchOnPull, never participates in collapse.
   */
  extras?: React.ReactNode;
  actions: HeroAction[];
  /**
   * Drives the collapse/stretch animations on the UI thread. Wire via
   *   const scrollY = useSharedValue(0);
   *   const onScroll = useAnimatedScrollHandler(e => { scrollY.value = e.contentOffset.y; });
   * and pass to an Animated.ScrollView with stickyHeaderIndices=[0] so the
   * hero stays pinned while content scrolls up behind it. Omit to render a
   * static (fully expanded) hero — useful in the library.
   */
  scrollY?: SharedValue<number>;
  /**
   * Default true. When false, the action-button row stays at full opacity /
   * height regardless of scroll position. Use this for screens where there
   * shouldn't be enough body content to need collapse (e.g. the main Accounts
   * page) — the header stays predictable, only stretching on pull-down.
   */
  collapseOnScroll?: boolean;
  /**
   * Default false. When true, the headline + label/amount/subtitle stack
   * scales up on pull-down (overscroll). The button row never scales.
   */
  stretchOnPull?: boolean;
};

/**
 * Generic collapsing hero — domain-agnostic so it can front any detail screen
 * (Account, Jar, Card insights, etc) or the Accounts overview. Label / amount
 * / subtitle stay pinned when used via stickyHeaderIndices=[0]. The button row
 * fades and clips against the hero's rounded bottom EDGE (overflow:hidden +
 * paddingBottom:0 — the wrapper itself does NOT clip, so the mask is the card
 * frame). A static 16pt sits beneath the buttons even when fully collapsed.
 *
 * Behaviour modes
 *   default            collapse on scroll, no stretch    → AccountDetail
 *   collapseOnScroll:false + stretchOnPull:true        → Accounts (locked
 *                      buttons, predictable header, elastic on pull-down)
 *   stretchOnPull:true (with default collapse)         → JarDetail (doughnut
 *                      headline scales on pull; buttons collapse on scroll)
 *
 * Pair with <CollapsingHeroBacking/> inside the same scroll view to keep the
 * surface colour above the hero on overscroll.
 *
 * All animation runs on the UI thread via reanimated — no JS-bridge per frame.
 */
export function CollapsingHero({
  c, label, amount, subtitle, headline, extras, actions, scrollY,
  collapseOnScroll = true,
  stretchOnPull = false,
}: CollapsingHeroProps) {
  const { tokens } = useDesign();
  // Pull token values out so the worklets capture stable primitives.
  const btnRowH = tokens.heroBtnRowH;
  const btnMarginTop = tokens.heroBtnMarginTop;
  const collapseRange = tokens.heroCollapseRange;
  const stretchScale = tokens.heroStretchScale;

  // Worklets need stable shape; fall back to a local SharedValue when the
  // caller doesn't drive the collapse (e.g. library previews).
  const fallback = useSharedValue(0);
  const sy = scrollY ?? fallback;

  // Button row: optional collapse on scroll (positive scrollY).
  const buttonsStyle = useAnimatedStyle(() => {
    if (!collapseOnScroll) {
      return { opacity: 1, height: btnRowH, marginTop: btnMarginTop };
    }
    return {
      opacity: interpolate(sy.value, [0, collapseRange], [1, 0], Extrapolation.CLAMP),
      height: interpolate(sy.value, [0, collapseRange], [btnRowH, 0], Extrapolation.CLAMP),
      marginTop: interpolate(sy.value, [0, collapseRange], [btnMarginTop, 0], Extrapolation.CLAMP),
    };
  }, [collapseOnScroll, btnRowH, btnMarginTop, collapseRange]);

  // Content block (headline + label + amount + subtitle): optional stretch on
  // pull (negative scrollY). Buttons stay static — they don't scale.
  const contentStretch = useAnimatedStyle(() => {
    const scale = stretchOnPull
      ? interpolate(sy.value, [-STRETCH_RANGE, 0], [stretchScale, 1], Extrapolation.CLAMP)
      : 1;
    return { transform: [{ scale }] };
  }, [stretchOnPull, stretchScale]);

  // With a headline present, stretch applies only to the headline (matches
  // the doughnut-pull-up gesture). Without a headline, stretch applies to the
  // whole text block. Either way the action row and extras stay still.
  const hasHeadline = !!headline;
  const headlineStretch = hasHeadline ? contentStretch : undefined;
  const textStretch = hasHeadline ? undefined : contentStretch;

  return (
    <View style={[styles.hero, { backgroundColor: c.surface, paddingTop: tokens.heroPadTop }]}>
      {headline ? (
        <Animated.View style={[styles.headlineSlot, headlineStretch]}>{headline}</Animated.View>
      ) : null}
      <Animated.View style={textStretch}>
        <Text style={[styles.heroLabel, { color: c.muted, fontSize: tokens.heroLabelSize }]}>{label}</Text>
        <Text style={[styles.heroAmount, { color: c.text, fontSize: tokens.heroAmountSize }]}>{amount}</Text>
        {subtitle ? <Text style={[styles.heroRef, { color: c.muted, fontSize: tokens.heroRefSize }]}>{subtitle}</Text> : null}
      </Animated.View>
      {extras ? <View style={styles.extrasSlot}>{extras}</View> : null}
      <Animated.View style={[styles.heroButtonsWrap, { marginBottom: tokens.heroBtnMarginBottom }, buttonsStyle]}>
        <View style={[styles.heroButtons, { height: btnRowH }]}>
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
  // paddingTop is driven by tokens.heroPadTop (applied inline)
  hero: {
    paddingHorizontal: 16,
    paddingBottom: 0,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  headlineSlot: { alignItems: 'center', marginBottom: 12 },
  extrasSlot: { alignItems: 'center', marginTop: 12 },
  // Font sizes driven by tokens (applied inline); weights / family / alignment stay here.
  heroLabel: { fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  heroAmount: { fontFamily: 'PPRightGrotesk-WideMedium', textAlign: 'center' },
  heroRef: { fontWeight: '500', marginTop: 4, textAlign: 'center' },
  // Wrapper collapses (height + marginTop + opacity all on UI thread). The row
  // itself stays a static 60pt — no per-frame layout on the buttons. The
  // wrapper has NO overflow:hidden — that would clip the buttons 16pt above
  // the hero's edge (at the wrapper's bottom), creating a visible gap during
  // collapse. We let the buttons overflow the wrapper into the 16pt margin so
  // the actual clipper is the HERO's overflow:hidden — i.e. the rounded bottom
  // edge of the card. marginBottom stays static 16 so the balance always has
  // 16pt of breathing room above that edge, including when fully collapsed.
  // marginBottom + button height driven by tokens (applied inline).
  heroButtonsWrap: { width: '100%' },
  heroButtons: { flexDirection: 'row', gap: 8, width: '100%' },
});
