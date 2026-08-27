import { READING_STALE_AFTER_MS, SENSOR_THRESHOLDS } from '../config/sensorConfig';
import type { DeviceReading } from '../types/reading';

export type SensorStatus = 'normal' | 'elevated' | 'high' | 'unknown';
export type MqSensorName = 'mq135' | 'mq2' | 'mq7' | 'mq8';

export type AirEnvironmentAnalysis = {
  status: SensorStatus;
  score?: number;
  sensors: Record<MqSensorName, SensorStatus>;
};

const STATUS_RANK: Record<SensorStatus, number> = {
  unknown: -1,
  normal: 0,
  elevated: 1,
  high: 2,
};

function analyzeMq(value: number | undefined, sensor: MqSensorName): SensorStatus {
  if (value === undefined || !Number.isFinite(value)) {
    return 'unknown';
  }

  const thresholds = SENSOR_THRESHOLDS.mq[sensor];
  if (value <= thresholds.normalMax) {
    return 'normal';
  }
  if (value <= thresholds.elevatedMax) {
    return 'elevated';
  }
  return 'high';
}

export function analyzeMq135(value?: number): SensorStatus {
  return analyzeMq(value, 'mq135');
}

export function analyzeMq2(value?: number): SensorStatus {
  return analyzeMq(value, 'mq2');
}

export function analyzeMq7(value?: number): SensorStatus {
  return analyzeMq(value, 'mq7');
}

export function analyzeMq8(value?: number): SensorStatus {
  return analyzeMq(value, 'mq8');
}

export function analyzeAirEnvironment(reading?: DeviceReading | null): AirEnvironmentAnalysis {
  const sensors: AirEnvironmentAnalysis['sensors'] = {
    mq135: analyzeMq135(reading?.mq135),
    mq2: analyzeMq2(reading?.mq2),
    mq7: analyzeMq7(reading?.mq7),
    mq8: analyzeMq8(reading?.mq8),
  };

  const knownStatuses = Object.values(sensors).filter(
    (status): status is Exclude<SensorStatus, 'unknown'> => status !== 'unknown',
  );
  const status = knownStatuses.reduce<SensorStatus>(
    (worst, current) => (STATUS_RANK[current] > STATUS_RANK[worst] ? current : worst),
    'unknown',
  );

  const score =
    status === 'normal' ? 100 : status === 'elevated' ? 65 : status === 'high' ? 30 : undefined;

  return { status, score, sensors };
}

export function sensorStatusLabel(status: SensorStatus): string {
  switch (status) {
    case 'normal':
      return 'Нормальный относительный уровень';
    case 'elevated':
      return 'Повышенный относительный уровень';
    case 'high':
      return 'Высокий относительный уровень';
    case 'unknown':
      return 'Нет данных';
  }
}

export function isRainDetected(rainRaw?: number): boolean | undefined {
  if (rainRaw === undefined || !Number.isFinite(rainRaw)) {
    return undefined;
  }

  // Must be calibrated using real dry/wet sensor readings.
  return SENSOR_THRESHOLDS.rain.wetWhen === 'below'
    ? rainRaw < SENSOR_THRESHOLDS.rain.wetThreshold
    : rainRaw > SENSOR_THRESHOLDS.rain.wetThreshold;
}

export function isReadingStale(createdAt?: string, now = Date.now()): boolean {
  if (!createdAt) {
    return true;
  }
  const timestamp = new Date(createdAt).getTime();
  return Number.isNaN(timestamp) || now - timestamp > READING_STALE_AFTER_MS;
}
