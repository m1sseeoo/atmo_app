import type { AtmoDevice } from '../types/device';
import type {
  AtmoNotification,
  AtmoNotificationCategory,
  AtmoNotificationType,
} from '../types/notification';
import type { AtmoLocation } from '../types/location';
import type { DeviceReading } from '../types/reading';
import type { RecommendationResult } from '../types/recommendation';
import { analyzeAirEnvironment } from './sensorAnalysisService';
import { storageGetItem, storageRemoveItem, storageSetItem } from './storageAdapter';

export const NOTIFICATIONS_STORAGE_KEY = 'atmo:notifications';

const MAX_NOTIFICATIONS = 50;
const DUPLICATE_WINDOW_MS = 15 * 60 * 1000;

const NOTIFICATION_TYPES: AtmoNotificationType[] = ['info', 'warning', 'danger'];
const NOTIFICATION_CATEGORIES: AtmoNotificationCategory[] = [
  'air_quality',
  'uv',
  'rain',
  'comfort',
  'device',
  'general',
];

type NotificationDraft = Omit<AtmoNotification, 'id' | 'createdAt' | 'time' | 'read'>;

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isValidNotification(data: unknown): data is AtmoNotification {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const item = data as Record<string, unknown>;

  return (
    typeof item.id === 'string' &&
    typeof item.type === 'string' &&
    NOTIFICATION_TYPES.includes(item.type as AtmoNotificationType) &&
    typeof item.category === 'string' &&
    NOTIFICATION_CATEGORIES.includes(item.category as AtmoNotificationCategory) &&
    typeof item.title === 'string' &&
    isStringArray(item.body) &&
    typeof item.time === 'string' &&
    typeof item.createdAt === 'string' &&
    typeof item.read === 'boolean' &&
    (item.sourceDeviceId === undefined || typeof item.sourceDeviceId === 'string') &&
    (item.sourceLocationLabel === undefined || typeof item.sourceLocationLabel === 'string')
  );
}

function parseNotifications(raw: string): AtmoNotification[] {
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    return [];
  }

  return parsed.filter(isValidNotification);
}

