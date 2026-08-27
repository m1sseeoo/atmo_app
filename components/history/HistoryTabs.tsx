import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { HistoryTab } from '../../types/history';

type HistoryTabsProps = {
  active: HistoryTab;
  onChange: (tab: HistoryTab) => void;
  notificationCount?: number;
};

export function HistoryTabs({
  active,
  onChange,
  notificationCount = 0,
}: HistoryTabsProps) {
  return (
    <View style={styles.track}>
      <Pressable
        onPress={() => onChange('history')}
        style={[styles.tab, active === 'history' && styles.tabActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'history' }}
      >
        <Text style={[styles.label, active === 'history' && styles.labelActive]}>История</Text>
      </Pressable>

      <Pressable
        onPress={() => onChange('notifications')}
        style={[styles.tab, active === 'notifications' && styles.tabActive]}
        accessibilityRole="button"
        accessibilityState={{ selected: active === 'notifications' }}
      >
        <View style={styles.notificationsWrap}>
          <Text style={[styles.label, active === 'notifications' && styles.labelActive]}>
            Уведомления
          </Text>
          {notificationCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: 'row',
    backgroundColor: colors.primarySoft,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
  },
  tabActive: {
    backgroundColor: colors.white,
    ...shadows.soft,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 18,
  },
  labelActive: {
    color: colors.primaryDark,
  },
  notificationsWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 12,
  },
});
