import type { DeviceReading } from '../types/reading';
import { isRainDetected } from './sensorAnalysisService';

const CHANNEL_ID = process.env.EXPO_PUBLIC_THINGSPEAK_CHANNEL_ID?.trim() || '3449460';
const READ_API_KEY = process.env.EXPO_PUBLIC_THINGSPEAK_READ_API_KEY?.trim() || '';

// Production: proxy private ThingSpeak requests through backend.
// Expo public variables are bundled into the app and must not contain long-lived secrets.

export type AtmoData = {
  entryId?: number;
  temperature?: number;
  humidity?: number;
  light?: number;
  rainRaw?: number;
  mq135?: number;
  mq2?: number;
  mq7?: number;
  mq8?: number;
  updatedAt: string;
};

type ThingSpeakFeed = Record<`field${number}`, string | null> & {
  entry_id?: number;
  created_at?: string;
};

function parseField(value: string | null | undefined): number | undefined {
  if (value === null || value === undefined || value.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function logThingSpeakError(
  message: string,
  status: number | undefined,
  responseBody: string | undefined,
): void {
  if (!__DEV__) {
    return;
  }

  console.error('[ATMO] ThingSpeak request failed', {
    message,
    httpStatus: status ?? 'unavailable',
    responseBody: responseBody ?? 'unavailable',
    channelIdPresent: CHANNEL_ID.length > 0,
    readApiKeyConfigured: READ_API_KEY.length > 0,
  });
}

function throwThingSpeakError(
  message: string,
  status: number | undefined,
  responseBody: string | undefined,
): never {
  logThingSpeakError(message, status, responseBody);
  throw new Error(message);
}

export async function getAtmoData(): Promise<AtmoData> {
  let url = `https://api.thingspeak.com/channels/${encodeURIComponent(CHANNEL_ID)}/feeds/last.json`;

  if (READ_API_KEY) {
    url += `?api_key=${encodeURIComponent(READ_API_KEY)}`;
  }

  let response: Response;
  try {
    response = await fetch(url);
  } catch (error) {
    logThingSpeakError(
      error instanceof Error ? error.message : 'ThingSpeak network request failed',
      undefined,
      undefined,
    );
    throw error;
  }

  let responseBody: string;
  try {
    responseBody = await response.text();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось прочитать ответ ThingSpeak';
    throwThingSpeakError(message, response.status, undefined);
  }

  if (!response.ok) {
    throwThingSpeakError(`Ошибка ThingSpeak: ${response.status}`, response.status, responseBody);
  }

  let json: unknown;
  try {
    json = JSON.parse(responseBody);
  } catch {
    throwThingSpeakError('ThingSpeak вернул некорректный JSON', response.status, responseBody);
  }

  if (!json || typeof json !== 'object') {
    throwThingSpeakError(
      'ThingSpeak не вернул корректное измерение',
      response.status,
      responseBody,
    );
  }
  const feed = json as ThingSpeakFeed;
  if (!feed.created_at || Number.isNaN(new Date(feed.created_at).getTime())) {
    throwThingSpeakError(
      'ThingSpeak не вернул время измерения',
      response.status,
      responseBody,
    );
  }

  const data: AtmoData = {
    entryId: feed.entry_id,
    temperature: parseField(feed.field1),
    humidity: parseField(feed.field2),
    light: parseField(feed.field3),
    rainRaw: parseField(feed.field4),
    mq135: parseField(feed.field5),
    mq2: parseField(feed.field6),
    mq7: parseField(feed.field7),
    mq8: parseField(feed.field8),
    updatedAt: feed.created_at,
  };

  const hasSensorValue = Object.entries(data).some(
    ([key, value]) => key !== 'entryId' && key !== 'updatedAt' && typeof value === 'number',
  );
  if (!hasSensorValue) {
    throwThingSpeakError(
      'ThingSpeak не вернул значения сенсоров',
      response.status,
      responseBody,
    );
  }

  return data;
}

export function convertThingSpeakToReading(
  data: AtmoData,
  deviceId: string,
): DeviceReading {
  const rainDetected = isRainDetected(data.rainRaw);

  return {
    id: `thingspeak-${data.entryId ?? data.updatedAt}`,
    deviceId,
    temperature: data.temperature,
    humidity: data.humidity,
    light: data.light,
    rainRaw: data.rainRaw,
    rain: rainDetected,
    mq135: data.mq135,
    mq2: data.mq2,
    mq7: data.mq7,
    mq8: data.mq8,
    createdAt: data.updatedAt,
  };
}
