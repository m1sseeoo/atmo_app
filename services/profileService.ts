import type { ActivityLevel, UserProfile, WeatherSensitivity } from '../types/profile';
import { storageGetItem, storageRemoveItem, storageSetItem } from './storageAdapter';

const PROFILE_STORAGE_KEY = 'atmo:user-profile';

const ACTIVITY_LEVELS: ActivityLevel[] = ['low', 'medium', 'high'];
const WEATHER_SENSITIVITIES: WeatherSensitivity[] = ['low', 'medium', 'high'];

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidUserProfile(data: unknown): data is UserProfile {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const profile = data as Record<string, unknown>;

  return (
    typeof profile.name === 'string' &&
    typeof profile.age === 'number' &&
    Number.isInteger(profile.age) &&
    profile.age >= 7 &&
    profile.age <= 100 &&
    typeof profile.city === 'string' &&
    profile.city.length > 0 &&
    typeof profile.activityLevel === 'string' &&
    ACTIVITY_LEVELS.includes(profile.activityLevel as ActivityLevel) &&
    typeof profile.weatherSensitivity === 'string' &&
    WEATHER_SENSITIVITIES.includes(profile.weatherSensitivity as WeatherSensitivity) &&
    isStringArray(profile.factors) &&
    isStringArray(profile.preferences) &&
    typeof profile.createdAt === 'string' &&
    typeof profile.updatedAt === 'string'
  );
}

export async function saveUserProfile(profile: UserProfile): Promise<void> {
  try {
    await storageSetItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.warn('ATMO: failed to save profile', error);
    throw error;
  }
}

export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await storageGetItem(PROFILE_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidUserProfile(parsed)) {
      console.warn('ATMO: invalid stored profile, clearing');
      await storageRemoveItem(PROFILE_STORAGE_KEY);
      return null;
    }

    return parsed;
  } catch (error) {
    console.warn('ATMO: failed to load profile', error);
    return null;
  }
}

export async function updateUserProfile(
  updates: Partial<Omit<UserProfile, 'createdAt'>>,
): Promise<UserProfile> {
  const existing = await getUserProfile();
  if (!existing) {
    throw new Error('Profile not found');
  }

  const updated: UserProfile = {
    ...existing,
    ...updates,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };

  await saveUserProfile(updated);
  return updated;
}

export async function clearUserProfile(): Promise<void> {
  try {
    await storageRemoveItem(PROFILE_STORAGE_KEY);
  } catch (error) {
    console.warn('ATMO: failed to clear profile', error);
    throw error;
  }
}
