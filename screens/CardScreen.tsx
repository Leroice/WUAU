import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, runOnJS } from 'react-native-reanimated';
import { CartesianChart, Line } from 'victory-native';
import { useTheme, Theme, SPACING } from '../theme';
import { Surface, WidgetCard, ListRow, StatusDot, ActionButton } from '../components/ui';
import { Squishy } from '../components/Squishy';
import { SystemIcon } from '../components/SystemIcon';
import { WalletCard } from '../components/WalletCard';
import { usePersona } from '../PersonaContext';
import {
  CARD_ACTIONS, CARD_SPENDS, CARD_INSIGHTS, CARD_SETTINGS, CARD_APPLE_PAY, CARD_SECTIONS,
} from '../mockData';

const SCREEN_PAD = 20;

// ─── Apple Pay setup banner ──────────────────────────────────────────────────
function ApplePayBanner({ c, onDismiss }: { c: Theme; onDismiss: () => void }) {
  return (
    <Surface c={c} style={styles.apBanner} padded={false}>
      <View style={styles.apContent}>
        <View style={styles.apBadge}>
          <SystemIcon ios="applelogo" android="apple" size={13} color="#FFFFFF" />
          <Text style={styles.apBadgeText}>{CARD_APPLE_PAY.badge}</Text>
        </View>
        <Text style={[styles.apTitle, { color: c.text }]}>{CARD_APPLE_PAY.title}</Text>
        <Text style={[styles.apSub, { color: c.muted }]}>{CARD_APPLE_PAY.subtitle}</Text>
      </View>
      <Pressable onPress={onDismiss} style={styles.apClose} accessibilityRole="button" accessibilityLabel="Dismiss">
        <SystemIcon ios="xmark" android="close" size={16} color={c.muted} />
      </Pressable>
    </Surface>
  );
}

// ─── Recent spend row (list item) ────────────────────────────────────────────
function SpendRow({ c, spend, divider }: { c: Theme; spend: typeof CARD_SPENDS[number]; divider: boolean }) {
  return (
    <>
      <Pressable style={styles.spendRow} accessibilityRole="button" accessibilityLabel={spend.merchant}>
        <View style={[styles.avatar, { backgroundColor: spend.color }]}>
          <Text style={[styles.avatarText, { color: spend.textColor }]}>{spend.initials}</Text>
        </View>
        <View style={styles.spendMeta}>
          <Text style={[styles.spendName, { color: c.text }]}>{spend.merchant}</Text>
          <Text style={[styles.spendDate, { color: c.muted }]}>{spend.date}</Text>
        </View>
        <View style={styles.spendRight}>
          <Text style={[styles.spendAmount, { color: c.text }]}>{spend.amount}</Text>
          <StatusDot c={c} color={spend.statusType === 'warning' ? c.warning : c.info} label={spend.status} />
        </View>
      </Pressable>
      {divider && <View style={[styles.rowDivider, { backgroundColor: c.border }]} />}
    </>
  );
}

// ─── Insights content (Skia/victory-native animated line chart) ──────────────
function InsightsContent({ c }: { c: Theme }) {
  const data = useMemo(
    () => CARD_INSIGHTS.thisMonth.map((y, i) => ({ day: i, thisMonth: y, lastMonth: CARD_INSIGHTS.lastMonth[i] })),
    [],
  );
  return (
    <View style={styles.insightsBody}>
      <View style={styles.insightsTop}>
        <View>
          <Text style={[styles.insightsLabel, { color: c.muted }]}>{CARD_INSIGHTS.period}</Text>
          <Text style={[styles.insightsAmount, { color: c.text }]}>{CARD_INSIGHTS.amount}</Text>
        </View>
        <View style={styles.deltaRow}>
          <Text style={[styles.deltaText, { color: c.error }]}>{CARD_INSIGHTS.delta}</Text>
          <SystemIcon
            ios={CARD_INSIGHTS.deltaUp ? 'arrow.up.circle.fill' : 'arrow.down.circle.fill'}
            android={CARD_INSIGHTS.deltaUp ? 'arrow-circle-up' : 'arrow-circle-down'}
            size={16}
            color={c.error}
          />
        </View>
      </View>

      <View style={styles.chart}>
        <CartesianChart
          data={data}
          xKey="day"
          yKeys={['thisMonth', 'lastMonth']}
          domainPadding={{ top: 10, bottom: 10 }}
        >
          {({ points }) => (
            <>
              <Line points={points.lastMonth} color={c.border} strokeWidth={2} curveType="natural" animate={{ type: 'timing', duration: 700 }} />
              <Line points={points.thisMonth} color={c.error} strokeWidth={3} curveType="natural" animate={{ type: 'timing', duration: 900 }} />
            </>
          )}
        </CartesianChart>
      </View>

      <View style={styles.axisRow}>
        {CARD_INSIGHTS.axis.map((t) => (
          <Text key={t} style={[styles.axisLabel, { color: c.muted }]}>{t}</Text>
        ))}
      </View>
    </View>
  );
}

