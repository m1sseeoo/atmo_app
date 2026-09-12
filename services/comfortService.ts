import type { ComfortFactorImpact, ComfortIndexResult } from '../types/comfort';
import type { UserProfile } from '../types/profile';
import type { DeviceReading } from '../types/reading';
import type { ComfortStatus } from '../types/recommendation';
import { analyzeAirEnvironment } from './sensorAnalysisService';

type PenaltyDraft = Omit<ComfortFactorImpact, 'severity'>;

function hasFactor(profile: UserProfile | null | undefined, factor: string): boolean {
  return profile?.factors.includes(factor) ?? false;
}

function pushPenalty(impacts: ComfortFactorImpact[], draft: PenaltyDraft): void {
  if (draft.points === 0) return;
  const magnitude = Math.abs(draft.points);
  impacts.push({
    ...draft,
    severity: magnitude >= 16 ? 'high' : magnitude >= 7 ? 'medium' : 'low',
  });
}

function evaluateTemperature(reading: DeviceReading, profile: UserProfile | null | undefined, impacts: ComfortFactorImpact[]): void {
  const value = reading.temperature;
  if (value === undefined || (value >= 18 && value <= 26)) return;
  let points = -20;
  if ((value >= 15 && value <= 17) || (value >= 27 && value <= 29)) points = -6;
  else if ((value >= 10 && value <= 14) || (value >= 30 && value <= 32)) points = -12;
  if ((value < 18 && hasFactor(profile, 'Холод')) || (value > 26 && hasFactor(profile, 'Жара'))) points -= 4;
  if (profile?.activityLevel === 'high' && value >= 30) points -= 4;
  pushPenalty(impacts, {
    key: 'temperature', label: value < 18 ? 'Прохладно' : 'Жарко', points,
    explanation: value < 18 ? 'Температура ниже комфортного диапазона.' : 'Температура выше комфортного диапазона.',
  });
}

function evaluateHumidity(reading: DeviceReading, profile: UserProfile | null | undefined, impacts: ComfortFactorImpact[]): void {
  const value = reading.humidity;
  if (value === undefined || (value >= 35 && value <= 60)) return;
  let points = value < 25 || value > 70 ? -10 : -5;
  if ((value > 60 && hasFactor(profile, 'Высокая влажность')) || (value < 35 && hasFactor(profile, 'Сухой воздух'))) points -= 4;
  pushPenalty(impacts, {
    key: 'humidity', label: value < 35 ? 'Сухой воздух' : 'Повышенная влажность', points,
    explanation: value < 35 ? 'Воздух суше комфортного уровня.' : 'Влажность выше комфортного уровня.',
  });
}

function evaluatePressure(reading: DeviceReading, profile: UserProfile | null | undefined, impacts: ComfortFactorImpact[]): void {
  const value = reading.pressure;
  if (value === undefined || (value >= 745 && value <= 760)) return;
  let points = value < 735 || value > 770 ? -12 : -6;
  if (hasFactor(profile, 'Перепады давления') || hasFactor(profile, 'Давление')) points -= 5;
  pushPenalty(impacts, { key: 'pressure', label: 'Давление', points, explanation: 'Давление вне привычного комфортного диапазона.' });
}

function evaluateAir(reading: DeviceReading, profile: UserProfile | null | undefined, impacts: ComfortFactorImpact[]): void {
  const status = analyzeAirEnvironment(reading).status;
  if (status === 'unknown' || status === 'normal') return;
  let points = status === 'high' ? -22 : -10;
  if (hasFactor(profile, 'Качество воздуха') || hasFactor(profile, 'Аллергия')) points -= 5;
  pushPenalty(impacts, {
    key: 'air-environment', label: 'Воздушная среда', points,
    explanation: 'Датчики MQ показывают повышенный относительный уровень; это не AQI и не ppm.',
  });
}

function evaluateRain(reading: DeviceReading, profile: UserProfile | null | undefined, impacts: ComfortFactorImpact[]): void {
  let points = 0;
  if (reading.rain === true) points = -12;
  else if (reading.rainProbability !== undefined && reading.rainProbability > 60) points = -10;
  else if (reading.rainProbability !== undefined && reading.rainProbability > 30) points = -5;
  else return;
  if (hasFactor(profile, 'Дождь')) points -= 3;
  pushPenalty(impacts, { key: 'rain', label: 'Осадки', points, explanation: 'Датчик фиксирует влагу или есть вероятность осадков.' });
}

function evaluateWind(reading: DeviceReading, impacts: ComfortFactorImpact[]): void {
  const value = reading.windSpeed;
  if (value === undefined || value <= 6) return;
  pushPenalty(impacts, { key: 'wind', label: 'Ветер', points: value <= 10 ? -6 : -12, explanation: 'Ветер может снизить комфорт на улице.' });
}

export function resolveComfortStatus(score: number): ComfortStatus {
  if (score >= 81) return 'условия комфортные';
  if (score >= 66) return 'условия средние';
  if (score >= 46) return 'желательна осторожность';
  if (score >= 26) return 'рекомендуется сократить пребывание';
  return 'лучше перенести выход';
}

export function resolveComfortConclusion(score: number): string {
  if (score >= 81) return 'Доступные показатели сейчас благоприятны.';
  if (score >= 66) return 'Условия в целом нормальные, но есть факторы для внимания.';
  if (score >= 46) return 'Возможен дискомфорт, лучше следить за временем на улице.';
  if (score >= 26) return 'Лучше сократить длительное пребывание на улице.';
  return 'Лучше перенести выход или выбрать более комфортное время.';
}

function countAvailable(reading: DeviceReading): number {
  return [reading.temperature, reading.humidity, reading.pressure, analyzeAirEnvironment(reading).status === 'unknown' ? undefined : 1, reading.rain ?? reading.rainProbability, reading.windSpeed].filter((value) => value !== undefined).length;
}

export function calculateComfortIndex(reading: DeviceReading, profile?: UserProfile | null): ComfortIndexResult {
  const impacts: ComfortFactorImpact[] = [];
  evaluateTemperature(reading, profile, impacts);
  evaluateHumidity(reading, profile, impacts);
  evaluatePressure(reading, profile, impacts);
  evaluateAir(reading, profile, impacts);
  evaluateRain(reading, profile, impacts);
  evaluateWind(reading, impacts);

  const available = countAvailable(reading);
  const rawPenalty = impacts.reduce((sum, impact) => sum + Math.abs(impact.points), 0);
  const sensitivity = profile?.weatherSensitivity === 'high' ? 1.2 : profile?.weatherSensitivity === 'medium' ? 1.1 : 1;
  const normalization = available > 0 ? Math.min(1.25, 5 / available) : 1;
  const score = Math.max(0, Math.min(100, Math.round(100 - rawPenalty * sensitivity * normalization)));

  return { score, status: resolveComfortStatus(score), conclusion: resolveComfortConclusion(score), factors: impacts };
}
