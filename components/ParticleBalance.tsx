import React, { useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from 'react-native-sensors';
import { useTweaks } from '../hooks/useTweaks';

const WHITE = '#FFFFFF';
const SENSOR_INTERVAL_MS = 33; // ~30fps sensor updates
const G = 9.81;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

type Particle = {
  startX: number;       // origin along the number
  startY: number;
  tx: number;           // scattered target (radial)
  ty: number;
  depth: number;        // 0 = far, 1 = near
  haloMult: number;     // halo size relative to core (size itself comes from tweaks)
  coreOpacity: number;
  haloOpacity: number;
  band: number;         // depth band index (0 far .. 2 near) — drives tilt parallax
  accentRoll: number;   // 0..1; below accentRatio → accent-coloured (decided live)
  sizeRoll: number;     // -1..1 random size variation
  wanderScale: number;  // per-particle wander radius multiplier
  lifeDur: number;      // ms for one birth→death cycle
  puffs: { dx: number; dy: number; sf: number; of: number }[]; // halo noise blobs
};

// Tilt parallax per depth band; gravity is applied to ONE view per band so the
// sensor updates stay cheap on the JS thread.
const BAND_FACTORS = [0.9, 1.5, 2.3];
const MAX_PUFFS = 5;

function makeParticles(count: number, scatter: number): Particle[] {
  const list = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2;
    const radius = rand(40, scatter);
    const depth = Math.random();
    return {
      startX: rand(-95, 95),
      startY: rand(-20, 20),
      tx: Math.cos(angle) * radius,
      ty: Math.sin(angle) * radius * 0.6,
      depth,
      haloMult: lerp(3.6, 2, depth),
      coreOpacity: lerp(0.35, 1, depth),
      haloOpacity: lerp(0.16, 0.34, depth),
      band: depth < 0.34 ? 0 : depth < 0.67 ? 1 : 2,
      accentRoll: Math.random(),
      sizeRoll: rand(-1, 1),
      wanderScale: rand(0.6, 1.5),
      lifeDur: rand(2600, 6200),
      puffs: Array.from({ length: MAX_PUFFS }, () => ({
        dx: rand(-1, 1),
        dy: rand(-1, 1),
        sf: rand(0.45, 1.05),
        of: rand(0.45, 1),
      })),
    };
  });
  return list.sort((a, b) => a.depth - b.depth); // far → near draw order
}

interface ParticleBalanceProps {
  amount: string;
  currency: string;
  hidden: boolean;
  color: string;
  accent?: string;
}

/**
 * Balance number that dissolves into depth-shaded, soft particles. Each particle
 * has a lifecycle: it pops in white (matching the number it exploded from), shifts
 * to its colour as it ages, then fades out — on its own random timer, so some die
 * while others appear. Motion is a continuous random walk (no linear bouncing).
 * Tilt leans the field via the accelerometer. All native-driver; knobs from
 * TweaksContext.
 */
