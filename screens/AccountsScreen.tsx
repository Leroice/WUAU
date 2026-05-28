import React, { useLayoutEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import { useTheme, Theme, WU_YELLOW } from '../constants/theme';
import { SystemIcon } from '../components/SystemIcon';
import { Squishy } from '../components/Squishy';
import { ActionButton, SegmentedControl } from '../components/ui';
import { usePersona } from '../hooks/usePersona';
import { ACCOUNTS_PAGE } from '../services/content';
import { useJars } from '../hooks/useJars';
import type { Jar } from '../types';

// Emoji flag in a 40pt circle (currency rows).
function Flag({ c, emoji }: { c: Theme; emoji: string }) {
  return (
    <View style={[styles.leadCircle, { backgroundColor: c.pill }]}>
      <Text style={styles.leadEmoji}>{emoji}</Text>
    </View>
  );
}

// Jar emoji in a circle with an optional progress ring (goal completion).
function JarEmoji({ c, emoji, progress }: { c: Theme; emoji: string; progress?: number }) {
  const size = 40;
  const stroke = 2.5;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(1, progress ?? 0));
  return (
    <View style={styles.lead}>
      {progress != null && (
        <Svg width={size} height={size} style={[StyleSheet.absoluteFill, { transform: [{ rotate: '-90deg' }] }]}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={c.border} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={c.accent}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={`${circ * p} ${circ}`}
            strokeLinecap="round"
          />
        </Svg>
      )}
      <View style={[styles.jarInner, { backgroundColor: c.pill }]}>
        <Text style={styles.jarEmoji}>{emoji}</Text>
      </View>
    </View>
  );
}

