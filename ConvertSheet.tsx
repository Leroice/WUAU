import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Squishy } from './Squishy';
import { SystemIcon } from './SystemIcon';
import { CONVERT_MAIN, CONVERSIONS, CONVERT } from './mockData';

type Theme = {
  bg: string;
  card: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  pill: string;
};

/**
 * Convert content for the sheet: a main currency, a send/quote bar, a list of
 * target currencies with live rates, and an add-currency action. The sheet's
 * chrome (grabber, detents, drag-to-dismiss) is provided by the native stack's
 * `presentation: 'formSheet'`.
 */
export function ConvertSheet({ c }: { c: Theme }) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
      <Text style={[styles.title, { color: c.text }]}>{CONVERT.title}</Text>

        {/* main currency */}
        <View style={[styles.mainCard, { backgroundColor: c.card, borderColor: c.border }]}>
          <View style={styles.row}>
            <View style={[styles.flagWrap, { backgroundColor: c.pill }]}>
              <Text style={styles.flag}>{CONVERT_MAIN.flag}</Text>
            </View>
            <View style={styles.rowMeta}>
              <View style={styles.codeRow}>
                <Text style={[styles.code, { color: c.text }]}>{CONVERT_MAIN.code}</Text>
                <SystemIcon ios="chevron.down" android="expand-more" size={14} color={c.muted} />
              </View>
              <Text style={[styles.name, { color: c.muted }]}>{CONVERT_MAIN.name}</Text>
            </View>
            <Text style={[styles.amount, { color: c.text }]}>{CONVERT_MAIN.symbol} {CONVERT_MAIN.amount}</Text>
            <View style={[styles.calcBtn, { borderColor: c.border }]}>
              <SystemIcon ios="plus.forwardslash.minus" android="calculate" size={18} color={c.muted} />
            </View>
          </View>
          <Squishy scaleTo={0.97} style={[styles.sendBar, { backgroundColor: c.accent }]} accessibilityRole="button">
            <SystemIcon ios="paperplane.fill" android="send" size={16} color="#FFFFFF" />
            <Text style={styles.sendText}>{CONVERT.sendTemplate.replace('{code}', CONVERT_MAIN.code).replace('{to}', CONVERT_MAIN.sendTo)}</Text>
            <View style={styles.sendRight}>
              <Text style={styles.quoteText}>{CONVERT.viewQuote}</Text>
              <SystemIcon ios="chevron.right" android="chevron-right" size={16} color="#FFFFFF" />
            </View>
          </Squishy>
        </View>

        {/* target currencies */}
        {CONVERSIONS.map((cur) => (
          <Pressable key={cur.code} style={[styles.convRow, { backgroundColor: c.card, borderColor: c.border }]}>
            <View style={[styles.flagWrap, { backgroundColor: c.pill }]}>
              <Text style={styles.flag}>{cur.flag}</Text>
            </View>
            <View style={styles.rowMeta}>
              <View style={styles.codeRow}>
                <Text style={[styles.code, { color: c.text }]}>{cur.code}</Text>
                <SystemIcon ios="chevron.down" android="expand-more" size={14} color={c.muted} />
              </View>
              <Text style={[styles.name, { color: c.muted }]}>{cur.name}</Text>
            </View>
            <View style={styles.convAmounts}>
              <Text style={[styles.amount, { color: c.text }]}>{cur.symbol} {cur.amount}</Text>
              <Text style={[styles.rate, { color: c.muted }]}>1 {CONVERT_MAIN.code} =</Text>
              <Text style={[styles.rate, { color: c.muted }]}>{cur.rate} {cur.code}</Text>
            </View>
            <View style={styles.kebab}>
              <SystemIcon ios="ellipsis" android="more-vert" size={18} color={c.muted} />
            </View>
          </Pressable>
        ))}

        <Squishy scaleTo={0.97} style={[styles.addBtn, { borderColor: c.accent }]} accessibilityRole="button">
          <Text style={[styles.addText, { color: c.accent }]}>{CONVERT.addCurrency}</Text>
        </Squishy>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: '700', marginBottom: 16 },
  mainCard: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden', marginBottom: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  flagWrap: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  flag: { fontSize: 26 },
  rowMeta: { flex: 1 },
  codeRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  code: { fontSize: 17, fontWeight: '700' },
  name: { fontSize: 13, marginTop: 1 },
  amount: { fontSize: 17, fontWeight: '400', fontFamily: 'PPRightGrotesk-WideMedium' },
  calcBtn: { width: 40, height: 40, borderRadius: 8, borderWidth: StyleSheet.hairlineWidth, justifyContent: 'center', alignItems: 'center' },
  sendBar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 12, paddingHorizontal: 16 },
  sendText: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', flex: 1 },
  sendRight: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  quoteText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  convRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, marginBottom: 12 },
  convAmounts: { alignItems: 'flex-end' },
  rate: { fontSize: 12 },
  kebab: { width: 20, alignItems: 'center' },
  addBtn: { borderRadius: 14, borderWidth: 1.5, paddingVertical: 16, alignItems: 'center', marginTop: 4 },
  addText: { fontSize: 15, fontWeight: '700' },
});
