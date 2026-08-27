import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';

type DeviceSearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
};

export function DeviceSearchBar({ value, onChangeText }: DeviceSearchBarProps) {
  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        placeholder="Поиск устройства"
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="while-editing"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    minHeight: 44,
    justifyContent: 'center',
    ...shadows.soft,
  },
  input: {
    fontSize: 14,
    color: colors.textMain,
    lineHeight: 18,
    paddingVertical: 10,
  },
});
