# WUAU — Context Handover

Concept/POC React Native app for Western Union. iOS-first with the iOS 26
aesthetic; Android Material parity. Design-driven from Figma. **Native is the
priority** — prefer native components/navigation; discuss before any custom
deviation.

## Environment & how to run

- **Repo**: `/Users/lsmbp/Developer/WUAU` (moved out of iCloud). Bundle id is
  still the RN template `org.reactjs.native.example.WUAU` (this blocks TestFlight).
- **Git**: branch `feat/converter-and-native-header` → PR #1 on
  `github.com/Leroice/WUAU`. Latest commit `b0dfacc`. Commit/push when asked;
  branch off `main`.
- **iOS sim**: iPhone 17 (iOS 26) booted. Relaunch:
  `xcrun simctl terminate booted org.reactjs.native.example.WUAU; xcrun simctl launch booted org.reactjs.native.example.WUAU`
- **Physical phone**: `LSiP15` (iPhone 15 Pro), udid `5C9EC090-FE13-5BDE-865C-4A726A6C589B`.
  Debug build on Metro. Push: `xcrun devicectl device process launch --terminate-existing --device <udid> org.reactjs.native.example.WUAU`
  (must be on the same Wi-Fi as the Mac; LAN IP ~192.168.86.228).
- **Verifying a screen without tapping**: temporarily set `initialRouteName` on
  the root `Stack.Navigator` (App.tsx), relaunch, screenshot, then revert. Used
  throughout — there's no tap/scroll automation on the sim (no idb, osascript
  lacks accessibility).
- **Android**: env in `~/.zshrc` but the non-interactive shell doesn't source it —
  set inline: `JAVA_HOME=/opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk/Contents/Home ANDROID_HOME=/opt/homebrew/share/android-commandlinetools ./gradlew assembleDebug`.
  Builds clean. No Android device/emulator attached (Pixel 6a per notes).
  `pod install` needs `LANG/LC_ALL=en_US.UTF-8`.
- **Figma (MCP)**: WU Beta App `yI7nZdcmlTYwoPuQOQ7V2M` works. WU DS – Discovery
  `z3vrFZgc7G8lgrLq5q8ojl` is NOT accessible — use the Beta App file.
- **tsc** (`npx tsc --noEmit`) is the standard check after edits; keep it clean.

## What's built

- **Navigation**: fully native. Root native-stack → drawer (Settings, left,
  drawerType 'back', 48pt radius scene, no tint) → native bottom tabs
  (Home/Payments/Card), each its own native-stack. Top tabs: **transparent** bar,
  centred WU logo, profile (opens drawer), Home eye (hide balance). Pushed
  screens (Convert, App settings, Choose currency, Accounts, Account/Stack
  detail) use native bars (back + close ✕). No custom nav chrome anywhere.
- **Home** (App.tsx `HomeScreen`): balance hero, currency-cards carousel (tap →
  AccountDetail), quick actions, Send Money converter, contacts carousel, recent
  transactions.
- **Send Money converter** (`ConverterWidget.tsx`): two currency legs + flip
  (slow eased rotation, no overshoot, 40pt button), live conversion, selectors →
  Choose currency.
- **Choose currency** (`ChooseCurrencyScreen.tsx`): full list, native push.
- **Accounts** (`AccountsScreen.tsx`): native bar, hero (total + Add/Convert),
  `SegmentedControl` (Currencies/Stacks, 24pt around it), rows tap → detail.
- **Account detail** (`AccountDetailScreen.tsx`): native bar, collapsing hero
  (balance + Send/Add/Convert/More, buttons fade on scroll), date-grouped txns,
  empty state, **native More bottom sheet** (`formSheet`, `sheetAllowedDetents:
  'fitToContents'`). NOTE: native sheet content must be intrinsic-height (no
  flex:1 + ScrollView) or it overflows off the bottom.
