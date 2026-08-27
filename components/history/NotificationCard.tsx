import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { AtmoNotification } from '../../types/notification';
import { formatNotificationTime } from '../../services/notificationService';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import type { DashboardIconConfig } from '../dashboard/DashboardIcon';
import { historyIcons } from './historyIcons';

type NotificationCardProps = {
  notification: AtmoNotification;
  onPress?: (id: string) => void;
};

const STYLES = {
  danger: {
    cardBg: '#FFF5F5',
    iconBg: '#FFE4E4',
    icon: historyIcons.alertTriangle,
  },
  warning: {
    cardBg: '#FFFBEB',
    iconBg: '#FFF0C2',
    icon: historyIcons.bell,
  },
  info: {
    cardBg: '#F0F9FF',
    iconBg: '#EAF7FF',
    icon: historyIcons.cloud,
  },
} as const satisfies Record<
  AtmoNotification['type'],
  { cardBg: string; iconBg: string; icon: DashboardIconConfig }
>;

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const palette = STYLES[notification.type];
  const timeLabel = formatNotificationTime(notification.createdAt);

  return (
    <Pressable
      onPress={() => onPress?.(notification.id)}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: palette.cardBg },
        !notification.read && styles.unread,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: !notification.read }}
    >
      <View style={[styles.iconWrap, { backgroundColor: palette.iconBg }]}>
        <DashboardIcon icon={palette.icon} size={18} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, !notification.read && styles.titleUnread]}>
            {notification.title}
          </Text>
          {!notification.read ? <View style={styles.unreadDot} /> : null}
        </View>
        {notification.body.map((line, index) => (
          <Text key={`${notification.id}-${index}`} style={styles.body}>
            {line}
          </Text>
        ))}
        <Text style={styles.time}>{timeLabel}</Text>
      </View>

      <DashboardIcon icon={historyIcons.chevronRight} size={18} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadows.soft,
  },
  unread: {
    borderColor: colors.primary,
  },
  pressed: {
    opacity: 0.92,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 20,
  },
  titleUnread: {
    fontWeight: '700',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primaryDark,
    flexShrink: 0,
  },
  body: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  time: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 2,
  },
});
