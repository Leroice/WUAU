import React, { useEffect, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, runOnJS } from 'react-native-reanimated';

const COLLAPSE_DURATION = 280; // ms — matches the cards-screen Apple Pay banner

/**
 * DismissibleSlot — a card wrapper that animates its height and opacity to
 * zero when `dismissed` flips to true. Mirrors the pattern we already use on
 * the Cards screen Apple Pay banner: measure once via onLayout, then drive a
 * height-multiplier on the UI thread so siblings below slide up smoothly as
 * the slot collapses.
 *
 *   <DismissibleSlot
 *     dismissed={dismissingId === item.id}
 *     onCollapsed={() => engine.dismiss(item.id)}
 *   >
 *     <Card item={item} />
 *   </DismissibleSlot>
 *
 * Notes:
 *   - First layout pass measures the natural height; subsequent renders honour
 *     it. If the child's height legitimately changes while not dismissed (e.g.
 *     dynamic content), pass `remeasureKey` so the slot re-measures.
 *   - onCollapsed fires once the collapse animation has finished. Use it to
 *     remove the item from the source list — the slot will unmount as a result.
 *   - Wrapper uses overflow:'hidden' so partial cards never leak.
 */
export function DismissibleSlot({
  children,
  dismissed,
  onCollapsed,
  remeasureKey,
}: {
  children: React.ReactNode;
  dismissed: boolean;
  onCollapsed?: () => void;
  remeasureKey?: any;
}) {
  const [height, setHeight] = useState<number | null>(null);
  const progress = useSharedValue(1); // 1 = full size, 0 = collapsed

  // Re-measure on demand.
  useEffect(() => {
    setHeight(null);
  }, [remeasureKey]);

  // Drive the collapse when `dismissed` flips on.
  useEffect(() => {
    if (dismissed) {
      progress.value = withTiming(0, { duration: COLLAPSE_DURATION }, (fin) => {
        if (fin && onCollapsed) runOnJS(onCollapsed)();
      });
    } else {
      progress.value = 1;
    }
  }, [dismissed, onCollapsed, progress]);

  const style = useAnimatedStyle(() => ({
    height: height != null ? height * progress.value : undefined,
    opacity: progress.value,
  }));

  return (
    <Animated.View
      style={[style, { overflow: 'hidden' }]}
      onLayout={(e) => { if (height == null) setHeight(e.nativeEvent.layout.height); }}
    >
      {children}
    </Animated.View>
  );
}
