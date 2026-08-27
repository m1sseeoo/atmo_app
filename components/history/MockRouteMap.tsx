import { StyleSheet, View } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

type MockRouteMapProps = {
  routeColor: string;
};

export function MockRouteMap({ routeColor }: MockRouteMapProps) {
  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 64 64">
        <Rect x="0" y="0" width="64" height="64" fill="#F3F0E8" rx="8" />
        <Rect x="8" y="10" width="18" height="14" fill="#D8EBD4" rx="4" />
        <Rect x="38" y="40" width="16" height="12" fill="#D8EBD4" rx="3" />
        <Path
          d="M 10 48 Q 22 36, 34 30 T 54 16"
          stroke={routeColor}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E4F1FA',
    flexShrink: 0,
  },
});
