import React, { useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
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

// Large stack emoji (72pt) with a progress ring showing goal completion.
function BigStackEmoji({ c, emoji, progress }: { c: Theme; emoji: string; progress?: number }) {
  const size = 72;
  const stroke = 4;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress ?? 0));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {progress != null && (
        <Svg width={size} height={size} style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-90deg' }] }]}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" />
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.accent} strokeWidth={stroke} fill="none" strokeDasharray={`${circ * p} ${circ}`} strokeLinecap="round" />
        </Svg>
      )}
      <View style={{ width: size - 14, height: size - 14, borderRadius: (size - 14) / 2, backgroundColor: c.pill, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 32 }}>{emoji}</Text>
      </View>
    </View>
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

  useLayoutEffect(() => {
    navigation.setOptions({ title: name, headerRight: () => closeButton(navigation, c.text) });
  }, [navigation, c, name]);

  const fade = scrollY.interpolate({ inputRange: [0, 70], outputRange: [1, 0], extrapolate: 'clamp' });
  const emojiH = scrollY.interpolate({ inputRange: [0, 70], outputRange: [80, 0], extrapolate: 'clamp' });
  const extrasH = scrollY.interpolate({ inputRange: [0, 70], outputRange: [BTN_ROW_H + 40, 0], extrapolate: 'clamp' });

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
            <BigStackEmoji c={c} emoji={emoji} progress={progress} />
          </Animated.View>
          <Text style={[styles.heroLabel, { color: c.muted }]}>{ACCOUNT_DETAIL.availableLabel}</Text>
          <Text style={[styles.heroAmount, { color: c.text }]}>{amount}</Text>
          {goalAmount ? <Text style={[styles.heroGoal, { color: c.muted }]}>Goal {goalAmount}{pct}</Text> : null}
          <Animated.View style={{ opacity: fade, height: extrasH, overflow: 'hidden', alignItems: 'center', width: '100%' }}>
            {targetDate ? (
              <View style={[styles.chip, { backgroundColor: c.pill }]}>
                <SystemIcon ios="calendar" android="event" size={13} color={c.text} />
                <Text style={[styles.chipText, { color: c.text }]}>Target date: {targetDate}</Text>
              </View>
            ) : null}
            <View style={styles.heroButtons}>
              <ActionButton icon={{ ios: 'plus', android: 'add' }} label="Add" />
              <ActionButton icon={{ ios: 'arrow.left.arrow.right', android: 'swap-horiz' }} label="Convert" />
              <ActionButton icon={{ ios: 'ellipsis', android: 'more-horiz' }} label="More" />
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
  chip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 8 },
  chipText: { fontSize: 12, fontWeight: '500' },
  heroButtons: { flexDirection: 'row', gap: 8, height: BTN_ROW_H, width: '100%', marginTop: 12 },

  list: { paddingHorizontal: 16, gap: 8, marginTop: 4 },
  section: { gap: 8, marginTop: 8 },
  sectionDate: { fontSize: 16, fontWeight: '500' },
});
