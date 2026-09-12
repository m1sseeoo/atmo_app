import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AtmoLogo } from '../components/AtmoLogo';
import { colors, typography } from '../constants/theme';

type PlaceholderScreenProps = {
  title: string;
};

export function PlaceholderScreen({ title }: PlaceholderScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top + 24 }]}>
      <AtmoLogo />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Экран в разработке</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    gap: 12,
  },
  title: {
    ...typography.title,
    color: colors.textMain,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    lineHeight: 22,
  },
});
