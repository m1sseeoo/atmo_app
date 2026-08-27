import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';

type ChipProps = {
  label: string;
  onRemove?: () => void;
};

export function Chip({ label, onRemove }: ChipProps) {
  return (
    <View style={styles.chip}>
      <Text style={styles.label}>{label}</Text>
      {onRemove ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Удалить ${label}`}
          hitSlop={8}
          onPress={onRemove}
          style={styles.removeBtn}
        >
          <Text style={styles.removeIcon}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EAF7FF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#C8E9FF',
    paddingLeft: 12,
    paddingRight: 8,
    paddingVertical: 6,
    minHeight: 32,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1688E8',
  },
  removeBtn: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: {
    fontSize: 16,
    lineHeight: 17,
    color: '#1688E8',
    fontWeight: '300',
  },
});
