import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { HistoryRoute } from '../../types/history';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { ComfortBadge } from './ComfortBadge';
import { historyIcons } from './historyIcons';
import { MockRouteMap } from './MockRouteMap';

type RouteHistoryCardProps = {
  route: HistoryRoute;
};

export function RouteHistoryCard({ route }: RouteHistoryCardProps) {
  const activityIcon = route.activity === 'walk' ? historyIcons.walk : historyIcons.bike;

  return (
    <View style={styles.card}>
      <MockRouteMap routeColor={route.routeColor} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {route.title}
        </Text>

        <View style={styles.metaRow}>
          <DashboardIcon icon={historyIcons.calendar} size={13} />
          <Text style={styles.metaText}>{route.date}</Text>
        </View>

        <View style={styles.metaRow}>
          <DashboardIcon icon={activityIcon} size={14} />
          <Text style={styles.metaText}>
            {route.distance} • {route.duration}
          </Text>
        </View>
      </View>

      <ComfortBadge
        label={route.comfortLabel}
        index={route.comfortIndex}
        status={route.status}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    ...shadows.soft,
  },
  content: {
    flex: 1,
    minWidth: 0,
    gap: 6,
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
});
