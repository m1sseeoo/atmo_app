import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { AtmoDevice } from '../../types/device';
import type { AtmoLocation } from '../../types/location';
import { findNearestDevice, getDistanceKm, getLocationTypeLabel } from '../../services/locationService';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type LocationSearchPanelProps = {
  query: string;
  suggestions: AtmoLocation[];
  devices: AtmoDevice[];
  selectedId?: string;
  onChangeQuery: (query: string) => void;
  onSelect: (location: AtmoLocation) => void;
  onClose: () => void;
  onShowPopular: () => void;
};

function formatDistanceKm(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} м`;
  }
  return `${distance.toFixed(1)} км`;
}

function SuggestionRow({
  item,
  selected,
  devices,
  onSelect,
}: {
  item: AtmoLocation;
  selected: boolean;
  devices: AtmoDevice[];
  onSelect: (location: AtmoLocation) => void;
}) {
  const nearest = findNearestDevice(item, devices);
  const distanceLabel = nearest
    ? formatDistanceKm(getDistanceKm(item, nearest))
    : undefined;

  const icon =
    item.type === 'route' ? dashboardIcons.navigation : dashboardIcons.mapPin;

  return (
    <Pressable
      onPress={() => onSelect(item)}
      style={({ pressed }) => [
        styles.row,
        selected && styles.rowSelected,
        pressed && styles.rowPressed,
      ]}
      accessibilityRole="button"
    >
      <DashboardIcon icon={icon} size={18} />
      <View style={styles.rowText}>
        <Text style={[styles.rowLabel, selected && styles.rowLabelSelected]} numberOfLines={2}>
          {item.label}
        </Text>
        <Text style={styles.rowMeta}>
          {getLocationTypeLabel(item.type)}
          {distanceLabel ? ` · ${distanceLabel} до станции` : ''}
        </Text>
      </View>
      <DashboardIcon icon={dashboardIcons.chevronRight} size={16} />
    </Pressable>
  );
}

export function LocationSearchPanel({
  query,
  suggestions,
  devices,
  selectedId,
  onChangeQuery,
  onSelect,
  onClose,
  onShowPopular,
}: LocationSearchPanelProps) {
  const trimmedQuery = query.trim();
  const isEmpty = trimmedQuery.length > 0 && suggestions.length === 0;

  return (
    <View style={styles.panel}>
      <View style={styles.inputRow}>
        <DashboardIcon icon={dashboardIcons.search} size={18} />
        <TextInput
          value={query}
          onChangeText={onChangeQuery}
          placeholder="Район, место, адрес или маршрут"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoFocus
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
        />
        <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
          <Text style={styles.closeText}>Готово</Text>
        </Pressable>
      </View>

      {isEmpty ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>Ничего не найдено</Text>
          <Text style={styles.emptyMessage}>
            Попробуйте выбрать район или популярное место.
          </Text>
          <Pressable onPress={onShowPopular} style={styles.popularBtn} accessibilityRole="button">
            <Text style={styles.popularText}>Показать популярные места</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          <Text style={styles.listHint}>
            {trimmedQuery ? 'Результаты поиска' : 'Популярные места'}
          </Text>
          {suggestions.map((item) => (
            <SuggestionRow
              key={item.id}
              item={item}
              selected={item.id === selectedId}
              devices={devices}
              onSelect={onSelect}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    maxHeight: 340,
    ...shadows.card,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.textMain,
    paddingVertical: 0,
    minHeight: 24,
  },
  closeBtn: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
  list: {
    maxHeight: 260,
  },
  listHint: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  rowSelected: {
    backgroundColor: colors.primarySoft,
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowText: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  rowLabel: {
    fontSize: 15,
    color: colors.textMain,
    lineHeight: 20,
  },
  rowLabelSelected: {
    fontWeight: '600',
    color: colors.primaryDark,
  },
  rowMeta: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  empty: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 8,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
  },
  popularBtn: {
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  popularText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
