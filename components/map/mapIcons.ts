import type { DashboardIconConfig } from '../dashboard/DashboardIcon';

export const mapIcons = {
  search: { set: 'Feather', name: 'search', color: '#8FA1B7' } satisfies DashboardIconConfig,
  filter: { set: 'Feather', name: 'filter', color: '#1688E8' } satisfies DashboardIconConfig,
  chevronDown: { set: 'Feather', name: 'chevron-down', color: '#7A8CA3' } satisfies DashboardIconConfig,
  mapPin: { set: 'Feather', name: 'map-pin', color: '#1688E8' } satisfies DashboardIconConfig,
  locationSharp: { set: 'Ionicons', name: 'location-sharp', color: '#1688E8' } satisfies DashboardIconConfig,
  close: { set: 'Feather', name: 'x', color: '#7A8CA3' } satisfies DashboardIconConfig,
  clock: { set: 'Feather', name: 'clock', color: '#7A8CA3' } satisfies DashboardIconConfig,
  radius: {
    set: 'MaterialCommunityIcons',
    name: 'radius-outline',
    color: '#7A8CA3',
  } satisfies DashboardIconConfig,
  thermometer: { set: 'Feather', name: 'thermometer', color: '#1688E8' } satisfies DashboardIconConfig,
  humidity: { set: 'Ionicons', name: 'water-outline', color: '#1688E8' } satisfies DashboardIconConfig,
  airQuality: { set: 'Feather', name: 'leaf', color: '#22C55E' } satisfies DashboardIconConfig,
  battery: { set: 'Feather', name: 'battery', color: '#7A8CA3' } satisfies DashboardIconConfig,
  signal: { set: 'Feather', name: 'wifi', color: '#7A8CA3' } satisfies DashboardIconConfig,
  comfort: { set: 'Feather', name: 'sun', color: '#1688E8' } satisfies DashboardIconConfig,
  home: { set: 'Feather', name: 'home', color: '#7A8CA3' } satisfies DashboardIconConfig,
  analytics: { set: 'Feather', name: 'bar-chart-2', color: '#7A8CA3' } satisfies DashboardIconConfig,
  map: { set: 'Feather', name: 'map-pin', color: '#7A8CA3' } satisfies DashboardIconConfig,
  assistant: { set: 'Feather', name: 'star', color: '#7A8CA3' } satisfies DashboardIconConfig,
  profile: { set: 'Feather', name: 'user', color: '#7A8CA3' } satisfies DashboardIconConfig,
} as const;

export type MapIconKey = keyof typeof mapIcons;
