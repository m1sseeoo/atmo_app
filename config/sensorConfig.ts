export type RainWetDirection = 'below' | 'above';

export const SENSOR_THRESHOLDS = {
  rain: {
    wetThreshold: 1500,
    // Must be calibrated using real dry/wet sensor readings.
    // Current device firmware treats rainRaw >= 1500 as wet.
    wetWhen: 'above' as RainWetDirection,
  },
  mq: {
    mq135: { normalMax: 900, elevatedMax: 1600 },
    mq2: { normalMax: 700, elevatedMax: 1400 },
    mq7: { normalMax: 700, elevatedMax: 1400 },
    mq8: { normalMax: 700, elevatedMax: 1400 },
  },
} as const;

// Prototype thresholds. Must be calibrated for the physical ATMO device.
// MQ values are relative raw ADC levels, not AQI or ppm.

export const READING_STALE_AFTER_MS = 3 * 60 * 1000;
