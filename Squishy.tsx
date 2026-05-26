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
 * Subtle press feedback for cards and standalone buttons (NOT list rows): scales
 * down a touch on press-in and settles straight back to 1 with no overshoot, so
 * it feels gentle and doesn't linger. Native driver. Forwards all Pressable props.
 */
export function Squishy({ style, scaleTo = 0.97, children, onPressIn, onPressOut, ...rest }: SquishyProps) {
  const scale = useRef(new Animated.Value(1)).current;

  return (
    <AnimatedPressable
      {...rest}
      onPressIn={(e) => {
        Animated.spring(scale, { toValue: scaleTo, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 0 }).start();
        onPressOut?.(e);
      }}
      style={[style, { transform: [{ scale }] }]}
    >
      {children}
    </AnimatedPressable>
  );
}
