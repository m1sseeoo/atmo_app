import type { AtmoDevice } from '../types/device';
import type { HistoryItem, HistoryItemType } from '../types/history';
import type { AtmoLocation } from '../types/location';
import type { DeviceReading } from '../types/reading';
import type { ComfortStatus, RecommendationResult } from '../types/recommendation';
import { storageGetItem, storageRemoveItem, storageSetItem } from './storageAdapter';

export const HISTORY_STORAGE_KEY = 'atmo:history';

const MAX_HISTORY_ITEMS = 50;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

const HISTORY_ITEM_TYPES: HistoryItemType[] = ['comfort_check', 'route_check', 'device_check'];

const COMFORT_STATUSES: ComfortStatus[] = [
  'условия комфортные',
  'условия средние',
  'желательна осторожность',
  'рекомендуется сократить пребывание',
  'лучше перенести выход',
];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isValidHistoryItem(data: unknown): data is HistoryItem {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const item = data as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    HISTORY_ITEM_TYPES.includes(item.type as HistoryItemType) &&
    typeof item.title === 'string' &&
    typeof item.locationLabel === 'string' &&
    (item.deviceId === null || typeof item.deviceId === 'string') &&
    isFiniteNumber(item.comfortIndex) &&
    typeof item.status === 'string' &&
    COMFORT_STATUSES.includes(item.status as ComfortStatus) &&
    typeof item.summary === 'string' &&
    (item.temperature === null || isFiniteNumber(item.temperature)) &&
    (item.humidity === null || isFiniteNumber(item.humidity)) &&
    (item.airQuality === null || isFiniteNumber(item.airQuality)) &&
    typeof item.createdAt === 'string'
  );
}

function parseHistoryItems(raw: string): HistoryItem[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isValidHistoryItem);
}

async function persistHistoryItems(items: HistoryItem[]): Promise<void> {
  await storageSetItem(HISTORY_STORAGE_KEY, JSON.stringify(items));
}

function generateHistoryId(): string {
  return `hist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function isDuplicateEntry(
  input: Omit<HistoryItem, 'id' | 'createdAt'>,
  existing: HistoryItem[],
): boolean {
  const now = Date.now();

  return existing.some((item) => {
    if (item.locationLabel !== input.locationLabel) {
      return false;
    }
    if (item.deviceId !== input.deviceId) {
      return false;
    }

    const createdAt = new Date(item.createdAt).getTime();
    if (Number.isNaN(createdAt)) {
      return false;
    }

    return now - createdAt < DUPLICATE_WINDOW_MS;
  });
}

export function formatHistoryDate(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const time = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (dateStart.getTime() === todayStart.getTime()) {
    return `Сегодня, ${time}`;
  }

  if (dateStart.getTime() === yesterdayStart.getTime()) {
    return `Вчера, ${time}`;
  }

  const dayMonth = date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  });

  return `${dayMonth}, ${time}`;
}

export function createHistoryItemFromCurrentState(params: {
  location: AtmoLocation | null;
  device: AtmoDevice | null;
  reading: DeviceReading | null;
  recommendation: RecommendationResult | null;
  profileCity?: string | null;
}): Omit<HistoryItem, 'id' | 'createdAt'> | null {
  const { location, device, reading, recommendation, profileCity } = params;

  if (!reading || !recommendation) {
    return null;
  }

  const locationLabel = location?.label ?? profileCity?.trim() ?? 'Не выбрано';
  const title = location ? `Проверка: ${location.label}` : 'Проверка условий';

  return {
    type: 'comfort_check',
    title,
    locationLabel,
    deviceId: device?.id ?? null,
    comfortIndex: recommendation.comfortIndex,
    status: recommendation.status,
    summary: recommendation.shouldGoOut.title || recommendation.conclusion,
    temperature: reading.temperature ?? null,
    humidity: reading.humidity ?? null,
    airQuality: null,
  };
}

export async function getHistoryItems(): Promise<HistoryItem[]> {
  try {
    const raw = await storageGetItem(HISTORY_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const items = parseHistoryItems(raw);
    return items.sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    );
  } catch (error) {
    console.warn('ATMO: failed to load history', error);
    return [];
  }
}

export async function saveHistoryItem(item: HistoryItem): Promise<void> {
  const existing = await getHistoryItems();
  const withoutCurrent = existing.filter((entry) => entry.id !== item.id);
  const next = [item, ...withoutCurrent]
    .sort(
      (left, right) =>
        new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
    )
    .slice(0, MAX_HISTORY_ITEMS);

  await persistHistoryItems(next);
}

export async function addHistoryItem(
  input: Omit<HistoryItem, 'id' | 'createdAt'>,
): Promise<HistoryItem | null> {
  const existing = await getHistoryItems();

  if (isDuplicateEntry(input, existing)) {
    return null;
  }

  const item: HistoryItem = {
    ...input,
    id: generateHistoryId(),
    createdAt: new Date().toISOString(),
  };

  const next = [item, ...existing].slice(0, MAX_HISTORY_ITEMS);
  await persistHistoryItems(next);
  return item;
}

export async function deleteHistoryItem(id: string): Promise<void> {
  const existing = await getHistoryItems();
  const next = existing.filter((item) => item.id !== id);
  await persistHistoryItems(next);
}

export async function clearHistory(): Promise<void> {
  await storageRemoveItem(HISTORY_STORAGE_KEY);
}
