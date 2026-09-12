import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import type { DashboardIconConfig } from '../dashboard/DashboardIcon';
import { adminIcons, type AdminTab } from './adminIcons';

export type { AdminTab };

type TabConfig = {
  id: AdminTab;
  label: string;
  icon: DashboardIconConfig;
};

const TABS: TabConfig[] = [
  { id: 'home', label: 'Главная', icon: adminIcons.home },
  { id: 'analytics', label: 'Аналитика', icon: adminIcons.analytics },
  { id: 'map', label: 'Карта устройств', icon: adminIcons.map },
  { id: 'notifications', label: 'Уведомления', icon: adminIcons.notifications },
  { id: 'admin', label: 'Admin', icon: adminIcons.admin },
];

type AdminBottomTabBarProps = {
  active: AdminTab;
  onChange: (tab: AdminTab) => void;
  embedded?: boolean;
};

export function AdminBottomTabBar({ active, onChange, embedded = false }: AdminBottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrap,
        embedded ? styles.wrapEmbedded : { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      <View style={styles.bar}>
        {TABS.map((tab) => {
          const isActive = tab.id === active;
          const icon = {
            ...tab.icon,
            color: isActive ? colors.primaryDark : colors.textMuted,
          };

          return (
            <Pressable
              key={tab.id}
              onPress={() => onChange(tab.id)}
              style={[styles.tab, isActive && styles.tabActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <DashboardIcon icon={icon} size={18} />
              <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    paddingTop: 6,
  },
  wrapEmbedded: {
    marginTop: 8,
    paddingHorizontal: 0,
    paddingTop: 0,
    backgroundColor: 'transparent',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,
    paddingHorizontal: 4,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 2,
    borderRadius: 14,
    minWidth: 0,
  },
  tabActive: {
    backgroundColor: colors.primarySoft,
  },
  label: {
    fontSize: 8,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 10,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
