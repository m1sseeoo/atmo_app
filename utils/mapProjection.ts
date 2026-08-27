export const ASTANA_MOCK_BOUNDS = {
  minLat: 51.08,
  maxLat: 51.17,
  minLng: 71.38,
  maxLng: 71.49,
} as const;

const MIN_PERCENT = 8;
const MAX_PERCENT = 92;

function clampPercent(value: number): number {
  return Math.min(MAX_PERCENT, Math.max(MIN_PERCENT, value));
}

export function projectDeviceToMockMap(params: {
  lat: number;
  lng: number;
  bounds?: typeof ASTANA_MOCK_BOUNDS;
}): {
  xPercent: number;
  yPercent: number;
} {
  const bounds = params.bounds ?? ASTANA_MOCK_BOUNDS;
  const lngSpan = bounds.maxLng - bounds.minLng;
  const latSpan = bounds.maxLat - bounds.minLat;

  const xRaw = lngSpan > 0 ? ((params.lng - bounds.minLng) / lngSpan) * 100 : 50;
  const yRaw = latSpan > 0 ? ((bounds.maxLat - params.lat) / latSpan) * 100 : 50;

  return {
    xPercent: clampPercent(xRaw),
    yPercent: clampPercent(yRaw),
  };
}

export function coverageRadiusToMapSize(
  radiusMeters: number,
  selected: boolean,
  zoomLevel: number,
): number {
  const base = 52 + (radiusMeters / 250) * 36;
  const selectedBoost = selected ? 28 : 0;
  const zoomScale = 1 + (zoomLevel - 1) * 0.1;
  return Math.round((base + selectedBoost) * zoomScale);
}
