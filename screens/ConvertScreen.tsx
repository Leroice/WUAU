import React from 'react';
import { View } from 'react-native';
import { useTheme } from '../constants/theme';
import { ConvertSheet } from '../components/ConvertSheet';

// Convert — a stock native pushed screen (the old bottom-sheet presentation was
// removed). Thin: resolves the theme and hands the converter sheet the content.
export function ConvertScreen() {
  const c = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ConvertSheet c={c} />
    </View>
  );
}
