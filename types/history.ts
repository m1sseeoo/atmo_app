import type { ComfortStatus } from './recommendation';

export type HistoryItemType = 'comfort_check' | 'route_check' | 'device_check';

export type HistoryItem = {
  id: string;
  type: HistoryItemType;
  title: string;
  locationLabel: string;
  deviceId: string | null;
  comfortIndex: number;
  status: ComfortStatus;
  summary: string;
  temperature: number | null;
  humidity: number | null;
  airQuality: number | null;
  uvIndex: number | null;
  createdAt: string;
};

export type RouteActivity = 'walk' | 'bike';
export type RouteStatus = 'comfortable' | 'medium';
export type NotificationType = 'danger' | 'warning' | 'info';
export type HistoryTab = 'history' | 'notifications';

export type HistoryRoute = {
  title: string;
  date: string;
  activity: RouteActivity;
  distance: string;
  duration: string;
  comfortLabel: string;
  comfortIndex: number;
  status: RouteStatus;
  routeColor: string;
};

export type HistoryNotification = {
  title: string;
  body: string[];
  time: string;
  type: NotificationType;
};
