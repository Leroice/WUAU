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
  Easing,
  Platform,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  IconPerson, IconEye,
} from './Icons';
import { SystemIcon } from './SystemIcon';
import { WULogo, ActionButton, WidgetCard } from './components/ui';
import { ParticleBalance } from './ParticleBalance';
import { TweaksProvider } from './TweaksContext';
import { Squishy } from './Squishy';
import { ConvertSheet } from './ConvertSheet';
import { CardScreen } from './CardScreen';
import { PaymentsScreen } from './PaymentsScreen';
import { ComponentLibraryScreen } from './ComponentLibraryScreen';
import { DesignProvider } from './DesignContext';
import { PersonaProvider, usePersona } from './PersonaContext';
import { WU_YELLOW } from './theme';
import {
  ACCOUNTS,
  TOTAL_BALANCE,
  CONTACTS,
  TRANSACTIONS,
  QUICK_ACTIONS,
  HOME,
  SETTINGS,
} from './mockData';
import { SettingsScreen } from './SettingsScreen';

// ─── LAYOUT METRICS ──────────────────────────────────────────────────────────
const SCREEN_PAD = 20;
const CARD_GAP = 12;
// Fixed width shared by currency cards and recent-contact cards.
const CARD_WIDTH = 260;

const LIGHT = {
  bg: '#F2F2F7',
  card: '#FFFFFF',
  surface: '#FFFFFF',
  text: '#1C1C1E',
  muted: '#8E8E93',
  accent: '#1A6FD4',
  border: '#E5E5EA',
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
  pill: '#2C2C2E',
  warning: '#EA7E00',
  info: '#239AF6',
  error: '#FF6B6B',
  success: '#30D158',
};

function HomeScreen({ navigation }: any) {
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

  // Present the Convert screen as a native iOS sheet (formSheet) on the root stack.
  const openConvert = () => navigation.navigate('Convert');

  // Native stack header: person (left), WU logo (title), calculator + eye (right).
  // Plain native-style header buttons (no custom pill) — just tinted icons.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <WULogo color={dark ? '#FFFFFF' : '#000000'} />,
      headerLeft: () => (
        <Pressable
          hitSlop={10}
          onPress={() => navigation.navigate('Settings')}
          accessibilityRole="button"
          accessibilityLabel="Profile and settings"
        >
          <IconPerson size={22} color={c.text} />
        </Pressable>
      ),
      headerRight: () => (
        <View style={styles.navRight}>
          <Pressable hitSlop={10} onPress={openConvert} accessibilityRole="button" accessibilityLabel="Currency calculator">
            <SystemIcon ios="plus.forwardslash.minus" android="calculate" size={22} color={c.text} />
          </Pressable>
          <Pressable
            hitSlop={10}
            onPress={() => setBalanceHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityState={{ selected: balanceHidden }}
            accessibilityLabel={balanceHidden ? 'Show balance' : 'Hide balance'}
          >
            <IconEye size={22} color={c.text} />
          </Pressable>
        </View>
      ),
    });
  }, [navigation, dark, c, balanceHidden, openConvert]);

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
              <TouchableOpacity accessibilityRole="button">
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

        {/* QUICK ACTIONS WIDGET */}
        <WidgetCard c={c} title={HOME.sections.quickActions} onPressHeader={() => {}} style={styles.widget}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.widgetCarousel}
            snapToInterval={CARD_WIDTH + CARD_GAP}
            snapToAlignment="start"
            decelerationRate="fast"
          >
            {contacts.map((contact, i) => (
              <Squishy key={i} scaleTo={0.96} style={[styles.contactCard, { backgroundColor: c.pill, borderWidth: 0 }]}>
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

// Convert presented as a native iOS sheet (see the root stack's formSheet screen).
function ConvertScreen() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? DARK : LIGHT;
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ConvertSheet c={c} />
    </View>
  );
}

const Tab = createNativeBottomTabNavigator();
const Stack = createNativeStackNavigator();
const HomeStackNav = createNativeStackNavigator();
const PaymentsStackNav = createNativeStackNavigator();
const CardStackNav = createNativeStackNavigator();

// Shared native-header chrome — iOS 26 nav bar (Figma node 754:48381):
// translucent Liquid Glass material, SF Pro Semibold 17 title (letterSpacing -0.43),
// vibrant primary label colour (#1A1A1A light / white dark) for title + controls.
function useNavChrome() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? DARK : LIGHT;
  const label = dark ? '#FFFFFF' : '#1A1A1A';
  if (Platform.OS === 'android') {
    // Material 3 top app bar — solid surface, Roboto title (no iOS blur on Android).
    return {
      headerStyle: { backgroundColor: c.bg },
      headerShadowVisible: false,
      headerTintColor: label,
      headerTitleStyle: { color: label, fontSize: 20, fontWeight: '600' as const },
      headerLargeTitleStyle: { color: label },
    };
  }
  // iOS 26 — Liquid Glass nav bar (Figma 754:48381).
  return {
    headerTransparent: true,
    headerBlurEffect: 'systemChromeMaterial' as const,
    headerShadowVisible: false,
    headerTintColor: label,
    headerTitleStyle: { color: label, fontSize: 17, fontWeight: '600' as const, letterSpacing: -0.43 },
    headerLargeTitleStyle: { color: label },
  };
}

