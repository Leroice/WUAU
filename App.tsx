import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Svg, { Path } from 'react-native-svg';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LiquidGlassView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import {
  IconHome, IconArrowUpDown, IconCreditCard,
  IconPerson, IconEye, IconChevronRight,
} from './Icons';
import { SystemIcon } from './SystemIcon';
import { ParticleBalance } from './ParticleBalance';
import { TweaksProvider, useTweaks } from './TweaksContext';
import { Squishy } from './Squishy';
import { TweaksPanel } from './TweaksPanel';
import {
  ACCOUNTS,
  TOTAL_BALANCE,
  AVAILABLE_BALANCE,
  CONTACTS,
  TRANSACTIONS,
  QUICK_ACTIONS,
} from './mockData';
import { SettingsScreen } from './SettingsScreen';

const WU_YELLOW = '#F5A623';

// ─── LAYOUT METRICS ──────────────────────────────────────────────────────────
const SCREEN_PAD = 20;
const CARD_GAP = 12;
// Fixed width shared by currency cards and recent-contact cards.
const CARD_WIDTH = 260;

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

function WULogo({ color = '#000000' }: { color?: string }) {
  return (
    <Svg width={36} height={20} viewBox="0 0 43 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2083 21.152C14.4031 24.9448 17.9936 24.9448 20.1883 21.152L21.416 19.0292L10.4319 0H0L12.2083 21.1485M35.3493 13.0211C34.5468 14.4031 32.6607 14.4031 31.8583 13.0211L24.3309 0H13.9058L26.1245 21.1554C28.3192 24.9482 31.9028 24.9482 34.0976 21.1554L42.2765 6.9855L38.2539 0H27.8323L35.3493 13.0211Z"
        fill={color}
      />
    </Svg>
  );
}

