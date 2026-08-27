import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AtmoLogo } from '../AtmoLogo';
import { colors } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type DashboardHeaderProps = {
  userName?: string;
};

function getInitial(name?: string): string {
  const trimmed = name?.trim();
  if (!trimmed) {
    return '';
  }
  return trimmed.charAt(0).toUpperCase();
}

export function DashboardHeader({ userName }: DashboardHeaderProps) {
  const initial = getInitial(userName);

  return (
    <View style={styles.row}>
      <AtmoLogo />
      <View style={styles.actions}>
        <Pressable style={styles.bellBtn} accessibilityRole="button">
          <DashboardIcon icon={dashboardIcons.bell} size={20} />
          <View style={styles.bellDot} />
        </Pressable>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            {initial ? <Text style={styles.avatarInitial}>{initial}</Text> : null}
          </View>
          <DashboardIcon icon={dashboardIcons.chevronDown} size={14} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: colors.background,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4EDFF',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
