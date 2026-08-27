import type { ProfileFormInput } from '../types/profile';

export type ProfileValidationErrors = Partial<
  Record<'name' | 'age' | 'city' | 'activityLevel' | 'weatherSensitivity', string>
>;

export function validateUserProfileInput(input: ProfileFormInput): {
  isValid: boolean;
  errors: ProfileValidationErrors;
} {
  const errors: ProfileValidationErrors = {};

  const name = input.name.trim();
  if (!name) {
    errors.name = 'Введите имя';
  } else if (name.length < 2) {
    errors.name = 'Имя должно содержать минимум 2 символа';
  }

  const ageText = input.age.trim();
  if (!ageText) {
    errors.age = 'Введите возраст';
  } else {
    const age = Number(ageText);
    if (!Number.isInteger(age)) {
      errors.age = 'Возраст должен быть числом';
    } else if (age < 7 || age > 100) {
      errors.age = 'Укажите возраст от 7 до 100';
    }
  }

  if (!input.city.trim()) {
    errors.city = 'Выберите город';
  }

  if (!input.activityLevel) {
    errors.activityLevel = 'Выберите уровень активности';
  }

  if (!input.weatherSensitivity) {
    errors.weatherSensitivity = 'Выберите чувствительность к погоде';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function isProfileFormSubmittable(input: ProfileFormInput): boolean {
  return validateUserProfileInput(input).isValid;
}
