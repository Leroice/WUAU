import React from 'react';
import { requireNativeComponent, Platform, Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Native SF Symbol renderer (iOS). Registered via ios/RNSystemIcon.{swift,m}.
const RNSystemIconView = Platform.OS === 'ios'
  ? requireNativeComponent<any>('RNSystemIcon')
  : null;

// Platform-native icon name pair. Drive these from mockData so the UI stays data-driven.
export type IconSpec = {
  ios: string;       // SF Symbol name (e.g. 'paperplane.fill')
  android: string;   // Material Icons name (e.g. 'send')
};

interface SystemIconProps {
  ios: string;       // SF Symbol name on iOS
  android: string;   // Material Icons name on Android
  size?: number;
  color?: string;
  weight?: 'ultraLight' | 'thin' | 'light' | 'regular' | 'medium' | 'semibold' | 'bold' | 'heavy' | 'black';
  style?: any;
}

/**
 * Renders platform-native iconography:
 *   iOS     → SF Symbols (native UIImage(systemName:))
 *   Android → Material Icons (react-native-vector-icons)
 * Callers pass both names; the correct one is picked per platform.
 */
export function SystemIcon({
  ios,
  android,
  size = 24,
  color = '#000000',
  weight = 'regular',
  style,
}: SystemIconProps) {
  if (Platform.OS === 'ios' && RNSystemIconView) {
    return (
      <RNSystemIconView
        name={ios}
        size={size}
        color={color}
        weight={weight}
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  if (Platform.OS === 'android') {
    return <MaterialIcon name={android} size={size} color={color} style={style} />;
  }

  // Last-resort fallback (e.g. iOS without the native module compiled in).
  return <Text style={[{ fontSize: size, color }, style]}>?</Text>;
}
