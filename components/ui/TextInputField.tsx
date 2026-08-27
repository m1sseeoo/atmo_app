import { StyleSheet, Text, TextInput, type TextInputProps, View } from 'react-native';

import { colors } from '../../constants/theme';

type Props = TextInputProps & { label: string; error?: string };

export function TextInputField({ label, style, error, ...props }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#8FA1B7"
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.textMain,
  },
  input: {
    fontSize: 15,
    color: colors.textMain,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DDEAF5',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    minHeight: 48,
  },
  inputError: {
    borderColor: '#E57373',
  },
  error: {
    fontSize: 12,
    lineHeight: 16,
    color: '#C0392B',
  },
});