export function ParticleBalance({ amount, currency, hidden, color }: ParticleBalanceProps) {
  const { tweaks } = useTweaks();
  const { count, scatter, driftAmount, driftSpeed, glow, sizeMin, sizeMax, sizeJitter, blurNoise, dissolveMs, reformMs, accentColor, accentRatio, baseColor } = tweaks;
  const effBase = baseColor || color;

  const particles = useMemo(() => makeParticles(count, scatter), [count, scatter]);
  const wander = useMemo(() => particles.map(() => new Animated.ValueXY({ x: 0, y: 0 })), [particles]);
  const lives = useMemo(() => particles.map(() => new Animated.Value(0)), [particles]);

  const progress = useRef(new Animated.Value(0)).current;
  const gravity = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  const tiltCfg = useRef({ maxOffset: tweaks.maxOffset, smooth: tweaks.smooth, signX: tweaks.signX, signY: tweaks.signY });
  tiltCfg.current = { maxOffset: tweaks.maxOffset, smooth: tweaks.smooth, signX: tweaks.signX, signY: tweaks.signY };

  const wanderCfg = useRef({ range: 22 * driftAmount, durScale: driftSpeed });
  wanderCfg.current = { range: 22 * driftAmount, durScale: driftSpeed };

  // Dissolve / reform when visibility toggles.
  useEffect(() => {
    Animated.timing(progress, {
      toValue: hidden ? 1 : 0,
      duration: hidden ? dissolveMs : reformMs,
      easing: hidden ? Easing.out(Easing.cubic) : Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, progress]);

  // Lifecycle + random-walk motion — runs only while particles are shown.
  useEffect(() => {
    if (!hidden) return;
    let active = true;

    const startLife = (i: number) => {
      lives[i].setValue(0);
      Animated.timing(lives[i], { toValue: 1, duration: particles[i].lifeDur, easing: Easing.linear, useNativeDriver: true }).start(
        ({ finished }) => {
          if (finished && active) startLife(i);
        },
      );
    };

    const startWander = (i: number) => {
      const cfg = wanderCfg.current;
      const r = particles[i].wanderScale * cfg.range;
      Animated.timing(wander[i], {
        toValue: { x: rand(-r, r), y: rand(-r, r) },
        duration: rand(1100, 2800) / Math.max(0.2, cfg.durScale),
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished && active) startWander(i);
      });
    };

    particles.forEach((_, i) => {
      startLife(i);
      wander[i].setValue({ x: 0, y: 0 });
      startWander(i);
    });

    return () => {
      active = false;
      lives.forEach((l) => l.stopAnimation());
      wander.forEach((w) => w.stopAnimation());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, particles, lives, wander]);

  // Accelerometer tilt while hidden.
  useEffect(() => {
    if (!hidden) {
      Animated.spring(gravity, {
        toValue: { x: 0, y: 0 },
        useNativeDriver: false,
        speed: tweaks.springSpeed,
        bounciness: tweaks.springBounciness,
      }).start();
      return;
    }
    let sub: { unsubscribe: () => void } | undefined;
    const smoothed = { x: 0, y: 0 };
    try {
      setUpdateIntervalForType(SensorTypes.accelerometer, SENSOR_INTERVAL_MS);
      sub = accelerometer.subscribe(
        ({ x, y }) => {
          const cfg = tiltCfg.current;
          const targetX = (clamp(x, -G, G) / G) * cfg.maxOffset * cfg.signX;
          const targetY = (clamp(y, -G, G) / G) * cfg.maxOffset * cfg.signY;
          smoothed.x += (targetX - smoothed.x) * cfg.smooth;
          smoothed.y += (targetY - smoothed.y) * cfg.smooth;
          gravity.setValue({ x: smoothed.x, y: smoothed.y });
        },
        () => {},
      );
    } catch {
      // sensor unavailable — skip tilt
    }
    return () => sub?.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden, gravity]);

  const numberOpacity = progress.interpolate({ inputRange: [0, 0.45, 1], outputRange: [1, 0, 0] });
  const numberScale = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0.82] });
  const numberTranslate = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -6] });
  const appear = progress.interpolate({ inputRange: [0, 0.2, 1], outputRange: [0, 1, 1] });

  return (
    <View style={styles.wrap}>
      <Animated.Text
        style={[
          styles.amount,
          { color, opacity: numberOpacity, transform: [{ scale: numberScale }, { translateY: numberTranslate }] },
        ]}
      >
        {amount}
        <Text style={[styles.currency, { color }]}> {currency}</Text>
      </Animated.Text>

      <View pointerEvents="none" style={styles.particleLayer}>
        <View style={styles.anchor}>
          {BAND_FACTORS.map((factor, band) => {
            const bgx = Animated.multiply(gravity.x, factor);
            const bgy = Animated.multiply(gravity.y, factor);
            return (
              <Animated.View key={band} style={[styles.particle, { transform: [{ translateX: bgx }, { translateY: bgy }] }]}>
                {particles.map((p, i) => {
                  if (p.band !== band) return null;
                  const life = lives[i];
                  const dotColor = p.accentRoll < accentRatio ? accentColor : effBase;

                  const x = Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [p.startX, p.tx] }), wander[i].x);
                  const y = Animated.add(progress.interpolate({ inputRange: [0, 1], outputRange: [p.startY, p.ty] }), wander[i].y);

                  // life envelope: born (fade in) → alive → die (fade out), looping.
                  const lifeEnv = life.interpolate({ inputRange: [0, 0.15, 0.82, 1], outputRange: [0, 1, 1, 0] });
                  const groupOpacity = Animated.multiply(appear, lifeEnv);
                  // colour over life: starts white, crossfades to its colour as it ages.
                  const co = p.coreOpacity;
                  const whiteOp = life.interpolate({ inputRange: [0, 0.2, 0.6, 1], outputRange: [co, co, 0, 0] });
                  const colorOp = life.interpolate({ inputRange: [0, 0.2, 0.6, 1], outputRange: [0, 0, co, co] });

                  const baseCore = lerp(sizeMin, sizeMax, p.depth);
                  const sizeMul = 1 + p.sizeRoll * sizeJitter;
                  const coreSize = Math.max(1, baseCore * sizeMul);
                  const haloSize = baseCore * p.haloMult * glow * Math.max(0.4, 1 + p.sizeRoll * sizeJitter * 0.6);
                  const nPuffs = Math.max(1, Math.round(1 + blurNoise * (MAX_PUFFS - 1)));
                  const spread = haloSize * 0.6 * blurNoise;
                  const puffDim = lerp(1, 0.6, blurNoise);

                  return (
                    <Animated.View key={i} style={{ position: 'absolute', opacity: groupOpacity, transform: [{ translateX: x }, { translateY: y }] }}>
                      {p.puffs.slice(0, nPuffs).map((pf, k) => {
                        const ps = haloSize * pf.sf;
                        const ox = pf.dx * spread;
                        const oy = pf.dy * spread;
                        const op = clamp(p.haloOpacity * pf.of * glow * puffDim, 0, 0.55);
                        return (
                          <View
                            key={k}
                            style={{
                              position: 'absolute',
                              width: ps,
                              height: ps,
                              borderRadius: ps / 2,
                              left: ox - ps / 2,
                              top: oy - ps / 2,
                              backgroundColor: dotColor,
                              opacity: op,
                            }}
                          />
                        );
                      })}
                      {/* white core (birth) */}
                      <Animated.View
                        style={{
                          position: 'absolute',
                          width: coreSize,
                          height: coreSize,
                          borderRadius: coreSize / 2,
                          left: -coreSize / 2,
                          top: -coreSize / 2,
                          backgroundColor: WHITE,
                          opacity: whiteOp,
                        }}
                      />
                      {/* coloured core (aged) */}
                      <Animated.View
                        style={{
                          position: 'absolute',
                          width: coreSize,
                          height: coreSize,
                          borderRadius: coreSize / 2,
                          left: -coreSize / 2,
                          top: -coreSize / 2,
                          backgroundColor: dotColor,
                          opacity: colorOp,
                        }}
                      />
                    </Animated.View>
                  );
                })}
              </Animated.View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  amount: {
    fontSize: 42,
    fontWeight: '400',
    letterSpacing: -1,
    fontFamily: 'PPRightGrotesk-WideMedium',
  },
  currency: {
    fontSize: 28,
    fontWeight: '400',
    fontFamily: 'PPRightGrotesk-WideMedium',
  },
  particleLayer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  anchor: { width: 0, height: 0, alignItems: 'center', justifyContent: 'center' },
  particle: { position: 'absolute' },
});
