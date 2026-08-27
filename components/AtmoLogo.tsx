import { Image, StyleSheet, type ImageStyle, type StyleProp } from 'react-native';

const LOGO_ASPECT_RATIO = 696 / 191;

export type AtmoLogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export function AtmoLogo({ width = 132, height, style }: AtmoLogoProps) {
  const logoHeight = height ?? Math.round(width / LOGO_ASPECT_RATIO);

  return (
    <Image
      source={require('../assets/images/atmo-logo.png')}
      style={[styles.logo, { width, height: logoHeight }, style]}
      resizeMode="contain"
      accessibilityLabel="atmo"
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    flexShrink: 0,
  },
});
