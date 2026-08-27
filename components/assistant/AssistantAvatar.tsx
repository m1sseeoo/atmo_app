import { Image, StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';

export function AssistantAvatar() {
  return (
    <View style={styles.wrap}>
      <Image
        source={require('../../assets/images/atmo-logo.png')}
        style={styles.logo}
        resizeMode="contain"
        accessibilityLabel="atmo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
  },
  logo: {
    width: 30,
    height: 30,
  },
});
