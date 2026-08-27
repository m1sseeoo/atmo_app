export type ActivityLevel = 'low' | 'medium' | 'high';
export type WeatherSensitivity = 'low' | 'medium' | 'high';

export type ActivityLevelLabel = 'Низкий' | 'Умеренный' | 'Высокий';
export type WeatherSensitivityLabel = 'Низкая' | 'Умеренная' | 'Высокая';

export type EnvironmentalFactor =
  | 'Головные боли'
  | 'Аллергия'
  | 'Давление'
  | 'Перепады давления'
  | 'Жара'
  | 'Холод'
  | 'Высокая влажность'
  | 'Сухой воздух'
  | 'Качество воздуха'
  | 'Солнце / УФ'
  | 'Дождь';

export type UserPreference =
  | 'Прогулки'
  | 'Велосипед'
  | 'Бег'
  | 'Больше спокойных рекомендаций'
  | 'Предупреждать заранее'
  | 'Учитывать маршруты'
  | 'Не перегружать уведомления';

export type UserProfile = {
  name: string;
  age: number;
  city: string;
  activityLevel: ActivityLevel;
  weatherSensitivity: WeatherSensitivity;
  factors: string[];
  preferences: string[];
  createdAt: string;
  updatedAt: string;
};

export type ProfileFormData = {
  name: string;
  age: string;
  city: string;
  activityLevel: ActivityLevelLabel | '';
  weatherSensitivity: WeatherSensitivityLabel | '';
  factors: EnvironmentalFactor[];
  preferences: UserPreference[];
};

export type ProfileFormInput = ProfileFormData;

export const ACTIVITY_LEVELS: ActivityLevelLabel[] = ['Низкий', 'Умеренный', 'Высокий'];

export const WEATHER_SENSITIVITY_OPTIONS: WeatherSensitivityLabel[] = [
  'Низкая',
  'Умеренная',
  'Высокая',
];

export const ENVIRONMENTAL_FACTORS: EnvironmentalFactor[] = [
  'Головные боли',
  'Аллергия',
  'Давление',
  'Перепады давления',
  'Жара',
  'Холод',
  'Высокая влажность',
  'Сухой воздух',
  'Качество воздуха',
  'Солнце / УФ',
  'Дождь',
];

export const USER_PREFERENCES: UserPreference[] = [
  'Прогулки',
  'Велосипед',
  'Бег',
  'Больше спокойных рекомендаций',
  'Предупреждать заранее',
  'Учитывать маршруты',
  'Не перегружать уведомления',
];

export const CITY_OPTIONS = ['Москва', 'Астана', 'Алматы', 'Шымкент', 'Караганда', 'Актобе'];

const ACTIVITY_LABEL_TO_LEVEL: Record<ActivityLevelLabel, ActivityLevel> = {
  Низкий: 'low',
  Умеренный: 'medium',
  Высокий: 'high',
};

const WEATHER_LABEL_TO_LEVEL: Record<WeatherSensitivityLabel, WeatherSensitivity> = {
  Низкая: 'low',
  Умеренная: 'medium',
  Высокая: 'high',
};

const ACTIVITY_LEVEL_TO_LABEL: Record<ActivityLevel, ActivityLevelLabel> = {
  low: 'Низкий',
  medium: 'Умеренный',
  high: 'Высокий',
};

const WEATHER_LEVEL_TO_LABEL: Record<WeatherSensitivity, WeatherSensitivityLabel> = {
  low: 'Низкая',
  medium: 'Умеренная',
  high: 'Высокая',
};

export function activityLabelToLevel(label: ActivityLevelLabel): ActivityLevel {
  return ACTIVITY_LABEL_TO_LEVEL[label];
}

export function weatherLabelToLevel(label: WeatherSensitivityLabel): WeatherSensitivity {
  return WEATHER_LABEL_TO_LEVEL[label];
}

export function activityLevelToLabel(level: ActivityLevel): ActivityLevelLabel {
  return ACTIVITY_LEVEL_TO_LABEL[level];
}

export function weatherLevelToLabel(level: WeatherSensitivity): WeatherSensitivityLabel {
  return WEATHER_LEVEL_TO_LABEL[level];
}

export function formDataToUserProfile(form: ProfileFormData, existing?: UserProfile): UserProfile {
  const now = new Date().toISOString();
  return {
    name: form.name.trim(),
    age: parseInt(form.age, 10),
    city: form.city,
    activityLevel: activityLabelToLevel(form.activityLevel as ActivityLevelLabel),
    weatherSensitivity: weatherLabelToLevel(form.weatherSensitivity as WeatherSensitivityLabel),
    factors: [...form.factors],
    preferences: [...form.preferences],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

export function userProfileToFormData(profile: UserProfile): ProfileFormData {
  return {
    name: profile.name,
    age: String(profile.age),
    city: profile.city,
    activityLevel: activityLevelToLabel(profile.activityLevel),
    weatherSensitivity: weatherLevelToLabel(profile.weatherSensitivity),
    factors: profile.factors as EnvironmentalFactor[],
    preferences: profile.preferences as UserPreference[],
  };
}

export const EMPTY_PROFILE_FORM: ProfileFormData = {
  name: '',
  age: '',
  city: '',
  activityLevel: '',
  weatherSensitivity: '',
  factors: [],
  preferences: [],
};
