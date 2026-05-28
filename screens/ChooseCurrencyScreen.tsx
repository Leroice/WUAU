import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme';
import { SystemIcon } from '../components/SystemIcon';
import { TOP_CURRENCIES, ALL_CURRENCIES } from '../mockData';

// Bridge the picker result back to the converter widget without putting a
// non-serializable callback in navigation params (avoids RN's serialize warning).
let pendingSelect: ((code: string) => void) | null = null;
export const requestCurrency = (onSelect: (code: string) => void) => {
  pendingSelect = onSelect;
};

const TOP_CODES = new Set(TOP_CURRENCIES.map((x) => x.code));
// Everything that isn't a "top" currency, alphabetical by name (matches the
// Figma list: 5 popular, divider, then the full list).
const REST = ALL_CURRENCIES.filter((x) => !TOP_CODES.has(x.code)).sort((a, b) => a.name.localeCompare(b.name));

function CurrencyRow({
  c, cur, selected, onPress,
}: { c: ReturnType<typeof useTheme>; cur: { code: string; flag: string; name: string }; selected: boolean; onPress: () => void }) {
  return (
    <Pressable style={styles.row} onPress={onPress} accessibilityRole="button" accessibilityLabel={`${cur.name}, ${cur.code}`}>
      <View style={styles.flag}>
        <Text style={styles.flagEmoji}>{cur.flag}</Text>
      </View>
      <Text style={[styles.name, { color: c.text }]} numberOfLines={1}>{cur.name}</Text>
      {selected && <SystemIcon ios="checkmark" android="check" size={17} color={c.accent} />}
      <Text style={[styles.code, { color: c.muted }]}>{cur.code}</Text>
    </Pressable>
  );
}

/**
 * "Choose currency" — the full currency list (Figma WU Beta App 176-68650).
 * Pushed natively so it slides in from the right. Top currencies first, a
 * hairline divider, then the rest. Selecting a row hands the code back to the
 * converter widget and pops.
 */
export function ChooseCurrencyScreen({ navigation, route }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const currentCode: string | undefined = route?.params?.currentCode;

  // Native close (✕) on the right of the bar, alongside the native back chevron.
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable onPress={() => navigation.goBack()} hitSlop={12} accessibilityRole="button" accessibilityLabel="Close">
          <SystemIcon ios="xmark" android="close" size={18} color={c.text} />
        </Pressable>
      ),
    });
  }, [navigation, c]);

  const choose = (code: string) => {
    pendingSelect?.(code);
    pendingSelect = null;
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {TOP_CURRENCIES.map((cur) => (
          <CurrencyRow key={cur.code} c={c} cur={cur} selected={cur.code === currentCode} onPress={() => choose(cur.code)} />
        ))}

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: c.divider }]} />
        </View>

        {REST.map((cur) => (
          <CurrencyRow key={cur.code} c={c} cur={cur} selected={cur.code === currentCode} onPress={() => choose(cur.code)} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: 16 },
  // list-item: 56pt row, gap 12, py 8
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 56, paddingVertical: 8 },
  flag: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  flagEmoji: { fontSize: 34, lineHeight: 40, textAlign: 'center' },
  name: { flex: 1, fontSize: 16, fontWeight: '500' },
  code: { fontSize: 12, fontWeight: '500' },
  // divider: 24px block with a centred hairline
  divider: { height: 24, justifyContent: 'center' },
  dividerLine: { height: StyleSheet.hairlineWidth, width: '100%' },
});
