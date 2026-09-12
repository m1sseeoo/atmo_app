import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AtmoLogo } from '../AtmoLogo';
import { colors } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { historyIcons } from './historyIcons';

type HistoryHeaderProps = {
  onOpenAdmin?: () => void;
};

export function HistoryHeader({ onOpenAdmin }: HistoryHeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.side}>
          <AtmoLogo width={88} />
      </View>
      <Text style={styles.title}>История</Text>
      <View style={styles.side}>
        <Pressable
          style={styles.avatarBtn}
          accessibilityRole="button"
          accessibilityLabel="Профиль"
          onPress={onOpenAdmin}
        >
          <DashboardIcon icon={historyIcons.user} size={18} />
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
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  avatarBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 'auto',
  },
});
