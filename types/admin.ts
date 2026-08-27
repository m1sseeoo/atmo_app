import type { DashboardIconConfig } from '../components/dashboard/DashboardIcon';

export type AdminActionType =
  | 'refresh_data'
  | 'restart_device'
  | 'firmware_update'
  | 'remote_config'
  | 'view_telemetry';

export type AdminActionStatus = 'success' | 'pending' | 'failed';

export type AdminActionLog = {
  id: string;
  action: AdminActionType;
  title: string;
  deviceId?: string;
  status: AdminActionStatus;
  message: string;
  createdAt: string;
};

export type TelemetryLog = {
  id: string;
  deviceId: string;
  temperature?: number;
  humidity?: number;
  pressure?: number;
  airStatus?: string;
  mq135?: number;
  mq2?: number;
  mq7?: number;
  mq8?: number;
  battery: number;
  signal: number | null;
  createdAt: string;
};

export type AdminDeviceFilter = 'all' | 'online' | 'offline' | 'delayed' | 'low_battery';

export const ADMIN_DEVICE_FILTERS: { id: AdminDeviceFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'online', label: 'Онлайн' },
  { id: 'offline', label: 'Оффлайн' },
  { id: 'delayed', label: 'Задержка' },
  { id: 'low_battery', label: 'Низкий заряд' },
];

export type AdminSummaryTone = 'blue' | 'green' | 'orange';

export type AdminSummary = {
  title: string;
  value: string;
  subtitle: string;
  tone: AdminSummaryTone;
  icon: DashboardIconConfig;
};

export type AdminActionKey = AdminActionType | 'navigate_map';

export type AdminAction = {
  title: string;
  subtitle: string;
  icon: DashboardIconConfig;
  actionKey: AdminActionKey;
};

export type AdminDeviceStatus = 'online' | 'offline' | 'delayed';

export type AdminDevice = {
  id: string;
  status: AdminDeviceStatus;
  statusLabel: string;
  charge: string;
  signal: string;
  lastUpdated: string;
};

export const adminActions: AdminAction[] = [
  {
    title: 'Удалённое обновление',
    subtitle: 'Обновить прошивку на устройствах',
    icon: { set: 'Feather', name: 'download-cloud', color: '#1688E8' },
    actionKey: 'firmware_update',
  },
  {
    title: 'Удалённое управление',
    subtitle: 'Настроить параметры устройств',
    icon: { set: 'Feather', name: 'sliders', color: '#1688E8' },
    actionKey: 'remote_config',
  },
  {
    title: 'Просмотр входящих данных',
    subtitle: 'Анализ телеметрии в реальном времени',
    icon: { set: 'Feather', name: 'file-text', color: '#1688E8' },
    actionKey: 'view_telemetry',
  },
  {
    title: 'Карта размещения устройств',
    subtitle: 'Просмотреть расположение на карте',
    icon: { set: 'Feather', name: 'map-pin', color: '#1688E8' },
    actionKey: 'navigate_map',
  },
];
