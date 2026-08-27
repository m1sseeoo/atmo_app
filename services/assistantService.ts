import type { AssistantIntent } from '../types/assistant';
import type { AtmoDevice, DeviceStatus } from '../types/device';
import type { AtmoLocation } from '../types/location';
import type { UserProfile } from '../types/profile';
import type { DeviceReading } from '../types/reading';
import type { RecommendationResult } from '../types/recommendation';
import { appConfig } from '../config/appConfig';
import { analyzeAirEnvironment, sensorStatusLabel } from './sensorAnalysisService';

const NO_DATA_REPLY =
  'Пока нет свежих данных от станции. Выберите место или станцию, чтобы я смог дать рекомендацию.';

const UNKNOWN_REPLY =
  'Я могу помочь с условиями на улице: стоит ли выходить, что надеть, насколько комфортно сейчас, когда лучше вернуться или что показывает ближайшая станция.';

const LOCATION_NOTE =
  'Место не выбрано, поэтому я использую данные текущей выбранной станции.';

function normalizeMessage(message: string): string {
  return message.toLowerCase().trim();
}

function matchesAny(text: string, keywords: string[]): boolean {
  return keywords.some((keyword) => text.includes(keyword));
}

export function formatList(items: string[], fallback: string): string {
  const filtered = items.map((item) => item.trim()).filter((item) => item.length > 0);
  if (filtered.length === 0) {
    return fallback;
  }
  return filtered.join(', ');
}

function deviceStatusLabel(status: DeviceStatus): string {
  switch (status) {
    case 'online':
      return 'онлайн';
    case 'delayed':
      return 'задержка обновления';
    case 'offline':
      return 'оффлайн';
    default:
      return status;
  }
}

function appendLocationNote(
  reply: string,
  selectedLocation: AtmoLocation | null | undefined,
): string {
  if (selectedLocation) {
    return reply;
  }
  return `${reply}\n\n${LOCATION_NOTE}`;
}

function formatWind(reading: DeviceReading): string {
  if (reading.windSpeed === undefined) {
    return 'ветер: нет данных';
  }
  return `ветер ${reading.windSpeed} м/с`;
}

export function detectAssistantIntent(message: string): AssistantIntent {
  const text = normalizeMessage(message);

  if (
    matchesAny(text, ['надеть', 'одеть', 'одеться', 'одежда', 'кепка']) ||
    (text.includes('взять') && !matchesAny(text, ['дождь', 'осадки', 'мокро']))
  ) {
    return 'what_to_wear';
  }

  if (
    matchesAny(text, ['стоит ли', 'идти', 'выйти', 'гулять', 'прогулка', 'наружу', 'на улицу'])
  ) {
    return 'should_go_out';
  }

  if (matchesAny(text, ['комфорт', 'комфортно', 'индекс', 'условия', 'нормально'])) {
    return 'comfort';
  }

  if (matchesAny(text, ['когда', 'вернуться', 'позже', 'сколько', 'время', 'лучше'])) {
    return 'when_better';
  }

  if (matchesAny(text, ['погода', 'сводка', 'что сейчас', 'температура', 'влажность', 'ветер'])) {
    return 'weather_summary';
  }

  if (matchesAny(text, ['воздух', 'aqi', 'качество воздуха', 'загрязнение', 'смог'])) {
    return 'air_quality';
  }


  if (matchesAny(text, ['дождь', 'осадки', 'зонт', 'мокро'])) {
    return 'rain';
  }

  if (matchesAny(text, ['станция', 'датчик', 'устройство', 'atmo-', 'обновление'])) {
    return 'device';
  }

  return 'unknown';
}

function replyShouldGoOut(recommendation: RecommendationResult): string {
  const { shouldGoOut, outdoorTime } = recommendation;
  return `${shouldGoOut.title} ${shouldGoOut.subtitle} ${shouldGoOut.explanation} Рекомендуемое время на улице: ${outdoorTime.safeTime}.`;
}

function replyWhatToWear(recommendation: RecommendationResult): string {
  const wear = formatList(recommendation.wear, 'удобная одежда');
  return `Лучше выбрать: ${wear}. Это связано с текущими условиями и индексом комфорта.`;
}

function replyComfort(recommendation: RecommendationResult): string {
  const reasons = formatList(recommendation.reasons, 'текущие показатели окружающей среды');
  return `Сейчас индекс комфорта ${recommendation.comfortIndex}/100: ${recommendation.status}. ${recommendation.conclusion} Основные факторы: ${reasons}.`;
}

function replyWhenBetter(recommendation: RecommendationResult): string {
  const { outdoorTime } = recommendation;
  const note = outdoorTime.worseningNote ? ` ${outdoorTime.worseningNote}` : '';
  return `Рекомендуемое время на улице: ${outdoorTime.safeTime}. ${outdoorTime.returnAdvice}${note}`;
}

