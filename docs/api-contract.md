# ATMO API Contract (Future)

This document describes the planned backend API contract for ATMO.

**Status:** not connected yet. The app currently runs in `mock` data mode and does not call these endpoints by default.

## Configuration

```ts
appConfig.dataMode = 'mock' | 'api';
appConfig.apiBaseUrl = '';
```

Switch to `api` only when a real backend URL is available.

## Devices

### List devices

```http
GET /devices
```

Response: `DeviceDto[]`

### Get device by id

```http
GET /devices/:id
```

Response: `DeviceDto`

## Readings

### Latest reading for device

```http
GET /devices/:id/readings/latest
```

Response: `ReadingDto`

### Reading history for device

```http
GET /devices/:id/readings
```

Response: `ReadingDto[]`

### Ingest ESP32 telemetry

```http
POST /readings
```

Example payload:

```json
{
  "deviceId": "ATMO-0547",
  "temperature": 23.1,
  "humidity": 46,
  "pressure": 751,
  "airQuality": 28,
  "gasLevel": 12,
  "rain": false,
  "rainProbability": 0,
  "uvIndex": 5,
  "light": 8200,
  "battery": 86,
  "signal": -63,
  "lat": 51.1204,
  "lng": 71.4304
}
```

## Admin (future)

```http
POST /devices/:id/actions/restart
POST /devices/:id/actions/update-firmware
POST /devices/:id/actions/config
GET /admin/logs
```

Admin actions are local-only in the current app build.

## Notes

- DTOs are mapped to app types in `api/mappers.ts`.
- Invalid API payloads are rejected safely and do not crash the UI.
- When API mode fails, screens should show friendly empty states such as `Нет данных от станции`.