function generateNotificationId(): string {
  return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function sortNotifications(items: AtmoNotification[]): AtmoNotification[] {
  return [...items].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function formatNotificationTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (dateStart.getTime() === todayStart.getTime()) {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }

  if (dateStart.getTime() === yesterdayStart.getTime()) {
    return 'Вчера';
  }

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
}

function buildNotification(
  input: NotificationDraft,
  createdAt: string,
): AtmoNotification {
  return {
    ...input,
    id: generateNotificationId(),
    createdAt,
    time: formatNotificationTime(createdAt),
    read: false,
  };
}

function getDedupeKey(notification: NotificationDraft): string {
  return [
    notification.category,
    notification.sourceDeviceId ?? '',
    notification.sourceLocationLabel ?? '',
  ].join('|');
}

function isDuplicateNotification(
  input: NotificationDraft,
  existing: AtmoNotification[],
): boolean {
  const key = getDedupeKey(input);
  const now = Date.now();

  return existing.some((item) => {
    if (getDedupeKey(item) !== key) {
      return false;
    }

    const createdAt = new Date(item.createdAt).getTime();
    if (Number.isNaN(createdAt)) {
      return false;
    }

    return now - createdAt < DUPLICATE_WINDOW_MS;
  });
}

function withSource(
  draft: NotificationDraft,
  device: AtmoDevice | null,
  location: AtmoLocation | null,
): NotificationDraft {
  return {
    ...draft,
    sourceDeviceId: device?.id,
    sourceLocationLabel: location?.label,
  };
}

function pushDraft(
  drafts: NotificationDraft[],
  draft: NotificationDraft,
  device: AtmoDevice | null,
  location: AtmoLocation | null,
): void {
  drafts.push(withSource(draft, device, location));
}

export function generateNotificationsFromState(params: {
  reading: DeviceReading | null;
  recommendation: RecommendationResult | null;
  selectedDevice: AtmoDevice | null;
  selectedLocation: AtmoLocation | null;
  previousReading?: DeviceReading | null;
  previousRecommendation?: RecommendationResult | null;
}): NotificationDraft[] {
  const {
    reading,
    recommendation,
    selectedDevice,
    selectedLocation,
    previousReading,
    previousRecommendation,
  } = params;

  const drafts: NotificationDraft[] = [];

  if (reading) {
    const airStatus = analyzeAirEnvironment(reading).status;
    if (airStatus === 'high') {
      pushDraft(
        drafts,
        {
          type: 'danger',
          category: 'air_quality',
          title: 'Высокий относительный уровень MQ-датчиков',
          body: [
            'Это относительный RAW-уровень, не AQI и не ppm.',
            'Лучше сократить длительное пребывание на улице.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    } else if (airStatus === 'elevated') {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'air_quality',
          title: 'Повышенный относительный уровень',
          body: [
            'MQ-датчики выше прототипного baseline.',
            'Планируйте маршрут заранее.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }

    if (reading.uvIndex !== undefined && reading.uvIndex >= 8) {
      pushDraft(
        drafts,
        {
          type: 'danger',
          category: 'uv',
          title: 'Высокий УФ-индекс',
          body: [
            'Солнечная нагрузка высокая.',
            'Лучше избегать долгого пребывания под прямым солнцем.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    } else if (reading.uvIndex !== undefined && reading.uvIndex >= 6) {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'uv',
          title: 'Повышенный УФ-индекс',
          body: [
            'Солнечная нагрузка повышена.',
            'Выбирайте тень и защиту от солнца.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }

    if (reading.rain) {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'rain',
          title: 'Начались осадки',
          body: [
            'Сейчас есть осадки.',
            'Возьмите зонт или выберите маршрут с укрытиями.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    } else if (reading.rainProbability !== undefined && reading.rainProbability >= 60) {
      pushDraft(
        drafts,
        {
          type: 'info',
          category: 'rain',
          title: 'Возможны осадки',
          body: [
            'Вероятность осадков повышена.',
            'Лучше проверить условия перед выходом.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }
  }

  if (recommendation) {
    if (recommendation.comfortIndex < 30) {
      pushDraft(
        drafts,
        {
          type: 'danger',
          category: 'comfort',
          title: 'Лучше перенести выход',
          body: [
            'Условия сейчас неблагоприятны для долгой прогулки.',
            'Выберите более комфортное время, если есть возможность.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    } else if (recommendation.comfortIndex < 50) {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'comfort',
          title: 'Условия стали менее комфортными',
          body: [
            'Индекс комфорта снизился.',
            'Лучше сократить длительное пребывание на улице.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }
  }

  if (selectedDevice?.status === 'offline') {
    pushDraft(
      drafts,
      {
        type: 'warning',
        category: 'device',
        title: 'Станция недоступна',
        body: [
          'Выбранная станция сейчас оффлайн.',
          'Данные могут быть недоступны или устаревшими.',
        ],
      },
      selectedDevice,
      selectedLocation,
    );
  } else if (selectedDevice?.status === 'delayed') {
    pushDraft(
      drafts,
      {
        type: 'info',
        category: 'device',
        title: 'Обновление данных задерживается',
        body: [
          'Станция обновлялась не сразу.',
          'ATMO использует последние доступные данные.',
        ],
      },
      selectedDevice,
      selectedLocation,
    );
  }

  if (previousReading && reading) {
    const previousAirStatus = analyzeAirEnvironment(previousReading).status;
    const nextAirStatus = analyzeAirEnvironment(reading).status;
    if ((previousAirStatus === 'normal' && nextAirStatus !== 'normal' && nextAirStatus !== 'unknown') || (previousAirStatus === 'elevated' && nextAirStatus === 'high')) {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'air_quality',
          title: 'Резкое ухудшение условий',
          body: [
            'Относительный уровень MQ-датчиков вырос по сравнению с прошлым обновлением.',
            'Планируйте маршрут заранее.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }
  }

  if (previousRecommendation && recommendation) {
    const comfortDrop = previousRecommendation.comfortIndex - recommendation.comfortIndex;
    if (comfortDrop >= 20) {
      pushDraft(
        drafts,
        {
          type: 'warning',
          category: 'comfort',
          title: 'Индекс комфорта снизился',
          body: [
            'Условия стали менее комфортными.',
            'Лучше пересмотреть время или маршрут.',
          ],
        },
        selectedDevice,
        selectedLocation,
      );
    }
  }

  return drafts;
}

export async function getNotifications(): Promise<AtmoNotification[]> {
  try {
    const raw = await storageGetItem(NOTIFICATIONS_STORAGE_KEY);
    if (!raw) {
      return [];
    }

    return sortNotifications(parseNotifications(raw));
  } catch (error) {
    console.warn('ATMO: failed to load notifications', error);
    return [];
  }
}

export async function saveNotifications(notifications: AtmoNotification[]): Promise<void> {
  const next = sortNotifications(notifications).slice(0, MAX_NOTIFICATIONS);
  await storageSetItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(next));
}

export async function addNotification(
  input: NotificationDraft,
): Promise<AtmoNotification | null> {
  const existing = await getNotifications();

  if (isDuplicateNotification(input, existing)) {
    return null;
  }

  const createdAt = new Date().toISOString();
  const item = buildNotification(input, createdAt);
  const next = [item, ...existing].slice(0, MAX_NOTIFICATIONS);
  await saveNotifications(next);
  return item;
}

export async function addNotifications(
  inputs: NotificationDraft[],
): Promise<AtmoNotification[]> {
  const existing = await getNotifications();
  const added: AtmoNotification[] = [];
  let next = existing;

  for (const input of inputs) {
    if (isDuplicateNotification(input, next)) {
      continue;
    }

    const createdAt = new Date().toISOString();
    const item = buildNotification(input, createdAt);
    next = [item, ...next].slice(0, MAX_NOTIFICATIONS);
    added.push(item);
  }

  if (added.length > 0) {
    await saveNotifications(next);
  }

  return added;
}

export async function markNotificationRead(id: string): Promise<void> {
  const existing = await getNotifications();
  const next = existing.map((item) =>
    item.id === id ? { ...item, read: true } : item,
  );
  await saveNotifications(next);
}

export async function markAllNotificationsRead(): Promise<void> {
  const existing = await getNotifications();
  const next = existing.map((item) => ({ ...item, read: true }));
  await saveNotifications(next);
}

export async function deleteNotification(id: string): Promise<void> {
  const existing = await getNotifications();
  const next = existing.filter((item) => item.id !== id);
  await saveNotifications(next);
}

export async function clearNotifications(): Promise<void> {
  await storageRemoveItem(NOTIFICATIONS_STORAGE_KEY);
}
