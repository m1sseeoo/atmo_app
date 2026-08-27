import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { formatTelemetryTime } from '../../services/adminService';
import type { TelemetryLog } from '../../types/admin';

type TelemetryLogsListProps = {
  logs: TelemetryLog[];
};

export function TelemetryLogsList({ logs }: TelemetryLogsListProps) {
  if (logs.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Нет входящих данных</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {logs.map((log) => (
        <View key={log.id} style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.deviceId}>{log.deviceId}</Text>
            <Text style={styles.time}>{formatTelemetryTime(log.createdAt)}</Text>
          </View>
          <Text style={styles.line}>
            {log.temperature !== undefined ? `${log.temperature.toFixed(1)}°` : '—'} · {log.humidity !== undefined ? `${log.humidity}%` : '—'} · {log.airStatus ?? 'Нет MQ-данных'}
          </Text>
          <Text style={styles.line}>
            Батарея {log.battery}% · Сигнал {log.signal === null ? '—' : `${log.signal} dBm`}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 4,
    ...shadows.soft,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  deviceId: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 18,
    flex: 1,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
  },
  line: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  empty: {
    paddingVertical: 8,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
});
