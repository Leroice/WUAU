import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Theme, WU_YELLOW, SPACING } from './theme';
import { useDesign, COMPONENT_LIBRARY, WEIGHTS, ComponentDef, Control, DesignTokens } from './DesignContext';
import { Surface, WidgetCard, ListRow, ActionButton, SectionHeader } from './components/ui';
import { SystemIcon } from './SystemIcon';

const SAMPLE_ICON = { ios: 'star.fill', android: 'star' };

// Live preview for each component, rendered with the current tokens.
function Preview({ name, c }: { name: string; c: Theme }) {
  const { tokens } = useDesign();
  switch (name) {
    case 'Widget Card':
      return (
        <WidgetCard c={c} title="Sample widget" onPressHeader={() => {}}>
          <View style={{ paddingHorizontal: SPACING.lg }}>
            <ListRow c={c} icon={SAMPLE_ICON} iconColor={c.muted} label="Item one" divider />
            <ListRow c={c} icon={SAMPLE_ICON} iconColor={c.muted} label="Item two" />
          </View>
        </WidgetCard>
      );
    case 'List Row':
      return (
        <Surface c={c} padded={false} style={{ paddingHorizontal: SPACING.lg }}>
          <ListRow c={c} icon={SAMPLE_ICON} iconColor={c.muted} label="Manage contacts" divider />
          <ListRow c={c} icon={SAMPLE_ICON} iconColor={c.muted} label="Statements" />
        </Surface>
      );
    case 'Action Button':
      return (
        <View style={{ flexDirection: 'row', gap: SPACING.sm, height: 60 }}>
          <ActionButton icon={{ ios: 'arrow.up', android: 'arrow-upward' }} label="Send" />
          <ActionButton icon={{ ios: 'arrow.down', android: 'arrow-downward' }} label="Request" />
          <ActionButton icon={{ ios: 'slider.horizontal.3', android: 'tune' }} label="Controls" />
        </View>
      );
    case 'Surface':
      return (
        <Surface c={c}>
          <Text style={{ color: c.text, fontWeight: '600' }}>Elevated surface</Text>
          <Text style={{ color: c.muted, marginTop: 4, fontSize: 13 }}>Rounded panel behind grouped content.</Text>
        </Surface>
      );
    case 'Wallet Card':
      return (
        <View style={{ alignItems: 'center' }}>
          <View style={[styles.miniCard, { borderRadius: tokens.cardRadius }]}>
            <Text style={styles.miniVisa}>VISA</Text>
          </View>
        </View>
      );
    default:
      return null;
  }
}

function ControlRow({ c, control }: { c: Theme; control: Control }) {
  const { tokens, set } = useDesign();
  const value = tokens[control.key];

  if (control.type === 'weight') {
    const idx = WEIGHTS.indexOf(value as any);
    const cycle = (dir: number) => set(control.key, WEIGHTS[(idx + dir + WEIGHTS.length) % WEIGHTS.length] as DesignTokens[typeof control.key]);
    return (
      <View style={styles.ctrlRow}>
        <Text style={[styles.ctrlLabel, { color: c.text }]}>{control.label}</Text>
        <View style={styles.stepper}>
          <Stepper c={c} label="−" onPress={() => cycle(-1)} />
          <Text style={[styles.ctrlValue, { color: c.text }]}>{String(value)}</Text>
          <Stepper c={c} label="+" onPress={() => cycle(1)} />
        </View>
      </View>
    );
  }

  const num = value as number;
  const change = (dir: number) => {
    const next = Math.min(control.max, Math.max(control.min, num + dir * control.step));
    set(control.key, next as DesignTokens[typeof control.key]);
  };
  return (
    <View style={styles.ctrlRow}>
      <Text style={[styles.ctrlLabel, { color: c.text }]}>{control.label}</Text>
      <View style={styles.stepper}>
        <Stepper c={c} label="−" onPress={() => change(-1)} />
        <Text style={[styles.ctrlValue, { color: c.text }]}>{num}</Text>
        <Stepper c={c} label="+" onPress={() => change(1)} />
      </View>
    </View>
  );
}

function Stepper({ c, label, onPress }: { c: Theme; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.stepBtn, { backgroundColor: c.pill }]} hitSlop={6} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={[styles.stepBtnText, { color: c.text }]}>{label}</Text>
    </Pressable>
  );
}

function ComponentCard({ def, c }: { def: ComponentDef; c: Theme }) {
  return (
    <View style={styles.block}>
      <Text style={[styles.blockName, { color: c.text }]}>{def.name}</Text>
      <Text style={[styles.blockBlurb, { color: c.muted }]}>{def.blurb}</Text>
      <View style={styles.preview}><Preview name={def.name} c={c} /></View>
      <View style={[styles.controls, { borderColor: c.border }]}>
        {def.controls.map((ctrl) => (
          <ControlRow key={ctrl.key} c={c} control={ctrl} />
        ))}
      </View>
    </View>
  );
}

export function ComponentLibraryScreen({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { tokens, reset } = useDesign();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Component Library',
      headerLargeTitle: false,
      headerRight: () => (
        <Pressable onPress={reset} hitSlop={10} accessibilityRole="button" accessibilityLabel="Reset design">
          <Text style={{ color: c.accent, fontSize: 16, fontWeight: '600' }}>Reset</Text>
        </Pressable>
      ),
    });
  }, [navigation, c, reset]);

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <Text style={[styles.intro, { color: c.muted }]}>
        Live design tokens — tweak a value and every instance across the app updates instantly.
      </Text>
      {COMPONENT_LIBRARY.map((def) => (
        <ComponentCard key={def.name} def={def} c={c} />
      ))}

      {/* Export — all current tweak values */}
      <View style={styles.block}>
        <Text style={[styles.blockName, { color: c.text }]}>Export</Text>
        <Text style={[styles.blockBlurb, { color: c.muted }]}>All current tweak values. Select to copy, or log to the Metro console.</Text>
        <Text selectable style={[styles.json, { color: c.text, backgroundColor: c.pill }]}>
          {JSON.stringify(tokens, null, 2)}
        </Text>
        <Pressable
          onPress={() => console.log('WUAU design tokens →', JSON.stringify(tokens, null, 2))}
          style={[styles.logBtn, { borderColor: c.border }]}
          accessibilityRole="button"
        >
          <Text style={{ color: c.accent, fontWeight: '600' }}>Log tokens to console</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: SPACING.lg, gap: SPACING.xl },
  intro: { fontSize: 13, lineHeight: 18 },
  block: { gap: SPACING.sm },
  blockName: { fontSize: 18, fontWeight: '700' },
  blockBlurb: { fontSize: 13, lineHeight: 17, marginTop: -2 },
  preview: { paddingVertical: SPACING.sm },
  controls: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: SPACING.sm, gap: 6 },
  ctrlRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctrlLabel: { fontSize: 14 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  ctrlValue: { fontSize: 15, fontWeight: '600', minWidth: 36, textAlign: 'center' },
  stepBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  stepBtnText: { fontSize: 18, fontWeight: '600' },
  miniCard: { width: 200, height: 126, backgroundColor: WU_YELLOW, justifyContent: 'flex-end', alignItems: 'flex-end', padding: 12 },
  miniVisa: { fontSize: 18, fontWeight: '800', fontStyle: 'italic', color: '#000000' },
  json: { fontFamily: 'Courier', fontSize: 12, padding: 12, borderRadius: 12, lineHeight: 18 },
  logBtn: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginTop: 8 },
});
