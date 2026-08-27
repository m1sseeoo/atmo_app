import type { DeviceDto, ReadingDto } from '../types/api';
import type { AtmoDevice, DeviceStatus } from '../types/device';
import type { DeviceReading } from '../types/reading';

const DEVICE_STATUSES: DeviceStatus[] = ['online', 'delayed', 'offline'];

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || isString(value);
}

function isDeviceStatus(value: unknown): value is DeviceStatus {
  return typeof value === 'string' && DEVICE_STATUSES.includes(value as DeviceStatus);
}

function isDeviceDto(value: unknown): value is DeviceDto {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const dto = value as Record<string, unknown>;

  return (
    isString(dto.id) &&
    isString(dto.name) &&
    isDeviceStatus(dto.status) &&
    isFiniteNumber(dto.lat) &&
    isFiniteNumber(dto.lng) &&
    isFiniteNumber(dto.coverageRadius) &&
    isFiniteNumber(dto.battery) &&
    (dto.signal === null || isFiniteNumber(dto.signal)) &&
    isString(dto.lastUpdated) &&
    isOptionalString(dto.firmwareVersion)
  );
}

function isReadingDto(value: unknown): value is ReadingDto {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const dto = value as Record<string, unknown>;

  return (
    isString(dto.id) &&
    isString(dto.deviceId) &&
    isFiniteNumber(dto.temperature) &&
    isFiniteNumber(dto.humidity) &&
    isFiniteNumber(dto.pressure) &&
    isFiniteNumber(dto.airQuality) &&
    isFiniteNumber(dto.gasLevel) &&
    typeof dto.rain === 'boolean' &&
    isFiniteNumber(dto.rainProbability) &&
    isFiniteNumber(dto.uvIndex) &&
    isFiniteNumber(dto.light) &&
    isString(dto.createdAt) &&
    (dto.windSpeed === undefined || isFiniteNumber(dto.windSpeed)) &&
    (dto.windDirection === undefined || isString(dto.windDirection)) &&
    (dto.battery === undefined || isFiniteNumber(dto.battery)) &&
    (dto.signal === undefined || dto.signal === null || isFiniteNumber(dto.signal))
  );
}

export function mapDeviceDtoToDevice(dto: DeviceDto): AtmoDevice {
  return {
    id: dto.id,
    name: dto.name,
    status: dto.status,
    lat: dto.lat,
    lng: dto.lng,
    coverageRadius: dto.coverageRadius,
    battery: dto.battery,
    signal: dto.signal,
    lastUpdated: dto.lastUpdated,
    firmwareVersion: dto.firmwareVersion,
  };
}

export function mapReadingDtoToReading(dto: ReadingDto): DeviceReading {
  return {
    id: dto.id,
    deviceId: dto.deviceId,
    temperature: dto.temperature,
    humidity: dto.humidity,
    pressure: dto.pressure,
    airQuality: dto.airQuality,
    gasLevel: dto.gasLevel,
    rain: dto.rain,
    rainProbability: dto.rainProbability,
    uvIndex: dto.uvIndex,
    light: dto.light,
    windSpeed: dto.windSpeed,
    windDirection: dto.windDirection,
    createdAt: dto.createdAt,
  };
}

export function safeMapDeviceDto(dto: unknown): AtmoDevice | null {
  if (!isDeviceDto(dto)) {
    return null;
  }
  return mapDeviceDtoToDevice(dto);
}

export function safeMapReadingDto(dto: unknown): DeviceReading | null {
  if (!isReadingDto(dto)) {
    return null;
  }
  return mapReadingDtoToReading(dto);
}

export function safeMapDeviceDtoList(payload: unknown): AtmoDevice[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => safeMapDeviceDto(item))
    .filter((item): item is AtmoDevice => item !== null);
}

export function safeMapReadingDtoList(payload: unknown): DeviceReading[] {
  if (!Array.isArray(payload)) {
    return [];
  }

  return payload
    .map((item) => safeMapReadingDto(item))
    .filter((item): item is DeviceReading => item !== null);
}
