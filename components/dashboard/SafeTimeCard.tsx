import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type SafeTimeCardProps = {
  safeTime: string;
  returnAdvice: string;
  worseningNote?: string;
  updatedAt: string;
};

export function SafeTimeCard({
  safeTime,
  returnAdvice,
  worseningNote,
  updatedAt,
}: SafeTimeCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <View style={styles.left}>
          <DashboardIcon
            icon={{ ...dashboardIcons.clock, bg: colors.primarySoft }}
            size={20}
            container
            containerStyle={styles.clockContainer}
          />
          <View style={styles.textBlock}>
            <Text style={styles.label}>Ориентировочно безопасное время пребывания на улице</Text>
            <Text style={styles.updated}>Обновлено {updatedAt}</Text>
          </View>
        </View>
        <Text style={styles.value}>{safeTime}</Text>
      </View>
      <Text style={styles.advice}>{returnAdvice}</Text>
      {worseningNote ? <Text style={styles.note}>{worseningNote}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
    ...shadows.soft,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minWidth: 0,
  },
  clockContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
  },
  textBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
    color: colors.textMain,
  },
  updated: {
    fontSize: 12,
    color: colors.textMuted,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textMain,
    flexShrink: 0,
    letterSpacing: -0.3,
  },
  advice: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMain,
  },
  note: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
});
