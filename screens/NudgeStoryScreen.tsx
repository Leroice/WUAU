import React, { useLayoutEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, SPACING, WU_YELLOW } from '../constants/theme';
import { usePersona, PERSONAS } from '../hooks/usePersona';
import { useNudgeState } from '../hooks/useNudgeState';
import { useNudgeActions } from '../hooks/useNudgeActions';
import { useNudges } from '../hooks/useNudges';
import { CATALOGUE } from '../services/nudges';
import type { Segment } from '../types';

const SEGMENT_NOTES: Record<Segment, string> = {
  S1: 'E1 wallet user. Full new home; the wallet earns its way in via gentle nudges.',
  S2: 'E1 IMT user with rejected wallet. IMT-first home, wallet retry available.',
  S3: 'E1 user on R4 web — edge case, redirect to E1 app.',
  S4: 'R4 registered, never verified. First time on E1; treat as new.',
  S5a: 'Verification in progress (KYC review). Status holding screen.',
  S5b: 'KYC failed — retry available. Non-dismissible retry banner.',
  S5c: 'ECDD / high-risk hold. Compliance sign-off. Log-out only.',
  S6: 'Verified R4, IMT only on E1. IMT-first home; subtle wallet intro.',
  S7a: 'Verified R4 mid-upgrade: wallet value prop (entry).',
  S7b: 'Verified R4 mid-upgrade: eligibility check.',
  S7c: 'Verified R4 mid-upgrade: transact-paused. Wallet onboarding in flight.',
};

const MONTH_1_JOURNEY: { day: string; event: string }[] = [
  { day: 'Day 1', event: 'Card delivered. Apple-required Apple Pay nudge fires (escalating cadence).' },
  { day: 'Day 1', event: 'Refer-a-Friend $50/$50 surfaces in the back of the deck (gated on first_send_done).' },
  { day: 'Day 2', event: 'After first conversion, post-action toast: "Save it in a Jar?" (touchpoint: post_action).' },
  { day: 'Day 3', event: 'First Jar nudge clears when user creates one (hideWhen: first_jar_created).' },
  { day: 'Day 5', event: 'Direct deposit nudge promotes (placeholder — to add).' },
  { day: 'Day 7', event: 'Apple Pay cadence transitions: 4-6 dismisses → every-load (~24h) tier.' },
  { day: 'Day 14', event: '2-week milestone interstitial — "you\'ve moved $X" (placeholder).' },
  { day: 'Day 21', event: 'Refer-a-Friend re-promotes if still unconverted.' },
  { day: 'Day 30', event: 'First-month summary; Apple Pay drops to 3-day cadence.' },
];

