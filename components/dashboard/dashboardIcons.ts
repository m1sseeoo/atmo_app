import { iconBackgrounds, type DashboardIconConfig } from './DashboardIcon';

export const dashboardIcons = {
  search: { set: 'Feather', name: 'search', color: '#8FA1B7' } satisfies DashboardIconConfig,
  send: { set: 'Feather', name: 'send', color: '#FFFFFF' } satisfies DashboardIconConfig,
  bell: { set: 'Feather', name: 'bell', color: '#1688E8' } satisfies DashboardIconConfig,
  chevronDown: { set: 'Feather', name: 'chevron-down', color: '#7A8CA3' } satisfies DashboardIconConfig,
  chevronLeft: { set: 'Feather', name: 'chevron-left', color: '#1688E8' } satisfies DashboardIconConfig,
  sliders: { set: 'Feather', name: 'sliders', color: '#1688E8' } satisfies DashboardIconConfig,
  info: { set: 'Feather', name: 'info', color: '#7A8CA3' } satisfies DashboardIconConfig,
  check: { set: 'Feather', name: 'check', color: '#22C55E' } satisfies DashboardIconConfig,
  clock: { set: 'Feather', name: 'clock', color: '#1688E8' } satisfies DashboardIconConfig,

  recWear: {
    set: 'MaterialCommunityIcons',
    name: 'tshirt-crew-outline',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  recExpect: {
    set: 'Ionicons',
    name: 'partly-sunny-outline',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  recDo: {
    set: 'MaterialCommunityIcons',
    name: 'walk',
    color: '#22C55E',
    bg: iconBackgrounds.green,
  } satisfies DashboardIconConfig,
  recAvoid: {
    set: 'Feather',
    name: 'x-circle',
    color: '#FF7A7A',
    bg: iconBackgrounds.red,
  } satisfies DashboardIconConfig,
  recReturn: {
    set: 'Feather',
    name: 'clock',
    color: '#7C3AED',
    bg: iconBackgrounds.purple,
  } satisfies DashboardIconConfig,

  metricTemp: {
    set: 'Feather',
    name: 'thermometer',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  metricHumidity: {
    set: 'Ionicons',
    name: 'water-outline',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  metricPressure: {
    set: 'MaterialCommunityIcons',
    name: 'gauge',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  metricAir: {
    set: 'Feather',
    name: 'leaf',
    color: '#22C55E',
    bg: iconBackgrounds.green,
  } satisfies DashboardIconConfig,
  metricUv: {
    set: 'Feather',
    name: 'sun',
    color: '#F59E0B',
    bg: iconBackgrounds.orange,
  } satisfies DashboardIconConfig,
  metricWind: {
    set: 'Feather',
    name: 'wind',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  metricRain: {
    set: 'Feather',
    name: 'cloud-rain',
    color: '#1688E8',
    bg: iconBackgrounds.blue,
  } satisfies DashboardIconConfig,
  refresh: { set: 'Feather', name: 'refresh-cw', color: '#1688E8' } satisfies DashboardIconConfig,
  mapPin: { set: 'Feather', name: 'map-pin', color: '#1688E8' } satisfies DashboardIconConfig,
  navigation: { set: 'Feather', name: 'navigation', color: '#1688E8' } satisfies DashboardIconConfig,
  chevronRight: { set: 'Feather', name: 'chevron-right', color: '#7A8CA3' } satisfies DashboardIconConfig,
} as const;

export type DashboardIconKey = keyof typeof dashboardIcons;
