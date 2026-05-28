import React from 'react';
import { useColorScheme, Platform } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { createNativeBottomTabNavigator } from '@bottom-tabs/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HeaderProfileButton, HeaderLogo } from '../components/ui';
import { LIGHT, DARK } from '../constants/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { ConvertScreen } from '../screens/ConvertScreen';
import { ChooseCurrencyScreen } from '../screens/ChooseCurrencyScreen';
import { AccountsScreen } from '../screens/AccountsScreen';
import { AccountDetailScreen, AccountMoreSheet } from '../screens/AccountDetailScreen';
import { JarDetailScreen } from '../screens/JarDetailScreen';
import { CardScreen } from '../screens/CardScreen';
import { PaymentsScreen } from '../screens/PaymentsScreen';
import { ComponentLibraryScreen } from '../screens/ComponentLibraryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createNativeBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const HomeStackNav = createNativeStackNavigator();
const PaymentsStackNav = createNativeStackNavigator();
const CardStackNav = createNativeStackNavigator();

// Top-level tab screens share one TRANSPARENT bar: the WU logo centred, the
// shared profile control on the left (opens the Settings drawer), and per-screen
// right-side controls (e.g. Home's hide-balance eye).
const TAB_BAR_OPTIONS = {
  headerShown: true,
  headerTransparent: true,
  headerShadowVisible: false,
  headerStyle: { backgroundColor: 'transparent' },
  headerTitle: () => <HeaderLogo />,
  headerTitleAlign: 'center' as const,
  headerLargeTitle: false,
  headerLeft: () => <HeaderProfileButton />,
};

// Pushed detail screens keep a STANDARD navigation bar — title + native back.
function useNavBarChrome() {
  const dark = useColorScheme() === 'dark';
  return {
    headerTintColor: dark ? '#FFFFFF' : '#000000',
    headerLargeTitle: false,
  };
}

// Each tab hosts its own native stack so every screen gets a real native bar.
function HomeStack() {
  return (
    <HomeStackNav.Navigator screenOptions={TAB_BAR_OPTIONS}>
      <HomeStackNav.Screen name="HomeMain" component={HomeScreen} />
    </HomeStackNav.Navigator>
  );
}

function PaymentsStack() {
  return (
    <PaymentsStackNav.Navigator screenOptions={TAB_BAR_OPTIONS}>
      <PaymentsStackNav.Screen name="PaymentsMain" component={PaymentsScreen} />
    </PaymentsStackNav.Navigator>
  );
}

function CardStack() {
  return (
    <CardStackNav.Navigator screenOptions={TAB_BAR_OPTIONS}>
      <CardStackNav.Screen name="CardMain" component={CardScreen} />
    </CardStackNav.Navigator>
  );
}

// Native tab icons: SF Symbols on iOS, Material icon images on Android.
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

// Settings is a left DRAWER PANEL (drawerType 'back' = the app slides right to
// reveal the panel). The panel content is the existing Settings UI.
function SettingsDrawerContent(props: any) {
  return <SettingsScreen navigation={props.navigation} />;
}

function DrawerRoot() {
  const dark = useColorScheme() === 'dark';
  return (
    <Drawer.Navigator
      drawerContent={(props) => <SettingsDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'back',
        drawerPosition: 'left',
        drawerStyle: { width: '86%', backgroundColor: dark ? DARK.bg : LIGHT.bg },
        swipeEdgeWidth: 60,
        overlayColor: 'transparent',
        sceneStyle: { borderRadius: 48, overflow: 'hidden', backgroundColor: dark ? DARK.bg : LIGHT.bg },
      }}
    >
      <Drawer.Screen name="Tabs" component={TabNavigator} />
    </Drawer.Navigator>
  );
}

export function RootNavigator() {
  const navBar = useNavBarChrome();
  const dark = useColorScheme() === 'dark';
  // White native nav bar that blends with the rounded hero cards on the account
  // screens. No custom header views — just the system bar.
  const whiteHeader = {
    headerShown: true,
    headerTitleAlign: 'center' as const,
    headerShadowVisible: false,
    headerTintColor: dark ? '#FFFFFF' : '#000000',
    headerStyle: { backgroundColor: dark ? DARK.surface : LIGHT.surface },
    headerTitleStyle: { fontFamily: 'PPRightGrotesk-WideMedium', fontSize: 16 },
    headerBackButtonDisplayMode: 'minimal' as const,
  };
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={DrawerRoot} />
      <Stack.Screen
        name="Convert"
        component={ConvertScreen}
        options={{ ...navBar, headerShown: true, title: 'Convert' }}
      />
      <Stack.Screen
        name="AppSettings"
        component={ComponentLibraryScreen}
        options={{ ...navBar, headerShown: true, title: 'App settings' }}
      />
      <Stack.Screen
        name="ChooseCurrency"
        component={ChooseCurrencyScreen}
        options={{
          ...navBar,
          headerShown: true,
          title: 'Choose currency',
          headerTitleAlign: 'center',
          headerBackButtonDisplayMode: 'minimal',
        }}
      />
      <Stack.Screen name="Accounts" component={AccountsScreen} options={{ ...whiteHeader, headerBackVisible: false }} />
      <Stack.Screen name="AccountDetail" component={AccountDetailScreen} options={whiteHeader} />
      <Stack.Screen name="JarDetail" component={JarDetailScreen} options={whiteHeader} />
      <Stack.Screen
        name="AccountMore"
        component={AccountMoreSheet}
        options={{ headerShown: false, presentation: 'formSheet', sheetAllowedDetents: 'fitToContents', sheetGrabberVisible: true, sheetCornerRadius: 24 }}
      />
    </Stack.Navigator>
  );
}
