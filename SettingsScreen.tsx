import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SETTINGS } from './mockData';
import { Squishy } from './Squishy';
import { SystemIcon } from './SystemIcon';
import { WU_YELLOW } from './theme';
import { usePersona, PERSONAS } from './PersonaContext';

type IconSpec = { ios: string; android: string };

const LIGHT = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E8E93',
  accent: '#1A6FD4',
  border: '#E5E5EA',
  pill: '#EBEBEB',
};

const DARK = {
  bg: '#000000',
  card: '#1C1C1E',
  text: '#FFFFFF',
  muted: '#8E8E93',
  accent: '#4DA3FF',
  border: '#2C2C2E',
  pill: '#2C2C2E',
};

const SETTINGS_ITEMS: { label: string; icon: IconSpec }[] = [
  { label: 'Profile', icon: { ios: 'person.crop.circle', android: 'person' } },
  { label: 'Security', icon: { ios: 'lock.fill', android: 'lock' } },
  { label: 'Manage contacts', icon: { ios: 'person.2.fill', android: 'group' } },
  { label: 'Payment settings', icon: { ios: 'creditcard.fill', android: 'credit-card' } },
  { label: 'Statements', icon: { ios: 'doc.text.fill', android: 'description' } },
  { label: 'Exchange rate alerts', icon: { ios: 'chart.line.uptrend.xyaxis', android: 'show-chart' } },
  { label: 'Marketing preferences', icon: { ios: 'bell.fill', android: 'notifications' } },
];

const MORE_SERVICES: { label: string; icon: IconSpec }[] = [
  { label: 'Get loan', icon: { ios: 'building.columns.fill', android: 'account-balance' } },
  { label: 'Mobile', icon: { ios: 'iphone', android: 'smartphone' } },
  { label: 'Pay bills', icon: { ios: 'list.bullet.rectangle.fill', android: 'receipt-long' } },
  { label: 'Gifts', icon: { ios: 'gift.fill', android: 'card-giftcard' } },
];

export function SettingsScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();
  const { persona, setPersona } = usePersona();
  const user = persona.user;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={[styles.userHeader, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.userAvatar, { backgroundColor: WU_YELLOW }]}>
            <Text style={styles.userAvatarText}>{user.initials}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: c.text }]}>{user.firstName} {user.lastName}</Text>
            <Text style={[styles.userLocation, { color: c.muted }]}>{user.location}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          <Pressable style={styles.row} onPress={() => navigation.navigate('ComponentLibrary')}>
            <View style={[styles.iconWrap, { backgroundColor: c.pill }]}>
              <SystemIcon ios="square.on.square" android="dashboard-customize" size={20} color={c.muted} />
            </View>
            <Text style={[styles.rowLabel, { color: c.text }]}>{SETTINGS.componentLibrary}</Text>
            <SystemIcon ios="chevron.right" android="chevron-right" size={14} color={c.muted} />
          </Pressable>
        </View>

        <Text style={[styles.heading, { color: c.text }]}>Scenario</Text>
        <View style={styles.personaRow}>
          {PERSONAS.map((p) => {
            const active = p.id === persona.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPersona(p.id)}
                style={[styles.personaChip, { backgroundColor: active ? WU_YELLOW : c.card, borderColor: active ? WU_YELLOW : c.border }]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.personaLabel, { color: active ? '#000000' : c.text }]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.personaBlurb, { color: c.muted }]}>{persona.blurb}</Text>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {SETTINGS_ITEMS.map((item, i) => (
            <View key={i}>
              <Pressable style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: c.pill }]}>
                  <SystemIcon ios={item.icon.ios} android={item.icon.android} size={20} color={c.muted} />
                </View>
                <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
                <SystemIcon ios="chevron.right" android="chevron-right" size={14} color={c.muted} />
              </Pressable>
              {i < SETTINGS_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: c.border, marginLeft: 64 }]} />
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.moreServices}</Text>
        <View style={styles.moreRow}>
          {MORE_SERVICES.map((item, i) => (
            <Squishy key={i} style={[styles.moreItem, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={[styles.moreIcon, { backgroundColor: c.pill }]}>
                <SystemIcon ios={item.icon.ios} android={item.icon.android} size={22} color={c.text} />
              </View>
              <Text style={[styles.moreLabel, { color: c.text }]}>{item.label}</Text>
            </Squishy>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.legal}</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {[
            { label: 'Legal notices', icon: { ios: 'doc.text.fill', android: 'description' } },
            { label: 'Get help', icon: { ios: 'questionmark.circle.fill', android: 'help-outline' } },
          ].map((item, i) => (
            <View key={i}>
              <Pressable style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: c.pill }]}>
                  <SystemIcon ios={item.icon.ios} android={item.icon.android} size={20} color={c.muted} />
                </View>
                <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
                <SystemIcon ios="chevron.right" android="chevron-right" size={14} color={c.muted} />
              </Pressable>
              {i === 0 && <View style={[styles.divider, { backgroundColor: c.border, marginLeft: 64 }]} />}
            </View>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.needHelp}</Text>
        <View style={styles.helpRow}>
          {[
            { label: 'Message us', icon: { ios: 'message.fill', android: 'chat-bubble' } },
            { label: 'Call us', icon: { ios: 'phone.fill', android: 'call' } },
            { label: 'Locations', icon: { ios: 'mappin.and.ellipse', android: 'location-on' } },
          ].map((item, i) => (
            <Squishy key={i} style={[styles.helpBtn, { backgroundColor: WU_YELLOW }]}>
              <SystemIcon ios={item.icon.ios} android={item.icon.android} size={22} color="#000000" />
              <Text style={styles.helpLabel}>{item.label}</Text>
            </Squishy>
          ))}
        </View>

        <Squishy style={[styles.logoutBtn, { borderColor: c.border }]}>
          <Text style={[styles.logoutLabel, { color: c.text }]}>{SETTINGS.logout}</Text>
        </Squishy>

        <Text style={[styles.copyright, { color: c.muted }]}>
          {'\u00a9'} {SETTINGS.copyright}{'\n'}App version {SETTINGS.appVersion}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  navTitle: { fontSize: 17, fontWeight: '600' },
  backBtn: {
    minWidth: 60,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backLabel: { fontSize: 17, fontWeight: '400' },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    marginBottom: 24,
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatarText: { fontSize: 18, fontWeight: '700', color: '#000000' },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  userLocation: { fontSize: 13 },
  card: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    marginBottom: 32,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth },
  heading: { fontSize: 20, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12 },
  personaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 20 },
  personaChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  personaLabel: { fontSize: 14, fontWeight: '600' },
  personaBlurb: { fontSize: 13, paddingHorizontal: 20, marginTop: 10, marginBottom: 8, lineHeight: 18 },
  moreRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  moreItem: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  moreIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  helpRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  helpBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
  },
  helpLabel: { fontSize: 12, fontWeight: '600', color: '#000000', textAlign: 'center' },
  logoutBtn: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutLabel: { fontSize: 16, fontWeight: '500' },
  copyright: { fontSize: 12, textAlign: 'center', lineHeight: 18, paddingHorizontal: 20 },
});
