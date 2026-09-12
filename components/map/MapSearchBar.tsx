import { StyleSheet, Text, TextInput, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { mapIcons } from './mapIcons';

type MapSearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  locationHint?: string;
};

export function MapSearchBar({ value, onChangeText, locationHint }: MapSearchBarProps) {
  return (
    <View style={styles.wrap}>
      <DashboardIcon icon={mapIcons.search} size={18} />
      <View style={styles.inputBlock}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Поиск станции по ID или имени"
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          autoCorrect={false}
          autoCapitalize="none"
          returnKeyType="search"
        />
        {locationHint ? (
          <Text style={styles.hint} numberOfLines={1}>
            {locationHint}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
    minHeight: 48,
    ...shadows.soft,
  },
  inputBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  input: {
    fontSize: 15,
    color: colors.textMain,
    lineHeight: 20,
    paddingVertical: 0,
    minHeight: 22,
  },
  hint: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
    paddingVertical: 0,
  },
});
