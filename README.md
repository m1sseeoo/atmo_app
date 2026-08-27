# ATMO

ATMO is an Expo + React Native + TypeScript mobile app that turns readings from a physical ESP32 environmental station into practical, personalized outdoor-comfort guidance. ATMO is not a medical device and does not replace official environmental measurements or medical advice.

## ATMO Live Data Architecture

```text
ESP32 sensors
      ↓
ThingSpeak
      ↓
ATMO React Native App
      ↓
ATMO analysis engine
      ↓
User profile
      ↓
Backend
      ↓
AI Assistant
```

The ESP32 publishes one reading approximately every 20 seconds. The dashboard fetches the latest ThingSpeak feed when opened, on pull-to-refresh, and every 60 seconds. The last successful reading remains visible during a temporary error and is marked stale after three minutes.

ThingSpeak field mapping:

- `field1`: DHT22 temperature, °C
- `field2`: DHT22 humidity, %
- `field3`: BH1750 light, lux
- `field4`: rain sensor RAW ADC
- `field5`: MQ135 RAW ADC
- `field6`: MQ2 RAW ADC
- `field7`: MQ7 RAW ADC
- `field8`: MQ8 RAW ADC

Missing readings stay absent (`undefined`). Pressure and UV are not synthesized when their sensors are unavailable.

## Air sensor interpretation

MQ values are retained as raw diagnostics. They are never displayed as official AQI or ppm. The user-facing `ATMO Air Score` is only a relative, prototype comparison against configurable thresholds in `config/sensorConfig.ts`.

The possible relative statuses are:

- normal;
- elevated;
- high;
- unknown.

This score is not a certified safety measurement. For potentially unsafe conditions, use calibrated equipment and official sources.

## Comfort and recommendations

The Comfort Index uses only available measurements. A missing pressure or UV sensor contributes neither a good nor a bad value. Rule-based recommendations use the saved user profile and form the deterministic safety/fallback layer for the assistant.

The assistant first calls `POST /api/assistant` when `EXPO_PUBLIC_API_BASE_URL` is configured. If the backend is unavailable or returns an invalid response, the existing local intent-and-template assistant answers instead. The OpenAI API key exists only on the server.

The backend uses the OpenAI Responses API through the official JavaScript SDK and returns only `{ "reply": "..." }` to the app.

## Local setup

Prerequisites: Node.js 20+ and npm.

### Mobile app

```bash
npm install
copy .env.example .env
npm run typecheck
npm start
```

On macOS/Linux, use `cp .env.example .env`. For a physical iPhone, set `EXPO_PUBLIC_API_BASE_URL` to the computer's reachable LAN address rather than `localhost`.

### Assistant backend

```bash
cd server
npm install
copy .env.example .env
npm run typecheck
npm run build
npm start
```

Add `OPENAI_API_KEY` only to `server/.env` (or the server deployment environment). Never create `EXPO_PUBLIC_OPENAI_API_KEY`.

## Environment configuration

```env
EXPO_PUBLIC_DATA_MODE=live
EXPO_PUBLIC_API_BASE_URL=http://localhost:3001
EXPO_PUBLIC_THINGSPEAK_CHANNEL_ID=YOUR_CHANNEL_ID
EXPO_PUBLIC_THINGSPEAK_READ_API_KEY=
OPENAI_API_KEY=YOUR_SERVER_SIDE_KEY
OPENAI_MODEL=gpt-5.4
```

Modes:

- `live` (default): one real `ATMO Station 1` backed by ThingSpeak;
- `demo`: explicit template data, always marked as demo in the UI;
- `api`: the legacy ATMO REST repository path.

`EXPO_PUBLIC_*` values are bundled into the mobile app. A private ThingSpeak read key in `EXPO_PUBLIC_THINGSPEAK_READ_API_KEY` is a development-only compatibility option; production should proxy private ThingSpeak requests through the backend.

## Sensor calibration

Edit the centralized prototype thresholds in `config/sensorConfig.ts` only after collecting real dry/wet and clean/exposed readings from the physical device.

1. Record rain ADC values while fully dry and reliably wet.
2. Confirm whether lower or higher ADC values mean wet for the installed board.
3. Adjust `wetThreshold` and, if required, `wetWhen`.
4. Warm up each MQ sensor according to its hardware requirements.
5. Collect a stable baseline for MQ135, MQ2, MQ7, and MQ8 in the intended installation.
6. Adjust `normalMax` and `elevatedMax` per sensor.

These thresholds are device-relative prototypes, not medical, industrial, AQI, or ppm limits.

## Diagnostics

In development builds, the dashboard shows a diagnostics card with temperature, humidity, light, rain RAW, all four MQ RAW values, the ThingSpeak timestamp, and fetch status. Production builds omit this card.

## Verification

```bash
npm run typecheck
cd server
npm run typecheck
```

The project keeps its existing Expo identity, bundle configuration, name, icons, and signing-related settings unchanged for the next iOS/TestFlight build.
