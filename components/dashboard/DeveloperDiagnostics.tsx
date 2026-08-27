import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { AtmoFetchStatus } from '../../context/AppStateContext';
import type { DeviceReading } from '../../types/reading';

export function DeveloperDiagnostics({ reading, status }: { reading: DeviceReading; status: AtmoFetchStatus }) {
  if (!__DEV__) return null;
  const rows: Array<[string, number | string | undefined]> = [
    ['temperature', reading.temperature], ['humidity', reading.humidity], ['light', reading.light],
    ['rainRaw', reading.rainRaw], ['mq135', reading.mq135], ['mq2', reading.mq2],
    ['mq7', reading.mq7], ['mq8', reading.mq8], ['ThingSpeak timestamp', reading.createdAt],
    ['fetch status', status],
  ];
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Developer diagnostics</Text>
      {rows.map(([label, value]) => <Text key={label} style={styles.row}>{label}: {value ?? '—'}</Text>)}
      <Text style={styles.note}>MQ values are raw ADC diagnostics, not AQI or ppm.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, borderRadius: 16, padding: 14, gap: 4 },
  title: { fontSize: 13, fontWeight: '700', color: colors.textMain, marginBottom: 4 },
  row: { fontSize: 11, color: colors.textMuted },
  note: { fontSize: 10, color: colors.textMuted, marginTop: 5, fontStyle: 'italic' },
});
