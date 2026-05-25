import React, { useEffect, useRef } from 'react';
import { Animated, useColorScheme, Dimensions, StyleSheet, View } from 'react-native';
import { Canvas, RadialGradient, Rect, vec, LinearGradient } from '@shopify/react-native-skia';

const { width, height } = Dimensions.get('window');
const SHADER_HEIGHT = height * 0.75;

export function MeshGradient() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 8000, useNativeDriver: false }),
        Animated.timing(anim, { toValue: 0, duration: 8000, useNativeDriver: false }),
      ])
    ).start();
  }, []);

  if (dark) {
    return (
      <Canvas style={[StyleSheet.absoluteFill, { height: SHADER_HEIGHT }]}>
        <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width, SHADER_HEIGHT)}
            colors={['#0a0a1a', '#0d1b2a', '#0a0a1a']}
          />
        </Rect>
        <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
          <RadialGradient
            c={vec(width * 0.3, height * 0.15)}
            r={width * 0.6}
            colors={['rgba(60,20,120,0.7)', 'rgba(0,0,0,0)']}
          />
        </Rect>
        <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
          <RadialGradient
            c={vec(width * 0.8, height * 0.25)}
            r={width * 0.5}
            colors={['rgba(20,60,120,0.6)', 'rgba(0,0,0,0)']}
          />
        </Rect>
        <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
          <RadialGradient
            c={vec(width * 0.5, height * 0.05)}
            r={width * 0.4}
            colors={['rgba(80,20,80,0.5)', 'rgba(0,0,0,0)']}
          />
        </Rect>
        <Rect x={0} y={SHADER_HEIGHT * 0.5} width={width} height={SHADER_HEIGHT * 0.5}>
          <LinearGradient
            start={vec(0, SHADER_HEIGHT * 0.5)}
            end={vec(0, SHADER_HEIGHT)}
            colors={['rgba(0,0,0,0)', '#000000']}
          />
        </Rect>
      </Canvas>
    );
  }

  return (
    <Canvas style={[StyleSheet.absoluteFill, { height: SHADER_HEIGHT }]}>
      <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
        <LinearGradient
          start={vec(0, 0)}
          end={vec(width, SHADER_HEIGHT)}
          colors={['#fffdf5', '#fff9e6', '#fffdf5']}
        />
      </Rect>
      <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
        <RadialGradient
          c={vec(width * 0.25, height * 0.1)}
          r={width * 0.7}
          colors={['rgba(255,221,0,0.45)', 'rgba(255,255,255,0)']}
        />
      </Rect>
      <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
        <RadialGradient
          c={vec(width * 0.8, height * 0.2)}
          r={width * 0.5}
          colors={['rgba(255,200,50,0.35)', 'rgba(255,255,255,0)']}
        />
      </Rect>
      <Rect x={0} y={0} width={width} height={SHADER_HEIGHT}>
        <RadialGradient
          c={vec(width * 0.5, height * 0.05)}
          r={width * 0.3}
          colors={['rgba(255,240,100,0.3)', 'rgba(255,255,255,0)']}
        />
      </Rect>
      <Rect x={0} y={SHADER_HEIGHT * 0.4} width={width} height={SHADER_HEIGHT * 0.6}>
        <LinearGradient
          start={vec(0, SHADER_HEIGHT * 0.4)}
          end={vec(0, SHADER_HEIGHT)}
          colors={['rgba(242,242,247,0)', '#F2F2F7']}
        />
      </Rect>
    </Canvas>
  );
}