function replyWeatherSummary(reading: DeviceReading): string {
  const parts: string[] = [];
  if (reading.temperature !== undefined) parts.push(`температура ${reading.temperature.toFixed(1)}°C`);
  if (reading.humidity !== undefined) parts.push(`влажность ${reading.humidity}%`);
  if (reading.pressure !== undefined) parts.push(`давление ${reading.pressure} мм`);
  if (reading.light !== undefined) parts.push(`освещённость ${reading.light} lux`);
  if (reading.windSpeed !== undefined) parts.push(formatWind(reading));
  const air = analyzeAirEnvironment(reading);
  if (air.status !== 'unknown') parts.push(`ATMO Air Score ${air.score}/100 (${sensorStatusLabel(air.status).toLowerCase()})`);
  return parts.length > 0 ? `Сейчас: ${parts.join(', ')}.` : 'От станции пока нет доступных измерений.';
}

function replyAirQuality(reading: DeviceReading): string {
  const air = analyzeAirEnvironment(reading);
  if (air.status === 'unknown') return 'Нет данных MQ-датчиков. ATMO не подменяет их фальшивым AQI.';
  const caution = air.status === 'normal' ? '' : ' Лучше выбрать спокойный маршрут и свериться с официальными данными.';
  return `ATMO Air Score ${air.score}/100: ${sensorStatusLabel(air.status).toLowerCase()}. Это относительный анализ RAW ADC, не AQI и не ppm.${caution}`;
}

function replyRain(reading: DeviceReading): string {
  if (reading.rain) {
    return 'Сейчас есть осадки. Возьмите зонт или выберите маршрут с укрытиями.';
  }
  if (reading.rainProbability !== undefined && reading.rainProbability >= 40) {
    return `Вероятность осадков ${reading.rainProbability}%. Лучше взять зонт или проверить условия перед выходом.`;
  }
  if (reading.rainProbability !== undefined) return `Вероятность осадков сейчас ${reading.rainProbability}%.`;
  if (reading.rain === false) return 'Локальный датчик сейчас сухой. Это не прогноз осадков.';
  return 'Данных датчика дождя нет.';
}

function replyDevice(device: AtmoDevice): string {
  const signal =
    device.signal === null ? 'сигнал: нет данных' : `сигнал ${device.signal}%`;
  return `Станция ${device.name}: статус ${deviceStatusLabel(device.status)}, батарея ${device.battery}%, ${signal}. Последнее обновление: ${device.lastUpdated}.`;
}

function intentNeedsRecommendation(intent: AssistantIntent): boolean {
  return (
    intent === 'should_go_out' ||
    intent === 'what_to_wear' ||
    intent === 'comfort' ||
    intent === 'when_better'
  );
}

function intentNeedsReading(intent: AssistantIntent): boolean {
  return (
    intent === 'weather_summary' ||
    intent === 'air_quality' ||
    intent === 'rain' ||
    intentNeedsRecommendation(intent)
  );
}

export type AssistantReplyParams = {
  message: string;
  profile?: UserProfile | null;
  selectedLocation?: AtmoLocation | null;
  selectedDevice?: AtmoDevice | null;
  reading?: DeviceReading | null;
  recommendation?: RecommendationResult | null;
};

export function generateLocalAssistantReply(params: AssistantReplyParams): string {
  const { message, selectedLocation, selectedDevice, reading, recommendation } = params;
  const intent = detectAssistantIntent(message);

  if (intent === 'unknown') {
    return UNKNOWN_REPLY;
  }

  if (intent === 'device') {
    if (!selectedDevice) {
      return 'Станция не выбрана. Выберите устройство на карте или на главной странице.';
    }
    return appendLocationNote(replyDevice(selectedDevice), selectedLocation);
  }

  if (intentNeedsReading(intent) && !reading) {
    return NO_DATA_REPLY;
  }

  if (intentNeedsRecommendation(intent) && !recommendation) {
    return NO_DATA_REPLY;
  }

  let reply: string;

  switch (intent) {
    case 'should_go_out':
      reply = replyShouldGoOut(recommendation as RecommendationResult);
      break;
    case 'what_to_wear':
      reply = replyWhatToWear(recommendation as RecommendationResult);
      break;
    case 'comfort':
      reply = replyComfort(recommendation as RecommendationResult);
      break;
    case 'when_better':
      reply = replyWhenBetter(recommendation as RecommendationResult);
      break;
    case 'weather_summary':
      reply = replyWeatherSummary(reading as DeviceReading);
      break;
    case 'air_quality':
      reply = replyAirQuality(reading as DeviceReading);
      break;
    case 'rain':
      reply = replyRain(reading as DeviceReading);
      break;
    default:
      reply = UNKNOWN_REPLY;
  }

  return appendLocationNote(reply, selectedLocation);
}

function readRemoteReply(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || !('reply' in payload)) return null;
  const reply = (payload as { reply?: unknown }).reply;
  return typeof reply === 'string' && reply.trim() ? reply.trim() : null;
}

export async function generateAssistantReply(params: AssistantReplyParams): Promise<string> {
  const fallback = () => generateLocalAssistantReply(params);
  if (!appConfig.apiBaseUrl) return fallback();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${appConfig.apiBaseUrl.replace(/\/$/, '')}/api/assistant`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        message: params.message,
        environment: params.reading ?? undefined,
        analysis: params.recommendation ?? undefined,
        profile: params.profile ?? undefined,
        location: params.selectedLocation?.label,
      }),
    });
    if (!response.ok) return fallback();
    return readRemoteReply(await response.json()) ?? fallback();
  } catch {
    return fallback();
  } finally {
    clearTimeout(timeout);
  }
}
