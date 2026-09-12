import { MOCK_READINGS } from '../data/mockReadings';
import type { UserProfile } from '../types/profile';
import type { DeviceReading } from '../types/reading';
import { calculateComfortIndex } from './comfortService';

const COMFORTABLE_READING: DeviceReading = {
  id: 'reading-test-comfort',
  deviceId: 'ATMO-0547',
  temperature: 23.1,
  humidity: 46,
  pressure: 751,
  mq135: 620,
  mq2: 430,
  mq7: 410,
  mq8: 390,
  rain: false,
  rainProbability: 0,
  light: 420,
  windSpeed: 3,
  windDirection: 'СЗ',
  createdAt: '2025-05-24T10:30:00+03:00',
};

const HOT_READING: DeviceReading = {
  ...COMFORTABLE_READING,
  id: 'reading-test-hot',
  temperature: 31,
};

const BAD_AIR_READING: DeviceReading = {
  ...COMFORTABLE_READING,
  id: 'reading-test-air',
  mq135: 2000,
};

const LOW_SENSITIVITY_PROFILE: UserProfile = {
  name: 'Test',
  age: 30,
  city: 'Москва',
  activityLevel: 'medium',
  weatherSensitivity: 'low',
  factors: [],
  preferences: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
};

const HIGH_SENSITIVITY_PROFILE: UserProfile = {
  ...LOW_SENSITIVITY_PROFILE,
  weatherSensitivity: 'high',
  factors: ['Давление'],
};

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Comfort check failed: ${message}`);
  }
}

export function runComfortSelfChecks(): void {
  const comfortable = calculateComfortIndex(COMFORTABLE_READING, LOW_SENSITIVITY_PROFILE);
  assert(comfortable.score > 80, `comfortable score expected > 80, got ${comfortable.score}`);
  assert(comfortable.score <= 100, 'score must be <= 100');

  const hot = calculateComfortIndex(HOT_READING, LOW_SENSITIVITY_PROFILE);
  assert(hot.score < comfortable.score, 'heat should lower score');

  const badAir = calculateComfortIndex(BAD_AIR_READING, LOW_SENSITIVITY_PROFILE);
  assert(badAir.score < comfortable.score, 'bad air quality should lower score');

  const lowSensitivity = calculateComfortIndex(COMFORTABLE_READING, LOW_SENSITIVITY_PROFILE);
  const highSensitivity = calculateComfortIndex(COMFORTABLE_READING, HIGH_SENSITIVITY_PROFILE);
  assert(
    highSensitivity.score <= lowSensitivity.score,
    'high sensitivity should not increase score',
  );

  const clampLow = calculateComfortIndex(
    {
      ...COMFORTABLE_READING,
      temperature: 2,
      humidity: 90,
      pressure: 700,
      mq135: 2200,
      mq2: 1900,
      rain: true,
      rainProbability: 90,
      windSpeed: 15,
    },
    HIGH_SENSITIVITY_PROFILE,
  );
  assert(clampLow.score >= 0, 'score must be >= 0');

  const defaultMock = MOCK_READINGS[0];
  if (defaultMock) {
    const defaultScore = calculateComfortIndex(defaultMock, LOW_SENSITIVITY_PROFILE);
    assert(defaultScore.score >= 90, `default mock score expected >= 90, got ${defaultScore.score}`);
  }
}
