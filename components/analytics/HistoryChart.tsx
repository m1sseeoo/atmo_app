import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

import { colors, shadows } from '../../constants/theme';
import { HISTORY_CHART_LABELS, type HistorySeries } from '../../types/analytics';
import { buildLinePath, normalizePoints } from './chartUtils';

type HistoryChartProps = {
  series: HistorySeries[];
};

const CHART_WIDTH = 320;
const CHART_HEIGHT = 168;
const GRID_LINES = 4;

export function HistoryChart({ series }: HistoryChartProps) {
  const normalizedSeries = series.map((item) => ({
    ...item,
    points: normalizePoints(item.points, CHART_WIDTH, CHART_HEIGHT, 8),
  }));

  return (
    <View style={styles.card}>
      <Text style={styles.title}>История изменений</Text>

      <View style={styles.legend}>
        {series.map((item) => (
          <View key={item.label} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendLabel} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.chartWrap}>
        <Svg width="100%" height={CHART_HEIGHT} viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}>
          {Array.from({ length: GRID_LINES }).map((_, index) => {
            const y = 8 + (index * (CHART_HEIGHT - 16)) / (GRID_LINES - 1);
            return (
              <Line
                key={`grid-${index}`}
                x1={0}
                y1={y}
                x2={CHART_WIDTH}
                y2={y}
                stroke={colors.border}
                strokeWidth={1}
                strokeDasharray="4 4"
              />
            );
          })}

          {normalizedSeries.map((item) => {
            const path = buildLinePath(item.points);
            if (!path) {
              return null;
            }

            return (
              <Path
                key={item.label}
                d={path}
                stroke={item.color}
                strokeWidth={2}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {normalizedSeries.map((item) =>
            item.points.map((point, index) => (
              <Circle
                key={`${item.label}-${index}`}
                cx={point.x}
                cy={point.y}
                r={3}
                fill={colors.white}
                stroke={item.color}
                strokeWidth={2}
              />
            )),
          )}
        </Svg>
      </View>

      <View style={styles.labels}>
        {HISTORY_CHART_LABELS.map((label) => (
          <Text key={label} style={styles.axisLabel}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 12,
    ...shadows.card,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    flexShrink: 0,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
    flexShrink: 1,
  },
  chartWrap: {
    width: '100%',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  axisLabel: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 12,
  },
});
