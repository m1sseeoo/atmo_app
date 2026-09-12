import type { AtmoLocation } from '../types/location';

export const MOCK_LOCATIONS: AtmoLocation[] = [
  {
    id: 'loc-astana-center',
    label: 'Центр Астаны',
    type: 'district',
    lat: 51.1605,
    lng: 71.4704,
  },
  {
    id: 'loc-yesil',
    label: 'Район Есиль',
    type: 'district',
    lat: 51.1204,
    lng: 71.4304,
  },
  {
    id: 'loc-botanical',
    label: 'Ботанический сад',
    type: 'place',
    lat: 51.0994,
    lng: 71.4112,
  },
  {
    id: 'loc-mega',
    label: 'Mega Silk Way',
    type: 'place',
    lat: 51.0898,
    lng: 71.4072,
  },
  {
    id: 'loc-nis',
    label: 'NIS FMN Astana',
    type: 'place',
    lat: 51.0909,
    lng: 71.3981,
  },
  {
    id: 'loc-baiterek',
    label: 'Байтерек',
    type: 'place',
    lat: 51.1282,
    lng: 71.4307,
  },
  {
    id: 'loc-khan-shatyr',
    label: 'Хан Шатыр',
    type: 'place',
    lat: 51.1328,
    lng: 71.4039,
  },
  {
    id: 'loc-left-bank-route',
    label: 'Маршрут: Ботанический сад → Mega Silk Way',
    type: 'route',
    lat: 51.095,
    lng: 71.409,
  },
];

export const mockLocations = MOCK_LOCATIONS;
