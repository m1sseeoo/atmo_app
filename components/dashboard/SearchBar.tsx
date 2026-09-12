import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type SearchBarProps = {
  locationLabel: string;
  onPress?: () => void;
};

export function SearchBar({ locationLabel, onPress }: SearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.wrap, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel="Выбрать место"
    >
      <DashboardIcon icon={dashboardIcons.search} size={18} />
      <View style={styles.textBlock}>
        <Text style={styles.location} numberOfLines={1}>
          {locationLabel}
        </Text>
        <Text style={styles.hint} numberOfLines={1}>
          Нажмите, чтобы выбрать адрес, район или маршрут
        </Text>
      </View>
      <View style={styles.sendBtn}>
        <DashboardIcon icon={dashboardIcons.send} size={16} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    minHeight: 56,
  },
  pressed: {
    opacity: 0.92,
  },
  textBlock: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  location: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 20,
  },
  hint: {
    fontSize: 12,
    color: '#8FA1B7',
    lineHeight: 16,
  },
  sendBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
