export type DeviceReading = {
  id: string;
  deviceId: string;

  temperature?: number;
  humidity?: number;
  light?: number;

  rain?: boolean;
  rainRaw?: number;

  mq135?: number;
  mq2?: number;
  mq7?: number;
  mq8?: number;

  pressure?: number;

  /** Legacy/calibrated API fields. Never populate these from raw MQ ADC values. */
  airQuality?: number;
  gasLevel?: number;
  rainProbability?: number;
  windSpeed?: number;
  windDirection?: string;

  /** Mock values are permitted only when this flag is explicit in the UI. */
  isDemoData?: boolean;
  createdAt: string;
};
