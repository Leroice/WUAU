import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ParticleBalance } from './ParticleBalance';
import { Tweaks, useTweaks } from './TweaksContext';

const WU_YELLOW = '#F5A623';
const PANEL = '#1C1C1E';
const TRACK = '#3A3A3C';
const TEXT = '#FFFFFF';
const MUTED = '#8E8E93';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ─── Numeric field with steppers (precise, not janky) ─────────────────────────
function NumberField({
  label,
  value,
  min,
  max,
  step,
  decimals,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  decimals: number;
  onChange: (v: number) => void;
}) {
  const [text, setText] = useState(value.toFixed(decimals));
  // Re-sync the field when the value changes from outside (reset / steppers).
  useEffect(() => setText(value.toFixed(decimals)), [value, decimals]);

  const commit = (raw: string) => {
    const n = parseFloat(raw);
    if (!isNaN(n)) onChange(clamp(parseFloat(n.toFixed(decimals)), min, max));
    else setText(value.toFixed(decimals));
  };
  const bump = (dir: number) => onChange(clamp(parseFloat((value + dir * step).toFixed(decimals)), min, max));

  return (
    <View style={styles.numRow}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.numControls}>
        <TouchableOpacity onPress={() => bump(-1)} style={styles.stepBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.stepText}>−</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.numInput}
          value={text}
          onChangeText={setText}
          onEndEditing={(e) => commit(e.nativeEvent.text)}
          onSubmitEditing={(e) => commit(e.nativeEvent.text)}
          keyboardType="decimal-pad"
          returnKeyType="done"
          selectTextOnFocus
          placeholderTextColor={MUTED}
        />
        <TouchableOpacity onPress={() => bump(1)} style={styles.stepBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.stepText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PALETTE = ['#F5A623', '#FFFFFF', '#FF453A', '#FF9F0A', '#FFD60A', '#32D74B', '#64D2FF', '#0A84FF', '#BF5AF2', '#FF2D95'];

function Swatches({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { color: string; label?: string; key: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <View style={styles.swatchBlock}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={styles.swatchRow}>
        {options.map((o) => {
          const selected = value === o.key;
          return (
            <TouchableOpacity
              key={o.key}
              onPress={() => onChange(o.key)}
              style={[
                styles.swatch,
                { backgroundColor: o.color, borderColor: selected ? '#FFFFFF' : 'transparent' },
                o.label ? styles.swatchLabeled : null,
              ]}
            >
              {o.label ? <Text style={styles.swatchText}>{o.label}</Text> : null}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function Toggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <TouchableOpacity style={styles.toggleRow} onPress={onToggle} activeOpacity={0.7}>
      <Text style={styles.sliderLabel}>{label}</Text>
      <View style={[styles.toggle, { backgroundColor: on ? WU_YELLOW : TRACK }]}>
        <Text style={[styles.toggleText, { color: on ? '#000' : MUTED }]}>{on ? 'ON' : 'OFF'}</Text>
      </View>
    </TouchableOpacity>
  );
}

type NumericKey = { [K in keyof Tweaks]: Tweaks[K] extends number ? K : never }[keyof Tweaks];
type SliderSpec = { key: NumericKey; label: string; min: number; max: number; step: number; decimals: number };

const TILT_SLIDERS: SliderSpec[] = [
  { key: 'maxOffset', label: 'Tilt strength', min: 0, max: 140, step: 2, decimals: 0 },
  { key: 'smooth', label: 'Smoothing', min: 0.02, max: 0.5, step: 0.01, decimals: 2 },
  { key: 'springSpeed', label: 'Settle speed', min: 2, max: 24, step: 1, decimals: 0 },
  { key: 'springBounciness', label: 'Settle bounce', min: 0, max: 20, step: 1, decimals: 0 },
];

const PARTICLE_SLIDERS: SliderSpec[] = [
  { key: 'count', label: 'Count', min: 10, max: 140, step: 2, decimals: 0 },
  { key: 'scatter', label: 'Scatter', min: 80, max: 320, step: 5, decimals: 0 },
  { key: 'driftAmount', label: 'Drift amount', min: 0, max: 2.5, step: 0.05, decimals: 2 },
  { key: 'driftSpeed', label: 'Drift speed', min: 0.3, max: 2.5, step: 0.05, decimals: 2 },
  { key: 'sizeMin', label: 'Min radius', min: 1, max: 12, step: 0.5, decimals: 1 },
  { key: 'sizeMax', label: 'Max radius', min: 2, max: 24, step: 0.5, decimals: 1 },
  { key: 'glow', label: 'Glow / blur', min: 0.5, max: 2.5, step: 0.05, decimals: 2 },
  { key: 'sizeJitter', label: 'Size randomness', min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: 'blurNoise', label: 'Blur noise', min: 0, max: 1, step: 0.02, decimals: 2 },
  { key: 'dissolveMs', label: 'Dissolve (ms)', min: 300, max: 1600, step: 50, decimals: 0 },
  { key: 'reformMs', label: 'Reform (ms)', min: 300, max: 1600, step: 50, decimals: 0 },
];

const PULL_SLIDERS: SliderSpec[] = [
  { key: 'pullThreshold', label: 'Pull threshold', min: 40, max: 220, step: 5, decimals: 0 },
  { key: 'expandGap', label: 'Expand gap', min: 40, max: 240, step: 5, decimals: 0 },
  { key: 'popBounce', label: 'Pop bounce', min: 0, max: 30, step: 1, decimals: 0 },
  { key: 'collapseSwipe', label: 'Swipe-up sensitivity', min: 20, max: 220, step: 5, decimals: 0 },
  { key: 'swapMs', label: 'Swap (ms)', min: 150, max: 900, step: 10, decimals: 0 },
];

export function TweaksPanel() {
  const { tweaks, set, reset } = useTweaks();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Particle tweaks</Text>
        <TouchableOpacity onPress={reset} style={styles.smallBtn}>
          <Text style={styles.smallBtnText}>Reset</Text>
        </TouchableOpacity>
      </View>

      {/* live preview (pinned so you can see edits while you scroll) */}
      <View style={styles.preview}>
        <ParticleBalance amount="5,966.90" currency="AUD" hidden color={TEXT} accent={WU_YELLOW} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.section}>Springs & tilt</Text>
        {TILT_SLIDERS.map((s) => (
          <NumberField
            key={s.key}
            label={s.label}
            value={tweaks[s.key]}
            min={s.min}
            max={s.max}
            step={s.step}
            decimals={s.decimals}
            onChange={(v) => set(s.key, v)}
          />
        ))}
        <Toggle label="Invert X" on={tweaks.signX === -1} onToggle={() => set('signX', tweaks.signX === 1 ? -1 : 1)} />
        <Toggle label="Invert Y" on={tweaks.signY === -1} onToggle={() => set('signY', tweaks.signY === 1 ? -1 : 1)} />

        <Text style={styles.section}>Particles</Text>
        {PARTICLE_SLIDERS.map((s) => (
          <NumberField
            key={s.key}
            label={s.label}
            value={tweaks[s.key]}
            min={s.min}
            max={s.max}
            step={s.step}
            decimals={s.decimals}
            onChange={(v) => set(s.key, v)}
          />
        ))}

        <Text style={styles.section}>Colour</Text>
        <Swatches
          label="Accent"
          value={tweaks.accentColor}
          options={PALETTE.map((c) => ({ key: c, color: c }))}
          onChange={(v) => set('accentColor', v)}
        />
        <Swatches
          label="Base"
          value={tweaks.baseColor}
          options={[{ key: '', color: '#48484A', label: 'Auto' }, ...PALETTE.map((c) => ({ key: c, color: c }))]}
          onChange={(v) => set('baseColor', v)}
        />
        <NumberField
          label="Accent ratio"
          value={tweaks.accentRatio}
          min={0}
          max={1}
          step={0.02}
          decimals={2}
          onChange={(v) => set('accentRatio', v)}
        />

        <Text style={styles.section}>Pull & swap</Text>
        {PULL_SLIDERS.map((s) => (
          <NumberField
            key={s.key}
            label={s.label}
            value={tweaks[s.key]}
            min={s.min}
            max={s.max}
            step={s.step}
            decimals={s.decimals}
            onChange={(v) => set(s.key, v)}
          />
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: PANEL, paddingHorizontal: 18 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  title: { color: TEXT, fontSize: 20, fontWeight: '700' },
  smallBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 10, backgroundColor: TRACK },
  smallBtnText: { color: TEXT, fontSize: 13, fontWeight: '600' },
  preview: { height: 150, borderRadius: 16, backgroundColor: '#000', overflow: 'hidden', justifyContent: 'center', marginBottom: 12 },
  scroll: {},
  section: { color: WU_YELLOW, fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 10, marginBottom: 6 },
  sliderLabel: { color: TEXT, fontSize: 14, flex: 1 },
  numRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  numControls: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepBtn: { width: 30, height: 30, borderRadius: 8, backgroundColor: TRACK, justifyContent: 'center', alignItems: 'center' },
  stepText: { color: TEXT, fontSize: 18, fontWeight: '700' },
  numInput: { width: 64, height: 32, borderRadius: 8, backgroundColor: '#000', color: TEXT, textAlign: 'center', fontSize: 14, fontVariant: ['tabular-nums'], paddingVertical: 0 },
  swatchBlock: { marginBottom: 14 },
  swatchRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  swatch: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, justifyContent: 'center', alignItems: 'center' },
  swatchLabeled: { width: 'auto', paddingHorizontal: 12 },
  swatchText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  toggle: { width: 56, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  toggleText: { fontSize: 12, fontWeight: '700' },
});
