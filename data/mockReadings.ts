import type { DeviceReading } from '../types/reading';

const BASE_READING: Omit<DeviceReading, 'id' | 'deviceId' | 'createdAt'> = {
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
  isDemoData: true,
};

function createReading(deviceId: string, overrides?: Partial<DeviceReading>): DeviceReading {
  return {
    id: `reading-${deviceId}`,
    deviceId,
    createdAt: '2025-05-24T10:30:00+03:00',
    ...BASE_READING,
    ...overrides,
  };
}

export const MOCK_READINGS: DeviceReading[] = [
  createReading('ATMO-0547'),
  createReading('ATMO-0011', {
    temperature: 22.8,
    humidity: 48,
    mq135: 680,
    createdAt: '2025-05-24T10:27:00+03:00',
  }),
  createReading('ATMO-0118', {
    temperature: 21.4,
    humidity: 52,
    mq135: 760,
    createdAt: '2025-05-23T21:05:00+03:00',
  }),
  createReading('ATMO-0099', {
    temperature: 23.5,
    humidity: 44,
    mq135: 590,
    createdAt: '2025-05-24T10:21:00+03:00',
  }),
  createReading('ATMO-0146', {
    temperature: 22.9,
    humidity: 47,
    mq135: 650,
    windSpeed: 4,
    windDirection: 'З',
    createdAt: '2025-05-24T10:05:00+03:00',
  }),
];
