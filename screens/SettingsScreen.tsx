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
import { SETTINGS } from '../mockData';
import { Squishy } from '../components/Squishy';
import { SystemIcon } from '../components/SystemIcon';
import { WU_YELLOW } from '../theme';
import { usePersona } from '../PersonaContext';

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

const LEGAL_ITEMS: { label: string; icon: IconSpec }[] = [
  { label: 'Legal notices', icon: { ios: 'doc.text.fill', android: 'description' } },
  { label: 'Get help', icon: { ios: 'questionmark.circle.fill', android: 'help-outline' } },
];

const MORE_SERVICES: { label: string; icon: IconSpec }[] = [
  { label: 'Get loan', icon: { ios: 'building.columns.fill', android: 'account-balance' } },
  { label: 'Mobile', icon: { ios: 'iphone', android: 'smartphone' } },
  { label: 'Pay bills', icon: { ios: 'list.bullet.rectangle.fill', android: 'receipt-long' } },
  { label: 'Gifts', icon: { ios: 'gift.fill', android: 'card-giftcard' } },
];

const HELP_ITEMS: { label: string; icon: IconSpec }[] = [
  { label: 'Message us', icon: { ios: 'message.fill', android: 'chat-bubble' } },
  { label: 'Call us', icon: { ios: 'phone.fill', android: 'call' } },
  { label: 'Locations', icon: { ios: 'mappin.and.ellipse', android: 'location-on' } },
];

// Flat menu row — icon + label only. No bounding box, no separator, no chevron.
function MenuRow({
  c, icon, label, onPress,
}: { c: typeof LIGHT; icon: IconSpec; label: string; onPress?: () => void }) {
  return (
    <Pressable
      style={styles.menuRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <SystemIcon ios={icon.ios} android={icon.android} size={22} color={c.text} />
      <Text style={[styles.menuLabel, { color: c.text }]}>{label}</Text>
    </Pressable>
  );
}

export function SettingsScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();
  const { persona } = usePersona();
  const user = persona.user;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 40 }}
      >
        {/* Profile summary — flat, no box */}
        <View style={styles.userHeader}>
          <View style={[styles.userAvatar, { backgroundColor: WU_YELLOW }]}>
            <Text style={styles.userAvatarText}>{user.initials}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: c.text }]}>{user.firstName} {user.lastName}</Text>
            <Text style={[styles.userLocation, { color: c.muted }]}>{user.location}</Text>
          </View>
        </View>

        {/* Menu — icon + label rows only. App settings leads to the design/demo
            screen, which now also hosts the Scenario switcher. */}
        <MenuRow
          c={c}
          icon={{ ios: 'slider.horizontal.3', android: 'tune' }}
          label={SETTINGS.appSettings}
          onPress={() => navigation.navigate('AppSettings')}
        />
        {SETTINGS_ITEMS.map((item) => (
          <MenuRow key={item.label} c={c} icon={item.icon} label={item.label} />
        ))}

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.moreServices}</Text>
        <View style={styles.moreRow}>
          {MORE_SERVICES.map((item, i) => (
            <Squishy key={i} style={[styles.moreItem, { backgroundColor: c.card, borderColor: c.border }]}>
              <SystemIcon ios={item.icon.ios} android={item.icon.android} size={24} color={c.text} />
              <Text style={[styles.moreLabel, { color: c.text }]}>{item.label}</Text>
            </Squishy>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.legal}</Text>
        {LEGAL_ITEMS.map((item) => (
          <MenuRow key={item.label} c={c} icon={item.icon} label={item.label} />
        ))}

        <Text style={[styles.heading, { color: c.text }]}>{SETTINGS.sections.needHelp}</Text>
        <View style={styles.helpRow}>
          {HELP_ITEMS.map((item, i) => (
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
          {'©'} {SETTINGS.copyright}{'\n'}App version {SETTINGS.appVersion}
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
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
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 13,
    paddingHorizontal: 20,
  },
  menuLabel: { fontSize: 16, fontWeight: '500' },
  heading: { fontSize: 20, fontWeight: '600', paddingHorizontal: 20, marginTop: 16, marginBottom: 12 },
  moreRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 16,
  },
  moreItem: {
    flex: 1,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  moreLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center' },
  helpRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
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
