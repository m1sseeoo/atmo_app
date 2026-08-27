export type AtmoNotificationType = 'info' | 'warning' | 'danger';

export type AtmoNotificationCategory =
  | 'air_quality'
  | 'rain'
  | 'comfort'
  | 'device'
  | 'general';

export type AtmoNotification = {
  id: string;
  type: AtmoNotificationType;
  category: AtmoNotificationCategory;
  title: string;
  body: string[];
  time: string;
  createdAt: string;
  read: boolean;
  sourceDeviceId?: string;
  sourceLocationLabel?: string;
};
