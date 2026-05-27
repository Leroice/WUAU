import React from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Theme, SPACING } from './theme';
import { WidgetCard, ActionButton, StatusDot } from './components/ui';
import { Squishy } from './Squishy';
import { usePersona } from './PersonaContext';
import {
  PAYMENTS_SECTIONS, PAYMENTS_CONTACTS, PAYMENTS_ACTIONS, PAYMENTS_UPCOMING, PAYMENTS_RECENT,
} from './mockData';

const SCREEN_PAD = 20;

// Contact avatar + flag badge + name (Contacts widget).
function ContactChip({ c, item }: { c: Theme; item: typeof PAYMENTS_CONTACTS[number] }) {
  return (
    <Pressable style={styles.contact} accessibilityRole="button" accessibilityLabel={item.name}>
      <View style={[styles.contactAv, { backgroundColor: item.color }]}>
        <Text style={[styles.contactInitials, { color: item.textColor }]}>{item.initials}</Text>
        <Text style={styles.contactFlag}>{item.flag}</Text>
      </View>
      <Text style={[styles.contactName, { color: c.text }]} numberOfLines={1}>{item.name}</Text>
    </Pressable>
  );
}

// Upcoming payment card (grey inner card in the carousel).
function UpcomingCard({ c, item }: { c: Theme; item: typeof PAYMENTS_UPCOMING[number] }) {
  return (
    <View style={[styles.upCard, { backgroundColor: c.pill }]}>
      <View style={[styles.upAv, { backgroundColor: item.color }]}>
        <Text style={[styles.upAvText, { color: item.textColor }]}>{item.initials}</Text>
      </View>
      <View style={styles.upText}>
        <View style={styles.upAmountRow}>
          <Text style={[styles.upAmount, { color: c.text }]}>{item.amount}</Text>
          <Text style={[styles.upCurrency, { color: c.text }]}>{item.currency}</Text>
        </View>
        <Text style={[styles.upDesc, { color: c.muted }]} numberOfLines={1}>{item.desc}</Text>
      </View>
    </View>
  );
}

// Recent payment row (status dot OR action link on the right).
function PaymentRow({ c, item, divider }: { c: Theme; item: typeof PAYMENTS_RECENT[number]; divider: boolean }) {
  const status = 'status' in item ? item.status : undefined;
  const action = 'action' in item ? item.action : undefined;
  return (
    <>
      <Pressable style={styles.payRow} accessibilityRole="button" accessibilityLabel={item.name}>
        <View style={[styles.avatar, { backgroundColor: item.color }]}>
          <Text style={[styles.avatarText, { color: item.textColor }]}>{item.initials}</Text>
        </View>
        <View style={styles.payMeta}>
          <Text style={[styles.payName, { color: c.text }]}>{item.name}</Text>
          <Text style={[styles.payDate, { color: c.muted }]}>{item.date}</Text>
        </View>
        <View style={styles.payRight}>
          <Text style={[styles.payAmount, { color: 'positive' in item && item.positive ? c.success : c.text }]}>{item.amount}</Text>
          {status ? (
            <StatusDot c={c} color={item.statusType === 'warning' ? c.warning : c.info} label={status} />
          ) : (
            <Text style={[styles.payAction, { color: c.accent }]}>{action}</Text>
          )}
        </View>
      </Pressable>
      {divider && <View style={[styles.rowDivider, { backgroundColor: c.border }]} />}
    </>
  );
}

export function PaymentsScreen({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { persona } = usePersona();

  // Top navigation intentionally removed — clean slate, to be rebuilt fresh.

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 96 }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* contacts */}
      <WidgetCard c={c} title={PAYMENTS_SECTIONS.contacts} onPressHeader={() => {}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {persona.paymentsContacts.map((item, i) => (
            <ContactChip key={i} c={c} item={item} />
          ))}
        </ScrollView>
      </WidgetCard>

      {/* action buttons */}
      <View style={styles.actionsRow}>
        {PAYMENTS_ACTIONS.map((a) => (
          <ActionButton key={a.key} icon={a.icon} label={a.label} />
        ))}
      </View>

      {/* upcoming */}
      <WidgetCard c={c} title={PAYMENTS_SECTIONS.upcoming} onPressHeader={() => {}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
          snapToInterval={252 + SPACING.md}
          snapToAlignment="start"
          decelerationRate="fast"
        >
          {persona.paymentsUpcoming.map((item, i) => (
            <UpcomingCard key={i} c={c} item={item} />
          ))}
        </ScrollView>
      </WidgetCard>

      {/* recent payments */}
      <WidgetCard c={c} title={PAYMENTS_SECTIONS.recent} onPressHeader={() => {}}>
        <View style={styles.listBody}>
          {persona.paymentsRecent.map((item, i) => (
            <PaymentRow key={i} c={c} item={item} divider={i < persona.paymentsRecent.length - 1} />
          ))}
        </View>
      </WidgetCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingHorizontal: SCREEN_PAD, paddingTop: SPACING.md, gap: SPACING.lg },
  headerBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  carousel: { paddingLeft: 12, paddingRight: 12, paddingBottom: SPACING.lg, gap: SPACING.md },

  // contacts
  contact: { width: 64, alignItems: 'center', gap: 8 },
  contactAv: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  contactInitials: { fontSize: 18, fontWeight: '700' },
  contactFlag: { position: 'absolute', bottom: -2, right: -2, fontSize: 16 },
  contactName: { fontSize: 12, fontWeight: '500' },

  // action buttons
  actionsRow: { flexDirection: 'row', gap: SPACING.sm, height: 60 },

  // upcoming card
  upCard: { width: 252, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  upAv: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  upAvText: { fontSize: 14, fontWeight: '700' },
  upText: { flex: 1 },
  upAmountRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  upAmount: { fontSize: 20, fontWeight: '800' },
  upCurrency: { fontSize: 13, fontWeight: '600' },
  upDesc: { fontSize: 12, marginTop: 2 },

  // recent list
  listBody: { paddingHorizontal: SPACING.lg },
  payRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, paddingVertical: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700' },
  payMeta: { flex: 1 },
  payName: { fontSize: 15, fontWeight: '600' },
  payDate: { fontSize: 11, marginTop: 2 },
  payRight: { alignItems: 'flex-end', gap: 4 },
  payAmount: { fontSize: 15, fontWeight: '600' },
  payAction: { fontSize: 13, fontWeight: '600' },
  rowDivider: { height: StyleSheet.hairlineWidth, marginLeft: 52 },
});
