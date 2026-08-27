export type DataMode = 'live' | 'demo' | 'api';

const configuredMode = process.env.EXPO_PUBLIC_DATA_MODE?.trim();

export const appConfig = {
  dataMode: (configuredMode === 'demo' || configuredMode === 'api' ? configuredMode : 'live') as DataMode,
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ?? '',
};

export const isApiMode = appConfig.dataMode === 'api';
export const isMockMode = appConfig.dataMode === 'demo';
export const isLiveMode = appConfig.dataMode === 'live';
