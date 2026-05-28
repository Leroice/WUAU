import React from 'react';
import { View, Text, Pressable, StyleSheet, Image, ImageBackground } from 'react-native';
import { useTheme, Theme, WU_YELLOW } from '../constants/theme';
import { SystemIcon } from './SystemIcon';
import { Squishy } from './Squishy';
import type { Nudge } from '../types';

const CARD_W_HINT = 0; // intentionally unspec — banners hug parent width
const CARD_H = 120;     // Figma NBA-Banner-variants spec: ~120pt tall
const RADIUS = 16;
const PAD = 16;

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

// Yellow CTA pill — used by every variant that has cta in content.
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

// ─── light-image: white card, headline + body + optional CTA on the left,
//     image on the right (~110pt square placeholder until assets land).
function LightImageVariant({ c, nudge, onCta, onDismiss }: VariantProps) {
  const { content } = nudge;
  return (
    <View style={[styles.card, { backgroundColor: c.surface }]}>
      <View style={styles.lightBody}>
        <View style={styles.lightText}>
          <Text style={[styles.headline, { color: c.text }]} numberOfLines={1}>{content.headline}</Text>
          <Text style={[styles.body, { color: c.muted }]} numberOfLines={2}>{content.body}</Text>
          {content.cta && (
            <View style={styles.ctaSlot}>
              <CtaButton label={content.cta.label} onPress={onCta} />
            </View>
          )}
        </View>
        <View style={[styles.imageSlot, { backgroundColor: c.pill }]}>
          {content.image ? (
            <Image source={content.image as any} style={styles.image} resizeMode="cover" accessibilityIgnoresInvertColors />
          ) : null}
        </View>
      </View>
      <CloseButton color={c.muted} onPress={onDismiss} />
    </View>
  );
}

// ─── light: white card, no image. Just headline + body + optional CTA.
function LightVariant({ c, nudge, onCta, onDismiss }: VariantProps) {
  const { content } = nudge;
  return (
    <View style={[styles.card, { backgroundColor: c.surface }]}>
      <View style={styles.lightTextOnly}>
        <Text style={[styles.headline, { color: c.text }]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, { color: c.muted }]} numberOfLines={2}>{content.body}</Text>
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

// ─── image-bg: full-bleed image + dark gradient overlay, white text overlaid.
function ImageBgVariant({ c, nudge, onCta, onDismiss }: VariantProps) {
  const { content } = nudge;
  const inner = (
    <>
      <View style={styles.imageBgScrim} />
      <View style={styles.imageBgBody}>
        <Text style={[styles.headline, styles.invertText]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, styles.invertBody]} numberOfLines={2}>{content.body}</Text>
        {content.cta && (
          <View style={styles.ctaSlot}>
            <CtaButton label={content.cta.label} onPress={onCta} />
          </View>
        )}
      </View>
      <CloseButton color="#FFFFFF" onPress={onDismiss} />
    </>
  );
  if (content.bgImage) {
    return (
      <ImageBackground
        source={content.bgImage as any}
        style={styles.card}
        imageStyle={{ borderRadius: RADIUS }}
        resizeMode="cover"
      >
        {inner}
      </ImageBackground>
    );
  }
  // Asset-less fallback: solid dark colour so the variant is still recognisable.
  return <View style={[styles.card, { backgroundColor: '#1F3B2E' }]}>{inner}</View>;
}

// ─── status: solid colour + headline + progress bar (e.g. points earned).
function StatusVariant({ c, nudge, onDismiss }: VariantProps) {
  const { content } = nudge;
  const bg = content.bgColor ?? '#106B4F';
  const p = Math.max(0, Math.min(1, content.progress ?? 0));
  return (
    <View style={[styles.card, { backgroundColor: bg }]}>
      <View style={styles.statusBody}>
        <Text style={[styles.statusHeadline, styles.invertText]} numberOfLines={1}>{content.headline}</Text>
        <Text style={[styles.body, styles.invertBody]} numberOfLines={1}>{content.body}</Text>
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
 * NudgeBanner — single card from the Figma NBA-Banner-variants frame (10664-227818).
 *
 * Variants (driven by nudge.style):
 *   light-image  white card, headline + body + optional CTA on the left,
 *                square image (or placeholder) on the right
 *   light        white card, no image, headline + body + optional CTA
 *   image-bg     full-bleed image with dark scrim, white text overlaid
 *   status       solid colour, headline + progress bar
 *
 * 361pt-ish wide (hugs parent), 120pt tall, 16pt radius, X close top-right,
 * yellow Squishy CTA pill. Character limits are enforced by `numberOfLines`
 * on the text nodes — exceeded copy truncates rather than overflowing.
 */
export function NudgeBanner({ nudge, onCta, onDismiss }: { nudge: Nudge; onCta?: () => void; onDismiss?: () => void }) {
  const c = useTheme();
  const props: VariantProps = { c, nudge, onCta, onDismiss };
  switch (nudge.style) {
    case 'light-image': return <LightImageVariant {...props} />;
    case 'light':       return <LightVariant {...props} />;
    case 'image-bg':    return <ImageBgVariant {...props} />;
    case 'status':      return <StatusVariant {...props} />;
  }
}

const styles = StyleSheet.create({
  // Shared card frame.
  card: {
    height: CARD_H,
    borderRadius: RADIUS,
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
  headline: { fontSize: 15, fontWeight: '700', lineHeight: 18 },
  body: { fontSize: 12, fontWeight: '400', lineHeight: 16, marginTop: 4 },
  invertText: { color: '#FFFFFF' },
  invertBody: { color: 'rgba(255,255,255,0.86)' },

  // CTA pill — yellow Squishy. Sits at the bottom of the text block.
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

  // light-image: row layout, image-right.
  lightBody: { flex: 1, flexDirection: 'row', padding: PAD, gap: 12 },
  lightText: { flex: 1, paddingRight: 24 /* clear of X */ },
  imageSlot: {
    width: 110,
    alignSelf: 'stretch',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },

  // light (no image): single text column.
  lightTextOnly: { flex: 1, padding: PAD, paddingRight: 36 /* clear of X */ },

  // image-bg: full-bleed; text overlays a dark scrim.
  imageBgScrim: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.32)' },
  imageBgBody: { flex: 1, padding: PAD, paddingRight: 36 /* clear of X */, justifyContent: 'center' },

  // status: text + progress.
  statusBody: { flex: 1, padding: PAD, paddingRight: 36 /* clear of X */, justifyContent: 'center' },
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
