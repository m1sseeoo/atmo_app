import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { AdminSummary, AdminSummaryTone } from '../../types/admin';
import { DashboardIcon } from '../dashboard/DashboardIcon';

const TONE_STYLES: Record<AdminSummaryTone, { bg: string; value: string }> = {
  blue: { bg: '#EAF7FF', value: colors.textMain },
  green: { bg: '#E8F9EE', value: '#15803D' },
  orange: { bg: '#FFF7E6', value: '#B45309' },
};

type AdminSummaryCardProps = {
  item: AdminSummary;
};

export function AdminSummaryCard({ item }: AdminSummaryCardProps) {
  const tone = TONE_STYLES[item.tone];

  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: tone.bg }]}>
        <DashboardIcon icon={item.icon} size={18} />
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {item.title}
      </Text>
      <Text style={[styles.value, { color: tone.value }]} numberOfLines={1}>
        {item.value}
      </Text>
      <Text style={styles.subtitle} numberOfLines={1}>
        {item.subtitle}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 6,
    ...shadows.soft,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 14,
    minHeight: 28,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
  },
});