- **Stack detail** (`StackDetailScreen.tsx`): native bar, collapsing hero (emoji +
  progress-ring "doughnut" + balance + goal + target-date chip + Add/Convert/More),
  date-grouped txns.
- **Settings** (`SettingsScreen.tsx`, drawer): flat rows, More-services single
  boxes. **App settings** = `ComponentLibraryScreen.tsx` — live component catalog +
  design-token sliders + persona switcher.

## Shared components (`components/ui.tsx`)

`WULogo`, `HeaderLogo`, `HeaderIconButton`, `HeaderProfileButton`, `WIDGET_TITLE`
(shared widget-header text style), `Surface`, `WidgetCard`, `SectionHeader`,
`ListRow`, `StatusDot`, `ActionButton`, `Carousel`, `CarouselCard`
(+`CAROUSEL_CARD_W`), `SegmentedControl`, `TransactionRow`. All catalogued in App
settings. Data: `mockData.ts` (persona-driven via `PersonaContext`).
`theme.ts` = LIGHT/DARK + SPACING/RADIUS/WU_YELLOW.

## Status

- Everything is on the phone (debug/Metro) and pushed to PR #1.
- **TestFlight: NOT uploaded** — blocked on (1) a real bundle id + an App Store
  Connect app record, (2) the ASC API **issuer id** (the `.p8` key is at
  `~/.appstoreconnect/private_keys/AuthKey_63D25H2A77.p8`, key id `63D25H2A77`,
  team `74N2E56WEY`). See `TESTFLIGHT.md` + `scripts/deploy-testflight.sh`.
  Xcode Archive→Distribute is a ~10-min finish once the bundle id + signing are set.
- **Android** builds clean; not runtime-tested.

## NEXT — captured for discussion (DO NOT build yet)

1. **Segment control + its content animate in UNISON.** Tapping the
   `SegmentedControl` should move the selected indicator (sliding pill) **and** the
   content beneath it together — in and out, synced timing. (Currencies⇄Stacks
   transition is paced to the segment, moving as one.)
2. **Accounts/Stack hero header must HUG its content height — not define or
   constrain it.** Today the hero imposes height. Make it size to content. On the
   **Vow Renewal (Stack detail)** specifically:
   - More padding between the **goal subline**, the **target-date pill**, and the
     **buttons**.
   - Push the **buttons further down** the page.
   - Make the top **doughnut (progress ring) larger**.
   - **Animate the doughnut in on page load.**
3. (Related, earlier-captured) **Unify the hero header** into one structure/
   framework shared by Accounts + Account detail + Stack detail (content varies,
   frame is constant) → gives consistent heights/alignment. Add an **overscroll
   backing** so no gap appears on bounce at the top.

## Cleanup / optimisation opportunities

- **Home "Recent transactions"** still hand-rolls its row → use shared `TransactionRow`.
- **Currency tiles** exist 3 ways (Home currency cards, Accounts `AccountRow`,
  Choose-currency rows) → unify into one `CurrencyTile`.
- **Collapse-on-scroll logic is duplicated** in AccountDetail + StackDetail →
  extract a shared `CollapsingDetailScreen` (hero render prop + sections). Pairs
  naturally with the hero unification (#3 above).
- **`AccountRow` (AccountsScreen) vs `ListRow` (ui.tsx)** overlap → consider merging.
- **App.tsx and SettingsScreen still define local LIGHT/DARK** instead of
  `useTheme()` → migrate to the single theme source.
- **Dead styles** (pre-existing): App.tsx `section`/`sectionTitle`/`actionSquare`/
  `contactsRow`, Payments `headerBtn`.
- **Native currency picker popup** (the only never-started feature): a UIMenu via
  `@react-native-menu/menu` (5 top currencies + separator + "More Currencies" +
  checkmark). Needs the module + a native rebuild. Today the selector goes
  straight to Choose currency.
- Placeholders to swap for real assets: transaction brand logos (cart icon now),
  empty-state illustration (icon now), circular flag images (emoji-in-circle now).
