import type { ComfortFactorImpact, ComfortIndexResult } from '../types/comfort';
import type { AtmoLocation } from '../types/location';
import type { UserProfile } from '../types/profile';
import type { DeviceReading } from '../types/reading';
import type {
  OutdoorTimeAdvice,
  RecommendationResult,
  ShouldGoOutAdvice,
} from '../types/recommendation';
import { calculateComfortIndex } from './comfortService';
import { analyzeAirEnvironment, sensorStatusLabel } from './sensorAnalysisService';

function hasFactor(profile: UserProfile | null | undefined, factor: string): boolean {
  return profile?.factors.includes(factor) ?? false;
}

export function uniqueList(items: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const item of items) {
    const trimmed = item.trim();
    const key = trimmed.toLowerCase();
    if (!trimmed || seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push(trimmed);
  }

  return result;
}

export function limitList(items: string[], limit: number): string[] {
  return items.slice(0, limit);
}

export function formatUpdatedAt(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '10:30';
  }
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

function capitalizeStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function getShouldGoOutAdvice(
  score: number,
  factors: ComfortFactorImpact[],
): ShouldGoOutAdvice {
  if (score >= 81) {
    return {
      title: 'Да, можно выходить.',
      subtitle: 'Условия стабильные.',
      explanation:
        'Доступные измерения не показывают выраженных факторов дискомфорта.',
    };
  }

  if (score >= 66) {
    const factorLabels = factors
      .slice(0, 2)
      .map((factor) => factor.label.toLowerCase())
      .join(' и ');

    return {
      title: 'Да, но с небольшими ограничениями.',
      subtitle: 'Есть факторы, на которые стоит обратить внимание.',
      explanation: factorLabels
        ? `Условия в целом нормальные, но стоит учитывать ${factorLabels}.`
        : 'Условия в целом нормальные, но стоит учитывать текущие показатели.',
    };
  }

  if (score >= 46) {
    return {
      title: 'Можно выйти, но лучше сократить время на улице.',
      subtitle: 'Возможен дискомфорт.',
      explanation:
        'Некоторые показатели отличаются от комфортного диапазона. Лучше делать перерывы и следить за временем пребывания.',
    };
  }

  if (score >= 26) {
    return {
      title: 'Лучше сократить пребывание на улице.',
      subtitle: 'Условия менее комфортные.',
      explanation:
        'Если выход необходим, выбирайте короткий маршрут и избегайте активной нагрузки.',
    };
  }

  return {
    title: 'Лучше перенести выход.',
    subtitle: 'Условия сейчас неблагоприятные для длительного пребывания.',
    explanation:
      'Рекомендуется выбрать более комфортное время или сократить выход до минимума.',
  };
}

export function getOutdoorTimeAdvice(
  score: number,
  reading: DeviceReading,
): OutdoorTimeAdvice {
  let safeTime = '1 ч 30 мин';
  let returnAdvice = 'Можно планировать обычную прогулку.';

  if (score >= 81) {
    safeTime = '1 ч 30 мин';
    returnAdvice = 'Можно планировать обычную прогулку.';
  } else if (score >= 66) {
    safeTime = '1 ч 00 мин';
    returnAdvice = 'Лучше вернуться или сделать перерыв примерно через час.';
  } else if (score >= 46) {
    safeTime = '40 мин';
    returnAdvice = 'Лучше делать перерывы и не задерживаться надолго.';
  } else if (score >= 26) {
    safeTime = '20–30 мин';
    returnAdvice = 'Лучше сократить выход до короткого маршрута.';
  } else {
    safeTime = 'до 15 мин';
    returnAdvice = 'Лучше перенести выход или выйти только при необходимости.';
  }

  let worseningNote = 'Существенного ухудшения не ожидается.';

  if (reading.uvIndex !== undefined && reading.uvIndex >= 6) {
    worseningNote = 'Солнечная нагрузка может ощущаться сильнее в ближайшее время.';
  } else if (reading.rainProbability !== undefined && reading.rainProbability >= 50) {
    worseningNote = 'Возможны осадки, лучше следить за обновлениями.';
  } else if (analyzeAirEnvironment(reading).status !== 'normal' && analyzeAirEnvironment(reading).status !== 'unknown') {
    worseningNote = 'Повышенный относительный уровень MQ-датчиков может снижать общий комфорт.';
  }

  return { safeTime, returnAdvice, worseningNote };
}