export function NudgeStoryScreen({ navigation }: any) {
  const c = useTheme();
  const insets = useSafeAreaInsets();
  const { persona, setPersona } = usePersona();
  const { dismissedIds, escalations, appLoads, effectiveFlags, simulateAppLoad, reset } = useNudgeState();
  const { setFlag } = useNudgeActions();
  const visible = useNudges('home_banner');

  useLayoutEffect(() => {
    navigation.setOptions({ title: 'Nudge framework' });
  }, [navigation]);

  return (
    <ScrollView
      style={{ backgroundColor: c.bg }}
      contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 40 }]}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      {/* ── Intro ───────────────────────────────────────────────────────── */}
      <Section c={c} title="What this is">
        <Body c={c}>
          A marketing-style nudge system layered on top of WUAU. Same way a CRM team
          would design a journey — declarative catalogue, rule-based eligibility,
          and four touchpoint surfaces (home banner deck, post-action toast,
          full-screen interstitial, silent). Components consume a single hook;
          marketing or product can author/swap entries without touching screens.
        </Body>
      </Section>

      {/* ── 7 segments ──────────────────────────────────────────────────── */}
      <Section c={c} title="Segments">
        <Body c={c}>
          Eleven entry experiences cover the migration from R4 to eOne. Per the
          migration UX doc — segment determines home variant, nudge eligibility,
          and which actions are locked.
        </Body>
        {(Object.entries(SEGMENT_NOTES) as [Segment, string][]).map(([k, v]) => (
          <View key={k} style={styles.segRow}>
            <View style={[styles.segBadge, { backgroundColor: c.pill }]}>
              <Text style={[styles.segBadgeText, { color: c.text }]}>{k}</Text>
            </View>
            <Text style={[styles.segText, { color: c.muted }]}>{v}</Text>
          </View>
        ))}
      </Section>

      {/* ── First month journey ─────────────────────────────────────────── */}
      <Section c={c} title="First month journey (S1 wallet user)">
        <Body c={c}>
          A composite walk of the day-1 to day-30 nudge cadence. Trigger-based
          hybrid: time gates + flag-flip gates.
        </Body>
        {MONTH_1_JOURNEY.map((row, i) => (
          <View key={i} style={[styles.timelineRow, { borderColor: c.border }]}>
            <Text style={[styles.timelineDay, { color: c.text }]}>{row.day}</Text>
            <Text style={[styles.timelineText, { color: c.muted }]}>{row.event}</Text>
          </View>
        ))}
      </Section>

      {/* ── Live demo controls ──────────────────────────────────────────── */}
      <Section c={c} title="Try a scenario">
        <Body c={c}>
          Each persona is a complete scenario — segment, wallet status, flags. Tap to switch; the home re-renders and the nudge queue re-evaluates.
        </Body>
        <View style={styles.personaGrid}>
          {PERSONAS.map((p) => {
            const active = p.id === persona.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPersona(p.id)}
                style={[styles.personaTile, { backgroundColor: active ? WU_YELLOW : c.surface, borderColor: active ? WU_YELLOW : c.border }]}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.personaTileSegment, { color: active ? '#000000' : c.muted }]}>{p.segment}</Text>
                <Text style={[styles.personaTileName, { color: active ? '#000000' : c.text }]}>{p.label}</Text>
                <Text style={[styles.personaTileBlurb, { color: active ? '#000000' : c.muted }]} numberOfLines={2}>{p.blurb}</Text>
              </Pressable>
            );
          })}
        </View>
      </Section>

      {/* ── Catalogue ───────────────────────────────────────────────────── */}
      <Section c={c} title={`Catalogue (${CATALOGUE.length} entries)`}>
        <Body c={c}>
          Every nudge ID, priority, scope, and visibility rule. Edit
          services/nudges.ts to add or re-prioritise — no screen changes needed.
        </Body>
        {CATALOGUE.map((n) => (
          <View key={n.id} style={[styles.catRow, { borderColor: c.border }]}>
            <View style={styles.catHeader}>
              <Text style={[styles.catId, { color: c.text }]}>{n.id}</Text>
              <View style={[styles.catPriority, { backgroundColor: c.pill }]}>
                <Text style={[styles.catPriorityText, { color: c.text }]}>p{n.priority}</Text>
              </View>
            </View>
            <Text style={[styles.catMeta, { color: c.muted }]}>{n.style} · {n.touchpoint} · dismiss: {n.dismiss}</Text>
            <Text style={[styles.catScope, { color: c.muted }]}>scope: {n.segmentScope.join(', ')}</Text>
            <Text style={[styles.catHeadline, { color: c.text }]}>{n.content.headline}</Text>
          </View>
        ))}
      </Section>

      {/* ── Demo controls (live state) ──────────────────────────────────── */}
      <Section c={c} title="Demo controls">
        <Body c={c}>
          Walk the Apple Pay cadence by simulating loads. Each tap bumps appLoads;
          dismiss the home banner, simulate 3 loads, watch it return.
        </Body>
        <View style={styles.btnRow}>
          <Pressable onPress={simulateAppLoad} style={[styles.demoBtn, { borderColor: c.border, backgroundColor: c.surface }]} accessibilityRole="button">
            <Text style={[styles.demoBtnText, { color: c.text }]}>Simulate app load (+1)</Text>
          </Pressable>
          <Pressable onPress={reset} style={[styles.demoBtn, { borderColor: c.border, backgroundColor: c.surface }]} accessibilityRole="button">
            <Text style={[styles.demoBtnText, { color: c.text }]}>Reset session state</Text>
          </Pressable>
        </View>
        <View style={[styles.stateBlock, { backgroundColor: c.pill }]}>
          <Text style={[styles.stateLine, { color: c.text }]}>persona       <Text style={{ color: c.muted }}>{persona.id} · {persona.segment} · {persona.walletStatus}</Text></Text>
          <Text style={[styles.stateLine, { color: c.text }]}>appLoads      <Text style={{ color: c.muted }}>{appLoads}</Text></Text>
          <Text style={[styles.stateLine, { color: c.text }]}>dismissedIds  <Text style={{ color: c.muted }}>{Array.from(dismissedIds).join(', ') || '(none)'}</Text></Text>
          <Text style={[styles.stateLine, { color: c.text }]}>escalations   <Text style={{ color: c.muted }}>{JSON.stringify(escalations)}</Text></Text>
          <Text style={[styles.stateLine, { color: c.text }]}>flags         <Text style={{ color: c.muted }}>{JSON.stringify(effectiveFlags)}</Text></Text>
          <Text style={[styles.stateLine, { color: c.text }]}>visible deck  <Text style={{ color: c.muted }}>{visible.map((n) => n.id).join(', ') || '(empty)'}</Text></Text>
        </View>
        <Body c={c}>Quick flag flip:</Body>
        <View style={styles.flagRow}>
          {(['apple_pay_active','has_card','first_send_done','first_jar_created','first_conversion_done','refer_friend_done'] as const).map((k) => {
            const v = effectiveFlags[k] === true;
            return (
              <Pressable key={k} onPress={() => setFlag(k, !v)} style={[styles.flagChip, { backgroundColor: v ? WU_YELLOW : c.surface, borderColor: v ? WU_YELLOW : c.border }]} accessibilityRole="button">
                <Text style={[styles.flagChipText, { color: v ? '#000000' : c.text }]}>{k} {v ? '✓' : '·'}</Text>
              </Pressable>
            );
          })}
        </View>
      </Section>
    </ScrollView>
  );
}

