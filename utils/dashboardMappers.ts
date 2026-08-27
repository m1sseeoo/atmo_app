import { dashboardIcons } from '../components/dashboard/dashboardIcons';
import { comfortStatusLabel } from '../services/recommendationService';
import { analyzeAirEnvironment, sensorStatusLabel } from '../services/sensorAnalysisService';
import type { Metric, Recommendation } from '../types/dashboard';
import type { DeviceStatus } from '../types/device';
import type { DeviceReading } from '../types/reading';
import type { RecommendationResult } from '../types/recommendation';

export function formatDashboardUpdatedAt(value?: string): string {
  if (!value?.trim()) {
    return 'недавно';
  }

  if (/^\d{2}:\d{2}$/.test(value.trim())) {
    return value.trim();
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'недавно';
  }

  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

export function formatDeviceStatusLabel(status: DeviceStatus): string {
  switch (status) {
    case 'online':
      return 'онлайн';
    case 'delayed':
      return 'задержка';
    case 'offline':
      return 'оффлайн';
  }
}

function recommendationItem(
  title: string,
  values: string[],
  icon: Recommendation['icon'],
): Recommendation {
  return {
    title,
    value: values[0] ?? '—',
    icon,
    extraCount: values.length > 1 ? values.length - 1 : undefined,
    allValues: values,
  };
}

export function buildDashboardMetrics(reading: DeviceReading): Metric[] {
  const metrics: Metric[] = [];

  if (reading.temperature !== undefined) {
    metrics.push({
      label: 'Температура',
      value: `${reading.temperature.toFixed(1)}°`,
      note: 'Текущее значение',
      icon: dashboardIcons.metricTemp,
    });
  }
  if (reading.humidity !== undefined) {
    metrics.push({
      label: 'Влажность',
      value: `${reading.humidity}%`,
      note:
        reading.humidity >= 35 && reading.humidity <= 60
          ? 'Комфортный уровень'
          : 'Вне комфортного диапазона',
      icon: dashboardIcons.metricHumidity,
    });
  }
  if (reading.light !== undefined) {
    metrics.push({
      label: 'Освещённость',
      value: `${Math.round(reading.light)} lux`,
      note: 'Датчик BH1750',
      icon: dashboardIcons.metricUv,
    });
  }
  if (reading.pressure !== undefined) {
    metrics.push({
      label: 'Давление',
      value: `${reading.pressure} мм`,
      note: 'мм рт. ст.',
      icon: dashboardIcons.metricPressure,
    });
  }

  const air = analyzeAirEnvironment(reading);
  if (air.status !== 'unknown') {
    metrics.push({
      label: 'ATMO Air Score',
      value: `${air.score}/100`,
      note: sensorStatusLabel(air.status),
      icon: dashboardIcons.metricAir,
    });
  }
  if (reading.windSpeed !== undefined) {
    metrics.push({
      label: 'Ветер',
      value: `${reading.windSpeed} м/с`,
      note: reading.windDirection ?? '—',
      icon: dashboardIcons.metricWind,
    });
  }
  if (reading.rain !== undefined || reading.rainProbability !== undefined) {
    metrics.push({
      label: 'Осадки',
      value: reading.rain ? 'Датчик влажный' : reading.rainProbability !== undefined ? `${reading.rainProbability}%` : 'Сухо',
      note: reading.rainProbability !== undefined ? 'Вероятность' : 'Локальный датчик',
      icon: dashboardIcons.metricRain,
    });
  }
  return metrics;
}

export function buildDashboardRecommendations(
  recommendation: RecommendationResult,
): Recommendation[] {
  return [
    recommendationItem('Что надеть', recommendation.wear, dashboardIcons.recWear),
    recommendationItem('Чего ожидать', recommendation.expect, dashboardIcons.recExpect),
    recommendationItem('Что стоит делать', recommendation.do, dashboardIcons.recDo),
    recommendationItem('Чего стоит избегать', recommendation.avoid, dashboardIcons.recAvoid),
    {
      title: 'Когда лучше вернуться',
      value: recommendation.outdoorTime.returnAdvice,
      icon: dashboardIcons.recReturn,
      extraCount: recommendation.outdoorTime.worseningNote ? 1 : undefined,
      allValues: [
        recommendation.outdoorTime.returnAdvice,
        ...(recommendation.outdoorTime.worseningNote
          ? [recommendation.outdoorTime.worseningNote]
          : []),
      ],
    },
  ];
}

export type DashboardViewModel = {
  comfortIndex: number;
  status: string;
  conclusion: string;
  shouldGoOutTitle: string;
  shouldGoOutSubtitle: string;
  shouldGoOutExplanation: string;
  safeTime: string;
  returnAdvice: string;
  worseningNote?: string;
  updatedAt: string;
  recommendations: Recommendation[];
  metrics: Metric[];
};

export function buildDashboardView(
  reading: DeviceReading,
  recommendation: RecommendationResult,
): DashboardViewModel {
  return {
    comfortIndex: recommendation.comfortIndex,
    status: comfortStatusLabel(recommendation.status),
    conclusion: recommendation.conclusion,
    shouldGoOutTitle: recommendation.shouldGoOut.title,
    shouldGoOutSubtitle: recommendation.shouldGoOut.subtitle,
    shouldGoOutExplanation: recommendation.shouldGoOut.explanation,
    safeTime: recommendation.outdoorTime.safeTime,
    returnAdvice: recommendation.outdoorTime.returnAdvice,
    worseningNote: recommendation.outdoorTime.worseningNote,
    updatedAt: formatDashboardUpdatedAt(recommendation.updatedAt),
    recommendations: buildDashboardRecommendations(recommendation),
    metrics: buildDashboardMetrics(reading),
  };
}
