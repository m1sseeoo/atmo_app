import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AtmoLogo } from '../AtmoLogo';
import { colors } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { dashboardIcons } from '../dashboard/dashboardIcons';

type AnalyticsHeaderProps = {
  onBack?: () => void;
};

export function AnalyticsHeader({ onBack }: AnalyticsHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            style={styles.backBtn}
            accessibilityRole="button"
            accessibilityLabel="Назад"
          >
            <DashboardIcon icon={dashboardIcons.chevronLeft} size={22} />
          </Pressable>
        ) : (
            <AtmoLogo width={88} />
        )}
      </View>

      <Text style={styles.title} numberOfLines={1}>
        Подробная аналитика
      </Text>

      <View style={styles.side}>
        <Pressable style={styles.filterBtn} accessibilityRole="button" accessibilityLabel="Фильтр">
          <DashboardIcon icon={dashboardIcons.sliders} size={18} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  side: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -6,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 20,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});
