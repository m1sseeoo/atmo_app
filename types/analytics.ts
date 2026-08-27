export type AnalyticsMetric = {
  title: string;
  value: string;
  level: string;
  levelColor: string;
  explanation: string;
  color: string;
  points: number[];
};

export type HistorySeries = {
  label: string;
  color: string;
  points: number[];
};

export const TIME_RANGE_OPTIONS = ['24 ч', '7 дн.', '30 дн.'] as const;
export type TimeRange = (typeof TIME_RANGE_OPTIONS)[number];

export const MINI_CHART_LABELS = ['00:00', '06:00', '12:00', '18:00'] as const;

export const HISTORY_CHART_LABELS = [
  '00:00',
  '04:00',
  '08:00',
  '12:00',
  '16:00',
  '20:00',
  '24:00',
] as const;

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    title: 'Температура',
    value: '23,1 °C',
    level: 'Норма',
    levelColor: '#1688E8',
    explanation: 'Комфортная температура для прогулок.',
    color: '#1688E8',
    points: [20, 19, 21, 24, 23, 26, 25, 28],
  },
  {
    title: 'Влажность',
    value: '46 %',
    level: 'Комфортно',
    levelColor: '#22C55E',
    explanation: 'Оптимальный уровень влажности.',
    color: '#1688E8',
    points: [50, 48, 49, 45, 47, 55, 49, 46],
  },
  {
    title: 'Давление',
    value: '751 мм рт. ст.',
    level: 'Норма',
    levelColor: '#1688E8',
    explanation: 'Давление в пределах нормы.',
    color: '#1688E8',
    points: [742, 743, 748, 751, 754, 752, 748, 746],
  },
  {
    title: 'ATMO Air Score',
    value: '100/100',
    level: 'Хорошее',
    levelColor: '#22C55E',
    explanation: 'Демо: нормальный относительный уровень MQ-датчиков.',
    color: '#22C55E',
    points: [24, 23, 25, 27, 29, 28, 26, 28],
  },
  {
    title: 'Осадки',
    value: '0 мм',
    level: 'Без осадков',
    levelColor: '#1688E8',
    explanation: 'Осадков не ожидается.',
    color: '#1688E8',
    points: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    title: 'Освещённость',
    value: '420 lux',
    level: 'Демо',
    levelColor: '#1688E8',
    explanation: 'Демо-значение освещённости BH1750.',
    color: '#1688E8',
    points: [120, 180, 260, 340, 420, 390, 280, 160],
  },
];

export const historySeries: HistorySeries[] = [
  {
    label: 'Температура (°C)',
    color: '#1688E8',
    points: [18, 17, 19, 22, 25, 27, 26, 24, 22, 20, 19, 18, 17],
  },
  {
    label: 'Влажность (%)',
    color: '#22C55E',
    points: [52, 54, 50, 48, 45, 42, 44, 46, 48, 50, 51, 52, 53],
  },
  {
    label: 'Давление (мм рт. ст.)',
    color: '#F59E0B',
    points: [738, 740, 742, 745, 748, 751, 753, 752, 750, 748, 746, 745, 744],
  },
];
