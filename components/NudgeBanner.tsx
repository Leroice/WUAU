import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageBackground } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import Svg, { Defs, LinearGradient, Stop, Rect } from 'react-native-svg';
import { useTheme, Theme, WU_YELLOW } from '../constants/theme';
import { useDesign } from '../hooks/useDesign';
import { SystemIcon } from './SystemIcon';
import { Squishy } from './Squishy';
import type { Nudge } from '../types';

// X close button — top-right of every variant.
function CloseButton({ color, onPress }: { color: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={10}
      style={styles.closeBtn}
      accessibilityRole="button"
      accessibilityLabel="Dismiss"
    >
      <SystemIcon ios="xmark" android="close" size={16} color={color} />
    </Pressable>
  );
}

// Yellow CTA pill — used by image + light variants.
function CtaButton({ label, onPress }: { label: string; onPress?: () => void }) {
  return (
    <Squishy
      scaleTo={0.97}
      onPress={onPress}
      style={styles.cta}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={styles.ctaText}>{label}</Text>
    </Squishy>
  );
}

// ─── image: full-bleed image (or solid colour fallback) + bottom-aligned
//     blur + dark gradient scrim under the bottom-left text + CTA.
function ImageVariant({ c, nudge, onCta, onDismiss }: VariantProps) {
  const { tokens } = useDesign();
  const { content } = nudge;
  const blurHeight = `${Math.round(tokens.nudgeBlurPct * 100)}%` as `${number}%`;

  const card = (
    <>
      {/* Blur layer — bottom N% of the card. Dark blur for legibility. */}
      <BlurView
        style={[styles.blurLayer, { height: blurHeight }]}
        blurType="dark"
        blurAmount={tokens.nudgeBlurAmount}
        reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
      />
      {/* SVG gradient scrim — transparent top → dark bottom. Stacked over the
          blur layer so text always lands on enough contrast. */}
      <Svg style={StyleSheet.absoluteFill} pointerEvents="none">
        <Defs>
          <LinearGradient id="nudge-scrim" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity="0" />
            <Stop offset="0.45" stopColor="#000000" stopOpacity="0" />
            <Stop offset="1" stopColor="#000000" stopOpacity={`${tokens.nudgeScrimOpacity}`} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#nudge-scrim)" />
      </Svg>

      {/* Text + CTA — bottom-left, white. Headline ≤40, body ≤120, CTA ≤24. */}
      <View style={[styles.imageBody, { padding: tokens.nudgePad }]}>
        <Text style={[styles.headline, styles.invertText, { fontSize: tokens.nudgeHeadlineSize }]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, styles.invertBody, { fontSize: tokens.nudgeBodySize }]} numberOfLines={2}>{content.body}</Text>
        {content.cta && (
          <View style={styles.ctaSlot}>
            <CtaButton label={content.cta.label} onPress={onCta} />
          </View>
        )}
      </View>

      <CloseButton color="#FFFFFF" onPress={onDismiss} />
    </>
  );

  // Asset present → ImageBackground; otherwise solid dark colour fallback.
  if (content.bgImage) {
    return (
      <ImageBackground
        source={content.bgImage as any}
        style={[styles.card, { height: tokens.nudgeCardH, borderRadius: tokens.nudgeRadius }]}
        imageStyle={{ borderRadius: tokens.nudgeRadius }}
        resizeMode="cover"
      >
        {card}
      </ImageBackground>
    );
  }
  return (
    <View style={[styles.card, { height: tokens.nudgeCardH, borderRadius: tokens.nudgeRadius, backgroundColor: '#1F3B2E' }]}>
      {card}
    </View>
  );
}

