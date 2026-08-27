import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';
import type { AtmoDevice } from '../../types/device';

type SelectedLocationMetaProps = {
  nearestDevice: AtmoDevice | null;
};

export function SelectedLocationMeta({ nearestDevice }: SelectedLocationMetaProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.text}>
        {nearestDevice
          ? `Ближайшая станция: ${nearestDevice.name}`
          : 'Нет активной станции рядом'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 2,
  },
  text: {
    fontSize: 12,
    lineHeight: 16,
    color: colors.textMuted,
  },
});
