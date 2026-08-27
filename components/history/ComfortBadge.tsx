import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { RouteStatus } from '../../types/history';

type ComfortBadgeProps = {
  label: string;
  index: number;
  status: RouteStatus;
};

const PALETTE = {
  comfortable: {
    bg: '#E8F9EE',
    label: '#15803D',
  },
  medium: {
    bg: '#FFF7E6',
    label: '#B45309',
  },
} as const;

export function ComfortBadge({ label, index, status }: ComfortBadgeProps) {
  const palette = PALETTE[status];

  return (
    <View style={[styles.badge, { backgroundColor: palette.bg }]}>
      <Text style={[styles.label, { color: palette.label }]}>{label}</Text>
      <Text style={styles.index}>Индекс {index}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    minWidth: 88,
    flexShrink: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
    marginBottom: 2,
  },
  index: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 14,
  },
});
