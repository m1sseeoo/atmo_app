export type DeviceStatus = 'online' | 'delayed' | 'offline';

export type AtmoDevice = {
  id: string;
  name: string;
  status: DeviceStatus;
  lat: number;
  lng: number;
  coverageRadius: number;
  battery: number;
  signal: number | null;
  lastUpdated: string;
  firmwareVersion?: string;
  mapX?: number;
  mapY?: number;
};
