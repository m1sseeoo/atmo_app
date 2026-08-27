import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { getDeviceStatusLabel, formatSignalLabel } from '../../services/adminService';
import type { AtmoDevice } from '../../types/device';
import type { DeviceReading } from '../../types/reading';
import { analyzeAirEnvironment, sensorStatusLabel } from '../../services/sensorAnalysisService';

type DeviceDetailsCardProps = {
  device: AtmoDevice | null;
  reading: DeviceReading | null;
};

function formatFirmwareVersion(version?: string): string {
  if (!version) {
    return 'v1.0.0';
  }
  return version.startsWith('v') ? version : `v${version}`;
}

export function DeviceDetailsCard({ device, reading }: DeviceDetailsCardProps) {
  if (!device) {
    return (
      <View style={styles.card}>
        <Text style={styles.emptyTitle}>Выберите устройство из списка</Text>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.deviceId}>{device.id}</Text>
      <Text style={styles.status}>{getDeviceStatusLabel(device.status)}</Text>

      <View style={styles.metrics}>
        <Text style={styles.metric}>Заряд: {device.battery}%</Text>
        <Text style={styles.metric}>Сигнал: {formatSignalLabel(device.signal)}</Text>
        <Text style={styles.metric}>Покрытие: {device.coverageRadius} м</Text>
        <Text style={styles.metric}>Последнее обновление: 24.05.2025 {device.lastUpdated}</Text>
        <Text style={styles.metric}>
          Версия прошивки: {formatFirmwareVersion(device.firmwareVersion)}
        </Text>
      </View>

      {reading ? (
        <View style={styles.readingBlock}>
          <Text style={styles.readingTitle}>Последние показания</Text>
          <Text style={styles.readingLine}>
            Температура {reading.temperature !== undefined ? `${reading.temperature.toFixed(1)}°` : '—'}, влажность {reading.humidity !== undefined ? `${reading.humidity}%` : '—'}
          </Text>
          <Text style={styles.readingLine}>
            Воздушная среда: {sensorStatusLabel(analyzeAirEnvironment(reading).status)}
          </Text>
        </View>
      ) : (
        <Text style={styles.noReading}>Нет свежих данных</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 8,
    ...shadows.soft,
  },
  emptyTitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  deviceId: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 18,
  },
  metrics: {
    gap: 4,
  },
  metric: {
    fontSize: 13,
    color: colors.textMain,
    lineHeight: 18,
  },
  readingBlock: {
    marginTop: 4,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 4,
  },
  readingTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 18,
  },
  readingLine: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  noReading: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
    marginTop: 4,
  },
});
