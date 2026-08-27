import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';

type SaveCheckButtonProps = {
  onPress: () => Promise<void>;
  disabled?: boolean;
};

type SaveState = 'idle' | 'saving' | 'success' | 'error' | 'duplicate';

export function SaveCheckButton({ onPress, disabled = false }: SaveCheckButtonProps) {
  const [state, setState] = useState<SaveState>('idle');

  useEffect(() => {
    if (state === 'idle') {
      return;
    }

    const timer = setTimeout(() => {
      setState('idle');
    }, 2500);

    return () => clearTimeout(timer);
  }, [state]);

  const handlePress = async () => {
    if (disabled || state === 'saving') {
      return;
    }

    setState('saving');
    try {
      await onPress();
      setState('success');
    } catch (error) {
      if (error instanceof Error && error.message === 'DUPLICATE') {
        setState('duplicate');
        return;
      }
      setState('error');
    }
  };

  const feedbackText =
    state === 'success'
      ? 'Сохранено в историю'
      : state === 'error'
        ? 'Не удалось сохранить проверку'
        : state === 'duplicate'
          ? 'Проверка уже сохранена недавно'
          : null;

  return (
    <View style={styles.wrap}>
      <Pressable
        onPress={handlePress}
        disabled={disabled || state === 'saving'}
        style={({ pressed }) => [
          styles.button,
          (disabled || state === 'saving') && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Сохранить проверку"
      >
        {state === 'saving' ? (
          <ActivityIndicator size="small" color={colors.primaryDark} />
        ) : (
          <Text style={styles.buttonText}>Сохранить проверку</Text>
        )}
      </Pressable>
      {feedbackText ? <Text style={styles.feedback}>{feedbackText}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
    alignItems: 'center',
  },
  button: {
    alignSelf: 'stretch',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },
  buttonDisabled: {
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.92,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 18,
  },
  feedback: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    textAlign: 'center',
  },
});
