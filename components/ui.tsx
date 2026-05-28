import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, StyleProp, ViewStyle, TextStyle, useColorScheme, Animated, Easing } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Squishy } from './Squishy';
import { SystemIcon, IconSpec } from './SystemIcon';
import { Theme, WU_YELLOW, SPACING, RADIUS } from '../constants/theme';
import { useDesign } from '../hooks/useDesign';

/**
 * Canonical widget-header title type — the "Send Money" style. Shared by every
 * widget header (SectionHeader + the converter) so header type never drifts.
 */
export const WIDGET_TITLE: TextStyle = { fontSize: 15, fontWeight: '600', letterSpacing: -0.23, lineHeight: 20 };

/** Western Union double-chevron mark. Shared brand glyph. */
export function WULogo({ color = '#000000', width = 36, height = 20 }: { color?: string; width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 43 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2083 21.152C14.4031 24.9448 17.9936 24.9448 20.1883 21.152L21.416 19.0292L10.4319 0H0L12.2083 21.1485M35.3493 13.0211C34.5468 14.4031 32.6607 14.4031 31.8583 13.0211L24.3309 0H13.9058L26.1245 21.1554C28.3192 24.9482 31.9028 24.9482 34.0976 21.1554L42.2765 6.9855L38.2539 0H27.8323L35.3493 13.0211Z"
        fill={color}
      />
    </Svg>
  );
}

/** WU brand mark, centred in the navigation bar. Theme-aware tint. */
export function HeaderLogo() {
  const dark = useColorScheme() === 'dark';
  return <WULogo color={dark ? '#FFFFFF' : '#000000'} width={40} height={22} />;
}

// ─── Native bar buttons (stock iOS toolbar) ──────────────────────────────────
// Plain bar-button items hosted in the navigator's own UINavigationBar. NO
// custom background, capsule or glass — we hand iOS just the SF Symbol (Material
// on Android) and let the system render its standard control. hitSlop gives the
// native ~44pt touch target without indenting the glyph from the bar's edge.

/** Generic stock bar-button: a single system icon, no chrome. */
export function HeaderIconButton({
  onPress, label, ios, android, size = 24,
}: { onPress?: () => void; label: string; ios: string; android: string; size?: number }) {
  const dark = useColorScheme() === 'dark';
  const color = dark ? '#FFFFFF' : '#000000';
  return (
    <Pressable
      onPress={onPress}
      hitSlop={12}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => ({ opacity: pressed ? 0.4 : 1 })}
    >
      <SystemIcon ios={ios} android={android} size={size} color={color} />
    </Pressable>
  );
}

/**
 * Shared profile control — the SINGLE source for the profile glyph in every
 * screen's bar, so it can't drift between pages. Opens the Settings drawer
 * (the left-panel menu animation).
 */
export function HeaderProfileButton() {
  const navigation = useNavigation();
  return (
    <HeaderIconButton
      label="Profile and settings"
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      ios="person.crop.circle"
      android="account-circle"
    />
  );
}

// ─── Shared component framework ──────────────────────────────────────────────
// Reusable primitives composed across screens. Keep these light and theme-driven
// (every component takes the resolved theme `c`, matching the existing convention).

/** Elevated rounded container — the white "card" surface behind grouped content. */
export function Surface({
  c, children, style, padded = true, radius,
}: { c: Theme; children: React.ReactNode; style?: StyleProp<ViewStyle>; padded?: boolean; radius?: number }) {
  const { tokens } = useDesign();
  return (
    <View
      style={[
        styles.surface,
        { backgroundColor: c.surface, borderColor: c.border, borderRadius: radius ?? tokens.surfaceRadius },
        padded && styles.surfacePad,
        style,
      ]}
    >
      {children}
    </View>
  );
}

/**
 * WidgetCard — the core dashboard widget container used across Level-1 screens.
 * A bordered/rounded Surface with the section header INSIDE it, then a content
 * slot below (carousel, grouped list, chart, …). Children manage their own
 * horizontal padding so carousels can bleed to the card edge (Surface clips).
 */
