import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useTheme, Theme } from '../constants/theme';
import { Squishy } from './Squishy';
import { SystemIcon } from './SystemIcon';

// MTCN format: 10 digits, grouped 3 + 3 + 4. We render 3 fixed-width slot
// rows to match the Figma (8605-298286). The TextInput sits invisibly over
// the slots so a single tap focuses the lot and the keyboard handles entry.
const SLOTS = [3, 3, 4] as const;
const TOTAL = SLOTS.reduce((a, b) => a + b, 0);

function Slots({ c, value }: { c: Theme; value: string }) {
  const digits = value.split('');
  let i = 0;
  return (
    <View style={styles.slotRow} pointerEvents="none">
      {SLOTS.map((count, gi) => (
        <View key={gi} style={styles.slotGroup}>
          {Array.from({ length: count }).map((_, j) => {
            const d = digits[i] ?? '';
            i += 1;
            return (
              <View
                key={j}
                style={[
                  styles.slot,
                  { borderColor: d ? c.text : c.border, backgroundColor: c.surface },
                ]}
              >
                <Text style={[styles.slotDigit, { color: c.text }]}>{d}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

/**
 * Track Transfer widget — IMT-home staple (Figma 8605-298286). Drawn on the
 * existing WidgetCard surface so it matches the rest of Home. Blue circular
 * icon, headline, body with inline find-it-another-way link, 10-digit MTCN
 * input rendered as grouped slots, and a non-yellow outline Track-transfer
 * CTA pill. Pure UI in this slice — no API.
 */
export function TrackTransferWidget({ style }: { style?: any }) {
  const c = useTheme();
  const [mtcn, setMtcn] = useState('');

  const canTrack = useMemo(() => mtcn.replace(/\D/g, '').length === TOTAL, [mtcn]);

  return (
    <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.border }, style]}>
      <View style={[styles.iconCircle, { backgroundColor: '#E8F4FF' }]}>
        <SystemIcon ios="dot.viewfinder" android="my-location" size={22} color="#1A6FD4" />
      </View>

      <Text style={[styles.headline, { color: c.text }]}>Track transfer status</Text>
      <Text style={[styles.body, { color: c.muted }]}>
        Enter your 10 digit tracking number (MTCN) here, or{' '}
        <Text style={[styles.link, { color: c.accent }]}>find it another way</Text>.
      </Text>

      <View style={styles.inputWrap}>
        <Slots c={c} value={mtcn} />
        <TextInput
          style={styles.hiddenInput}
          value={mtcn}
          onChangeText={(t) => setMtcn(t.replace(/\D/g, '').slice(0, TOTAL))}
          keyboardType="number-pad"
          maxLength={TOTAL}
          accessibilityLabel="Tracking number"
        />
      </View>

      <Squishy
        scaleTo={0.97}
        style={[styles.cta, { borderColor: c.border, backgroundColor: c.surface }]}
        accessibilityRole="button"
        accessibilityLabel="Track transfer"
        accessibilityState={{ disabled: !canTrack }}
      >
        <Text style={[styles.ctaText, { color: canTrack ? c.text : c.muted }]}>Track transfer</Text>
      </Squishy>
    </View>
  );
}

const SLOT_SIZE = 32;

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 12,
  },
  iconCircle: {
    width: 40, height: 40, borderRadius: 20,
    alignItems: 'center', justifyContent: 'center',
  },
  headline: { fontSize: 17, fontWeight: '700' },
  body: { fontSize: 13, lineHeight: 18 },
  link: { textDecorationLine: 'underline' },

  inputWrap: { position: 'relative', height: SLOT_SIZE, marginTop: 4 },
  slotRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: SLOT_SIZE,
  },
  slotGroup: { flexDirection: 'row', gap: 4 },
  slot: {
    width: SLOT_SIZE,
    height: SLOT_SIZE,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotDigit: { fontSize: 14, fontWeight: '700' },
  // Invisible over the slot row; tap focuses, OS keyboard handles entry.
  hiddenInput: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    color: 'transparent',
    fontSize: 1,
  },

  cta: {
    borderWidth: 1,
    borderRadius: 999,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  ctaText: { fontSize: 15, fontWeight: '600' },
});
