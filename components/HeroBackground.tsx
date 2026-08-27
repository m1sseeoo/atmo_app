import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

function CloudBlob({
  top,
  left,
  right,
  size,
  opacity = 0.7,
}: {
  top: number;
  left?: number;
  right?: number;
  size: number;
  opacity?: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        styles.cloudBlob,
        { top, left, right, width: size, height: size * 0.55, borderRadius: size * 0.28, opacity },
      ]}
    />
  );
}

function Sparkle({
  top,
  left,
  right,
  size = 6,
}: {
  top: number;
  left?: number;
  right?: number;
  size?: number;
}) {
  return (
    <View
      pointerEvents="none"
      style={[styles.sparkle, { top, left, right, width: size, height: size }]}
    />
  );
}

export function HeroBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.hero}>
      <CloudBlob top={8} left={-24} size={80} />
      <CloudBlob top={4} left={-10} size={50} opacity={0.85} />
      <CloudBlob top={6} right={-28} size={90} />
      <CloudBlob top={2} right={-8} size={55} opacity={0.8} />
      <Sparkle top={16} right={70} />
      <Sparkle top={30} left={40} size={5} />
      <Sparkle top={12} right={110} size={4} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: '#DDF4FF',
    paddingTop: 20,
    paddingBottom: 52,
    paddingHorizontal: 20,
    overflow: 'hidden',
    minHeight: 230,
  },
  cloudBlob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'rgba(22, 136, 232, 0.28)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  content: {
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
  },
});
