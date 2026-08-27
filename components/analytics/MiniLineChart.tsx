import { StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';

import { colors } from '../../constants/theme';
import { buildAreaPath, buildLinePath, normalizePoints } from './chartUtils';

type MiniLineChartProps = {
  points: number[];
  color: string;
  labels: readonly string[];
  height?: number;
  showFill?: boolean;
};

const CHART_WIDTH = 148;

export function MiniLineChart({
  points,
  color,
  labels,
  height = 56,
  showFill = true,
}: MiniLineChartProps) {
  const normalized = normalizePoints(points, CHART_WIDTH, height);
  const linePath = buildLinePath(normalized);
  const areaPath = buildAreaPath(normalized, height);
  const fillId = `fill-${color.replace('#', '')}`;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height={height} viewBox={`0 0 ${CHART_WIDTH} ${height}`}>
        {showFill && areaPath ? (
          <Defs>
            <LinearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.22" />
              <Stop offset="1" stopColor={color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>
        ) : null}
        {showFill && areaPath ? (
          <Path d={areaPath} fill={`url(#${fillId})`} />
        ) : null}
        {linePath ? (
          <Path
            d={linePath}
            stroke={color}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>
      <View style={styles.labels}>
        {labels.map((label) => (
          <Text key={label} style={styles.label}>
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    gap: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 9,
    color: colors.textMuted,
    lineHeight: 12,
  },
});
