import { StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { DeviceStatus } from '../../types/device';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { mapIcons } from './mapIcons';

type StationPinProps = {
  selected?: boolean;
  status?: DeviceStatus;
};

const PIN_COLORS: Record<DeviceStatus, string> = {
  online: colors.primaryDark,
  delayed: '#F59E0B',
  offline: '#94A3B8',
};

export function StationPin({ selected = false, status = 'online' }: StationPinProps) {
  const pinColor = PIN_COLORS[status];

  if (selected) {
    return (
      <View style={styles.selectedWrap}>
        <View style={[styles.selectedHalo, status === 'offline' && styles.haloMuted]} />
        <View
          style={[
            styles.selectedBg,
            { borderColor: pinColor },
            status === 'online' && styles.selectedBgOnline,
          ]}
        >
          <DashboardIcon
            icon={{
              ...mapIcons.locationSharp,
              color: status === 'online' ? colors.white : pinColor,
            }}
            size={22}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.wrap, status === 'offline' && styles.wrapOffline]}>
      <DashboardIcon icon={{ ...mapIcons.locationSharp, color: pinColor }} size={18} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapOffline: {
    opacity: 0.75,
  },
  selectedWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  selectedHalo: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(98, 189, 251, 0.35)',
  },
  haloMuted: {
    backgroundColor: 'rgba(148, 163, 184, 0.25)',
  },
  selectedBg: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  selectedBgOnline: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.white,
  },
});
