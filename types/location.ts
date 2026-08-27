export type AtmoLocation = {
  id: string;
  label: string;
  type: 'address' | 'district' | 'place' | 'route';
  lat: number;
  lng: number;
};
