import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type StationStatusRowProps = {
  stationLabel: string;
  lastUpdated?: string;
  onRefresh?: () => void;
  onOpenMap?: () => void;
};

export function StationStatusRow({
  stationLabel,
  lastUpdated,
  onRefresh,
  onOpenMap,
}: StationStatusRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.info}>
        <Text style={styles.station} numberOfLines={1}>
          {stationLabel}
        </Text>
        {lastUpdated ? (
          <Text style={styles.updated} numberOfLines={1}>
            Обновлено {lastUpdated}
          </Text>
        ) : null}
      </View>

      <View style={styles.actions}>
        {onRefresh ? (
          <Pressable
            onPress={onRefresh}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Обновить данные"
          >
            <DashboardIcon icon={dashboardIcons.refresh} size={18} />
          </Pressable>
        ) : null}
        {onOpenMap ? (
          <Pressable
            onPress={onOpenMap}
            style={styles.mapBtn}
            accessibilityRole="button"
            accessibilityLabel="Открыть карту устройств"
          >
            <DashboardIcon icon={dashboardIcons.mapPin} size={16} />
            <Text style={styles.mapText}>Карта</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  info: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  station: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 18,
  },
  updated: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  mapText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