export function WidgetCard({
  c, title, onPressHeader, children, style,
}: {
  c: Theme;
  title: string;
  onPressHeader?: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const { tokens } = useDesign();
  return (
    <View style={style}>
      <Surface c={c} padded={false} radius={tokens.widgetRadius}>
        <View style={{ paddingHorizontal: tokens.widgetHeaderPad, paddingTop: tokens.widgetHeaderPad }}>
          <SectionHeader c={c} title={title} onPress={onPressHeader} />
        </View>
        {children}
      </Surface>
    </View>
  );
}

/** Section title with an optional "›" affordance, e.g. "Recent Spends ›". */
export function SectionHeader({
  c, title, onPress,
}: { c: Theme; title: string; onPress?: () => void }) {
  return (
    <Pressable
      style={styles.sectionHeader}
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : 'header'}
    >
      <Text style={[WIDGET_TITLE, { color: c.text }]}>{title}</Text>
      {onPress && <SystemIcon ios="chevron.right" android="chevron-right" size={14} color={c.muted} />}
    </Pressable>
  );
}

/** List-view row: icon pill + label + trailing/chevron. NOT squishy (list item). */
export function ListRow({
  c, icon, iconColor, label, trailing, showChevron = true, onPress, divider = false,
}: {
  c: Theme;
  icon?: IconSpec;
  iconColor?: string;
  label: string;
  trailing?: React.ReactNode;
  showChevron?: boolean;
  onPress?: () => void;
  divider?: boolean;
}) {
  const { tokens } = useDesign();
  return (
    <>
      <Pressable
        style={[styles.row, { paddingVertical: tokens.listPadV }]}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {icon && (
          <View style={[styles.iconWrap, { width: tokens.listIcon, height: tokens.listIcon, borderRadius: tokens.listIcon / 2, backgroundColor: c.pill }]}>
            <SystemIcon ios={icon.ios} android={icon.android} size={Math.round(tokens.listIcon * 0.5)} color={iconColor ?? c.text} />
          </View>
        )}
        <Text style={[styles.rowLabel, { color: c.text, fontSize: tokens.listLabelSize, fontWeight: tokens.listLabelWeight }]} numberOfLines={1}>{label}</Text>
        {trailing}
        {showChevron && <SystemIcon ios="chevron.right" android="chevron-right" size={14} color={c.muted} />}
      </Pressable>
      {divider && <View style={[styles.divider, { backgroundColor: c.border }]} />}
    </>
  );
}

/** Coloured status dot + label, e.g. ● Pending / ● In progress. */
export function StatusDot({ c, color, label }: { c: Theme; color: string; label: string }) {
  return (
    <View style={styles.statusRow}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.statusLabel, { color: c.muted }]}>{label}</Text>
    </View>
  );
}

/**
 * Standalone yellow action button: icon over label, flex:1 to share a row.
 * Single source for Home's quick actions AND the Cards page actions.
 */
export function ActionButton({
  icon, label, onPress, color,
}: { icon: IconSpec; label: string; onPress?: () => void; color?: string }) {
  const { tokens } = useDesign();
  return (
    <Squishy
      scaleTo={0.96}
      onPress={onPress}
      style={[styles.actionBtn, { backgroundColor: color ?? WU_YELLOW, borderRadius: tokens.actionRadius }]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <SystemIcon ios={icon.ios} android={icon.android} size={tokens.actionIcon} color="#000000" weight="semibold" />
      <Text style={[styles.actionLabel, { fontSize: tokens.actionLabelSize }]}>{label}</Text>
    </Squishy>
  );
}

/**
 * Shared horizontal carousel — the ONE scroll container behind every in-widget
 * carousel (contacts, upcoming, currency cards). Consistent padding, gap, snap
 * and momentum so all carousels behave identically. Pass `snapWidth` (card width
 * + gap) to enable snapping; `style`/`contentStyle` to tune a single instance.
 */
export function Carousel({
  children, snapWidth, style, contentStyle,
}: { children: React.ReactNode; snapWidth?: number; style?: StyleProp<ViewStyle>; contentStyle?: StyleProp<ViewStyle> }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      decelerationRate="fast"
      snapToInterval={snapWidth}
      snapToAlignment="start"
      style={style}
      contentContainerStyle={[styles.carousel, contentStyle]}
    >
      {children}
    </ScrollView>
  );
}

