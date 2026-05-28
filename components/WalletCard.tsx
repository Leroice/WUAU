import React, { useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, Dimensions, GestureResponderEvent } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, withSequence, interpolate, Easing,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { WU_YELLOW } from '../theme';
import { useDesign } from '../DesignContext';
import { usePersona } from '../PersonaContext';
import { CARD } from '../mockData';

const SCREEN_PAD = 20;
// Collapsed = Figma card frame; expanded = fills the top section width.
const COLLAPSED_W = 236.93;
const COLLAPSED_H = 150;
const RATIO = COLLAPSED_H / COLLAPSED_W;
const EXPANDED_W = Dimensions.get('window').width - SCREEN_PAD * 2;
const EXPANDED_H = Math.round(EXPANDED_W * RATIO);

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * Interactive wallet card:
 *  - tap → expands to full width AND flips on its Y axis (content below pushes down),
 *  - the TAP POSITION kicks the rotation across X+Y (tap a corner → unorthodox dual-axis
 *    tumble) that eases out so the card resolves to a clean, balanced face,
 *  - floats in space via accelerometer (real device only),
 *  - specular highlight sweeps across the front as it tilts.
 * Front is the @3x card art; back is drawn from CARD mock data.
 */
export function WalletCard({ flipped, onToggle }: { flipped: boolean; onToggle: () => void }) {
  const { tokens } = useDesign();
  const { persona } = usePersona();
  const progress = useSharedValue(0); // 0 = collapsed/front, 1 = expanded/back
  const impX = useSharedValue(0); // touch-driven pitch impulse (decays)
  const impY = useSharedValue(0); // touch-driven roll impulse (decays)
  const tiltX = useSharedValue(0); // gyro pitch
  const tiltY = useSharedValue(0); // gyro roll

  useEffect(() => {
    // Fast out, ease into slow — resolves smoothly onto the target face.
    progress.value = withTiming(flipped ? 1 : 0, { duration: 760, easing: Easing.out(Easing.cubic) });
  }, [flipped, progress]);

  useEffect(() => {
    setUpdateIntervalForType(SensorTypes.accelerometer, 60);
    const sub = accelerometer.subscribe({
      next: ({ x, y }) => {
        tiltX.value = withTiming(clamp(-y * 7, -12, 12), { duration: 120 });
        tiltY.value = withTiming(clamp(x * 7, -12, 12), { duration: 120 });
      },
      error: () => {},
    });
    return () => sub.unsubscribe();
  }, [tiltX, tiltY]);

  const onPressIn = (e: GestureResponderEvent) => {
    const cw = flipped ? EXPANDED_W : COLLAPSED_W;
    const ch = flipped ? EXPANDED_H : COLLAPSED_H;
    const dx = e.nativeEvent.locationX / cw - 0.5; // -0.5 (left) .. 0.5 (right)
    const dy = e.nativeEvent.locationY / ch - 0.5; // -0.5 (top) .. 0.5 (bottom)
    // Touched point recedes: kick then ease back to 0.
    impX.value = withSequence(withTiming(dy * 26, { duration: 90 }), withTiming(0, { duration: 720, easing: Easing.out(Easing.cubic) }));
    impY.value = withSequence(withTiming(-dx * 26, { duration: 90 }), withTiming(0, { duration: 720, easing: Easing.out(Easing.cubic) }));
  };

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(progress.value, [0, 1], [COLLAPSED_W, EXPANDED_W]),
    height: interpolate(progress.value, [0, 1], [COLLAPSED_H, EXPANDED_H]),
  }));

  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateX: `${tiltX.value + impX.value}deg` },
      { rotateY: `${interpolate(progress.value, [0, 1], [0, 180]) + tiltY.value + impY.value}deg` },
    ],
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1200 },
      { rotateX: `${tiltX.value + impX.value}deg` },
      { rotateY: `${interpolate(progress.value, [0, 1], [180, 360]) + tiltY.value + impY.value}deg` },
    ],
  }));

  // Specular sheen drifts opposite the tilt.
  const sheenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -tiltY.value * 6 }, { translateY: -tiltX.value * 4 }],
  }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.card, containerStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onToggle}
          onPressIn={onPressIn}
          accessibilityRole="button"
          accessibilityLabel={flipped ? 'Collapse card' : 'Expand card and show details'}
        >
          {/* FRONT */}
          <Animated.View style={[styles.face, { borderRadius: tokens.cardRadius }, frontStyle]}>
            <Image
              source={require('../assets/images/card-image.png')}
              style={styles.img}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
            />
            <Animated.View style={[StyleSheet.absoluteFill, sheenStyle]} pointerEvents="none">
              <Svg width="140%" height="140%" style={{ position: 'absolute', top: '-20%', left: '-20%' }}>
                <Defs>
                  <LinearGradient id="sheen" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
                    <Stop offset="0.45" stopColor="#FFFFFF" stopOpacity="0.35" />
                    <Stop offset="0.6" stopColor="#FFFFFF" stopOpacity="0.1" />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                  </LinearGradient>
                </Defs>
                <Rect x="0" y="0" width="100%" height="100%" fill="url(#sheen)" />
              </Svg>
            </Animated.View>
          </Animated.View>

          {/* BACK */}
          <Animated.View style={[styles.face, styles.back, { borderRadius: tokens.cardRadius }, backStyle]}>
            <View style={styles.magstripe} />
            <View style={styles.backBody}>
              <Text style={styles.backLabel}>{CARD.labels.number}</Text>
              <Text style={styles.backNumber}>{CARD.number}</Text>
              <View style={styles.backRow}>
                <View style={styles.backCol}>
                  <Text style={styles.backLabel}>{CARD.labels.holder}</Text>
                  <Text style={styles.backValue}>{persona.cardHolder}</Text>
                </View>
                <View>
                  <Text style={styles.backLabel}>{CARD.labels.expiry}</Text>
                  <Text style={styles.backValue}>{CARD.expiry}</Text>
                </View>
                <View>
                  <Text style={styles.backLabel}>{CARD.labels.cvv}</Text>
                  <Text style={styles.backValue}>{CARD.cvv}</Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center' },
  card: { width: COLLAPSED_W, height: COLLAPSED_H },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  img: { width: '100%', height: '100%' },
  back: { backgroundColor: WU_YELLOW },
  magstripe: { height: 34, backgroundColor: '#1A1A1A', marginTop: 16 },
  backBody: { padding: 16, gap: 8 },
  backLabel: { fontSize: 9, fontWeight: '600', color: 'rgba(0,0,0,0.55)', textTransform: 'uppercase', letterSpacing: 0.5 },
  backNumber: { fontSize: 17, fontWeight: '700', color: '#000000', letterSpacing: 1, marginTop: -2 },
  backRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 18, marginTop: 4 },
  backCol: { flex: 1 },
  backValue: { fontSize: 13, fontWeight: '600', color: '#000000' },
});
