export type DeviceDto = {
  id: string;
  name: string;
  status: 'online' | 'delayed' | 'offline';
  lat: number;
  lng: number;
  coverageRadius: number;
  battery: number;
  signal: number | null;
  lastUpdated: string;
  firmwareVersion?: string;
};

export type ReadingDto = {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  pressure: number;
  airQuality: number;
  gasLevel: number;
  rain: boolean;
  rainProbability: number;
  light: number;
  windSpeed?: number;
  windDirection?: string;
  battery?: number;
  signal?: number | null;
  createdAt: string;
};

export type Esp32ReadingPayload = {
  deviceId: string;
  temperature: number;
  humidity: number;
  pressure: number;
  airQuality: number;
  gasLevel: number;
  rain: boolean;
  rainProbability: number;
  light: number;
  battery: number;
  signal: number | null;
  lat?: number;
  lng?: number;
  createdAt?: string;
};
