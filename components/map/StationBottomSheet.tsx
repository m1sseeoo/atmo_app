import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { MapStation } from '../../types/map';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { mapIcons } from './mapIcons';
import { DeviceStatusBadge } from './DeviceStatusBadge';
import { MetricMiniCard } from './MetricMiniCard';

type StationBottomSheetProps = {
  station: MapStation | null;
};

export function StationBottomSheet({ station }: StationBottomSheetProps) {
  if (!station) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyTitle}>Станция не выбрана</Text>
        <Text style={styles.emptyMessage}>Выберите устройство на карте.</Text>
      </View>
    );
  }

  const signalLabel = station.signal === null ? '—' : `${station.signal} dBm`;

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <DashboardIcon icon={mapIcons.mapPin} size={18} />
        <Text style={styles.title} numberOfLines={1}>
          Станция {station.name}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <DeviceStatusBadge status={station.status} />
        <Text style={styles.updatedInline}>обновлено {station.lastUpdated}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.detailText}>Покрытие: {station.coverageRadius} м</Text>
        <Text style={styles.detailDot}>·</Text>
        <Text style={styles.detailText}>Заряд: {station.battery}%</Text>
        <Text style={styles.detailDot}>·</Text>
        <Text style={styles.detailText} numberOfLines={1}>
          Сигнал: {signalLabel}
        </Text>
      </View>

      {!station.hasReading ? (
        <View style={styles.noData}>
          <Text style={styles.noDataTitle}>Нет свежих данных</Text>
          <Text style={styles.noDataMessage}>
            Выберите другую станцию или повторите позже.
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Текущие показатели</Text>
          <View style={styles.metricsGrid}>
            <MetricMiniCard
              icon={mapIcons.thermometer}
              label="Температура"
              value={station.temperature ?? '—'}
            />
            <MetricMiniCard
              icon={mapIcons.humidity}
              label="Влажность"
              value={station.humidity ?? '—'}
            />
            <MetricMiniCard
              icon={mapIcons.airQuality}
              label="Воздушная среда"
              value={station.airQuality ?? '—'}
            />
            <MetricMiniCard
              icon={mapIcons.comfort}
              label="Комфорт"
              value={
                station.comfortIndex !== undefined
                  ? `${station.comfortIndex}/100`
                  : '—'
              }
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
    ...shadows.card,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 21,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  updatedInline: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  detailDot: {
    fontSize: 12,
    color: colors.textMuted,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 17,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  noData: {
    gap: 4,
    paddingTop: 2,
  },
  noDataTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
  },
  noDataMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
