import type { AnalyticsMetric } from '../types/analytics';
import type { DeviceReading } from '../types/reading';
import { analyzeAirEnvironment, sensorStatusLabel } from './sensorAnalysisService';

function currentOnly(value: number): number[] {
  // ThingSpeak integration currently fetches only the latest reading; do not fabricate a trend.
  return Array.from({ length: 8 }, () => value);
}

export function buildAnalyticsMetricsFromReading(reading: DeviceReading): AnalyticsMetric[] {
  const metrics: AnalyticsMetric[] = [];
  if (reading.temperature !== undefined) metrics.push({ title: 'Температура', value: `${reading.temperature.toFixed(1).replace('.', ',')} °C`, level: 'Текущее', levelColor: '#1688E8', explanation: 'Последнее реальное измерение DHT22.', color: '#1688E8', points: currentOnly(reading.temperature) });
  if (reading.humidity !== undefined) metrics.push({ title: 'Влажность', value: `${reading.humidity} %`, level: 'Текущее', levelColor: '#1688E8', explanation: 'Последнее реальное измерение DHT22.', color: '#1688E8', points: currentOnly(reading.humidity) });
  if (reading.light !== undefined) metrics.push({ title: 'Освещённость', value: `${reading.light} lux`, level: 'Текущее', levelColor: '#1688E8', explanation: 'Последнее измерение BH1750.', color: '#1688E8', points: currentOnly(reading.light) });
  if (reading.pressure !== undefined) metrics.push({ title: 'Давление', value: `${reading.pressure} мм рт. ст.`, level: 'Текущее', levelColor: '#1688E8', explanation: 'Последнее доступное измерение.', color: '#1688E8', points: currentOnly(reading.pressure) });

  const air = analyzeAirEnvironment(reading);
  if (air.status !== 'unknown' && air.score !== undefined) metrics.push({ title: 'ATMO Air Score', value: `${air.score}/100`, level: sensorStatusLabel(air.status), levelColor: air.status === 'normal' ? '#22C55E' : '#F59E0B', explanation: 'Относительный анализ RAW MQ ADC; это не AQI и не ppm.', color: air.status === 'normal' ? '#22C55E' : '#F59E0B', points: currentOnly(air.score) });
  if (reading.rain !== undefined) metrics.push({ title: 'Датчик дождя', value: reading.rain ? 'Влага обнаружена' : 'Сухо', level: 'Локальный датчик', levelColor: '#1688E8', explanation: 'Состояние датчика не является прогнозом осадков.', color: '#1688E8', points: currentOnly(reading.rain ? 1 : 0) });
  return metrics;
}
