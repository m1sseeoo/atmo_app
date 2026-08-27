import type { DeviceStatus } from './device';

export type DeviceFilter = 'all' | 'online' | 'issues';

export type MapStation = {
  id: string;
  name: string;
  status: DeviceStatus;
  x: number;
  y: number;
  selected?: boolean;
  lastUpdated: string;
  coverageRadius: number;
  battery: number;
  signal: number | null;
  temperature?: string;
  humidity?: string;
  airQuality?: string;
  comfortIndex?: number;
  distanceLabel?: string;
  hasReading: boolean;
};

export function getSelectedStation(stations: MapStation[]): MapStation | undefined {
  return stations.find((station) => station.selected);
}

export function filterDevicesByQuery<T extends { id: string; name: string }>(
  devices: T[],
  query: string,
): T[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return devices;
  }

  return devices.filter(
    (device) =>
      device.id.toLowerCase().includes(normalized) ||
      device.name.toLowerCase().includes(normalized),
  );
}

export function filterDevicesByStatus<T extends { status: DeviceStatus }>(
  devices: T[],
  filter: DeviceFilter,
): T[] {
  switch (filter) {
    case 'online':
      return devices.filter((device) => device.status === 'online');
    case 'issues':
      return devices.filter(
        (device) => device.status === 'delayed' || device.status === 'offline',
      );
    case 'all':
      return devices;
  }
}
