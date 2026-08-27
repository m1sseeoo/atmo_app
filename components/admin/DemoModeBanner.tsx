import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';

export function DemoModeBanner() {
  return (
    <View style={styles.banner}>
      <Text style={styles.text}>
        Демо-режим: действия выполняются локально и не отправляются на устройства.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.primarySoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.primaryDark,
    fontWeight: '500',
  },
});
