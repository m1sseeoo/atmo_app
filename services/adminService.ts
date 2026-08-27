import { getLatestReadingForDevice } from './deviceService';
import type {
  AdminActionLog,
  AdminActionStatus,
  AdminActionType,
  AdminDeviceFilter,
  AdminSummary,
  TelemetryLog,
} from '../types/admin';
import type { AtmoDevice, DeviceStatus } from '../types/device';
import type { DeviceReading } from '../types/reading';
import { analyzeAirEnvironment, sensorStatusLabel } from './sensorAnalysisService';

const ACTION_TITLES: Record<AdminActionType, string> = {
  refresh_data: 'Обновление данных',
  restart_device: 'Перезапуск устройства',
  firmware_update: 'Удалённое обновление',
  remote_config: 'Удалённое управление',
  view_telemetry: 'Просмотр входящих данных',
};

const ACTION_MESSAGES: Record<AdminActionType, string> = {
  refresh_data: 'Данные станции обновлены локально.',
  restart_device: 'Команда перезапуска отправлена в демо-режиме.',
  firmware_update: 'Запущена проверка обновления прошивки.',
  remote_config: 'Настройки применены локально.',
  view_telemetry: 'Открыт просмотр входящих данных.',
};

function generateLogId(): string {
  return `admin-log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function generateTelemetryId(): string {
  return `telemetry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDeviceStatusLabel(status: DeviceStatus): string {
  switch (status) {
    case 'online':
      return 'Онлайн';
    case 'delayed':
      return 'Задержка';
    case 'offline':
      return 'Оффлайн';
    default:
      return status;
  }
}

export function formatSignalLabel(signal: number | null): string {
  return signal === null ? '—' : `${signal} dBm`;
}

function getSignalQualityLabel(averageSignal: number): string {
  if (averageSignal >= -65) {
    return 'Отличный';
  }
  if (averageSignal >= -75) {
    return 'Хороший';
  }
  if (averageSignal >= -85) {
    return 'Средний';
  }
  return 'Слабый';
}

export function getAdminSummary(devices: AtmoDevice[]): {
  totalDevices: number;
  onlineDevices: number;
  onlinePercent: number;
  averageBattery: number;
  offlineCount: number;
  averageSignalLabel: string;
  averageSignalValue: string;
} {
  const totalDevices = devices.length;
  const onlineDevices = devices.filter((device) => device.status === 'online').length;
  const onlinePercent =
    totalDevices > 0 ? Math.round((onlineDevices / totalDevices) * 100) : 0;
  const averageBattery =
    totalDevices > 0
      ? Math.round(devices.reduce((sum, device) => sum + device.battery, 0) / totalDevices)
      : 0;
  const offlineCount = devices.filter((device) => device.status === 'offline').length;

  const onlineSignals = devices
    .filter((device) => device.status === 'online' && device.signal !== null)
    .map((device) => device.signal as number);

  if (onlineSignals.length === 0) {
    return {
      totalDevices,
      onlineDevices,
      onlinePercent,
      averageBattery,
      offlineCount,
      averageSignalLabel: 'Нет данных',
      averageSignalValue: '—',
    };
  }

  const averageSignal = Math.round(
    onlineSignals.reduce((sum, value) => sum + value, 0) / onlineSignals.length,
  );

  return {
    totalDevices,
    onlineDevices,
    onlinePercent,
    averageBattery,
    offlineCount,
    averageSignalLabel: getSignalQualityLabel(averageSignal),
    averageSignalValue: `${averageSignal} dBm`,
  };
}

export function buildAdminSummaryCards(devices: AtmoDevice[]): AdminSummary[] {
  const summary = getAdminSummary(devices);

  return [
    {
      title: 'Всего устройств',
      value: String(summary.totalDevices),
      subtitle: 'Всего устройств',
      tone: 'blue',
      icon: { set: 'MaterialCommunityIcons', name: 'server-network', color: '#1688E8' },
    },
    {
      title: 'Онлайн устройств',
      value: `${summary.onlineDevices} онлайн`,
      subtitle: `${summary.onlinePercent}% онлайн`,
      tone: 'green',
      icon: { set: 'Feather', name: 'wifi', color: '#22C55E' },
    },
    {
      title: 'Средний заряд',
      value: `${summary.averageBattery}%`,
      subtitle: `${summary.offlineCount} оффлайн`,
      tone: 'orange',
      icon: { set: 'Feather', name: 'battery', color: '#F59E0B' },
    },
    {
      title: 'Качество сигнала',
      value: summary.averageSignalLabel,
      subtitle: summary.averageSignalValue,
      tone: 'green',
      icon: { set: 'Feather', name: 'bar-chart-2', color: '#22C55E' },
    },
  ];
}

export function getReadingsForDevices(devices: AtmoDevice[]): DeviceReading[] {
  return devices
    .map((device) => getLatestReadingForDevice(device.id))
    .filter((reading): reading is DeviceReading => reading !== null);
}

export function createTelemetryLogsFromDevices(
  devices: AtmoDevice[],
  readings: DeviceReading[],
): TelemetryLog[] {
  const readingByDevice = new Map(readings.map((reading) => [reading.deviceId, reading]));

  const logs = devices
    .map<TelemetryLog | null>((device) => {
      const reading = readingByDevice.get(device.id);
      if (!reading) {
        return null;
      }

      return {
        id: generateTelemetryId(),
        deviceId: device.id,
        temperature: reading.temperature,
        humidity: reading.humidity,
        pressure: reading.pressure,
        airStatus: sensorStatusLabel(analyzeAirEnvironment(reading).status),
        mq135: reading.mq135,
        mq2: reading.mq2,
        mq7: reading.mq7,
        mq8: reading.mq8,
        battery: device.battery,
        signal: device.signal,
        createdAt: reading.createdAt,
      } satisfies TelemetryLog;
    })
    .filter((log): log is TelemetryLog => log !== null);

  return logs.sort(
    (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
  );
}

export function createAdminActionLog(params: {
  action: AdminActionType;
  deviceId?: string;
  status?: AdminActionStatus;
  message?: string;
}): AdminActionLog {
  const now = new Date().toISOString();

  return {
    id: generateLogId(),
    action: params.action,
    title: ACTION_TITLES[params.action],
    deviceId: params.deviceId,
    status: params.status ?? 'success',
    message: params.message ?? ACTION_MESSAGES[params.action],
    createdAt: now,
  };
}

export function filterAdminDevices(
  devices: AtmoDevice[],
  filter: AdminDeviceFilter,
  searchQuery: string,
): AtmoDevice[] {
  const query = searchQuery.trim().toLowerCase();

  return devices.filter((device) => {
    if (filter === 'online' && device.status !== 'online') {
      return false;
    }
    if (filter === 'offline' && device.status !== 'offline') {
      return false;
    }
    if (filter === 'delayed' && device.status !== 'delayed') {
      return false;
    }
    if (filter === 'low_battery' && device.battery > 25) {
      return false;
    }

    if (!query) {
      return true;
    }

    const statusLabel = getDeviceStatusLabel(device.status).toLowerCase();
    return (
      device.id.toLowerCase().includes(query) ||
      device.name.toLowerCase().includes(query) ||
      statusLabel.includes(query)
    );
  });
}

export function formatAdminLogTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function formatTelemetryTime(dateString: string): string {
  return formatAdminLogTime(dateString);
}
