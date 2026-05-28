import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  useColorScheme,
  StatusBar,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActionButton, WidgetCard, Carousel, CarouselCard, CAROUSEL_CARD_W, HeaderIconButton } from '../components/ui';
import { ParticleBalance } from '../components/ParticleBalance';
import { Squishy } from '../components/Squishy';
import { ConverterWidget } from '../components/ConverterWidget';
import { usePersona } from '../hooks/usePersona';
import { WU_YELLOW } from '../constants/theme';
import { HOME, QUICK_ACTIONS } from '../services/content';
import { SCREEN_PAD, CARD_GAP, CARD_WIDTH } from '../constants/layout';

// NOTE: Home keeps a local palette for now (pixel-identical to the previous
// inline theme). Migrating it to useTheme() is a tracked cleanup, kept out of the
// structural refactor so colours don't shift.
const LIGHT = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E8E93',
  accent: '#1A6FD4',
  border: '#E5E5EA',
  divider: '#C6C6C8',
  pill: '#EBEBEB',
  warning: '#EA7E00',
  info: '#239AF6',
  error: '#DC2626',
  success: '#1A8A4A',
};

const DARK = {
  bg: '#000000',
  card: '#1C1C1E',
  surface: '#1C1C1E',
  text: '#FFFFFF',
  muted: '#8E8E93',
  accent: '#4DA3FF',
  border: '#2C2C2E',
  divider: '#3A3A3C',
  pill: '#2C2C2E',
  warning: '#EA7E00',
  info: '#239AF6',
  error: '#FF6B6B',
  success: '#30D158',
};