/** Fixed width of a carousel card, so a screen can compute snap = width + gap. */
export const CAROUSEL_CARD_W = 252;

/**
 * The ONE card used inside widget carousels: circular initials avatar + a
 * title / subtitle / optional action line. The exact same card backs Home's
 * Quick Actions and Payments' Upcoming carousels — content differs, look does not.
 */
export function CarouselCard({
  c, initials, avatarColor, avatarTextColor, title, subtitle, action, onPress,
}: {
  c: Theme; initials: string; avatarColor: string; avatarTextColor: string;
  title: string; subtitle: string; action?: string; onPress?: () => void;
}) {
  return (
    <Squishy
      scaleTo={0.96}
      onPress={onPress}
      style={[styles.carouselCard, { backgroundColor: c.pill }]}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${subtitle}`}
    >
      <View style={[styles.carouselAvatar, { backgroundColor: avatarColor }]}>
        <Text style={[styles.carouselAvatarText, { color: avatarTextColor }]}>{initials}</Text>
      </View>
      <View style={styles.carouselTextStack}>
        <Text style={[styles.carouselTitle, { color: c.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.carouselSubtitle, { color: c.muted }]} numberOfLines={1}>{subtitle}</Text>
        {action ? <Text style={[styles.carouselAction, { color: c.accent }]} numberOfLines={1}>{action}</Text> : null}
      </View>
    </Squishy>
  );
}

/**
 * Pill segmented control — the ONE toggle (e.g. Accounts → Currencies / Stacks).
 * A sliding pill (black selected segment on a grey track) animates between
 * segments; theme-aware for dark mode. Pass an external `progress` Animated.Value
 * to drive content in unison (the owner runs the timing); omit it and the control
 * self-animates the pill. Segment frames are measured so the pill tracks unequal
 * widths exactly. Driven on the JS thread so the pill width and label colours can
 * cross-fade alongside translateX (none of which the native driver supports).
 */
export function SegmentedControl({
  c, options, selectedIndex, onChange, progress: externalProgress,
}: {
  c: Theme; options: readonly string[]; selectedIndex: number; onChange: (i: number) => void;
  progress?: Animated.Value;
}) {
  const dark = useColorScheme() === 'dark';
  const track = dark ? '#2C2C2E' : '#E6E6E6';
  const selBg = dark ? '#FFFFFF' : '#000000';
  const selText = dark ? '#000000' : '#FFFFFF';

  const internal = useRef(new Animated.Value(selectedIndex)).current;
  const progress = externalProgress ?? internal;

  // Per-segment frames (x + width), measured on layout — the pill follows these
  // so it lands precisely even when segments differ in width.
  const [frames, setFrames] = useState<{ x: number; width: number }[]>([]);
  const range = options.map((_, i) => i);
  const ready = frames.length === options.length && range.every((i) => !!frames[i]);
  const setFrame = (i: number, x: number, width: number) =>
    setFrames((prev) => {
      const next = prev.slice();
      next[i] = { x, width };
      return next;
    });

  // When no external driver is supplied, own the pill animation; otherwise the
  // caller drives `progress` (so its content can move in unison with the pill).
  useEffect(() => {
    if (externalProgress) return;
    Animated.timing(internal, {
      toValue: selectedIndex, duration: 280, easing: Easing.inOut(Easing.ease), useNativeDriver: false,
    }).start();
  }, [selectedIndex, externalProgress, internal]);

  return (
    <View style={[styles.segTrack, { backgroundColor: track }]}>
      {ready && (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.segPill,
            {
              backgroundColor: selBg,
              width: progress.interpolate({ inputRange: range, outputRange: frames.map((f) => f.width) }),
              transform: [{ translateX: progress.interpolate({ inputRange: range, outputRange: frames.map((f) => f.x) }) }],
            },
          ]}
        />
      )}
      {options.map((opt, i) => (
        <Pressable
          key={opt}
          onPress={() => onChange(i)}
          onLayout={(e) => setFrame(i, e.nativeEvent.layout.x, e.nativeEvent.layout.width)}
          style={styles.segItem}
          accessibilityRole="button"
          accessibilityState={{ selected: i === selectedIndex }}
        >
          <Animated.Text
            style={[
              styles.segText,
              {
                color: ready
                  ? progress.interpolate({ inputRange: [i - 1, i, i + 1], outputRange: [c.text, selText, c.text], extrapolate: 'clamp' })
                  : i === selectedIndex ? selText : c.text,
              },
            ]}
          >
            {opt}
          </Animated.Text>
        </Pressable>
      ))}
    </View>
  );
}

/**
 * Transaction list row — icon circle + title/subtitle + amount (+ optional
 * status dot). Shared by the account and jar detail screens.
 */
export function TransactionRow({
  c, icon, title, sub, amount, positive, status,
}: {
  c: Theme; icon: IconSpec; title: string; sub: string; amount: string; positive?: boolean; status?: string;
}) {
  return (
    <View style={[styles.txRow, { backgroundColor: c.surface }]}>
      <View style={[styles.txIcon, { backgroundColor: c.pill }]}>
        <SystemIcon ios={icon.ios} android={icon.android} size={20} color={c.text} />
      </View>
      <View style={styles.txMeta}>
        <Text style={[styles.txTitle, { color: c.text }]} numberOfLines={1}>{title}</Text>
        <Text style={[styles.txSub, { color: c.muted }]} numberOfLines={1}>{sub}</Text>
      </View>
      <View style={styles.txRight}>
        <Text style={[styles.txAmount, { color: positive ? c.success : c.text }]} numberOfLines={1}>{amount}</Text>
        {status ? <StatusDot c={c} color={c.warning} label={status} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carousel: { paddingHorizontal: 12, paddingBottom: SPACING.lg, gap: SPACING.md },
  carouselCard: { width: CAROUSEL_CARD_W, borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  carouselAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  carouselAvatarText: { fontSize: 15, fontWeight: '700' },
  carouselTextStack: { flex: 1, gap: 2 },
  carouselTitle: { fontSize: 16, fontWeight: '700' },
  carouselSubtitle: { fontSize: 13 },
  carouselAction: { fontSize: 13, fontWeight: '500' },
  segTrack: { flexDirection: 'row', height: 32, borderRadius: 100, padding: 2, gap: 4, alignItems: 'center', alignSelf: 'center' },
  segPill: { position: 'absolute', top: 2, bottom: 2, left: 0, borderRadius: 100 },
  segItem: { height: '100%', borderRadius: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  segText: { fontSize: 14, fontWeight: '500' },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 16 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txMeta: { flex: 1, gap: 2 },
  txTitle: { fontSize: 14, fontWeight: '500' },
  txSub: { fontSize: 11 },
  txRight: { alignItems: 'flex-end', gap: 2 },
  txAmount: { fontSize: 14, fontWeight: '500' },
  surface: {
    borderRadius: RADIUS.xl,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  surfacePad: { padding: SPACING.lg },
  widgetHeader: { paddingHorizontal: SPACING.lg, paddingTop: SPACING.lg },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingVertical: 12,
  },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    justifyContent: 'center', alignItems: 'center',
  },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: 48 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.xs },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusLabel: { fontSize: 12, fontWeight: '500' },
  actionBtn: {
    flex: 1,
    borderRadius: RADIUS.lg,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  actionLabel: { fontSize: 12, fontWeight: '500', color: '#000000', textAlign: 'center' },
});
