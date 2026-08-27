import { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AtmoLogo } from '../components/AtmoLogo';
import { HeroBackground } from '../components/HeroBackground';
import { ChipSelectSection } from '../components/ui/ChipSelectSection';
import { DisclaimerCard } from '../components/ui/DisclaimerCard';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SelectOption } from '../components/ui/SelectOption';
import { TextInputField } from '../components/ui/TextInputField';
import { useProfile } from '../context/ProfileContext';
import { colors, shadows } from '../constants/theme';
import {
  ACTIVITY_LEVELS,
  CITY_OPTIONS,
  EMPTY_PROFILE_FORM,
  ENVIRONMENTAL_FACTORS,
  formDataToUserProfile,
  type ProfileFormData,
  USER_PREFERENCES,
  userProfileToFormData,
  WEATHER_SENSITIVITY_OPTIONS,
} from '../types/profile';
import {
  isProfileFormSubmittable,
  validateUserProfileInput,
  type ProfileValidationErrors,
} from '../utils/profileValidation';

type RegistrationScreenProps = {
  onComplete?: () => void;
};

export function RegistrationScreen({ onComplete }: RegistrationScreenProps) {
  const insets = useSafeAreaInsets();
  const { profile, saveProfile } = useProfile();
  const [form, setForm] = useState<ProfileFormData>(
    profile ? userProfileToFormData(profile) : EMPTY_PROFILE_FORM,
  );
  const [fieldErrors, setFieldErrors] = useState<ProfileValidationErrors>({});
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = useMemo(() => isProfileFormSubmittable(form), [form]);

  function updateField<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) {
    setFieldErrors((prev) => {
      if (!(key in prev)) {
        return prev;
      }
      const next = { ...prev };
      delete next[key as keyof ProfileValidationErrors];
      return next;
    });
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    const { isValid, errors } = validateUserProfileInput(form);
    if (!isValid) {
      setFieldErrors(errors);
      Alert.alert('Проверьте профиль', 'Заполните обязательные поля, чтобы продолжить.');
      return;
    }

    setSubmitting(true);
    try {
      const nextProfile = formDataToUserProfile(form, profile ?? undefined);
      await saveProfile(nextProfile);
      onComplete?.();
    } catch {
      Alert.alert('Не удалось сохранить', 'Попробуйте ещё раз через несколько секунд.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top, paddingBottom: insets.bottom + 32 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.composition}>
            <HeroBackground>
              <AtmoLogo width={200} />
              <Text style={styles.heroTitle}>Добро пожаловать в ATMO</Text>
              <Text style={styles.heroSubtitle}>
                Ваш персональный помощник для комфортной жизни в любую погоду.
              </Text>
            </HeroBackground>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Давайте познакомимся</Text>
              <Text style={styles.cardSubtitle}>
                Заполните профиль, чтобы мы могли давать более точные рекомендации.
              </Text>

              <View style={styles.fields}>
                <TextInputField
                  label="Имя"
                  placeholder="Введите имя"
                  value={form.name}
                  onChangeText={(v) => updateField('name', v)}
                  autoCapitalize="words"
                  returnKeyType="next"
                  error={fieldErrors.name}
                />

                <View style={styles.row}>
                  <View style={styles.ageCol}>
                    <TextInputField
                      label="Возраст"
                      placeholder="25"
                      value={form.age}
                      onChangeText={(v) => updateField('age', v.replace(/\D/g, ''))}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      error={fieldErrors.age}
                    />
                  </View>
                  <View style={styles.cityCol}>
                    <SelectOption
                      label="Город"
                      value={form.city}
                      options={CITY_OPTIONS}
                      placeholder="Выберите город"
                      onChange={(v) => updateField('city', v)}
                    />
                    {fieldErrors.city ? (
                      <Text style={styles.fieldError}>{fieldErrors.city}</Text>
                    ) : null}
                  </View>
                </View>

                <SelectOption
                  label="Обычный уровень активности"
                  value={form.activityLevel}
                  options={ACTIVITY_LEVELS}
                  placeholder="Умеренный"
                  onChange={(v) => updateField('activityLevel', v)}
                />
                {fieldErrors.activityLevel ? (
                  <Text style={styles.fieldError}>{fieldErrors.activityLevel}</Text>
                ) : null}

                <SelectOption
                  label="Чувствительность к погодным изменениям"
                  value={form.weatherSensitivity}
                  options={WEATHER_SENSITIVITY_OPTIONS}
                  placeholder="Умеренная"
                  onChange={(v) => updateField('weatherSensitivity', v)}
                />
                {fieldErrors.weatherSensitivity ? (
                  <Text style={styles.fieldError}>{fieldErrors.weatherSensitivity}</Text>
                ) : null}

                <ChipSelectSection
                  label="Факторы, которые влияют на самочувствие"
                  selected={form.factors}
                  options={ENVIRONMENTAL_FACTORS}
                  addLabel="Добавить фактор"
                  onAdd={(v) => updateField('factors', [...form.factors, v])}
                  onRemove={(v) =>
                    updateField('factors', form.factors.filter((f) => f !== v))
                  }
                />

                <ChipSelectSection
                  label="Предпочтения пользователя"
                  selected={form.preferences}
                  options={USER_PREFERENCES}
                  addLabel="Добавить предпочтение"
                  onAdd={(v) => updateField('preferences', [...form.preferences, v])}
                  onRemove={(v) =>
                    updateField('preferences', form.preferences.filter((p) => p !== v))
                  }
                />
              </View>

              <PrimaryButton
                title="Сохранить и продолжить"
                onPress={handleSubmit}
                disabled={!canSubmit}
                loading={submitting}
              />
            </View>
          </View>

          <DisclaimerCard text="ATMO не ставит диагнозы и не заменяет консультацию врача. Мы анализируем данные окружающей среды и предоставляем персонализированные рекомендации для вашего комфорта." />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 18,
    gap: 12,
  },
  composition: {
    backgroundColor: '#DDF4FF',
    borderRadius: 28,
    overflow: 'hidden',
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 26,
    color: colors.textMain,
    textAlign: 'center',
    letterSpacing: -0.3,
    paddingHorizontal: 12,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 28,
    marginTop: -44,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    gap: 14,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    color: colors.textMain,
  },
  cardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    marginTop: -6,
  },
  fields: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  ageCol: {
    width: 88,
    flexShrink: 0,
  },
  cityCol: {
    flex: 1,
    minWidth: 0,
  },
  fieldError: {
    fontSize: 12,
    lineHeight: 16,
    color: '#C0392B',
    marginTop: -8,
  },
});