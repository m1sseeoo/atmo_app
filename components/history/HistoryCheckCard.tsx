import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { HistoryItem } from '../../types/history';
import { formatHistoryDate } from '../../services/historyService';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import {
  comfortStatusToLabel,
  comfortStatusToRouteStatus,
  formatHistoryMetrics,
} from '../../utils/historyMappers';
import { ComfortBadge } from './ComfortBadge';
import { historyIcons } from './historyIcons';

type HistoryCheckCardProps = {
  item: HistoryItem;
  onDelete?: (id: string) => void;
};

export function HistoryCheckCard({ item, onDelete }: HistoryCheckCardProps) {
  const metrics = formatHistoryMetrics(item);

  return (
    <View style={styles.card}>
      <View style={styles.iconBlock}>
        <DashboardIcon icon={historyIcons.mapPin} size={18} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>

        <View style={styles.metaRow}>
          <DashboardIcon icon={historyIcons.calendar} size={13} />
          <Text style={styles.metaText}>{formatHistoryDate(item.createdAt)}</Text>
        </View>

        <View style={styles.metaRow}>
          <DashboardIcon icon={historyIcons.location} size={13} />
          <Text style={styles.metaText} numberOfLines={1}>
            {item.locationLabel}
          </Text>
        </View>

        <Text style={styles.summary} numberOfLines={2}>
          {item.summary}
        </Text>

        {metrics ? <Text style={styles.metrics}>{metrics}</Text> : null}
      </View>

      <View style={styles.right}>
        <ComfortBadge
          label={comfortStatusToLabel(item.status)}
          index={item.comfortIndex}
          status={comfortStatusToRouteStatus(item.status)}
        />
        {onDelete ? (
          <Pressable
            onPress={() => onDelete(item.id)}
            style={styles.deleteBtn}
            accessibilityRole="button"
            accessibilityLabel="Удалить запись"
          >
            <DashboardIcon icon={historyIcons.trash} size={16} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    ...shadows.soft,
  },
  iconBlock: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 5,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 20,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
    flexShrink: 1,
  },
  summary: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMain,
  },
  metrics: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 16,
  },
  right: {
    alignItems: 'flex-end',
    gap: 8,
    flexShrink: 0,
  },
  deleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primarySoft,
  },
});
