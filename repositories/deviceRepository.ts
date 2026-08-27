import { apiGet } from '../api/apiClient';
import { safeMapDeviceDto, safeMapDeviceDtoList } from '../api/mappers';
import { isApiMode, isLiveMode } from '../config/appConfig';
import { LIVE_ATMO_STATION } from '../data/liveStation';
import { MOCK_DEVICES } from '../data/mockDevices';
import type { DeviceDto } from '../types/api';
import type { AtmoDevice } from '../types/device';

export type DeviceRepository = {
  getDevices: () => Promise<AtmoDevice[]>;
  getDeviceById: (deviceId: string) => Promise<AtmoDevice | null>;
};

export const mockDeviceRepository: DeviceRepository = {
  async getDevices() {
    return [...MOCK_DEVICES];
  },

  async getDeviceById(deviceId: string) {
    return MOCK_DEVICES.find((device) => device.id === deviceId) ?? null;
  },
};

export const liveDeviceRepository: DeviceRepository = {
  async getDevices() {
    return [{ ...LIVE_ATMO_STATION }];
  },

  async getDeviceById(deviceId: string) {
    return deviceId === LIVE_ATMO_STATION.id ? { ...LIVE_ATMO_STATION } : null;
  },
};

export const apiDeviceRepository: DeviceRepository = {
  async getDevices() {
    const result = await apiGet<DeviceDto[]>('/devices');
    if (!result.ok) {
      return [];
    }
    return safeMapDeviceDtoList(result.data);
  },

  async getDeviceById(deviceId: string) {
    const result = await apiGet<DeviceDto>(`/devices/${encodeURIComponent(deviceId)}`);
    if (!result.ok) {
      return null;
    }
    return safeMapDeviceDto(result.data);
  },
};

export const deviceRepository: DeviceRepository = isApiMode
  ? apiDeviceRepository
  : isLiveMode
    ? liveDeviceRepository
    : mockDeviceRepository;
