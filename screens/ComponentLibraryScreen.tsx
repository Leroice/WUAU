import React, { useLayoutEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, Theme, WU_YELLOW, SPACING } from '../constants/theme';
import { useDesign, COMPONENT_LIBRARY, WEIGHTS, ComponentDef, Control, DesignTokens } from '../hooks/useDesign';
import { Surface, WidgetCard, ListRow, ActionButton, SectionHeader, StatusDot, Carousel, CarouselCard, SegmentedControl, TransactionRow, HeaderIconButton, HeaderLogo } from '../components/ui';
import { ConverterWidget, CurrencySelector } from '../components/ConverterWidget';
import { SystemIcon } from '../components/SystemIcon';
import { usePersona, PERSONAS } from '../hooks/usePersona';

const SAMPLE_ICON = { ios: 'star.fill', android: 'star' };

// Stateful preview wrapper for the segmented control.
function SegmentedPreview({ c }: { c: Theme }) {
  const [i, setI] = useState(0);
  return <SegmentedControl c={c} options={['Currencies', 'Stacks']} selectedIndex={i} onChange={setI} />;
}

// Reference catalog of the SHARED components that have no live tokens — shown so
// every built component is visible and nameable in one place.
const CATALOG: { name: string; blurb: string; render: (c: Theme) => React.ReactNode }[] = [
  {
    name: 'Section Header',
    blurb: 'Widget title type (shared WIDGET_TITLE). Optional › affordance for drill-in widgets.',
    render: (c) => (
      <View style={{ gap: 6 }}>
        <SectionHeader c={c} title="Recent transactions" onPress={() => {}} />
        <SectionHeader c={c} title="Send Money" />
      </View>
    ),
  },
  {
    name: 'Carousel',
    blurb: 'The single horizontal scroller behind every in-widget carousel (contacts, upcoming, …).',
    render: (c) => (
      <Carousel>
        {[0, 1, 2, 3].map((n) => (
          <View key={n} style={{ width: 110, height: 64, borderRadius: 12, backgroundColor: c.pill }} />
        ))}
      </Carousel>
    ),
  },
  {
    name: 'Carousel Card',
    blurb: 'The single card inside widget carousels — avatar + title/subtitle/optional action. Shared by Quick Actions and Upcoming.',
    render: (c) => (
      <Carousel>
        <CarouselCard c={c} initials="MB" avatarColor="#FFF0E8" avatarTextColor="#C45E1A" title="Maria B." subtitle="500.00 AUD" action="Send again" />
        <CarouselCard c={c} initials="AH" avatarColor="#C9F1E8" avatarTextColor="#048F6E" title="50,000.00 JPY" subtitle="To Aurora · 16 Apr" />
      </Carousel>
    ),
  },
  {
    name: 'Transaction Row',
    blurb: 'Account/stack list row — icon circle + title/time + amount, with an optional status dot.',
    render: (c) => (
      <View style={{ gap: 8 }}>
        <TransactionRow c={c} icon={{ ios: 'cart.fill', android: 'shopping-cart' }} title="Woolworths" sub="11:04AM • Melbourne" amount="180.22 AUD" status="Pending" />
        <TransactionRow c={c} icon={{ ios: 'building.columns.fill', android: 'account-balance' }} title="Cash deposit" sub="09:15PM • Richmond" amount="+350.00 AUD" positive />
      </View>
    ),
  },
  {
    name: 'Status Dot',
    blurb: 'Coloured dot + label for row status (Pending, In progress, Delivered…).',
    render: (c) => (
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <StatusDot c={c} color={c.warning} label="Pending" />
        <StatusDot c={c} color={c.info} label="In progress" />
        <StatusDot c={c} color={c.success} label="Delivered" />
      </View>
    ),
  },
  {
    name: 'Segmented Control',
    blurb: 'Pill toggle — black selected segment on a grey track. Used on the Accounts page.',
    render: (c) => <SegmentedPreview c={c} />,
  },
  {
    name: 'Currency Selector',
    blurb: 'Flag + code + up/down caret. The tap target that opens the currency picker.',
    render: (c) => (
      <View style={{ flexDirection: 'row', gap: 28 }}>
        <CurrencySelector cur={{ code: 'AUD', flag: '🇦🇺', name: 'Australian Dollar' }} color={c.text} />
        <CurrencySelector cur={{ code: 'JPY', flag: '🇯🇵', name: 'Japanese Yen' }} color={c.text} />
      </View>
    ),
  },
  {
    name: 'Bar Buttons',
    blurb: 'Native navigation-bar icon buttons — no chrome, system-tinted (profile, eye, calculator).',
    render: () => (
      <View style={{ flexDirection: 'row', gap: 28 }}>
        <HeaderIconButton label="Profile" ios="person.crop.circle" android="account-circle" />
        <HeaderIconButton label="Hide balance" ios="eye" android="visibility" />
        <HeaderIconButton label="Calculator" ios="plus.forwardslash.minus" android="calculate" />
      </View>
    ),
  },
  {
    name: 'WU Logo',
    blurb: 'Brand double-chevron mark. Centred in the nav bar via HeaderLogo.',
    render: () => <HeaderLogo />,
  },
  {
    name: 'Send Money Converter',
    blurb: 'The Home converter widget — flip reverses flow (animated), live rate conversion, currency picker.',
    render: () => <ConverterWidget />,
  },
];

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
  const { persona, setPersona } = usePersona();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'App settings',
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
      {/* Scenario — demo persona switcher (relocated here from the Settings panel) */}
      <View style={styles.block}>
        <Text style={[styles.blockName, { color: c.text }]}>Scenario</Text>
        <Text style={[styles.blockBlurb, { color: c.muted }]}>
          Switch the demo persona — reshapes balances, accounts, contacts and transactions across the app.
        </Text>
        <View style={styles.personaRow}>
          {PERSONAS.map((p) => {
            const active = p.id === persona.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPersona(p.id)}
                style={[styles.personaChip, { backgroundColor: active ? WU_YELLOW : c.card, borderColor: active ? WU_YELLOW : c.border }]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.personaLabel, { color: active ? '#000000' : c.text }]}>{p.label}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.personaBlurb, { color: c.muted }]}>{persona.blurb}</Text>
      </View>

      <Text style={[styles.intro, { color: c.muted }]}>
        Live design tokens — tweak a value and every instance across the app updates instantly.
      </Text>
      {COMPONENT_LIBRARY.map((def) => (
        <ComponentCard key={def.name} def={def} c={c} />
      ))}

      <Text style={[styles.intro, { color: c.muted }]}>
        Reference — shared components (no live tokens).
      </Text>
      {CATALOG.map((item) => (
        <View key={item.name} style={styles.block}>
          <Text style={[styles.blockName, { color: c.text }]}>{item.name}</Text>
          <Text style={[styles.blockBlurb, { color: c.muted }]}>{item.blurb}</Text>
          <View style={styles.preview}>{item.render(c)}</View>
        </View>
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
  personaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  personaChip: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: StyleSheet.hairlineWidth },
  personaLabel: { fontSize: 14, fontWeight: '600' },
  personaBlurb: { fontSize: 13, marginTop: 8, lineHeight: 18 },
});