export function HomeScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();
  const { persona } = usePersona();
  const { accounts, totalBalance, contacts, transactions } = persona;
  const [balanceHidden, setBalanceHidden] = useState(false);
  const reveal = useRef(new Animated.Value(0)).current; // 0 = balance shown, 1 = particles

  useEffect(() => {
    Animated.spring(reveal, { toValue: balanceHidden ? 1 : 0, useNativeDriver: false, speed: 12, bounciness: 6 }).start();
  }, [balanceHidden, reveal]);

  const labelOpacity = reveal.interpolate({ inputRange: [0, 0.6], outputRange: [1, 0], extrapolate: 'clamp' });
  const linkOpacity = reveal.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });
  const pillOpacity = reveal.interpolate({ inputRange: [0.4, 1], outputRange: [0, 1], extrapolate: 'clamp' });
  const pillTranslate = reveal.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  // Scales down from center as the balance returns (faux "blur out").
  const pillScale = reveal.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] });

  // Stock iOS bar: the profile control (left) is set once on the tab stack; the
  // eye (right) toggles the hidden-balance reveal and lives here since it owns
  // that state. The icon flips eye ⇄ eye.slash with the current state.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderIconButton
          label={balanceHidden ? 'Show balance' : 'Hide balance'}
          onPress={() => setBalanceHidden((h) => !h)}
          ios={balanceHidden ? 'eye.slash' : 'eye'}
          android={balanceHidden ? 'visibility-off' : 'visibility'}
        />
      ),
    });
  }, [navigation, balanceHidden]);

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <ScrollView
        style={{ backgroundColor: c.bg }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* BALANCE HERO */}
        <View style={styles.hero}>
          <Animated.Text style={[styles.balanceLabel, { color: c.muted, opacity: labelOpacity }]}>{HOME.totalBalanceLabel}</Animated.Text>
          <View style={styles.balanceWrap}>
            <ParticleBalance
              amount={totalBalance.amount}
              currency={totalBalance.currency}
              hidden={balanceHidden}
              color={c.text}
              accent={WU_YELLOW}
            />
          </View>
          <View style={styles.heroLinkSlot}>
            {/* text link (balance shown) */}
            <Animated.View
              style={[styles.heroLinkLayer, { opacity: linkOpacity }]}
              pointerEvents={balanceHidden ? 'none' : 'auto'}
            >
              <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate('Accounts')}>
                <Text style={[styles.viewAll, { color: c.accent }]}>{HOME.viewAllAccounts}</Text>
              </TouchableOpacity>
            </Animated.View>
            {/* pill button (particles) — rises into the hero */}
            <Animated.View
              style={[styles.heroLinkLayer, { opacity: pillOpacity, transform: [{ translateY: pillTranslate }, { scale: pillScale }] }]}
              pointerEvents={balanceHidden ? 'auto' : 'none'}
            >
              <Squishy
                scaleTo={0.96}
                onPress={() => navigation.navigate('Accounts')}
                style={[styles.viewPill, { backgroundColor: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.16)' }]}
                accessibilityRole="button"
                accessibilityLabel="View all accounts"
              >
                <Text style={[styles.viewPillText, { color: c.text }]}>{HOME.viewAllAccounts}</Text>
              </Squishy>
            </Animated.View>
          </View>
        </View>

        {/* CURRENCY CARDS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsRow}
          style={styles.cardsScroll}
          pagingEnabled={false}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + CARD_GAP}
          snapToAlignment="start"
        >
          {accounts.map((a, i) => (
            <Squishy
              key={i}
              scaleTo={0.97}
              onPress={() => navigation.navigate('AccountDetail', { code: a.code, amount: a.amount })}
              style={[styles.currencyCard, { backgroundColor: dark ? 'rgba(28,28,30,0.85)' : 'rgba(255,255,255,0.85)', borderColor: c.border }]}
            >
              <View style={styles.cardInner}>
                <View style={styles.cardFlagWrap}>
                  <Text style={styles.flagText}>{a.flag}</Text>
                </View>
                <View style={styles.cardTextStack}>
                  <Text style={[styles.cardCode, { color: c.text }]}>{a.code}</Text>
                  <View style={styles.cardAmountRow}>
                    <Text style={[styles.cardAmount, { color: c.text }]}>{a.amount}</Text>
                    <Text style={[styles.cardAmountCurrency, { color: c.text }]}>{a.code}</Text>
                  </View>
                  <Text style={[styles.cardLabel, { color: c.muted }]}>{a.label}</Text>
                </View>
              </View>
            </Squishy>
          ))}
        </ScrollView>

        {/* QUICK ACTIONS */}
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((action) => (
            <ActionButton key={action.key} icon={action.icon} label={action.label} />
          ))}
        </View>

        {/* SEND MONEY — currency converter widget */}
        <ConverterWidget style={styles.widget} navigation={navigation} />

        {/* QUICK ACTIONS WIDGET */}
        <WidgetCard c={c} title={HOME.sections.quickActions} onPressHeader={() => {}} style={styles.widget}>
          <Carousel snapWidth={CAROUSEL_CARD_W + CARD_GAP}>
            {contacts.map((contact, i) => (
              <CarouselCard
                key={i}
                c={c}
                initials={contact.initials}
                avatarColor={contact.color}
                avatarTextColor={contact.textColor}
                title={contact.name}
                subtitle={contact.amount}
                action={contact.action}
              />
            ))}
          </Carousel>
        </WidgetCard>

        {/* RECENT TRANSACTIONS WIDGET */}
        <WidgetCard c={c} title={HOME.sections.recentTransactions} onPressHeader={() => {}} style={styles.widget}>
          {transactions.slice(0, 5).map((tx: any, i: number) => (
            <View key={i}>
              <Pressable style={styles.txRow}>
                <View style={[styles.avatar, { backgroundColor: tx.color }]}>
                  <Text style={[styles.avatarText, { color: tx.textColor }]}>{tx.initials}</Text>
                </View>
                <View style={styles.txMeta}>
                  <Text style={[styles.txName, { color: c.text }]}>{tx.name}</Text>
                  <Text style={[styles.txDate, { color: c.muted }]}>{tx.date}</Text>
                </View>
                <View style={styles.txAmounts}>
                  <Text style={[styles.txAmount, { color: c.text }]}>{tx.amount}</Text>
                  <Text style={[styles.txSub, { color: tx.subColor || c.muted }]}>{tx.sub}</Text>
                </View>
              </Pressable>
              {i < transactions.slice(0, 5).length - 1 && (
                <View style={[styles.divider, { backgroundColor: c.border, marginLeft: 72 }]} />
              )}
            </View>
          ))}
        </WidgetCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 16 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 44,
  },
  balanceLabel: { fontSize: 15, marginBottom: 6 },
  balanceWrap: { marginBottom: 8 },
  heroLinkSlot: { height: 40, justifyContent: 'center', alignItems: 'center' },
  heroLinkLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  viewAll: { fontSize: 15, fontWeight: '400' },
  viewPill: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 999 },
  viewPillText: { fontSize: 14, fontWeight: '400' },
  cardsScroll: { marginBottom: 28 },
  cardsRow: { paddingHorizontal: SCREEN_PAD, gap: CARD_GAP },
  currencyCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  cardInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  cardFlagWrap: {
    width: 40,
    height: 40,
    borderRadius: 9999,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  cardTextStack: { flex: 1, gap: 4 },
  cardAmountRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 2 },
  flagText: { fontSize: 26 },
  cardCode: { fontSize: 12, fontWeight: '400' },
  cardAmount: {
    fontSize: 20,
    fontWeight: '400',
    letterSpacing: -0.3,
    fontFamily: 'PPRightGrotesk-WideMedium',
  },
  cardAmountCurrency: {
    fontSize: 16,
    fontWeight: '400',
    paddingBottom: 1,
    fontFamily: 'PPRightGrotesk-WideMedium',
  },
  cardLabel: { fontSize: 12, fontWeight: '400' },
  actionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 28,
    gap: 8,
    height: 60,
  },
  widget: { marginHorizontal: 16, marginBottom: 16 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  txMeta: { flex: 1 },
  txName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  txDate: { fontSize: 11 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  txSub: { fontSize: 13 },
  divider: { height: StyleSheet.hairlineWidth },
});
