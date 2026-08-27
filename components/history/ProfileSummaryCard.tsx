import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import {
  activityLevelToLabel,
  type UserProfile,
  weatherLevelToLabel,
} from '../../types/profile';

type ProfileSummaryCardProps = {
  profile: UserProfile;
  onReset: () => void;
};

export function ProfileSummaryCard({ profile, onReset }: ProfileSummaryCardProps) {
  function handleResetPress() {
    Alert.alert(
      'Сбросить профиль?',
      'Локальные данные профиля будут удалены. Вы вернётесь к экрану настройки.',
      [
        { text: 'Отмена', style: 'cancel' },
        { text: 'Сбросить', style: 'destructive', onPress: onReset },
      ],
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Ваш профиль</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Имя</Text>
        <Text style={styles.value}>{profile.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Возраст</Text>
        <Text style={styles.value}>{profile.age}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Город</Text>
        <Text style={styles.value}>{profile.city}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Активность</Text>
        <Text style={styles.value}>{activityLevelToLabel(profile.activityLevel)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Чувствительность</Text>
        <Text style={styles.value}>{weatherLevelToLabel(profile.weatherSensitivity)}</Text>
      </View>
      <Pressable
        onPress={handleResetPress}
        style={({ pressed }) => [styles.resetBtn, pressed && styles.resetBtnPressed]}
        accessibilityRole="button"
      >
        <Text style={styles.resetText}>Сбросить профиль</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: colors.textMain,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  resetBtn: {
    marginTop: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F5C2C7',
    backgroundColor: '#FFF5F5',
    paddingVertical: 12,
    alignItems: 'center',
  },
  resetBtnPressed: {
    opacity: 0.85,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#C0392B',
  },
});