// One row in the Accounts list — leading visual + title/subtitle + amount/subAmount.
function AccountRow({
  c, leading, title, subtitle, amount, subAmount, onPress,
}: {
  c: Theme; leading: React.ReactNode; title: string; subtitle?: string; amount: string; subAmount?: string; onPress?: () => void;
}) {
  return (
    <Pressable style={[styles.row, { backgroundColor: c.surface }]} onPress={onPress} accessibilityRole="button" accessibilityLabel={title}>
      {leading}
      <View style={styles.rowBody}>
        <View style={styles.rowLeft}>
          <Text style={[styles.rowTitle, { color: c.text }]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={[styles.rowSub, { color: c.muted }]} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        <View style={styles.rowRight}>
          <Text style={[styles.rowAmount, { color: c.text }]} numberOfLines={1}>{amount}</Text>
          {subAmount ? <Text style={[styles.rowSub, { color: c.muted }]} numberOfLines={1}>{subAmount}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

/**
 * Accounts page (Figma WU Beta App 5-20294 Currencies / 5-20398 Jars). A
 * rounded-bottom header card (total balance + Add/Convert), a segmented control
 * toggling Currencies ⇄ Jars, the matching list, and an "Add new …" pill.
 */
export function AccountsScreen({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { persona } = usePersona();
  const { jars } = useJars();
  const [tab, setTab] = useState(0); // 0 = Currencies, 1 = Jars
  const [prevTab, setPrevTab] = useState(0); // outgoing tab, shown during a transition
  const [transitioning, setTransitioning] = useState(false);
  const progress = useRef(new Animated.Value(0)).current; // shared driver: pill + content move as one
  const home = persona.totalBalance.currency;

  // Tapping a segment runs ONE timing that drives the pill (inside SegmentedControl)
  // and the content cross-fade below off the same value — so they move in unison.
  const changeTab = (i: number) => {
    if (i === tab) return;
    setPrevTab(tab);
    setTab(i);
    setTransitioning(true);
    Animated.timing(progress, {
      toValue: i, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: false,
    }).start(({ finished }) => { if (finished) setTransitioning(false); });
  };

  // A content layer: full opacity at its own index, faded + slid aside toward neighbours.
  const SLIDE = 20;
  const layerStyle = (index: number) => ({
    opacity: progress.interpolate({ inputRange: [index - 1, index, index + 1], outputRange: [0, 1, 0], extrapolate: 'clamp' as const }),
    transform: [{ translateX: progress.interpolate({ inputRange: [index - 1, index, index + 1], outputRange: [SLIDE, 0, -SLIDE], extrapolate: 'clamp' as const }) }],
  });

  const renderRows = (which: number) =>
    which === 0
      ? persona.accounts.map((a: any, i: number) => (
          <AccountRow
            key={i}
            c={c}
            leading={<Flag c={c} emoji={a.flag} />}
            title={a.code}
            amount={`${a.amount} ${a.code}`}
            subAmount={a.code === home ? undefined : a.label}
            onPress={() => navigation.navigate('AccountDetail', { code: a.code, amount: a.amount })}
          />
        ))
      : jars.map((j: Jar, i: number) => (
          <AccountRow
            key={i}
            c={c}
            leading={<JarEmoji c={c} emoji={j.emoji} progress={j.progress} />}
            title={j.name}
            subtitle={j.goal}
            amount={j.amount}
            subAmount={j.subAmount}
            onPress={() => navigation.navigate('JarDetail', { emoji: j.emoji, name: j.name, amount: j.amount, goalAmount: j.goalAmount, progress: j.progress, targetDate: j.targetDate })}
          />
        ));

  // Native nav bar — title + close ✕ (no custom header chrome).
  useLayoutEffect(() => {
    navigation.setOptions({
      title: ACCOUNTS_PAGE.title,
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
          <SystemIcon ios="xmark" android="close" size={18} color={c.text} />
        </Pressable>
      ),
    });
  }, [navigation, c]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }} showsVerticalScrollIndicator={false} contentInsetAdjustmentBehavior="automatic">
        {/* Header card (white, rounded bottom) — flush under the native nav bar */}
        <View style={[styles.header, { backgroundColor: c.surface, paddingTop: 8 }]}>
          <View style={styles.totalBlock}>
            <Text style={[styles.totalLabel, { color: c.muted }]}>{ACCOUNTS_PAGE.totalLabel}</Text>
            <Text style={[styles.totalAmount, { color: c.text }]}>
              {persona.totalBalance.amount} {persona.totalBalance.currency}
            </Text>
          </View>

          <View style={styles.headerButtons}>
            <ActionButton icon={{ ios: 'plus', android: 'add' }} label="Add" />
            <ActionButton icon={{ ios: 'arrow.left.arrow.right', android: 'swap-horiz' }} label="Convert" />
          </View>
        </View>

        {/* Segmented control */}
        <View style={styles.segWrap}>
          <SegmentedControl c={c} options={ACCOUNTS_PAGE.tabs} selectedIndex={tab} onChange={changeTab} progress={progress} />
        </View>

        {/* List — incoming layer in flow; outgoing layer overlaid during the cross-fade */}
        <View style={styles.list}>
          <Animated.View style={[styles.rowsLayer, layerStyle(tab)]}>
            {renderRows(tab)}
          </Animated.View>
          {transitioning && (
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, styles.rowsLayer, layerStyle(prevTab)]}>
              {renderRows(prevTab)}
            </Animated.View>
          )}
        </View>

        {/* Add new */}
        <View style={styles.addWrap}>
          <Squishy
            scaleTo={0.96}
            style={styles.addBtn}
            accessibilityRole="button"
            accessibilityLabel={tab === 0 ? ACCOUNTS_PAGE.addCurrency : ACCOUNTS_PAGE.addJar}
          >
            <Text style={styles.addText}>{tab === 0 ? ACCOUNTS_PAGE.addCurrency : ACCOUNTS_PAGE.addJar}</Text>
          </Squishy>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // header card: white, rounded bottom 24, gap 24
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    gap: 24,
    alignItems: 'center',
  },
  totalBlock: { alignItems: 'center', gap: 8, width: '100%' },
  totalLabel: { fontSize: 14, fontWeight: '500' },
  totalAmount: { fontSize: 32, fontFamily: 'PPRightGrotesk-WideMedium', textAlign: 'center' },
  headerButtons: { flexDirection: 'row', gap: 8, width: '100%', height: 60 },

  segWrap: { paddingHorizontal: 16, alignItems: 'center', paddingTop: 24, paddingBottom: 24 },

  list: { paddingHorizontal: 16 },
  rowsLayer: { gap: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 16, borderRadius: 12 },
  rowBody: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  rowLeft: { flex: 1, gap: 2 },
  rowRight: { alignItems: 'flex-end', gap: 2 },
  rowTitle: { fontSize: 14 },
  rowSub: { fontSize: 12 },
  rowAmount: { fontSize: 14, fontWeight: '600' },

  // leading visuals
  lead: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  leadCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  leadEmoji: { fontSize: 22, lineHeight: 26 },
  jarInner: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  jarEmoji: { fontSize: 18, lineHeight: 22 },

  // add-new pill
  addWrap: { alignItems: 'center', marginTop: 16 },
  addBtn: { backgroundColor: WU_YELLOW, height: 32, borderRadius: 80, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center' },
  addText: { fontSize: 12, fontWeight: '600', color: '#000000' },
});