// ─── Cards page ──────────────────────────────────────────────────────────────
export function CardScreen({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { persona } = usePersona();
  const [showApplePay, setShowApplePay] = useState(true);
  const [apHeight, setApHeight] = useState(0);
  const apShown = useSharedValue(1);
  const [flipped, setFlipped] = useState(false);

  const apStyle = useAnimatedStyle(() => ({
    height: apHeight ? apHeight * apShown.value : undefined,
    opacity: apShown.value,
  }));
  const dismissApplePay = () => {
    apShown.value = withTiming(0, { duration: 280 }, (fin) => {
      if (fin) runOnJS(setShowApplePay)(false);
    });
  };

  // Top navigation intentionally removed — clean slate, to be rebuilt fresh.

  const onAction = (key: string) => {
    if (key === 'details') setFlipped((f) => !f);
  };

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <WalletCard flipped={flipped} onToggle={() => setFlipped((f) => !f)} />

      {/* card actions */}
      <View style={styles.actionsRow}>
        {CARD_ACTIONS.map((a) => (
          <ActionButton key={a.key} icon={a.icon} label={a.label} onPress={() => onAction(a.key)} />
        ))}
      </View>

      {showApplePay && (
        <Animated.View
          style={[apStyle, { overflow: 'hidden' }]}
          onLayout={(e) => { if (!apHeight) setApHeight(e.nativeEvent.layout.height); }}
        >
          <ApplePayBanner c={c} onDismiss={dismissApplePay} />
        </Animated.View>
      )}

      {/* recent spends */}
      <WidgetCard c={c} title={CARD_SECTIONS.spends} onPressHeader={() => {}}>
        <View style={styles.listBody}>
          {persona.cardSpends.map((s, i) => (
            <SpendRow key={i} c={c} spend={s} divider={i < persona.cardSpends.length - 1} />
          ))}
        </View>
      </WidgetCard>

      {/* insights */}
      <WidgetCard c={c} title={CARD_SECTIONS.insights} onPressHeader={() => {}}>
        <InsightsContent c={c} />
      </WidgetCard>

      {/* settings */}
      <WidgetCard c={c} title={CARD_SECTIONS.settings} onPressHeader={() => {}}>
        <View style={styles.listBody}>
          {CARD_SETTINGS.map((item, i) => (
            <ListRow
              key={i}
              c={c}
              icon={item.icon}
              iconColor={c.muted}
              label={item.label}
              divider={i < CARD_SETTINGS.length - 1}
            />
          ))}
        </View>
      </WidgetCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SCREEN_PAD, paddingTop: SPACING.md, gap: SPACING.lg },
  headerBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  // actions
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, height: 60 },

  // apple pay banner
  apBanner: { flexDirection: 'row', alignItems: 'flex-start', padding: SPACING.lg },
  apContent: { flex: 1, gap: 6 },
  apBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#000000', alignSelf: 'flex-start',
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6,
  },
  apBadgeText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
  apTitle: { fontSize: 16, fontWeight: '700', marginTop: 2 },
  apSub: { fontSize: 13, lineHeight: 18 },
  apClose: { padding: 4, marginLeft: SPACING.md },

  // widget list body (rows inside a WidgetCard)
  listBody: { paddingHorizontal: SPACING.lg },

  // spend row
  spendRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700' },
  spendMeta: { flex: 1 },
  spendName: { fontSize: 15, fontWeight: '600' },
  spendDate: { fontSize: 11, marginTop: 2 },
  spendRight: { alignItems: 'flex-end', gap: 4 },
  spendAmount: { fontSize: 15, fontWeight: '600' },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },

  // insights
  insightsBody: { paddingHorizontal: SPACING.lg, paddingBottom: SPACING.lg },
  insightsTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md },
  insightsLabel: { fontSize: 13 },
  insightsAmount: { fontSize: 22, fontWeight: '700', marginTop: 2 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  deltaText: { fontSize: 14, fontWeight: '600' },
  chart: { height: 90 },
  axisRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: SPACING.sm },
  axisLabel: { fontSize: 11 },
});
