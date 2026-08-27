import { StyleSheet, Text, View } from 'react-native';

import { AtmoLogo } from '../AtmoLogo';
import { colors } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { adminIcons } from './adminIcons';

export function AdminHeader() {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
          <AtmoLogo width={88} />
      </View>
      <Text style={styles.title}>ATMO Admin</Text>
      <View style={styles.side}>
        <View style={styles.avatarWrap}>
          <View style={styles.avatar} />
          <DashboardIcon icon={adminIcons.chevronDown} size={14} />
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
    gap: 8,
  },
  side: {
    width: 88,
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  avatarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginLeft: 'auto',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#D4EDFF',
    borderWidth: 2,
    borderColor: colors.white,
  },
});