// ─── light: white card, no image. Headline + body + optional CTA, X close.
function LightVariant({ c, nudge, onCta, onDismiss }: VariantProps) {
  const { tokens } = useDesign();
  const { content } = nudge;
  return (
    <View style={[styles.card, { height: tokens.nudgeCardH, borderRadius: tokens.nudgeRadius, backgroundColor: c.surface }]}>
      <View style={[styles.lightTextOnly, { padding: tokens.nudgePad }]}>
        <Text style={[styles.headline, { color: c.text, fontSize: tokens.nudgeHeadlineSize }]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, { color: c.muted, fontSize: tokens.nudgeBodySize }]} numberOfLines={2}>{content.body}</Text>
        {content.cta && (
          <View style={styles.ctaSlot}>
            <CtaButton label={content.cta.label} onPress={onCta} />
          </View>
        )}
      </View>
      <CloseButton color={c.muted} onPress={onDismiss} />
    </View>
  );
}

// ─── status: solid colour + headline + progress bar (e.g. points earned).
function StatusVariant({ nudge, onDismiss }: VariantProps) {
  const { tokens } = useDesign();
  const { content } = nudge;
  const bg = content.bgColor ?? '#106B4F';
  const p = Math.max(0, Math.min(1, content.progress ?? 0));
  return (
    <View style={[styles.card, { height: tokens.nudgeCardH, borderRadius: tokens.nudgeRadius, backgroundColor: bg }]}>
      <View style={[styles.statusBody, { padding: tokens.nudgePad }]}>
        <Text style={[styles.statusHeadline, styles.invertText]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, styles.invertBody, { fontSize: tokens.nudgeBodySize }]} numberOfLines={1}>{content.body}</Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${p * 100}%` }]} />
        </View>
      </View>
      <CloseButton color="#FFFFFF" onPress={onDismiss} />
    </View>
  );
}

interface VariantProps {
  c: Theme;
  nudge: Nudge;
  onCta?: () => void;
  onDismiss?: () => void;
}

/**
 * NudgeBanner — single card from the latest Figma direction. No image-well:
 * every image-bearing nudge is full-bleed with a bottom-aligned blur view
 * + SVG gradient scrim under the text. Three variants:
 *
 *   image    full-bleed image (or solid colour fallback until assets land);
 *            BlurView covers the bottom % of the card; SVG gradient scrim
 *            (transparent → dark) sits over the blur. Headline + body +
 *            optional CTA bottom-left in white. X close top-right.
 *   light    white card, no image, headline + body + optional CTA, X close.
 *   status   solid colour, headline + body + progress bar, X close.
 *
 * All sizes driven by useDesign().tokens.nudge* — tweak in App Settings.
 * Character budgets enforced via numberOfLines on the text nodes.
 */
export function NudgeBanner({ nudge, onCta, onDismiss }: { nudge: Nudge; onCta?: () => void; onDismiss?: () => void }) {
  const c = useTheme();
  const props: VariantProps = { c, nudge, onCta, onDismiss };
  switch (nudge.style) {
    case 'image':  return <ImageVariant {...props} />;
    case 'light':  return <LightVariant {...props} />;
    case 'status': return <StatusVariant {...props} />;
  }
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },

  // Close button — same position on every variant.
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text styles.
  headline: { fontWeight: '700', lineHeight: 18 },
  body: { fontWeight: '400', lineHeight: 16, marginTop: 4 },
  invertText: { color: '#FFFFFF' },
  invertBody: { color: 'rgba(255,255,255,0.92)' },

  // CTA pill — yellow Squishy.
  ctaSlot: { marginTop: 8 },
  cta: {
    backgroundColor: WU_YELLOW,
    height: 28,
    borderRadius: 80,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { fontSize: 12, fontWeight: '600', color: '#000000' },

  // image variant: blur layer pinned to the bottom; body positioned bottom-left.
  blurLayer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  imageBody: {
    position: 'absolute', left: 0, right: 36 /* clear of X */, bottom: 0,
  },

  // light: single text column.
  lightTextOnly: { flex: 1, paddingRight: 36 /* clear of X */, justifyContent: 'center' },

  // status: text + progress.
  statusBody: { flex: 1, paddingRight: 36, justifyContent: 'center' },
  statusHeadline: { fontSize: 22, fontWeight: '700', lineHeight: 26 },
  progressTrack: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressFill: { height: '100%', backgroundColor: WU_YELLOW, borderRadius: 3 },
});
