import type { DashboardIconConfig } from '../dashboard/DashboardIcon';

export const adminIcons = {
  user: { set: 'Feather', name: 'user', color: '#1688E8' } satisfies DashboardIconConfig,
  chevronDown: { set: 'Feather', name: 'chevron-down', color: '#7A8CA3' } satisfies DashboardIconConfig,
  filter: { set: 'Feather', name: 'filter', color: '#1688E8' } satisfies DashboardIconConfig,
  chevronRight: { set: 'Feather', name: 'chevron-right', color: '#B8D4E8' } satisfies DashboardIconConfig,
  signal: { set: 'Feather', name: 'bar-chart-2', color: '#22C55E' } satisfies DashboardIconConfig,
  signalMuted: { set: 'Feather', name: 'bar-chart-2', color: '#B8D4E8' } satisfies DashboardIconConfig,
  home: { set: 'Feather', name: 'home', color: '#7A8CA3' } satisfies DashboardIconConfig,
  analytics: { set: 'Feather', name: 'bar-chart-2', color: '#7A8CA3' } satisfies DashboardIconConfig,
  map: { set: 'Feather', name: 'map-pin', color: '#7A8CA3' } satisfies DashboardIconConfig,
  notifications: { set: 'Feather', name: 'bell', color: '#7A8CA3' } satisfies DashboardIconConfig,
  admin: { set: 'Feather', name: 'user', color: '#7A8CA3' } satisfies DashboardIconConfig,
} as const;

export type AdminTab = 'home' | 'analytics' | 'map' | 'notifications' | 'admin';
