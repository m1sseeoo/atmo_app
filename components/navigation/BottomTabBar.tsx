import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import type { DashboardIconConfig } from '../dashboard/DashboardIcon';
import { mapIcons } from '../map/mapIcons';

export type MainTab = 'home' | 'analytics' | 'map' | 'assistant' | 'profile' | 'admin';

type TabConfig = {
  id: MainTab;
  label: string;
  icon: DashboardIconConfig;
};

const TABS: TabConfig[] = [
  { id: 'home', label: 'Главная', icon: mapIcons.home },
  { id: 'analytics', label: 'Аналитика', icon: mapIcons.analytics },
  { id: 'map', label: 'Карта устройств', icon: mapIcons.map },
  { id: 'assistant', label: 'ИИ ассистент', icon: mapIcons.assistant },
  { id: 'profile', label: 'Профиль', icon: mapIcons.profile },
];

type BottomTabBarProps = {
  active: MainTab;
  onChange: (tab: MainTab) => void;
  embedded?: boolean;
};

export function BottomTabBar({ active, onChange, embedded = false }: BottomTabBarProps) {
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
              style={styles.tab}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <DashboardIcon icon={icon} size={20} />
              <Text
                style={[styles.label, isActive && styles.labelActive]}
                numberOfLines={1}
              >
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
    paddingVertical: 8,
    paddingHorizontal: 4,
    ...shadows.card,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 4,
    minWidth: 0,
  },
  label: {
    fontSize: 9,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 11,
    textAlign: 'center',
  },
  labelActive: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
});
