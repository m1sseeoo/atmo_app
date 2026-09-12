import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { formatAdminLogTime } from '../../services/adminService';
import type { AdminActionLog, AdminActionStatus } from '../../types/admin';

type AdminActionLogsListProps = {
  logs: AdminActionLog[];
  onClear: () => void;
};

const STATUS_COLORS: Record<AdminActionStatus, string> = {
  success: '#15803D',
  pending: '#B45309',
  failed: '#DC2626',
};

const STATUS_LABELS: Record<AdminActionStatus, string> = {
  success: 'Успешно',
  pending: 'В процессе',
  failed: 'Ошибка',
};

export function AdminActionLogsList({ logs, onClear }: AdminActionLogsListProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Журнал действий</Text>
        {logs.length > 0 ? (
          <Pressable onPress={onClear} accessibilityRole="button">
            <Text style={styles.clearLink}>Очистить журнал</Text>
          </Pressable>
        ) : null}
      </View>

      {logs.length === 0 ? (
        <Text style={styles.empty}>Действий пока нет</Text>
      ) : (
        <View style={styles.list}>
          {logs.map((log) => (
            <View key={log.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{log.title}</Text>
                <Text style={[styles.status, { color: STATUS_COLORS[log.status] }]}>
                  {STATUS_LABELS[log.status]}
                </Text>
              </View>
              {log.deviceId ? (
                <Text style={styles.meta}>Устройство: {log.deviceId}</Text>
              ) : null}
              <Text style={styles.message}>{log.message}</Text>
              <Text style={styles.time}>{formatAdminLogTime(log.createdAt)}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
    flex: 1,
  },
  clearLink: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 18,
  },
  empty: {
    fontSize: 13,
    color: colors.textMuted,
    lineHeight: 18,
  },
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    gap: 4,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 18,
    flex: 1,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 14,
  },
  meta: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
  },
  message: {
    fontSize: 12,
    color: colors.textMain,
    lineHeight: 16,
  },
  time: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
    alignSelf: 'flex-end',
  },
});
