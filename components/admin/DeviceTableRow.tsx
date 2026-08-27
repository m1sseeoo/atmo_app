import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { AdminDevice } from '../../types/admin';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { adminIcons } from './adminIcons';

type DeviceTableRowProps = {
  device: AdminDevice;
  selected?: boolean;
  onPress?: () => void;
};

export function DeviceTableRow({ device, selected = false, onPress }: DeviceTableRowProps) {
  const isOnline = device.status === 'online';
  const isDelayed = device.status === 'delayed';
  const signalIcon =
    isOnline && device.signal !== '—' ? adminIcons.signal : adminIcons.signalMuted;

  return (
    <Pressable
      onPress={onPress}
      style={[styles.row, selected ? styles.rowSelected : null]}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.cell, styles.idCell]} numberOfLines={1}>
        {device.id}
      </Text>
      <View style={[styles.statusCell]}>
        <View
          style={[
            styles.dot,
            isOnline ? styles.dotOnline : isDelayed ? styles.dotDelayed : styles.dotOffline,
          ]}
        />
        <Text
          style={[
            styles.statusText,
            isOnline ? styles.online : isDelayed ? styles.delayed : styles.offline,
          ]}
          numberOfLines={1}
        >
          {device.statusLabel}
        </Text>
      </View>
      <Text style={[styles.cell, styles.chargeCell]} numberOfLines={1}>
        {device.charge}
      </Text>
      <View style={styles.signalCell}>
        <DashboardIcon icon={signalIcon} size={12} />
        <Text style={styles.signalText} numberOfLines={1}>
          {device.signal}
        </Text>
      </View>
      <Text style={[styles.cell, styles.dateCell]} numberOfLines={1}>
        {device.lastUpdated}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  rowSelected: {
    backgroundColor: colors.primarySoft,
    borderRadius: 10,
    marginHorizontal: -4,
    paddingHorizontal: 4,
  },
  cell: {
    fontSize: 10,
    lineHeight: 13,
    color: colors.textMain,
  },
  idCell: {
    width: 72,
    fontWeight: '600',
    flexShrink: 0,
  },
  statusCell: {
    width: 62,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    flexShrink: 0,
  },
  dotOnline: {
    backgroundColor: '#22C55E',
  },
  dotDelayed: {
    backgroundColor: '#F59E0B',
  },
  dotOffline: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 13,
  },
  online: {
    color: '#15803D',
  },
  delayed: {
    color: '#B45309',
  },
  offline: {
    color: '#B45309',
  },
  chargeCell: {
    width: 40,
    flexShrink: 0,
  },
  signalCell: {
    width: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flexShrink: 0,
  },
  signalText: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 13,
    flexShrink: 1,
  },
  dateCell: {
    width: 96,
    color: colors.textMuted,
    flexShrink: 0,
  },
});
