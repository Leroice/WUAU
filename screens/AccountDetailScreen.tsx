import React, { useLayoutEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../constants/theme';
import { SystemIcon } from '../components/SystemIcon';
import { TransactionRow } from '../components/ui';
import { CollapsingHero, CollapsingHeroBacking } from '../components/CollapsingHero';
import { ACCOUNT_DETAIL, ACCOUNT_MORE } from '../services/content';
import { useAccountDetail } from '../hooks/useAccountDetail';

// Close (✕) bar button — dismisses the whole accounts flow back to Home.
function closeButton(navigation: any, color: string) {
  return (
    <Pressable onPress={() => navigation.popToTop()} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close">
      <SystemIcon ios="xmark" android="close" size={18} color={color} />
    </Pressable>
  );
}

/**
 * Account detail (Figma 5-20465 / 5-20600 / 5-20556). Native nav bar (back + ✕)
 * over a <CollapsingHero/> wired sticky: balance/label/ref stay pinned, the
 * action-button row fades + collapses against the hero's rounded bottom edge,
 * and transactions scroll up BEHIND the hero (sticky headers sit above sibling
 * content in the z-stack). The companion <CollapsingHeroBacking/> keeps the
 * surface colour above the hero on overscroll. All animation runs on the UI
 * thread via reanimated, so Android stays smooth.
 */
export function AccountDetailScreen({ navigation, route }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const code: string = route?.params?.code ?? 'AUD';
  const amount: string = route?.params?.amount ?? '0.00';
  const { txns: sections, isLoading } = useAccountDetail(code);

  useLayoutEffect(() => {
    navigation.setOptions({ title: code, headerRight: () => closeButton(navigation, c.text) });
  }, [navigation, c, code]);

  const openMore = () => navigation.navigate('AccountMore', { code });

  // UI-thread scroll tracking — passed into the header so its collapse worklets
  // read scrollY directly (no JS-bridge crossings per frame).
  const scrollY = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

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
        {/* Sticky hero — index 0. Brings it to the top of the z-stack and
            pins it under the nav bar. */}
        <CollapsingHero
          c={c}
          label={ACCOUNT_DETAIL.availableLabel}
          amount={`${amount} ${code}`}
          subtitle={ACCOUNT_DETAIL.accountRef}
          scrollY={scrollY}
          actions={[
            { icon: { ios: 'arrow.up', android: 'arrow-upward' }, label: 'Send' },
            { icon: { ios: 'plus', android: 'add' }, label: 'Add' },
            { icon: { ios: 'arrow.left.arrow.right', android: 'swap-horiz' }, label: 'Convert' },
            { icon: { ios: 'ellipsis', android: 'more-horiz' }, label: 'More', onPress: openMore },
          ]}
        />

        {/* Backing for the area above the hero on overscroll. */}
        <CollapsingHeroBacking c={c} />

        {/* transactions, grouped by date — or empty state */}
        {sections.length === 0 && !isLoading ? (
          <View style={styles.empty}>
            <SystemIcon ios="tray" android="inbox" size={48} color={c.muted} />
            <Text style={[styles.emptyTitle, { color: c.text }]}>{ACCOUNT_DETAIL.emptyTitle}</Text>
            <Text style={[styles.emptySub, { color: c.muted }]}>{ACCOUNT_DETAIL.emptySubtitle}</Text>
          </View>
        ) : (
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
        )}
      </Animated.ScrollView>
    </View>
  );
}

/**
 * Account "More" — a NATIVE bottom sheet (presented as a formSheet). Copyable
 * account-info rows, View statements / Need help links, and Close account.
 */
export function AccountMoreSheet({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={{ backgroundColor: c.bg, paddingHorizontal: 16, paddingTop: 20, paddingBottom: insets.bottom + 16, gap: 16 }}>
        {/* account info — one card, copyable rows */}
        <View style={[styles.card, { backgroundColor: c.surface }]}>
          {ACCOUNT_MORE.rows.map((r, i) => (
            <View key={r.label}>
              <View style={styles.infoRow}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.infoLabel, { color: c.muted }]}>{r.label}</Text>
                  <Text style={[styles.infoValue, { color: c.text }]}>{r.value}</Text>
                </View>
                <Pressable hitSlop={8} accessibilityRole="button" accessibilityLabel={`Copy ${r.label}`}>
                  <SystemIcon ios="doc.on.doc" android="content-copy" size={20} color={c.text} />
                </Pressable>
              </View>
              {i < ACCOUNT_MORE.rows.length - 1 && <View style={[styles.infoDivider, { backgroundColor: c.border }]} />}
            </View>
          ))}
        </View>

        {/* link rows */}
        {ACCOUNT_MORE.links.map((l) => (
          <Pressable key={l.title} style={[styles.linkRow, { backgroundColor: c.surface }]} accessibilityRole="button" accessibilityLabel={l.title}>
            <View style={[styles.linkIcon, { backgroundColor: c.pill }]}>
              <SystemIcon ios={l.icon.ios} android={l.icon.android} size={20} color={c.text} />
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.infoValue, { color: c.text }]}>{l.title}</Text>
              <Text style={[styles.infoLabel, { color: c.muted }]}>{l.desc}</Text>
            </View>
          </Pressable>
        ))}

        <Pressable style={styles.closeRow} onPress={() => navigation.goBack()} accessibilityRole="button" accessibilityLabel={ACCOUNT_MORE.close}>
          <Text style={[styles.closeText, { color: c.error }]}>{ACCOUNT_MORE.close}</Text>
        </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // transaction list
  list: { paddingHorizontal: 16, gap: 8, marginTop: 4 },
  section: { gap: 8, marginTop: 8 },
  sectionDate: { fontSize: 16, fontWeight: '500' },

  // empty state
  empty: { alignItems: 'center', paddingTop: 80, paddingHorizontal: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, textAlign: 'center' },
  emptySub: { fontSize: 14, textAlign: 'center' },

  // more sheet
  card: { borderRadius: 16, paddingHorizontal: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 14 },
  infoLabel: { fontSize: 12 },
  infoValue: { fontSize: 16, fontWeight: '600' },
  infoDivider: { height: StyleSheet.hairlineWidth },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 16 },
  linkIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  closeRow: { alignItems: 'center', paddingVertical: 12 },
  closeText: { fontSize: 16, fontWeight: '600' },
});
