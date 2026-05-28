import React, { useLayoutEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from './theme';
import { SystemIcon } from './SystemIcon';
import { ActionButton, TransactionRow } from './components/ui';
import { ACCOUNT_TXNS, ACCOUNT_DETAIL, ACCOUNT_MORE } from './mockData';

const BTN_ROW_H = 60;

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
 * over a sticky hero that collapses on scroll — the action buttons fade and
 * collapse away, revealing more of the date-grouped transaction list. "More"
 * opens a native bottom sheet.
 */
export function AccountDetailScreen({ navigation, route }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const code: string = route?.params?.code ?? 'AUD';
  const amount: string = route?.params?.amount ?? '0.00';
  const sections = ACCOUNT_TXNS;
  const scrollY = useRef(new Animated.Value(0)).current;

  useLayoutEffect(() => {
    navigation.setOptions({ title: code, headerRight: () => closeButton(navigation, c.text) });
  }, [navigation, c, code]);

  // Hero buttons fade + collapse over the first 60pt of scroll.
  const btnOpacity = scrollY.interpolate({ inputRange: [0, 60], outputRange: [1, 0], extrapolate: 'clamp' });
  const btnHeight = scrollY.interpolate({ inputRange: [0, 60], outputRange: [BTN_ROW_H, 0], extrapolate: 'clamp' });
  const btnGap = scrollY.interpolate({ inputRange: [0, 60], outputRange: [24, 0], extrapolate: 'clamp' });

  const openMore = () => navigation.navigate('AccountMore', { code });

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
          <Text style={[styles.heroLabel, { color: c.muted }]}>{ACCOUNT_DETAIL.availableLabel}</Text>
          <Text style={[styles.heroAmount, { color: c.text }]}>{amount} {code}</Text>
          <Text style={[styles.heroRef, { color: c.muted }]}>{ACCOUNT_DETAIL.accountRef}</Text>
          <Animated.View style={{ opacity: btnOpacity, height: btnHeight, marginTop: btnGap, width: '100%', overflow: 'hidden' }}>
            <View style={styles.heroButtons}>
              <ActionButton icon={{ ios: 'arrow.up', android: 'arrow-upward' }} label="Send" />
              <ActionButton icon={{ ios: 'plus', android: 'add' }} label="Add" />
              <ActionButton icon={{ ios: 'arrow.left.arrow.right', android: 'swap-horiz' }} label="Convert" />
              <ActionButton icon={{ ios: 'ellipsis', android: 'more-horiz' }} label="More" onPress={openMore} />
            </View>
          </Animated.View>
        </View>

        {/* transactions, grouped by date — or empty state */}
        {sections.length === 0 ? (
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
  // hero (white, rounded bottom, sits flush under the native bar)
  hero: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
  heroLabel: { fontSize: 14, fontWeight: '500', textAlign: 'center', marginBottom: 8 },
  heroAmount: { fontSize: 32, fontFamily: 'PPRightGrotesk-WideMedium', textAlign: 'center' },
  heroRef: { fontSize: 12, fontWeight: '500', marginTop: 4, textAlign: 'center' },
  heroButtons: { flexDirection: 'row', gap: 8, height: BTN_ROW_H },

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
