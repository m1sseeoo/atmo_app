import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';

function CloudBlob({
  top,
  left,
  right,
  size,
  opacity = 0.55,
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
  size = 5,
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

export function ChatBackground({ children }: { children: ReactNode }) {
  return (
    <View style={styles.root}>
      <CloudBlob top={40} left={-30} size={120} />
      <CloudBlob top={24} right={-36} size={130} />
      <CloudBlob top={120} left={20} size={70} opacity={0.4} />
      <CloudBlob top={90} right={30} size={60} opacity={0.35} />
      <Sparkle top={56} left={48} />
      <Sparkle top={72} right={64} size={4} />
      <Sparkle top={110} left={120} size={4} />
      <Sparkle top={140} right={90} size={5} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  sparkle: {
    position: 'absolute',
    backgroundColor: 'rgba(98, 189, 251, 0.35)',
    transform: [{ rotate: '45deg' }],
    borderRadius: 1,
  },
  content: {
    flex: 1,
  },
});
