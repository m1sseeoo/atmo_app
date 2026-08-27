import type { DashboardIconConfig } from '../dashboard/DashboardIcon';

export const assistantIcons = {
  back: { set: 'Feather', name: 'arrow-left', color: '#1688E8' } satisfies DashboardIconConfig,
  menu: { set: 'Feather', name: 'more-horizontal', color: '#1688E8' } satisfies DashboardIconConfig,
  send: { set: 'Feather', name: 'send', color: '#FFFFFF' } satisfies DashboardIconConfig,
  read: { set: 'Ionicons', name: 'checkmark-done', color: 'rgba(255,255,255,0.85)' } satisfies DashboardIconConfig,
} as const;
