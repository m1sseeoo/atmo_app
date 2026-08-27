import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import type { DashboardIconConfig } from '../dashboard/DashboardIcon';

type StationMetricRowProps = {
  icon: DashboardIconConfig;
  label: string;
  value: string;
};

export function StationMetricRow({ icon, label, value }: StationMetricRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <DashboardIcon icon={icon} size={18} container />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
    minWidth: 0,
  },
  label: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 18,
    flexShrink: 1,
  },
  value: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 20,
    flexShrink: 0,
  },
});
