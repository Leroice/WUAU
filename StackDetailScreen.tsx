import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, Theme } from './theme';
import { SystemIcon } from './SystemIcon';
import { ActionButton, TransactionRow } from './components/ui';
import { STACK_TXNS, ACCOUNT_DETAIL } from './mockData';

const BTN_ROW_H = 60;

function closeButton(navigation: any, color: string) {
  return (
    <Pressable onPress={() => navigation.popToTop()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
      <SystemIcon ios="xmark" android="close" size={18} color={color} />
    </Pressable>
  );
}

// Animated SVG ring so the progress arc can sweep in on mount.
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Large stack doughnut with a progress ring. On mount the ring sweeps clockwise
// to its value while the whole doughnut gently scales/fades up — no overshoot,
// matching the app's calm motion language.
function BigStackEmoji({ c, emoji, progress, size = 104 }: { c: Theme; emoji: string; progress?: number; size?: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress ?? 0));
  const inner = size - 22;
  const draw = useRef(new Animated.Value(0)).current; // ring sweep 0 → 1 (SVG prop, JS-driven)
  const pop = useRef(new Animated.Value(0)).current;  // scale + opacity 0 → 1
  // Both JS-driven to keep a single paradigm: the SVG ring can't use the native
  // driver, and the scroll-collapse parent is JS-driven too.

  useEffect(() => {
    Animated.parallel([
      Animated.timing(draw, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      Animated.timing(pop, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [draw, pop]);

  return (
    <Animated.View
      style={{
        width: size, height: size, alignItems: 'center', justifyContent: 'center',
        opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
      }}
    >
      {progress != null && (
        <Svg width={size} height={size} style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-90deg' }] }]}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" />
          <AnimatedCircle
            cx={size / 2} cy={size / 2} r={r} stroke={c.accent} strokeWidth={stroke} fill="none"
            strokeDasharray={`${circ} ${circ}`}
            strokeDashoffset={draw.interpolate({ inputRange: [0, 1], outputRange: [circ, circ * (1 - p)] })}
            strokeLinecap="round"
          />
        </Svg>
      )}
      <View style={{ width: inner, height: inner, borderRadius: inner / 2, backgroundColor: c.pill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: Math.round(size * 0.42) }}>{emoji}</Text>
      </View>
    </Animated.View>
  );
}

/**
 * Stack detail (Figma 5-21356 / 5-21424). Native nav bar (back + ✕) over a
 * collapsing hero: emoji + progress ring, available balance, goal + target date,
 * and Add/Convert/More — the emoji, chip and buttons fade away on scroll,
 * revealing the date-grouped transaction list. Shares TransactionRow/ActionButton.
 */
export function StackDetailScreen({ navigation, route }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { width: screenW } = useWindowDimensions();
  const innerW = screenW - 32; // hero content width (16pt padding each side) — explicit so child widths resolve reliably under the sticky header
  const p = route?.params ?? {};
  const emoji: string = p.emoji ?? '💍';
  const name: string = p.name ?? 'Vow Renewal';
  const amount: string = p.amount ?? '1,800.56 AUD';
  const goalAmount: string | undefined = p.goalAmount ?? '13,000.00 AUD';
  const progress: number | undefined = p.progress ?? 0.14;
  const targetDate: string | undefined = p.targetDate ?? '01/09/2026';
  const pct = progress != null ? ` (${Math.round(progress * 100)}%)` : '';
  const sections = STACK_TXNS;
  const scrollY = useRef(new Animated.Value(0)).current;
  // Hero hugs its content: measure the collapsible blocks instead of hard-coding
  // heights, so a bigger doughnut or more padding is never clipped or constrained.
  const [emojiH0, setEmojiH0] = useState(104);
  const [extrasH0, setExtrasH0] = useState(160);

  useLayoutEffect(() => {
    navigation.setOptions({ title: name, headerRight: () => closeButton(navigation, c.text) });
  }, [navigation, c, name]);

  const COLLAPSE = 120; // scroll distance over which the hero extras collapse away
  const fade = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [1, 0], extrapolate: 'clamp' });
  const emojiH = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [emojiH0, 0], extrapolate: 'clamp' });
  const extrasH = scrollY.interpolate({ inputRange: [0, COLLAPSE], outputRange: [extrasH0, 0], extrapolate: 'clamp' });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: false })}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* sticky, collapsing hero */}
        <View style={[styles.hero, { backgroundColor: c.surface }]}>
          <Animated.View style={{ opacity: fade, height: emojiH, overflow: 'hidden', alignItems: 'center' }}>
            <View onLayout={(e) => setEmojiH0(e.nativeEvent.layout.height)} style={{ alignItems: 'center', width: innerW }}>
              <BigStackEmoji c={c} emoji={emoji} progress={progress} />
            </View>
          </Animated.View>
          <Text style={[styles.heroLabel, { color: c.muted }]}>{ACCOUNT_DETAIL.availableLabel}</Text>
          <Text style={[styles.heroAmount, { color: c.text }]}>{amount}</Text>
          {goalAmount ? <Text style={[styles.heroGoal, { color: c.muted }]}>Goal {goalAmount}{pct}</Text> : null}
          <Animated.View style={{ opacity: fade, height: extrasH, overflow: 'hidden', alignItems: 'center' }}>
            <View onLayout={(e) => setExtrasH0(e.nativeEvent.layout.height)} style={{ alignItems: 'center', width: innerW }}>
              <View style={{ height: 16 }} />
              {targetDate ? (
                <View style={[styles.chip, { backgroundColor: c.pill }]}>
                  <SystemIcon ios="calendar" android="event" size={13} color={c.text} />
                  <Text style={[styles.chipText, { color: c.text }]}>Target date: {targetDate}</Text>
                </View>
              ) : null}
              <View style={{ height: 26 }} />
              <View style={styles.heroButtons}>
                <ActionButton icon={{ ios: 'plus', android: 'add' }} label="Add" />
                <ActionButton icon={{ ios: 'arrow.left.arrow.right', android: 'swap-horiz' }} label="Convert" />
                <ActionButton icon={{ ios: 'ellipsis', android: 'more-horiz' }} label="More" />
              </View>
              <View style={{ height: 12 }} />
            </View>
          </Animated.View>
        </View>

        {/* transactions */}
        <View style={styles.list}>
          {sections.map((sec) => (
            <View key={sec.date} style={styles.section}>
              <Text style={[styles.sectionDate, { color: c.text }]}>{sec.date}</Text>
              {sec.items.map((t, i) => (
                <TransactionRow key={i} c={c} icon={t.icon} title={t.title} sub={t.sub} amount={t.amount} positive={t.positive} status={t.status} />
              ))}
            </View>
          ))}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, alignItems: 'center', gap: 4 },
  heroLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginTop: 4 },
  heroAmount: { fontSize: 32, fontFamily: 'PPRightGrotesk-WideMedium', textAlign: 'center' },
  heroGoal: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '500' },
  heroButtons: { flexDirection: 'row', gap: 8, height: BTN_ROW_H, width: '100%' },

  list: { paddingHorizontal: 16, gap: 8, marginTop: 4 },
  section: { gap: 8, marginTop: 8 },
  sectionDate: { fontSize: 16, fontWeight: '500' },
});