function buildWear(reading: DeviceReading): string[] {
  const items: string[] = [];

  if (reading.temperature !== undefined && reading.temperature <= 10) {
    items.push('тёплая одежда');
  } else if (reading.temperature !== undefined && reading.temperature <= 17) {
    items.push('ветровка');
  }

  if (reading.temperature !== undefined && reading.temperature >= 27) {
    items.push('лёгкая одежда');
  }
  if (reading.temperature !== undefined && reading.temperature >= 30) {
    items.push('дышащая одежда');
  }

  if (reading.uvIndex !== undefined && reading.uvIndex >= 3) {
    items.push('головной убор');
  }
  if (reading.uvIndex !== undefined && reading.uvIndex >= 5) {
    items.push('защита от солнца');
  }
  if (reading.uvIndex !== undefined && reading.uvIndex >= 7) {
    items.push('закрытая одежда');
  }

  if (reading.rain || (reading.rainProbability !== undefined && reading.rainProbability >= 40)) {
    items.push('зонт');
  }

  if (reading.windSpeed !== undefined && reading.windSpeed >= 7) {
    items.push('ветровка');
  }

  if (items.length === 0) {
    items.push('удобная лёгкая одежда');
  }

  return limitList(uniqueList(items), 5);
}

function buildExpect(reading: DeviceReading): string[] {
  const items: string[] = [];

  if (reading.rain) {
    items.push('возможен дождь');
  } else if (reading.rainProbability !== undefined && reading.rainProbability >= 40) {
    items.push('вероятность осадков');
  }

  if (reading.humidity !== undefined && reading.humidity > 65) {
    items.push('повышенная влажность');
  } else if (reading.humidity !== undefined && reading.humidity < 30) {
    items.push('сухой воздух');
  }

  if (reading.pressure !== undefined && (reading.pressure < 745 || reading.pressure > 760)) {
    items.push('перепады давления');
  }

  if (['elevated', 'high'].includes(analyzeAirEnvironment(reading).status)) {
    items.push('повышенный относительный уровень воздушной среды');
  }

  if (reading.uvIndex !== undefined && reading.uvIndex >= 5) {
    items.push('повышенная солнечная нагрузка');
  }

  if (reading.windSpeed !== undefined && reading.windSpeed >= 7) {
    items.push('усиление ветра');
  }

  if (items.length === 0) {
    items.push('условия стабильные');
  }

  return limitList(uniqueList(items), 5);
}

function buildDo(reading: DeviceReading, score: number): string[] {
  const items: string[] = [];

  if ((reading.temperature !== undefined && reading.temperature >= 27) || (reading.uvIndex !== undefined && reading.uvIndex >= 5)) {
    items.push('взять воду');
  }
  if (reading.uvIndex !== undefined && reading.uvIndex >= 5) {
    items.push('выбирать тень');
  }
  if (score < 66) {
    items.push('чаще делать перерывы');
  }
  if (score < 50) {
    items.push('сократить маршрут');
  }
  if (['elevated', 'high'].includes(analyzeAirEnvironment(reading).status)) {
    items.push('избегать активной нагрузки');
  }
  if (reading.windSpeed !== undefined && reading.windSpeed >= 7) {
    items.push('следить за ветром');
  }
  if (reading.rainProbability !== undefined && reading.rainProbability >= 40) {
    items.push('проверить осадки перед выходом');
  }

  if (items.length === 0) {
    items.push('можно планировать обычную прогулку');
  }

  return limitList(uniqueList(items), 5);
}

function buildAvoid(reading: DeviceReading, score: number): string[] {
  const items: string[] = [];

  if (score < 66) {
    items.push('долгих прогулок');
  }
  if (reading.uvIndex !== undefined && reading.uvIndex >= 6) {
    items.push('открытого солнца');
  }
  if (reading.temperature !== undefined && reading.temperature >= 30) {
    items.push('высокой физической нагрузки');
  }
  if (['elevated', 'high'].includes(analyzeAirEnvironment(reading).status)) {
    items.push('мест с ухудшенным воздухом');
  }
  if (score < 45) {
    items.push('длительного пребывания вне помещения');
  }
  if (reading.rain) {
    items.push('маршрутов без укрытий');
  }

  if (items.length === 0) {
    items.push('нет выраженных ограничений');
  }

  return limitList(uniqueList(items), 5);
}

