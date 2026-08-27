import type { AdminDevice } from '../types/admin';
import type { AtmoDevice } from '../types/device';
import type { AtmoLocation } from '../types/location';
import type { DeviceReading } from '../types/reading';
import type { MapStation } from '../types/map';
import { analyzeAirEnvironment, sensorStatusLabel } from '../services/sensorAnalysisService';
import { getDeviceStatusLabel, formatSignalLabel } from '../services/adminService';
import { formatDistanceLabel, getDistanceKm } from '../services/locationService';
import { ASTANA_MOCK_BOUNDS, projectDeviceToMockMap } from './mapProjection';

function formatCharge(battery: number): string {
  return `${battery}%`;
}

function formatAdminDate(lastUpdated: string): string {
  return `24.05.2025 ${lastUpdated}`;
}

function mapAdminDeviceStatus(device: AtmoDevice): AdminDevice['status'] {
  if (device.status === 'online') {
    return 'online';
  }
  if (device.status === 'delayed') {
    return 'delayed';
  }
  return 'offline';
}

export function deviceToAdminDevice(device: AtmoDevice): AdminDevice {
  return {
    id: device.id,
    status: mapAdminDeviceStatus(device),
    statusLabel: getDeviceStatusLabel(device.status),
    charge: formatCharge(device.battery),
    signal: formatSignalLabel(device.signal),
    lastUpdated: formatAdminDate(device.lastUpdated),
  };
}

export function deviceToMapStation(
  device: AtmoDevice,
  reading: DeviceReading | null,
  selected: boolean,
  options?: {
    selectedLocation?: AtmoLocation | null;
    comfortIndex?: number;
  },
): MapStation {
  const { xPercent, yPercent } = projectDeviceToMockMap({
    lat: device.lat,
    lng: device.lng,
    bounds: ASTANA_MOCK_BOUNDS,
  });

  const distanceLabel = options?.selectedLocation
    ? formatDistanceLabel(getDistanceKm(options.selectedLocation, device))
    : undefined;

  return {
    id: device.id,
    name: device.name,
    status: device.status,
    x: xPercent,
    y: yPercent,
    selected,
    lastUpdated: device.lastUpdated,
    coverageRadius: device.coverageRadius,
    battery: device.battery,
    signal: device.signal,
    temperature: reading?.temperature !== undefined ? `${reading.temperature.toFixed(1)}°` : undefined,
    humidity: reading?.humidity !== undefined ? `${reading.humidity}%` : undefined,
    airQuality: reading && analyzeAirEnvironment(reading).status !== 'unknown' ? sensorStatusLabel(analyzeAirEnvironment(reading).status) : undefined,
    comfortIndex: options?.comfortIndex,
    distanceLabel,
    hasReading: reading !== null,
  };
}
