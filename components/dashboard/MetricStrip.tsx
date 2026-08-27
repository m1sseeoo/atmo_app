import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { Metric } from '../../types/dashboard';
import { DashboardIcon } from './DashboardIcon';

type MetricStripProps = {
  metrics: Metric[];
  stationLabel: string;
  updatedAt: string;
  onOpenAnalytics?: () => void;
};

const METRIC_WIDTH = 112;

export function MetricStrip({
  metrics,
  stationLabel,
  updatedAt,
  onOpenAnalytics,
}: MetricStripProps) {
  return (
    <View style={styles.card}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        contentContainerStyle={styles.strip}
      >
        {metrics.map((metric, index) => (
          <View
            key={metric.label}
            style={[styles.metric, index < metrics.length - 1 && styles.metricBorder]}
          >
            <DashboardIcon icon={metric.icon} size={18} container />
            <Text style={styles.metricLabel} numberOfLines={2}>
              {metric.label}
            </Text>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricNote} numberOfLines={2}>
              {metric.note}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText} numberOfLines={2}>
          {stationLabel} • Обновлено {updatedAt}
        </Text>
        <Pressable accessibilityRole="button" onPress={onOpenAnalytics}>
          <Text style={styles.link}>Подробнее в аналитике ›</Text>
        </Pressable>
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
    overflow: 'hidden',
    ...shadows.card,
  },
  strip: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    paddingRight: 16,
  },
  metric: {
    width: METRIC_WIDTH,
    paddingRight: 12,
    alignItems: 'flex-start',
    gap: 6,
  },
  metricBorder: {
    borderRightWidth: 1,
    borderRightColor: colors.border,
    marginRight: 4,
    paddingRight: 12,
  },
  metricLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 14,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  metricNote: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 10,
  },
  footerText: {
    flex: 1,
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 15,
  },
  link: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    flexShrink: 0,
    maxWidth: 130,
    textAlign: 'right',
  },
});
