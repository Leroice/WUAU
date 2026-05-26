import React from 'react';
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Squishy } from '../Squishy';
import { SystemIcon, IconSpec } from '../SystemIcon';
import { Theme, WU_YELLOW, SPACING, RADIUS } from '../theme';
import { useDesign } from '../DesignContext';

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
      <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
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

const styles = StyleSheet.create({
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
  sectionTitle: { fontSize: 17, fontWeight: '700' },
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
