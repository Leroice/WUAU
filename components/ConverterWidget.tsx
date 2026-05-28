import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, useColorScheme } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { useTheme, WU_YELLOW } from '../theme';
import { WIDGET_TITLE } from './ui';
import { SystemIcon } from './SystemIcon';
import { Squishy } from './Squishy';
import { CONVERTER, TOP_CURRENCIES, ALL_CURRENCIES, RATES_PER_AUD, Currency } from '../mockData';
import { requestCurrency } from '../screens/ChooseCurrencyScreen';

// number → "11,240.00" (manual formatter; no Intl dependency).
function fmt(n: number, decimals = 2) {
  const fixed = Math.abs(n).toFixed(decimals);
  const [int, frac] = fixed.split('.');
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return frac ? `${withCommas}.${frac}` : withCommas;
}

const findCur = (code: string) => TOP_CURRENCIES.find((x) => x.code === code) ?? TOP_CURRENCIES[0];

// Emoji flag clipped into a 24pt circle (matches the design's circular flags
// without needing bespoke flag assets — consistent with the app's flag treatment).
function Flag({ emoji }: { emoji: string }) {
  return (
    <View style={styles.flag}>
      <Text style={styles.flagEmoji}>{emoji}</Text>
    </View>
  );
}

/**
 * Currency selector — flag + code + up/down caret. The whole control is the tap
 * target for the native currency picker (icon, label and caret all trigger it).
 */
