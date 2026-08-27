import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { DeviceFilter } from '../../types/map';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { mapIcons } from './mapIcons';

const FILTER_LABELS: Record<DeviceFilter, string> = {
  all: 'Все',
  online: 'Онлайн',
  issues: 'Проблемы',
};

type FilterButtonProps = {
  value: DeviceFilter;
  onChange: (next: DeviceFilter) => void;
};

const FILTER_ORDER: DeviceFilter[] = ['all', 'online', 'issues'];

export function FilterButton({ value, onChange }: FilterButtonProps) {
  const handlePress = () => {
    const currentIndex = FILTER_ORDER.indexOf(value);
    const next = FILTER_ORDER[(currentIndex + 1) % FILTER_ORDER.length];
    onChange(next);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [styles.btn, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`Фильтр: ${FILTER_LABELS[value]}`}
    >
      <DashboardIcon icon={mapIcons.filter} size={16} />
      <Text style={styles.label}>{FILTER_LABELS[value]}</Text>
      <DashboardIcon icon={mapIcons.chevronDown} size={14} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
    alignSelf: 'flex-start',
    flexShrink: 0,
    ...shadows.soft,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 18,
  },
});
