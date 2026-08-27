import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { AdminDevice, AdminDeviceFilter } from '../../types/admin';
import { DeviceFilterChips } from './DeviceFilterChips';
import { DeviceSearchBar } from './DeviceSearchBar';
import { DeviceTableRow } from './DeviceTableRow';

type DeviceTableProps = {
  devices: AdminDevice[];
  searchQuery: string;
  onSearchChange: (value: string) => void;
  activeFilter: AdminDeviceFilter;
  onFilterChange: (filter: AdminDeviceFilter) => void;
  selectedDeviceId?: string | null;
  onDevicePress?: (deviceId: string) => void;
};

const TABLE_WIDTH = 360;

export function DeviceTable({
  devices,
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  selectedDeviceId,
  onDevicePress,
}: DeviceTableProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.sectionTitle}>Список устройств</Text>

      <DeviceSearchBar value={searchQuery} onChangeText={onSearchChange} />
      <DeviceFilterChips active={activeFilter} onChange={onFilterChange} />

      {devices.length === 0 ? (
        <Text style={styles.empty}>Устройства не найдены</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={[styles.table, { minWidth: TABLE_WIDTH }]}>
            <View style={styles.headRow}>
              <Text style={[styles.headCell, styles.idCell]}>ID устройства</Text>
              <Text style={[styles.headCell, styles.statusCell]}>Статус</Text>
              <Text style={[styles.headCell, styles.chargeCell]}>Заряд</Text>
              <Text style={[styles.headCell, styles.signalCell]}>Сигнал</Text>
              <Text style={[styles.headCell, styles.dateCell]}>Последнее обновление</Text>
            </View>
            {devices.map((device) => (
              <DeviceTableRow
                key={device.id}
                device={device}
                selected={device.id === selectedDeviceId}
                onPress={() => onDevicePress?.(device.id)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  empty: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    paddingVertical: 8,
  },
  table: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingBottom: 4,
    ...shadows.soft,
  },
  headRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 6,
  },
  headCell: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted,
    lineHeight: 13,
  },
  idCell: { width: 72, flexShrink: 0 },
  statusCell: { width: 62, flexShrink: 0 },
  chargeCell: { width: 40, flexShrink: 0 },
  signalCell: { width: 58, flexShrink: 0 },
  dateCell: { width: 96, flexShrink: 0 },
});