export function CurrencySelector({
  cur, color, onPress, renderTrigger,
}: {
  cur: Currency;
  color: string;
  onPress?: () => void;
  // Lets a parent host the trigger inside a native menu component instead of a Pressable.
  renderTrigger?: (inner: React.ReactNode) => React.ReactNode;
}) {
  const inner = (
    <>
      <Flag emoji={cur.flag} />
      <View style={styles.labelCaret}>
        <Text style={[styles.code, { color }]}>{cur.code}</Text>
        <SystemIcon ios="chevron.up.chevron.down" android="unfold-more" size={13} color={color} />
      </View>
    </>
  );
  if (renderTrigger) return <>{renderTrigger(inner)}</>;
  return (
    <Pressable
      style={styles.selector}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${cur.code}, change currency`}
    >
      {inner}
    </Pressable>
  );
}

type Props = {
  style?: any;
  navigation?: any;
  onPressSend?: () => void;
};

/**
 * Home "Send Money" currency converter (Figma WU Beta App 176-67708 / 176-68576).
 * Two currency fields with a flip control between them: tapping the flip reverses
 * the cash flow (which leg is the outgoing/negative one) and the values update.
 * Editing the source amount converts live via the pair rate. No title chevron —
 * intentional.
 */
export function ConverterWidget({ style, navigation, onPressSend }: Props) {
  const c = useTheme();
  const dark = useColorScheme() === 'dark';

  const [fromCur, setFromCur] = useState<Currency>(findCur(CONVERTER.fromCode));
  const [toCur, setToCur] = useState<Currency>(findCur(CONVERTER.toCode));
  const [amount, setAmount] = useState(CONVERTER.amount); // magnitude of the SOURCE leg
  const [flowUp, setFlowUp] = useState(false); // false = arrow down, top is the outgoing (−) leg

  // Flip arrow rotation — springs 180° on each flip (single arrow.down glyph).
  const rot = useSharedValue(0);
  const arrowStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  // Pair rate: how many `toCur` per 1 `fromCur`.
  const rate = RATES_PER_AUD[toCur.code] / RATES_PER_AUD[fromCur.code];
  const mag = parseFloat(amount.replace(/,/g, '')) || 0;
  const topMag = flowUp ? mag / rate : mag; // fromCur leg
  const bottomMag = flowUp ? mag : mag * rate; // toCur leg
  const topIsSource = !flowUp;

  // Flip the flow: swap which leg is outgoing, carrying the value across so the
  // on-screen magnitudes stay consistent (only the signs + arrow flip).
  const flip = () => {
    const m = parseFloat(amount.replace(/,/g, '')) || 0;
    const newUp = !flowUp;
    setAmount(fmt(newUp ? m * rate : m / rate));
    setFlowUp(newUp);
    rot.value = withTiming(rot.value + 180, { duration: 450, easing: Easing.inOut(Easing.cubic) });
  };

  // Design tokens (light = exact Figma values; dark = theme-aware equivalents).
  const fieldBorder = dark ? c.border : '#C6C6C8';
  const flipBg = dark ? c.pill : '#F1F1F1';
  const chipBg = dark ? 'rgba(35,154,246,0.22)' : '#D0E1EE';

  // ONE stable layout for both legs so nothing shifts on flip: a fixed-width sign
  // slot (transparent when positive), the value filling/pinned left, and the
  // currency selector pinned right. The source leg is editable; the other mirrors
  // the converted value. Both legs are always a TextInput, so the structure never
  // changes between states.
  const amountSlot = (isSource: boolean, mag: number) => (
    <View style={styles.amountWrap}>
      <Text style={[styles.amount, { color: isSource ? c.text : 'transparent' }]}>-</Text>
      <TextInput
        style={[styles.amount, styles.amountInput, { color: c.text }]}
        value={isSource ? amount : fmt(mag)}
        editable={isSource}
        onChangeText={isSource ? setAmount : undefined}
        keyboardType="decimal-pad"
        selectTextOnFocus={isSource}
        returnKeyType="done"
        accessibilityLabel="Amount"
        numberOfLines={1}
      />
    </View>
  );

  const openPicker = (side: 'from' | 'to') => {
    const cur = side === 'from' ? fromCur : toCur;
    requestCurrency((code) => {
      const next = ALL_CURRENCIES.find((x) => x.code === code) ?? cur;
      if (side === 'from') setFromCur(next);
      else setToCur(next);
    });
    navigation?.navigate('ChooseCurrency', { side, currentCode: cur.code });
  };

  const selector = (side: 'from' | 'to', cur: Currency) => (
    <CurrencySelector cur={cur} color={c.text} onPress={() => openPicker(side)} />
  );

  return (
    <View style={[styles.widget, { backgroundColor: c.surface, borderColor: c.border }, style]}>
      {/* section header — title (no chevron, intentional) + special-rate chip */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, WIDGET_TITLE, { color: c.text }]} numberOfLines={1}>
            {CONVERTER.title}
          </Text>
          <View style={[styles.chip, { backgroundColor: chipBg }]}>
            <Text style={[styles.chipText, { color: c.text }]} numberOfLines={1}>
              1 {fromCur.code} = {fmt(rate, 2)} {toCur.code}
            </Text>
            <SystemIcon ios="info.circle" android="info-outline" size={13} color={c.text} />
          </View>
        </View>
      </View>

      {/* move money */}
      <View style={styles.moveMoney}>
        <View style={styles.fieldGroup}>
          {/* top leg */}
          <View style={[styles.field, { backgroundColor: c.surface, borderColor: fieldBorder }]}>
            {amountSlot(topIsSource, topMag)}
            {selector('from', fromCur)}
          </View>

          {/* bottom leg */}
          <View style={[styles.field, { backgroundColor: c.surface, borderColor: fieldBorder }]}>
            {amountSlot(!topIsSource, bottomMag)}
            {selector('to', toCur)}
          </View>

          {/* flip — absolutely centred over the gap between the two fields */}
          <View style={styles.flipWrap} pointerEvents="box-none">
            <Squishy
              scaleTo={0.9}
              onPress={flip}
              style={[styles.flip, { backgroundColor: flipBg }]}
              accessibilityRole="button"
              accessibilityLabel="Flip currencies"
            >
              <Animated.View style={arrowStyle}>
                <SystemIcon ios="arrow.down" android="arrow-downward" size={16} color={c.text} />
              </Animated.View>
            </Squishy>
          </View>
        </View>

        {/* send */}
        <View style={styles.sendRow}>
          <Squishy
            scaleTo={0.97}
            onPress={onPressSend}
            style={styles.sendBtn}
            accessibilityRole="button"
            accessibilityLabel={CONVERTER.cta}
          >
            <Text style={styles.sendText}>{CONVERTER.cta}</Text>
          </Squishy>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // widget container: px16 / py4, gap12, radius24 (Figma _dashboard-widget)
  widget: {
    borderRadius: 24,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 4,
    gap: 12,
  },
  // section-header: pt16, gap8
  header: { paddingTop: 16, width: '100%' },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  title: { flex: 1 },
  // chip_rate-special: bg #d0e1ee, radius24, pl8 pr8 pt4 pb4, gap4
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 4,
    borderRadius: 24,
  },
  chipText: { fontSize: 12, fontWeight: '500', lineHeight: 16 },

  moveMoney: { gap: 4, width: '100%' },
  fieldGroup: { gap: 4, width: '100%', position: 'relative' },
  // field: h100, px16, py20, radius12, gap16
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    height: 100,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    width: '100%',
  },
  // amount: PP Right Grotesk Wide Medium 32, leading none
  amount: { fontFamily: 'PPRightGrotesk-WideMedium', fontSize: 32, lineHeight: 36 },
  // fills the space left of the selector so the value pins left and the selector pins right
  amountWrap: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  amountInput: { flex: 1, padding: 0, margin: 0 },

  // currency-selector: row gap8, h32 — never shrinks/moves (pinned right)
  selector: { flexDirection: 'row', alignItems: 'center', gap: 8, height: 32, flexShrink: 0 },
  flag: { width: 24, height: 24, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  flagEmoji: { fontSize: 20, lineHeight: 24, textAlign: 'center' },
  labelCaret: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  code: { fontSize: 15, fontWeight: '600', letterSpacing: -0.23, lineHeight: 20 },

  // flip: 36 circle #f1f1f1, centred over the 4px gap between fields
  flipWrap: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  flip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // send: container py16, pill button radius80
  sendRow: { flexDirection: 'row', paddingVertical: 16, width: '100%' },
  sendBtn: {
    flex: 1,
    backgroundColor: WU_YELLOW,
    borderRadius: 80,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: { fontFamily: 'PPRightGrotesk-WideMedium', fontSize: 16, color: '#000000', textAlign: 'center' },
});