function applyProfilePersonalization(
  reading: DeviceReading,
  score: number,
  profile: UserProfile | null | undefined,
  lists: {
    wear: string[];
    expect: string[];
    do: string[];
    avoid: string[];
  },
): void {
  if (!profile) {
    return;
  }

  if (profile.activityLevel === 'high') {
    if (reading.temperature !== undefined && reading.temperature >= 27) {
      lists.avoid.push('интенсивной нагрузки на жаре');
    }
    if (['elevated', 'high'].includes(analyzeAirEnvironment(reading).status)) {
      lists.do.push('снизить темп активности');
    }
  }

  if (profile.activityLevel === 'low' && score < 66) {
    lists.do.push('выбирать спокойный маршрут');
  }

  if (profile.weatherSensitivity === 'high' && score < 80) {
    lists.do.push('делать короткие перерывы в помещении');
    lists.avoid.push('резкой смены активности');
  }

  if (
    (hasFactor(profile, 'Перепады давления') || hasFactor(profile, 'Давление')) &&
    reading.pressure !== undefined &&
    (reading.pressure < 745 || reading.pressure > 760)
  ) {
    lists.expect.push('изменения давления');
    lists.do.push('планировать спокойный темп');
  }

  if (hasFactor(profile, 'Жара') && reading.temperature !== undefined && reading.temperature >= 27) {
    lists.do.push('выбирать тень');
    lists.avoid.push('долгого пребывания на солнце');
  }

  if (hasFactor(profile, 'Холод') && reading.temperature !== undefined && reading.temperature <= 17) {
    lists.wear.push('дополнительный слой одежды');
  }

  if (hasFactor(profile, 'Высокая влажность') && reading.humidity !== undefined && reading.humidity > 65) {
    lists.expect.push('ощущение духоты');
  }

  if (hasFactor(profile, 'Сухой воздух') && reading.humidity !== undefined && reading.humidity < 30) {
    lists.expect.push('сухой воздух');
  }

  if (
    (hasFactor(profile, 'Качество воздуха') || hasFactor(profile, 'Аллергия')) &&
    ['elevated', 'high'].includes(analyzeAirEnvironment(reading).status)
  ) {
    lists.avoid.push('мест с плотным трафиком');
  }

  if (hasFactor(profile, 'Солнце / УФ') && reading.uvIndex !== undefined && reading.uvIndex >= 5) {
    lists.wear.push('защита от солнца');
    lists.avoid.push('прямого солнца');
  }

  if (hasFactor(profile, 'Дождь') && (reading.rain || (reading.rainProbability !== undefined && reading.rainProbability >= 40))) {
    lists.wear.push('зонт');
  }
}

function buildReasons(
  comfort: ComfortIndexResult,
  reading: DeviceReading,
  location?: AtmoLocation | null,
): string[] {
  const reasons = [
    comfort.conclusion,
    capitalizeStatus(comfort.status),
    ...comfort.factors.slice(0, 3).map((factor) => factor.explanation),
  ];

  if (reading.temperature !== undefined) reasons.push(`Температура ${reading.temperature.toFixed(1)} °C.`);
  if (reading.humidity !== undefined) reasons.push(`Влажность ${reading.humidity}%.`);
  const air = analyzeAirEnvironment(reading);
  if (air.status !== 'unknown') reasons.push(`ATMO Air Score: ${air.score}/100. ${sensorStatusLabel(air.status)}.`);

  if (location) {
    reasons.push(`Локация: ${location.label}.`);
  }

  return uniqueList(reasons);
}

export function generateRecommendations(params: {
  reading: DeviceReading;
  comfort: ComfortIndexResult;
  profile?: UserProfile | null;
  location?: AtmoLocation | null;
}): RecommendationResult {
  const { reading, comfort, profile, location } = params;
  const score = comfort.score;

  const wear = buildWear(reading);
  const expect = buildExpect(reading);
  const doList = buildDo(reading, score);
  const avoid = buildAvoid(reading, score);

  applyProfilePersonalization(reading, score, profile, { wear, expect, do: doList, avoid });

  return {
    comfortIndex: comfort.score,
    status: comfort.status,
    conclusion: comfort.conclusion,
    shouldGoOut: getShouldGoOutAdvice(score, comfort.factors),
    outdoorTime: getOutdoorTimeAdvice(score, reading),
    wear: limitList(uniqueList(wear), 5),
    expect: limitList(uniqueList(expect), 5),
    do: limitList(uniqueList(doList), 5),
    avoid: limitList(uniqueList(avoid), 5),
    reasons: buildReasons(comfort, reading, location),
    updatedAt: formatUpdatedAt(reading.createdAt),
  };
}

export function getRecommendationForReading(
  reading: DeviceReading,
  profile?: UserProfile | null,
  location?: AtmoLocation | null,
): RecommendationResult {
  const comfort = calculateComfortIndex(reading, profile);
  return generateRecommendations({ reading, comfort, profile, location });
}

export function comfortStatusLabel(status: RecommendationResult['status']): string {
  return capitalizeStatus(status);
}

export { calculateComfortIndex };
