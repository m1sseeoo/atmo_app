import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { colors } from '../../constants/theme';
import { ADMIN_DEVICE_FILTERS, type AdminDeviceFilter } from '../../types/admin';

type DeviceFilterChipsProps = {
  active: AdminDeviceFilter;
  onChange: (filter: AdminDeviceFilter) => void;
};

export function DeviceFilterChips({ active, onChange }: DeviceFilterChipsProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {ADMIN_DEVICE_FILTERS.map((filter) => {
        const selected = active === filter.id;
        return (
          <Pressable
            key={filter.id}
            onPress={() => onChange(filter.id)}
            style={[styles.chip, selected ? styles.chipActive : null]}
            accessibilityRole="button"
            accessibilityState={{ selected }}
          >
            <Text style={[styles.label, selected ? styles.labelActive : null]}>{filter.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipActive: {
    borderColor: colors.primaryDark,
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 16,
  },
  labelActive: {
    color: colors.primaryDark,
  },
});
