import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { dashboardIcons } from '../dashboard/dashboardIcons';

export function AnalyticsInfoCard() {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <DashboardIcon icon={dashboardIcons.info} size={14} />
      </View>
      <View style={styles.textWrap}>
        <Text style={styles.text}>Данные обновляются каждые 10 минут.</Text>
        <Text style={styles.text}>Источники: ATMO-станция, открытые метеоданные.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadows.soft,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  textWrap: {
    flex: 1,
    gap: 4,
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
