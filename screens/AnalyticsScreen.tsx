import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AnalyticsHeader } from '../components/analytics/AnalyticsHeader';
import { AnalyticsInfoCard } from '../components/analytics/AnalyticsInfoCard';
import { HistoryChart } from '../components/analytics/HistoryChart';
import { MetricChartCard } from '../components/analytics/MetricChartCard';
import { SegmentedControl } from '../components/analytics/SegmentedControl';
import { useAppState } from '../context/AppStateContext';
import { buildAnalyticsMetricsFromReading } from '../services/analyticsService';
import { colors } from '../constants/theme';
import { historySeries, TIME_RANGE_OPTIONS, type TimeRange } from '../types/analytics';
import { isMockMode } from '../config/appConfig';

type AnalyticsScreenProps = {
  onBack?: () => void;
};

export function AnalyticsScreen({ onBack }: AnalyticsScreenProps) {
  const insets = useSafeAreaInsets();
  const { latestReading } = useAppState();
  const [timeRange, setTimeRange] = useState<TimeRange>('24 ч');

  const analyticsMetrics = useMemo(
    () => (latestReading ? buildAnalyticsMetricsFromReading(latestReading) : []),
    [latestReading],
  );

  const rows: (typeof analyticsMetrics)[] = [];
  for (let index = 0; index < analyticsMetrics.length; index += 2) {
    rows.push(analyticsMetrics.slice(index, index + 2));
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 88 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <AnalyticsHeader onBack={onBack} />
        <SegmentedControl
          options={TIME_RANGE_OPTIONS}
          value={timeRange}
          onChange={setTimeRange}
        />

        <View style={styles.grid}>
          {rows.map((row) => (
            <View key={row[0].title} style={styles.gridRow}>
              {row.map((metric) => (
                <MetricChartCard key={metric.title} metric={metric} />
              ))}
              {row.length === 1 ? <View style={styles.gridSpacer} /> : null}
            </View>
          ))}
        </View>

        {isMockMode ? (
          <>
            <Text style={styles.demoLabel}>Демо-график: исторические данные не получены от ThingSpeak</Text>
            <HistoryChart series={historySeries} />
          </>
        ) : null}
        <AnalyticsInfoCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 18,
    gap: 14,
  },
  grid: {
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridSpacer: {
    flex: 1,
  },
  demoLabel: { fontSize: 12, color: colors.textMuted, lineHeight: 17 },
});