// ── Small presenters ────────────────────────────────────────────────────────
function Section({ c, title, children }: any) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: c.text }]}>{title}</Text>
      {children}
    </View>
  );
}
function Body({ c, children }: any) {
  return <Text style={[styles.body, { color: c.muted }]}>{children}</Text>;
}

const styles = StyleSheet.create({
  scroll: { padding: SPACING.lg, gap: SPACING.xl },
  section: { gap: SPACING.md },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 14, lineHeight: 20 },

  segRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginTop: 4 },
  segBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, minWidth: 38, alignItems: 'center' },
  segBadgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  segText: { fontSize: 13, lineHeight: 18, flex: 1 },

  timelineRow: { flexDirection: 'row', gap: 12, paddingVertical: 10, borderTopWidth: StyleSheet.hairlineWidth, alignItems: 'flex-start' },
  timelineDay: { fontSize: 13, fontWeight: '700', minWidth: 56 },
  timelineText: { fontSize: 13, lineHeight: 18, flex: 1 },

  personaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  personaTile: {
    width: '48%', borderRadius: 14, borderWidth: StyleSheet.hairlineWidth,
    padding: 12, gap: 2,
  },
  personaTileSegment: { fontSize: 11, fontWeight: '700', letterSpacing: 0.4 },
  personaTileName: { fontSize: 14, fontWeight: '700', marginTop: 2 },
  personaTileBlurb: { fontSize: 11, lineHeight: 14, marginTop: 4 },

  catRow: { borderTopWidth: StyleSheet.hairlineWidth, paddingVertical: 10, gap: 2 },
  catHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  catId: { fontSize: 14, fontWeight: '700', fontFamily: 'Courier' },
  catPriority: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  catPriorityText: { fontSize: 11, fontWeight: '700' },
  catMeta: { fontSize: 11, fontFamily: 'Courier' },
  catScope: { fontSize: 11, fontFamily: 'Courier' },
  catHeadline: { fontSize: 13, fontWeight: '600', marginTop: 2 },

  btnRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  demoBtn: {
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 12, borderWidth: StyleSheet.hairlineWidth,
  },
  demoBtnText: { fontSize: 13, fontWeight: '600' },

  stateBlock: { padding: 12, borderRadius: 12, gap: 6, marginTop: 4 },
  stateLine: { fontSize: 11, fontFamily: 'Courier', lineHeight: 16 },

  flagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 },
  flagChip: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 10, borderWidth: StyleSheet.hairlineWidth,
  },
  flagChipText: { fontSize: 11, fontWeight: '600', fontFamily: 'Courier' },
});
