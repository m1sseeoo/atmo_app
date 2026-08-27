import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors } from '../constants/theme';

export function ProfileLoadingScreen() {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>Загрузка профиля...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  text: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
