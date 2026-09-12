import { isMockMode } from '../config/appConfig';
import { MOCK_DEVICES } from '../data/mockDevices';
import { MOCK_READINGS } from '../data/mockReadings';
import { deviceRepository } from '../repositories/deviceRepository';
import { readingRepository } from '../repositories/readingRepository';
import type { AtmoDevice } from '../types/device';
import type { DeviceReading } from '../types/reading';

export async function fetchDevices(): Promise<AtmoDevice[]> {
  return deviceRepository.getDevices();
}

export async function fetchDeviceById(deviceId: string): Promise<AtmoDevice | null> {
  return deviceRepository.getDeviceById(deviceId);
}

export async function fetchLatestReadingForDevice(
  deviceId: string,
): Promise<DeviceReading | null> {
  return readingRepository.getLatestReadingForDevice(deviceId);
}

export async function fetchReadingsForDevice(deviceId: string): Promise<DeviceReading[]> {
  return readingRepository.getReadingsForDevice(deviceId);
}

/** Sync accessor for mock mode only. Prefer repository/async methods in new code. */
export function getDevices(): AtmoDevice[] {
  if (!isMockMode) {
    return [];
  }
  return MOCK_DEVICES;
}

/** Sync accessor for mock mode only. Prefer repository/async methods in new code. */
export function getDeviceById(deviceId: string): AtmoDevice | null {
  if (!isMockMode) {
    return null;
  }
  return MOCK_DEVICES.find((device) => device.id === deviceId) ?? null;
}

/** Sync accessor for mock mode only. Prefer repository/async methods in new code. */
export function getLatestReadingForDevice(deviceId: string): DeviceReading | null {
  if (!isMockMode) {
    return null;
  }
  return MOCK_READINGS.find((reading) => reading.deviceId === deviceId) ?? null;
}

export function getDefaultDeviceId(devices?: AtmoDevice[]): string {
  const list = devices ?? getDevices();
  const online = list.find((device) => device.status === 'online');
  return online?.id ?? list[0]?.id ?? 'ATMO-0547';
}

export { deviceRepository, readingRepository };
