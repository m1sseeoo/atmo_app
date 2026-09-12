import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AtmoLogo } from '../AtmoLogo';
import { colors } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { assistantIcons } from './assistantIcons';

type AssistantHeaderProps = {
  onBack?: () => void;
};

export function AssistantHeader({ onBack }: AssistantHeaderProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable
          onPress={onBack}
          style={styles.iconBtn}
          accessibilityRole="button"
          accessibilityLabel="Назад"
        >
          <DashboardIcon icon={assistantIcons.back} size={20} />
        </Pressable>

        <View style={styles.logoWrap}>
          <AtmoLogo width={100} />
        </View>

        <Pressable style={styles.iconBtn} accessibilityRole="button" accessibilityLabel="Меню">
          <DashboardIcon icon={assistantIcons.menu} size={20} />
        </Pressable>
      </View>

      <Text style={styles.title}>ИИ ассистент</Text>
      <Text style={styles.subtitle}>
        Ответы основаны на текущих данных и сохранённом профиле.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  iconBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrap: {
    transform: [{ scale: 0.82 }],
    marginBottom: -6,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 8,
  },
});
