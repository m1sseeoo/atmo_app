import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { TimeRange } from '../../types/analytics';

type SegmentedControlProps = {
  options: readonly TimeRange[];
  value: TimeRange;
  onChange: (value: TimeRange) => void;
};

export function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
  return (
    <View style={styles.track}>
      {options.map((option) => {
        const active = option === value;

        return (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[styles.segment, active && styles.segmentActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 18,
  },
  labelActive: {
    color: colors.primaryDark,
  },
});
