import { MOCK_LOCATIONS } from '../data/mockLocations';
import type { AtmoDevice } from '../types/device';
import type { AtmoLocation } from '../types/location';

const LOCATION_ALIASES: Record<string, string[]> = {
  'Ботанический сад': ['ботан', 'botanical', 'botanic'],
  'Mega Silk Way': ['mega', 'мега', 'silk way'],
  'NIS FMN Astana': ['nis', 'нис', 'фмн'],
  'Район Есиль': ['есиль', 'yesil'],
  'Хан Шатыр': ['хан', 'шатыр', 'khan'],
  'Центр Астаны': ['астана', 'astana', 'центр'],
  'Байтерек': ['байтерек', 'baiterek'],
};

const MAX_SUGGESTIONS = 5;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function getDistanceKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const earthRadiusKm = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h));
}

export function getMockLocations(): AtmoLocation[] {
  return MOCK_LOCATIONS;
}

export function getLocationTypeLabel(type: AtmoLocation['type']): string {
  switch (type) {
    case 'district':
      return 'Район';
    case 'place':
      return 'Место';
    case 'address':
      return 'Адрес';
    case 'route':
      return 'Маршрут';
  }
}

type ScoredLocation = {
  location: AtmoLocation;
  score: number;
  index: number;
};

function getMatchScore(location: AtmoLocation, query: string): number | null {
  const label = location.label.toLowerCase();

  if (label === query) {
    return 0;
  }
  if (label.startsWith(query)) {
    return 1;
  }
  if (label.includes(query)) {
    return 2;
  }

  const aliases = LOCATION_ALIASES[location.label] ?? [];
  const aliasHit = aliases.some(
    (alias) => alias.includes(query) || query.includes(alias),
  );
  if (aliasHit) {
    return 3;
  }

  return null;
}

export function searchMockLocations(query: string): AtmoLocation[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return MOCK_LOCATIONS.slice(0, MAX_SUGGESTIONS);
  }

  const scored: ScoredLocation[] = [];

  MOCK_LOCATIONS.forEach((location, index) => {
    const score = getMatchScore(location, normalized);
    if (score !== null) {
      scored.push({ location, score, index });
    }
  });

  scored.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score;
    }
    return a.index - b.index;
  });

  return scored.slice(0, MAX_SUGGESTIONS).map((item) => item.location);
}

export function formatDistanceLabel(km: number): string {
  if (km < 1) {
    return '< 1 км';
  }
  return `${km.toFixed(1)} км`;
}

export function findNearestDevice(
  location: AtmoLocation,
  devices: AtmoDevice[],
): AtmoDevice | null {
  const pickNearest = (candidates: AtmoDevice[]): AtmoDevice | null => {
    if (candidates.length === 0) {
      return null;
    }

    return candidates.reduce<AtmoDevice | null>((nearest, device) => {
      const deviceDistance = getDistanceKm(location, device);
      if (!nearest) {
        return device;
      }

      const nearestDistance = getDistanceKm(location, nearest);
      return deviceDistance < nearestDistance ? device : nearest;
    }, null);
  };

  const online = devices.filter((device) => device.status === 'online');
  const nearestOnline = pickNearest(online);
  if (nearestOnline) {
    return nearestOnline;
  }

  const delayed = devices.filter((device) => device.status === 'delayed');
  const nearestDelayed = pickNearest(delayed);
  if (nearestDelayed) {
    return nearestDelayed;
  }

  return null;
}
