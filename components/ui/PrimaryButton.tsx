import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { colors, shadows } from '../../constants/theme';

type PrimaryButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
}: PrimaryButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isDisabled ? styles.disabled : styles.enabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.white} />
      ) : (
        <Text style={styles.label}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  enabled: {
    backgroundColor: '#1688E8',
    ...shadows.button,
  },
  disabled: {
    backgroundColor: '#B8D4E8',
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.92,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.white,
    letterSpacing: 0.1,
  },
});
