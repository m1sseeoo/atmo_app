import { Pressable, StyleSheet, Text } from 'react-native';

import { colors, shadows } from '../../constants/theme';

type SecondaryButtonProps = {
  title: string;
  onPress?: () => void;
};

export function SecondaryButton({ title, onPress }: SecondaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.button}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.soft,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 20,
  },
});
