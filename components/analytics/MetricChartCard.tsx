import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { MINI_CHART_LABELS, type AnalyticsMetric } from '../../types/analytics';
import { MiniLineChart } from './MiniLineChart';

type MetricChartCardProps = {
  metric: AnalyticsMetric;
};

export function MetricChartCard({ metric }: MetricChartCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title} numberOfLines={2}>
        {metric.title}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {metric.value}
      </Text>
      <Text style={[styles.level, { color: metric.levelColor }]} numberOfLines={1}>
        {metric.level}
      </Text>
      <View style={styles.chart}>
        <MiniLineChart
          points={metric.points}
          color={metric.color}
          labels={MINI_CHART_LABELS}
          showFill={metric.points.some((point) => point > 0)}
        />
      </View>
      <Text style={styles.explanation} numberOfLines={3}>
        {metric.explanation}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    gap: 4,
    ...shadows.soft,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 17,
    minHeight: 34,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 24,
  },
  level: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
    marginBottom: 2,
  },
  chart: {
    marginTop: 2,
    marginBottom: 4,
  },
  explanation: {
    fontSize: 11,
    lineHeight: 15,
    color: colors.textMuted,
    minHeight: 30,
  },
});