// Each tab hosts its own native stack so every screen gets a real UINavigationBar.
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={useNavChrome()}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    </HomeStackNav.Navigator>
  );
}

function PaymentsStack() {
  return (
    <PaymentsStackNav.Navigator screenOptions={useNavChrome()}>
      <PaymentsStackNav.Screen
        name="PaymentsMain"
        component={PaymentsScreen}
        options={{ title: 'Payments', headerLargeTitle: false }}
      />
    </PaymentsStackNav.Navigator>
  );
}

function CardStack() {
  return (
    <CardStackNav.Navigator screenOptions={useNavChrome()}>
      <CardStackNav.Screen
        name="CardMain"
        component={CardScreen}
        options={{ title: 'Cards', headerLargeTitle: false }}
      />
    </CardStackNav.Navigator>
  );
}

// Native tab icons: SF Symbols on iOS, Material icon images on Android
// (react-native-bottom-tabs takes an image source on Android, not SF names).
function tabBarIconFor(sf: string, sfFocused: string, material: string): (props: { focused: boolean }) => any {
  if (Platform.OS === 'ios') {
    return ({ focused }: { focused: boolean }) => ({ sfSymbol: focused ? sfFocused : sf });
  }
  return () => MaterialIcon.getImageSourceSync(material, 26);
}

function TabNavigator() {
  const dark = useColorScheme() === 'dark';
  const c = dark ? DARK : LIGHT;
  return (
    <Tab.Navigator
      tabBarActiveTintColor={c.accent}
      tabBarInactiveTintColor={c.muted}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{ title: 'Home', tabBarIcon: tabBarIconFor('house', 'house.fill', 'home') }}
      />
      <Tab.Screen
        name="Payments"
        component={PaymentsStack}
        options={{ title: 'Payments', tabBarIcon: tabBarIconFor('arrow.left.arrow.right', 'arrow.left.arrow.right', 'swap-horiz') }}
      />
      <Tab.Screen
        name="Card"
        component={CardStack}
        options={{ title: 'Card', tabBarIcon: tabBarIconFor('creditcard', 'creditcard.fill', 'credit-card') }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const chrome = useNavChrome();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          ...chrome,
          headerShown: true,
          title: SETTINGS.title,
          headerLargeTitle: false,
          animation: 'slide_from_left',
          gestureEnabled: true,
          fullScreenGestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="Convert"
        component={ConvertScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.92],
          sheetGrabberVisible: true,
          sheetCornerRadius: 20,
          gestureEnabled: true,
        }}
      />
      <Stack.Screen
        name="ComponentLibrary"
        component={ComponentLibraryScreen}
        options={{ ...chrome, headerShown: true, title: 'Component Library', headerLargeTitle: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <TweaksProvider>
          <PersonaProvider>
            <DesignProvider>
              <NavigationContainer theme={dark ? DarkTheme : DefaultTheme}>
                <RootNavigator />
              </NavigationContainer>
            </DesignProvider>
          </PersonaProvider>
        </TweaksProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
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
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  navLogo: { position: 'absolute', left: 0, right: 0, bottom: 12, alignItems: 'center', justifyContent: 'center' },
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
  widget: { marginHorizontal: 16, marginBottom: 16 },
  widgetCarousel: { paddingLeft: 12, paddingRight: 12, paddingBottom: 16, gap: CARD_GAP },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '700' },
  contactName: { fontSize: 13 },
  contactAmount: { fontSize: 15, fontWeight: '600' },
  contactAction: { fontSize: 13, fontWeight: '500' },
  txCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },
  txRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  txMeta: { flex: 1 },
  txName: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  txDate: { fontSize: 11 },
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
    borderRadius: 52,
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
