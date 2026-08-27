import type { DashboardIconConfig } from '../dashboard/DashboardIcon';

export const historyIcons = {
  user: { set: 'Feather', name: 'user', color: '#1688E8' } satisfies DashboardIconConfig,
  calendar: { set: 'Feather', name: 'calendar', color: '#7A8CA3' } satisfies DashboardIconConfig,
  walk: {
    set: 'MaterialCommunityIcons',
    name: 'walk',
    color: '#7A8CA3',
  } satisfies DashboardIconConfig,
  bike: {
    set: 'MaterialCommunityIcons',
    name: 'bike',
    color: '#7A8CA3',
  } satisfies DashboardIconConfig,
  chevronRight: { set: 'Feather', name: 'chevron-right', color: '#B8D4E8' } satisfies DashboardIconConfig,
  mapPin: { set: 'Feather', name: 'map-pin', color: '#1688E8' } satisfies DashboardIconConfig,
  location: { set: 'Feather', name: 'map-pin', color: '#7A8CA3' } satisfies DashboardIconConfig,
  trash: { set: 'Feather', name: 'trash-2', color: '#7A8CA3' } satisfies DashboardIconConfig,
  alertTriangle: { set: 'Feather', name: 'alert-triangle', color: '#EF4444' } satisfies DashboardIconConfig,
  bell: { set: 'Feather', name: 'bell', color: '#F59E0B' } satisfies DashboardIconConfig,
  cloud: { set: 'Ionicons', name: 'cloud-outline', color: '#1688E8' } satisfies DashboardIconConfig,
} as const;
