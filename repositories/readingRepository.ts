import { apiGet } from '../api/apiClient';
import { safeMapReadingDto, safeMapReadingDtoList } from '../api/mappers';
import { isApiMode, isLiveMode } from '../config/appConfig';
import { MOCK_READINGS } from '../data/mockReadings';
import type { ReadingDto } from '../types/api';
import type { DeviceReading } from '../types/reading';

export type ReadingRepository = {
  getLatestReadingForDevice: (deviceId: string) => Promise<DeviceReading | null>;
  getReadingsForDevice: (deviceId: string) => Promise<DeviceReading[]>;
};

function sortReadingsNewestFirst(readings: DeviceReading[]): DeviceReading[] {
  return [...readings].sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export const mockReadingRepository: ReadingRepository = {
  async getLatestReadingForDevice(deviceId: string) {
    const readings = MOCK_READINGS.filter((reading) => reading.deviceId === deviceId);
    return sortReadingsNewestFirst(readings)[0] ?? null;
  },

  async getReadingsForDevice(deviceId: string) {
    return sortReadingsNewestFirst(
      MOCK_READINGS.filter((reading) => reading.deviceId === deviceId),
    );
  },
};

export const apiReadingRepository: ReadingRepository = {
  async getLatestReadingForDevice(deviceId: string) {
    const result = await apiGet<ReadingDto>(
      `/devices/${encodeURIComponent(deviceId)}/readings/latest`,
    );
    if (!result.ok) {
      return null;
    }
    return safeMapReadingDto(result.data);
  },

  async getReadingsForDevice(deviceId: string) {
    const result = await apiGet<ReadingDto[]>(
      `/devices/${encodeURIComponent(deviceId)}/readings`,
    );
    if (!result.ok) {
      return [];
    }
    return sortReadingsNewestFirst(safeMapReadingDtoList(result.data));
  },
};

export const liveReadingRepository: ReadingRepository = {
  async getLatestReadingForDevice() {
    return null;
  },

  async getReadingsForDevice() {
    return [];
  },
};

export const readingRepository: ReadingRepository = isApiMode
  ? apiReadingRepository
  : isLiveMode
    ? liveReadingRepository
    : mockReadingRepository;
