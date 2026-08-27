import { StyleSheet, Text, View } from 'react-native';

import type { DeviceStatus } from '../../types/device';

type DeviceStatusBadgeProps = {
  status: DeviceStatus;
};

const STATUS_CONFIG: Record<
  DeviceStatus,
  { label: string; bg: string; dot: string; text: string }
> = {
  online: { label: 'Онлайн', bg: '#E8F9EE', dot: '#22C55E', text: '#15803D' },
  delayed: { label: 'Задержка', bg: '#FFF7E6', dot: '#F59E0B', text: '#B45309' },
  offline: { label: 'Оффлайн', bg: '#F1F5F9', dot: '#94A3B8', text: '#64748B' },
};

export function DeviceStatusBadge({ status }: DeviceStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <View style={[styles.dot, { backgroundColor: config.dot }]} />
      <Text style={[styles.label, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
