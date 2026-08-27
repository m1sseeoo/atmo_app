import { StyleSheet, View } from 'react-native';

import type { DeviceStatus } from '../../types/device';

type CoverageCircleProps = {
  size: number;
  selected?: boolean;
  status?: DeviceStatus;
};

export function CoverageCircle({
  size,
  selected = false,
  status = 'online',
}: CoverageCircleProps) {
  if (status === 'offline' && !selected) {
    return null;
  }

  const isOffline = status === 'offline';
  const isDelayed = status === 'delayed';

  return (
    <View
      pointerEvents="none"
      style={[
        styles.circle,
        {
          width: isOffline ? size * 0.55 : size,
          height: isOffline ? size * 0.55 : size,
          borderRadius: (isOffline ? size * 0.55 : size) / 2,
          marginLeft: -(isOffline ? size * 0.55 : size) / 2,
          marginTop: -(isOffline ? size * 0.55 : size) / 2,
        },
        selected && styles.selected,
        isDelayed && styles.delayed,
        isOffline && styles.offline,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(98, 189, 251, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(98, 189, 251, 0.35)',
  },
  selected: {
    backgroundColor: 'rgba(98, 189, 251, 0.28)',
    borderColor: 'rgba(22, 136, 232, 0.45)',
    borderWidth: 1.5,
  },
  delayed: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  offline: {
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: 'rgba(148, 163, 184, 0.28)',
  },
});
