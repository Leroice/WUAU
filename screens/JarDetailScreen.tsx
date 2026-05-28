import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated as RNAnimated, Easing } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, Theme } from '../constants/theme';
import { SystemIcon } from '../components/SystemIcon';
import { TransactionRow } from '../components/ui';
import { CollapsingHero, CollapsingHeroBacking } from '../components/CollapsingHero';
import { ACCOUNT_DETAIL } from '../services/content';
import { useJarDetail } from '../hooks/useJarDetail';

function closeButton(navigation: any, color: string) {
  return (
    <Pressable onPress={() => navigation.popToTop()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
      <SystemIcon ios="xmark" android="close" size={18} color={color} />
    </Pressable>
  );
}

// Animated SVG ring so the progress arc can sweep in on mount.
const AnimatedCircle = RNAnimated.createAnimatedComponent(Circle);

/**
 * Large jar doughnut with a progress ring. On mount the ring sweeps clockwise
 * to its value while the whole doughnut gently scales/fades up. The pull-down
 * stretch is delegated to CollapsingHero — this component only owns its
 * mount-time entrance.
 */
function BigJarEmoji({ c, emoji, progress, size = 104 }: { c: Theme; emoji: string; progress?: number; size?: number }) {
  const stroke = 5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress ?? 0));
  const inner = size - 22;
  const draw = useRef(new RNAnimated.Value(0)).current; // ring sweep 0 → 1 (SVG prop, JS-driven)
  const pop = useRef(new RNAnimated.Value(0)).current;  // scale + opacity 0 → 1

  useEffect(() => {
    RNAnimated.parallel([
      RNAnimated.timing(draw, { toValue: 1, duration: 700, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
      RNAnimated.timing(pop, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: false }),
    ]).start();
  }, [draw, pop]);

  return (
    <RNAnimated.View
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
    </RNAnimated.View>
  );
}

/**
 * Jar detail (Figma 5-21356 / 5-21424). Now front-ended by <CollapsingHero/>:
 *   headline    BigJarEmoji (mount entrance still owned here)
 *   subtitle    "Goal X (Y%)"
 *   extras      target-date chip
 *   actions     Add / Convert / More
 *   stretchOnPull   doughnut elastic on pull-down
 *   collapseOnScroll buttons fade + clip at the rounded bottom edge
 *
 * <CollapsingHeroBacking/> keeps the surface above the hero on overscroll.
 * Sticky via the parent ScrollView's stickyHeaderIndices=[0] — content
 * scrolls up behind the hero (sticky brings it to the top of the z-stack).
 */
export function JarDetailScreen({ navigation, route }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const p = route?.params ?? {};
  const emoji: string = p.emoji ?? '💍';
  const name: string = p.name ?? 'Vow Renewal';
  const amount: string = p.amount ?? '1,800.56 AUD';
  const goalAmount: string | undefined = p.goalAmount ?? '13,000.00 AUD';
  const progress: number | undefined = p.progress ?? 0.14;
  const targetDate: string | undefined = p.targetDate ?? '01/09/2026';
  const pct = progress != null ? ` (${Math.round(progress * 100)}%)` : '';
  const goalSubtitle = goalAmount ? `Goal ${goalAmount}${pct}` : undefined;
  const { txns: sections } = useJarDetail(name);

  // UI-thread scroll tracking — passed to CollapsingHero for collapse + stretch.
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  useLayoutEffect(() => {
    navigation.setOptions({ title: name, headerRight: () => closeButton(navigation, c.text) });
  }, [navigation, c, name]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Sticky hero — index 0. Doughnut stretches on pull-down; buttons
            collapse + clip against the rounded bottom edge on scroll-up. */}
        <CollapsingHero
          c={c}
          label={ACCOUNT_DETAIL.availableLabel}
          amount={amount}
          subtitle={goalSubtitle}
          headline={<BigJarEmoji c={c} emoji={emoji} progress={progress} />}
          extras={targetDate ? (
            <View style={[styles.chip, { backgroundColor: c.pill }]}>
              <SystemIcon ios="calendar" android="event" size={13} color={c.text} />
              <Text style={[styles.chipText, { color: c.text }]}>Target date: {targetDate}</Text>
            </View>
          ) : undefined}
          scrollY={scrollY}
          stretchOnPull
          actions={[
            { icon: { ios: 'plus', android: 'add' }, label: 'Add' },
            { icon: { ios: 'arrow.left.arrow.right', android: 'swap-horiz' }, label: 'Convert' },
            { icon: { ios: 'ellipsis', android: 'more-horiz' }, label: 'More' },
          ]}
        />

        {/* Overscroll backing — surface colour extends above the hero. */}
        <CollapsingHeroBacking c={c} />

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
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipText: { fontSize: 12, fontWeight: '500' },

  list: { paddingHorizontal: 16, gap: 8, marginTop: 4 },
  section: { gap: 8, marginTop: 8 },
  sectionDate: { fontSize: 16, fontWeight: '500' },
});
