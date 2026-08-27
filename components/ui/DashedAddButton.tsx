import { Pressable, StyleSheet, Text } from 'react-native';

import { colors } from '../../constants/theme';

type Props = { label: string; onPress: () => void };

export function DashedAddButton({ label, onPress }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}
    >
      <Text style={styles.plus}>+</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: '#9ACFEF',
    borderStyle: 'dashed',
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  btnPressed: {
    backgroundColor: colors.primarySoft,
  },
  plus: {
    fontSize: 14,
    lineHeight: 16,
    color: colors.primaryDark,
    fontWeight: '500',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textMuted,
  },
});
