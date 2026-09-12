import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { MapStation } from '../../types/map';
import { DeviceStatusBadge } from './DeviceStatusBadge';

type NearbyStationsListProps = {
  stations: MapStation[];
  onSelect: (id: string) => void;
};

export function NearbyStationsList({ stations, onSelect }: NearbyStationsListProps) {
  if (stations.length === 0) {
    return null;
  }

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Ближайшие станции</Text>
      <View style={styles.list}>
        {stations.map((station) => (
          <Pressable
            key={station.id}
            onPress={() => onSelect(station.id)}
            style={({ pressed }) => [
              styles.card,
              station.selected && styles.cardSelected,
              pressed && styles.cardPressed,
            ]}
            accessibilityRole="button"
            accessibilityState={{ selected: station.selected }}
          >
            <Text style={styles.cardId} numberOfLines={1}>
              {station.id}
            </Text>
            <DeviceStatusBadge status={station.status} />
            <View style={styles.metaRow}>
              <Text style={styles.meta}>{station.battery}%</Text>
              <Text style={styles.meta}>
                {station.signal === null ? '—' : `${station.signal} dBm`}
              </Text>
            </View>
            <Text style={styles.distance} numberOfLines={1}>
              {station.distanceLabel ?? '—'}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    gap: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    minHeight: 132,
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 8,
    justifyContent: 'space-between',
    ...shadows.soft,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primarySoft,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardId: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMain,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  meta: {
    fontSize: 11,
    color: colors.textMuted,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
