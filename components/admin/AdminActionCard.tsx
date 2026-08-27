import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { AdminAction } from '../../types/admin';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { adminIcons } from './adminIcons';

type AdminActionCardProps = {
  action: AdminAction;
  onPress?: () => void;
};

export function AdminActionCard({ action, onPress }: AdminActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.card}
      accessibilityRole="button"
    >
      <View style={styles.iconWrap}>
        <DashboardIcon icon={action.icon} size={18} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {action.title}
        </Text>
        <Text style={styles.subtitle} numberOfLines={2}>
          {action.subtitle}
        </Text>
      </View>
      <DashboardIcon icon={adminIcons.chevronRight} size={16} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    ...shadows.soft,
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 15,
  },
  subtitle: {
    fontSize: 10,
    color: colors.textMuted,
    lineHeight: 13,
  },
});
