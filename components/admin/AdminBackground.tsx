import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';

function CloudBlob({
  top,
  left,
  right,
  size,
  opacity = 0.45,
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
  size = 4,
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

export function AdminBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <CloudBlob top={60} left={-40} size={140} />
      <CloudBlob top={40} right={-50} size={150} />
      <CloudBlob top={180} left={30} size={80} opacity={0.3} />
      <Sparkle top={80} left={60} />
      <Sparkle top={120} right={80} size={5} />
      <Sparkle top={200} left={140} size={4} />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    overflow: 'hidden',
  },
  cloudBlob: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'rgba(98, 189, 251, 0.28)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
});
