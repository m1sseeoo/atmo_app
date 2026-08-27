import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { DashboardIconConfig } from '../dashboard/DashboardIcon';
import { DashboardIcon } from '../dashboard/DashboardIcon';

type MetricMiniCardProps = {
  icon: DashboardIconConfig;
  label: string;
  value: string;
};

export function MetricMiniCard({ icon, label, value }: MetricMiniCardProps) {
  return (
    <View style={styles.card}>
      <DashboardIcon icon={icon} size={14} container containerStyle={styles.iconWrap} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Text style={styles.value} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: colors.primarySoft,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 10,
    gap: 4,
    minHeight: 72,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.white,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 18,
  },
});
