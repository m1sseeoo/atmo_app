import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type DashboardGreetingProps = {
  name?: string;
};

export function DashboardGreeting({ name }: DashboardGreetingProps) {
  const trimmed = name?.trim();
  if (!trimmed) {
    return null;
  }

  return (
    <Text style={styles.greeting} numberOfLines={1}>
      С возвращением, {trimmed}
    </Text>
  );
}

const styles = StyleSheet.create({
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textMain,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
});