function GlassTabBar({ state, navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();

  const tabs = [
    { label: 'Home', Icon: IconHome },
    { label: 'Payments', Icon: IconArrowUpDown },
    { label: 'Card', Icon: IconCreditCard },
  ];

  const tabContent = (
    <View style={styles.tabBarInner}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const color = isFocused ? c.accent : c.muted;
        const TabIcon = tabs[index].Icon;
        const onPress = () => { if (!isFocused) navigation.navigate(route.name); };
        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tabItem} accessibilityRole="button">
            <TabIcon size={22} color={color} strokeWidth={isFocused ? 2.2 : 1.8} />
            <Text style={{ fontSize: 11, fontWeight: '500', color }}>{tabs[index].label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={[styles.tabBarOuter, { paddingBottom: insets.bottom }]}>
      {isLiquidGlassSupported ? (
        <LiquidGlassView
          style={styles.glassTab}
          glassEffectStyle={{ mode: 'regular', colorScheme: dark ? 'dark' : 'light' }}
        >
          {tabContent}
        </LiquidGlassView>
      ) : (
        <View style={[styles.glassTab, { backgroundColor: c.card, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: c.border }]}>
          {tabContent}
        </View>
      )}
    </View>
  );
}

function HomeScreen({ navigation }: any) {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const c = dark ? DARK : LIGHT;
  const insets = useSafeAreaInsets();
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

  // ─── Pull-to-reveal: total + available balances ───────────────────────────
  const { tweaks } = useTweaks();
  const { pullThreshold, expandGap, popBounce, collapseSwipe, swapMs } = tweaks;
  const [expanded, setExpanded] = useState(false);
  const expandedRef = useRef(false); // read synchronously in scroll handlers
  const [mainKey, setMainKey] = useState<'total' | 'available'>('total');
  const RECEDE = 130; // px of upward scroll over which the hero balance recedes
  const expand = useRef(new Animated.Value(0)).current;
  const swapFade = useRef(new Animated.Value(1)).current; // 1 = settled, dips to 0 mid-swap
  const heroRecede = useRef(new Animated.Value(0)).current; // 0 = full, 1 = receded
  const swappingRef = useRef(false);
  const scrollRef = useRef<ScrollView>(null);

  const main = mainKey === 'total' ? TOTAL_BALANCE : AVAILABLE_BALANCE;
  const other = mainKey === 'total' ? AVAILABLE_BALANCE : TOTAL_BALANCE;
  const mainLabel = mainKey === 'total' ? 'Total balance' : 'Available balance';
  const otherLabel = mainKey === 'total' ? 'Available balance' : 'Total balance';

  const setExpandedBoth = (v: boolean) => {
    expandedRef.current = v;
    setExpanded(v);
  };

  // Return to the original state with no overshoot.
  const collapse = () => {
    setExpandedBoth(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    Animated.spring(expand, { toValue: 0, useNativeDriver: false, speed: 16, bounciness: 0 }).start();
  };

  // Swap = simple crossfade + scale hint. Fade both balances out, swap the data while
  // they're invisible (so no flicker), then fade back in.
  const startSwap = () => {
    if (swappingRef.current) return;
    swappingRef.current = true;
    Animated.timing(swapFade, { toValue: 0, duration: swapMs / 2, easing: Easing.in(Easing.quad), useNativeDriver: false }).start(({ finished }) => {
      if (!finished) { swappingRef.current = false; return; }
      setMainKey((k) => (k === 'total' ? 'available' : 'total'));
      Animated.timing(swapFade, { toValue: 1, duration: swapMs / 2, easing: Easing.out(Easing.quad), useNativeDriver: false }).start(() => {
        swappingRef.current = false;
      });
    });
  };

  const onScroll = (e: any) => {
    if (balanceHidden) return; // disabled in particle view
    const y = e.nativeEvent.contentOffset.y;
    if (expandedRef.current) {
      if (y > collapseSwipe) collapse(); // swipe back up → return to rest
      return;
    }
    if (y < 0) {
      expand.setValue(Math.min(1, -y / pullThreshold)); // elastic reveal
      heroRecede.setValue(0);
    } else {
      expand.setValue(0);
      heroRecede.setValue(Math.min(1, y / RECEDE)); // scroll up → hero recedes
    }
  };

  const onScrollEndDrag = (e: any) => {
    if (balanceHidden || expandedRef.current) return;
    const y = e.nativeEvent.contentOffset.y;
    if (y <= -pullThreshold) {
      setExpandedBoth(true); // pop
      Animated.spring(expand, { toValue: 1, useNativeDriver: false, speed: 12, bounciness: popBounce }).start();
    } else {
      Animated.spring(expand, { toValue: 0, useNativeDriver: false, speed: 16, bounciness: 0 }).start();
    }
  };

  useEffect(() => {
    if (balanceHidden && expanded) collapse(); // entering particle view collapses it
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceHidden]);

  const contentTranslate = expand.interpolate({ inputRange: [0, 1], outputRange: [0, expandGap] });
  const availableOpacity = expand.interpolate({ inputRange: [0.15, 0.7], outputRange: [0, 1], extrapolate: 'clamp' });
  const linkHide = expand.interpolate({ inputRange: [0, 0.5], outputRange: [1, 0], extrapolate: 'clamp' });

  // Expanded layout positions — no swap motion (the swap is a crossfade in place now).
  const mainTranslateY = expand.interpolate({ inputRange: [0, 1], outputRange: [0, 6] });
  const availableTranslateY = expand.interpolate({ inputRange: [0, 1], outputRange: [-6, 52] });
  // Secondary stays small: rendered at 42pt, scaled DOWN to ~0.57 so it never upscales.
  const availableScale = expand.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0.57] });

  const swapScale = swapFade.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }); // crossfade scale hint
  // Hero recedes (scale down + fade) as the page scrolls up — never flies behind the header.
  const heroOpacity = heroRecede.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });
  const heroScale = heroRecede.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <StatusBar barStyle={dark ? 'light-content' : 'dark-content'} />

      <View style={[styles.navbar, { paddingTop: insets.top + 8, backgroundColor: c.bg }]}>
        <Squishy
          scaleTo={0.88}
          style={[styles.iconBtn, { backgroundColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)' }]}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Profile and settings"
        >
          <IconPerson size={18} color={c.text} />
        </Squishy>
        <WULogo color={dark ? '#FFFFFF' : '#000000'} />
        <Squishy
          scaleTo={0.88}
          style={[styles.iconBtn, { backgroundColor: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)' }]}
          onPress={() => setBalanceHidden((h) => !h)}
          accessibilityRole="button"
          accessibilityState={{ selected: balanceHidden }}
          accessibilityLabel={balanceHidden ? 'Show balance' : 'Hide balance'}
        >
          <IconEye size={18} color={c.text} />
        </Squishy>
      </View>

      <ScrollView
        ref={scrollRef}
        style={{ backgroundColor: c.bg }}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onScrollEndDrag={onScrollEndDrag}
      >
        {/* BALANCE HERO */}
        <View style={styles.hero}>
          <Animated.View style={{ alignItems: 'center', opacity: heroOpacity, transform: [{ scale: heroScale }] }}>
            <Animated.Text style={[styles.balanceLabel, { color: c.muted, opacity: Animated.multiply(labelOpacity, swapFade) }]}>{mainLabel}</Animated.Text>
            <View style={styles.balanceWrap}>
              <Animated.View style={{ opacity: swapFade, transform: [{ translateY: mainTranslateY }, { scale: swapScale }] }}>
                <ParticleBalance
                  amount={main.amount}
                  currency={main.currency}
                  hidden={balanceHidden}
                  color={c.text}
                  accent={WU_YELLOW}
                />
              </Animated.View>
              {/* available balance — emerges on pull; tap to swap (crossfade in place) */}
              <Animated.View
                style={[styles.availableSlot, { opacity: Animated.multiply(availableOpacity, swapFade), transform: [{ translateY: availableTranslateY }] }]}
                pointerEvents={expanded ? 'auto' : 'none'}
              >
                <Squishy
                  scaleTo={0.96}
                  onPress={startSwap}
                  accessibilityRole="button"
                  accessibilityLabel={`Switch to ${otherLabel}`}
                >
                  <Text style={[styles.availLabel, { color: c.muted }]}>{otherLabel}</Text>
                  {/* rendered at 42pt, scaled down — never upscaled, so it stays crisp */}
                  <Animated.Text style={[styles.availAmount, { color: c.text, transform: [{ scale: Animated.multiply(availableScale, swapScale) }] }]}>
                    {other.amount}
                    <Text style={styles.availCurrency}> {other.currency}</Text>
                  </Animated.Text>
                </Squishy>
              </Animated.View>
            </View>
          </Animated.View>
          <Animated.View style={[styles.heroLinkSlot, { opacity: linkHide }]}>
            {/* text link (balance shown) */}
            <Animated.View
              style={[styles.heroLinkLayer, { opacity: linkOpacity }]}
              pointerEvents={balanceHidden ? 'none' : 'auto'}
            >
              <TouchableOpacity accessibilityRole="button">
                <Text style={[styles.viewAll, { color: c.accent }]}>View all accounts</Text>
              </TouchableOpacity>
            </Animated.View>
            {/* pill button (particles) — rises into the hero */}
            <Animated.View
              style={[styles.heroLinkLayer, { opacity: pillOpacity, transform: [{ translateY: pillTranslate }, { scale: pillScale }] }]}
              pointerEvents={balanceHidden ? 'auto' : 'none'}
            >
              <Squishy
                scaleTo={0.94}
                style={[styles.viewPill, { backgroundColor: dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.16)' }]}
                accessibilityRole="button"
                accessibilityLabel="View all accounts"
              >
                <Text style={[styles.viewPillText, { color: c.text }]}>View all accounts</Text>
              </Squishy>
            </Animated.View>
          </Animated.View>
        </View>

        {/* Content below the hero — slides to the base of the screen on pop */}
        <Animated.View style={{ transform: [{ translateY: contentTranslate }] }}>
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
          {ACCOUNTS.map((a, i) => (
            <Squishy
              key={i}
              scaleTo={0.97}
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
            <Squishy
              key={action.key}
              scaleTo={0.9}
              style={styles.actionBtn}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <View style={styles.actionSquare}>
                <SystemIcon
                  ios={action.icon.ios}
                  android={action.icon.android}
                  size={24}
                  color="#000000"
                  weight="semibold"
                />
                <Text style={styles.actionLabel}>{action.label}</Text>
              </View>
            </Squishy>
          ))}
        </View>

        {/* RECENT CONTACTS */}
        <View style={{ marginBottom: 24 }}>
          <View style={[styles.sectionHeader, { paddingHorizontal: 20 }]}>
            <TouchableOpacity style={styles.sectionTitleRow} accessibilityRole="button">
              <Text style={[styles.sectionTitle, { color: c.text }]}>Quick Actions</Text>
              <IconChevronRight size={18} color={c.muted} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.contactsRow, { paddingHorizontal: 20 }]}>
            {CONTACTS.map((contact, i) => (
              <Squishy key={i} scaleTo={0.96} style={[styles.contactCard, { backgroundColor: c.card, borderColor: c.border }]}>
                <View style={styles.cardInner}>
                  <View style={[styles.contactAvatar, { backgroundColor: contact.color }]}>
                    <Text style={[styles.avatarText, { color: contact.textColor }]}>{contact.initials}</Text>
                  </View>
                  <View style={styles.cardTextStack}>
                    <Text style={[styles.contactName, { color: c.muted }]}>{contact.name}</Text>
                    <Text style={[styles.contactAmount, { color: c.text }]}>{contact.amount}</Text>
                    <Text style={[styles.contactAction, { color: c.accent }]}>{contact.action}</Text>
                  </View>
                </View>
              </Squishy>
            ))}
          </ScrollView>
        </View>

        {/* RECENT TRANSACTIONS */}
        <View style={[styles.section, { paddingHorizontal: 20 }]}>
          <View style={styles.sectionHeader}>
            <TouchableOpacity style={styles.sectionTitleRow} accessibilityRole="button">
              <Text style={[styles.sectionTitle, { color: c.text }]}>Recent transactions</Text>
              <IconChevronRight size={18} color={c.muted} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          <View style={[styles.txCard, { backgroundColor: c.card, borderColor: c.border }]}>
            {TRANSACTIONS.slice(0, 5).map((tx: any, i: number) => (
              <View key={i}>
                <Squishy style={styles.txRow} scaleTo={0.97}>
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
                </Squishy>
                {i < 4 && <View style={[styles.divider, { backgroundColor: c.border }]} />}
              </View>
            ))}
          </View>
        </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function PaymentsScreen() {
  const scheme = useColorScheme();
  const c = scheme === 'dark' ? DARK : LIGHT;
  return (
    <View style={[styles.placeholder, { backgroundColor: c.bg }]}>
      <Text style={[styles.placeholderText, { color: c.muted }]}>Payments</Text>
    </View>
  );
}

function CardScreen() {
  return <TweaksPanel />;
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <GlassTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Payments" component={PaymentsScreen} />
      <Tab.Screen name="Card" component={CardScreen} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          animation: 'slide_from_left',
          gestureEnabled: true,
        }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <SafeAreaProvider>
      <TweaksProvider>
        <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
          <RootNavigator />
        </NavigationContainer>
      </TweaksProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: { paddingBottom: 16 },
  hero: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 44,
  },
  balanceLabel: { fontSize: 15, marginBottom: 6 },
  balanceWrap: { marginBottom: 8 },
  availableSlot: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  availLabel: { fontSize: 12, fontWeight: '500', textAlign: 'center', marginBottom: 2 },
  availAmount: { fontSize: 42, fontWeight: '400', letterSpacing: -1, textAlign: 'center', fontFamily: 'PPRightGrotesk-WideMedium' },
  availCurrency: { fontSize: 28, fontFamily: 'PPRightGrotesk-WideMedium' },
  heroLinkSlot: { height: 40, justifyContent: 'center', alignItems: 'center' },
  heroLinkLayer: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  viewAll: { fontSize: 15, fontWeight: '500' },
  viewPill: { paddingVertical: 9, paddingHorizontal: 18, borderRadius: 999 },
  viewPillText: { fontSize: 14, fontWeight: '600' },
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
  actionBtn: { flex: 1 },
  actionSquare: {
    flex: 1,
    borderRadius: 16,
    backgroundColor: WU_YELLOW,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  actionLabel: { fontSize: 12, fontWeight: '500', color: '#000000', textAlign: 'center' },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '600' },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  contactsRow: { gap: CARD_GAP },
  contactCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  avatarText: { fontSize: 15, fontWeight: '700' },
  contactName: { fontSize: 13 },
  contactAmount: { fontSize: 15, fontWeight: '600' },
  contactAction: { fontSize: 13, fontWeight: '500' },
  txCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  txMeta: { flex: 1 },
  txName: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  txDate: { fontSize: 13 },
  txAmounts: { alignItems: 'flex-end' },
  txAmount: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  txSub: { fontSize: 13 },
  divider: { height: StyleSheet.hairlineWidth },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 17 },
  tabBarOuter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  glassTab: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 8,
  },
  tabBarInner: {
    flexDirection: 'row',
    paddingVertical: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
});
