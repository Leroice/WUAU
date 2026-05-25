import React, { useRef } from 'react';
import { Animated, Pressable, PressableProps, StyleProp, ViewStyle } from 'react-native';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface SquishyProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  /** How far it squishes on press (1 = none). Smaller buttons can go lower. */
  scaleTo?: number;
  children?: React.ReactNode;
}

/**
 * Drop-in replacement for TouchableOpacity that gives a "squishy" spring press:
 * scales down quickly on press-in, then springs back past 1 and settles. Runs on
 * the native driver, so it stays smooth. Forwards all Pressable props.
 */
export function Squishy({ style, scaleTo = 0.95, children, onPressIn, onPressOut, ...rest }: SquishyProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 14 }).start();
        onPressOut?.(e);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
