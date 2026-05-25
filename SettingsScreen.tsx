import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  IconPerson, IconLock, IconPeople, IconCreditCard,
  IconDoc, IconChart, IconBell, IconBuilding, IconMobile,
  IconList, IconGift, IconMessage, IconPhone, IconLocation,
  IconChevronRight, IconHelp,
} from './Icons';
import { USER, SETTINGS } from './mockData';
import { Squishy } from './Squishy';

const WU_YELLOW = '#F5A623';

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

const SETTINGS_ITEMS = [
  { label: 'Profile', Icon: IconPerson },
  { label: 'Security', Icon: IconLock },
  { label: 'Manage contacts', Icon: IconPeople },
  { label: 'Payment settings', Icon: IconCreditCard },
  { label: 'Statements', Icon: IconDoc },
  { label: 'Exchange rate alerts', Icon: IconChart },
  { label: 'Marketing preferences', Icon: IconBell },
];

const MORE_SERVICES = [
  { label: 'Get loan', Icon: IconBuilding },
  { label: 'Mobile', Icon: IconMobile },
  { label: 'Pay bills', Icon: IconList },
  { label: 'Gifts', Icon: IconGift },
];

export function SettingsScreen() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <View style={[styles.nav, { paddingTop: insets.top + 8, backgroundColor: c.bg }]}>
        <Squishy
          onPress={() => navigation.goBack()}
          style={[styles.backBtn, { backgroundColor: c.pill }]}
          accessibilityRole="button"
          accessibilityLabel="Close settings"
        >
          <Text style={[styles.backLabel, { color: c.accent }]}>Done</Text>
        </Squishy>
        <Text style={[styles.navTitle, { color: c.text }]}>Profile & settings</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
      >
        <View style={[styles.userHeader, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={[styles.userAvatar, { backgroundColor: WU_YELLOW }]}>
            <Text style={styles.userAvatarText}>{USER.initials}</Text>
          </View>
          <View>
            <Text style={[styles.userName, { color: c.text }]}>{USER.firstName} {USER.lastName}</Text>
            <Text style={[styles.userLocation, { color: c.muted }]}>{USER.location}</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {SETTINGS_ITEMS.map((item, i) => (
            <View key={i}>
              <Squishy style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: c.pill }]}>
                  <item.Icon size={18} color={c.muted} />
                </View>
                <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
                <IconChevronRight size={16} color={c.muted} strokeWidth={2} />
              </Squishy>
              {i < SETTINGS_ITEMS.length - 1 && (
                <View style={[styles.divider, { backgroundColor: c.border, marginLeft: 56 }]} />
              )}
            </View>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>More services</Text>
        <View style={styles.moreRow}>
          {MORE_SERVICES.map((item, i) => (
            <Squishy key={i} style={[styles.moreItem, { backgroundColor: c.card, borderColor: c.border }]}>
              <View style={[styles.moreIcon, { backgroundColor: c.pill }]}>
                <item.Icon size={22} color={c.text} />
              </View>
              <Text style={[styles.moreLabel, { color: c.text }]}>{item.label}</Text>
            </Squishy>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>Legal and support</Text>
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border }]}>
          {[{ label: 'Legal notices', Icon: IconDoc }, { label: 'Get help', Icon: IconHelp }].map((item, i) => (
            <View key={i}>
              <Squishy style={styles.row}>
                <View style={[styles.iconWrap, { backgroundColor: c.pill }]}>
                  <item.Icon size={18} color={c.muted} />
                </View>
                <Text style={[styles.rowLabel, { color: c.text }]}>{item.label}</Text>
                <IconChevronRight size={16} color={c.muted} strokeWidth={2} />
              </Squishy>
              {i === 0 && <View style={[styles.divider, { backgroundColor: c.border, marginLeft: 56 }]} />}
            </View>
          ))}
        </View>

        <Text style={[styles.heading, { color: c.text }]}>Need help?</Text>
        <View style={styles.helpRow}>
          {[
            { label: 'Message us', Icon: IconMessage },
            { label: 'Call us', Icon: IconPhone },
            { label: 'Locations', Icon: IconLocation },
          ].map((item, i) => (
            <Squishy key={i} style={[styles.helpBtn, { backgroundColor: WU_YELLOW }]}>
              <item.Icon size={22} color="#000000" />
              <Text style={styles.helpLabel}>{item.label}</Text>
            </Squishy>
          ))}
        </View>

        <Squishy style={[styles.logoutBtn, { borderColor: c.border }]}>
          <Text style={[styles.logoutLabel, { color: c.text }]}>Log out</Text>
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
    padding: 16,
    gap: 12,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rowLabel: { flex: 1, fontSize: 16 },
  divider: { height: StyleSheet.hairlineWidth },
  heading: { fontSize: 20, fontWeight: '600', paddingHorizontal: 20, marginBottom: 12 },
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
