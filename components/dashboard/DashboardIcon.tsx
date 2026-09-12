import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

export type IconSetName = 'Feather' | 'Ionicons' | 'MaterialCommunityIcons';

export type DashboardIconConfig = {
  set: IconSetName;
  name: string;
  color: string;
  bg?: string;
};

export const iconBackgrounds = {
  blue: '#EAF7FF',
  green: '#EAFBF1',
  red: '#FFE9E9',
  purple: '#F3E8FF',
  orange: '#FFF4DE',
} as const;

const ICON_SETS = {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} as const;

type DashboardIconProps = {
  icon: DashboardIconConfig;
  size?: number;
  container?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
};

export function DashboardIcon({
  icon,
  size = 20,
  container = false,
  containerStyle,
}: DashboardIconProps) {
  const IconComponent = ICON_SETS[icon.set];

  const glyph = (
    <IconComponent name={icon.name as never} size={size} color={icon.color} />
  );

  if (!container) {
    return glyph;
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: icon.bg ?? iconBackgrounds.blue },
        containerStyle,
      ]}
    >
      {glyph}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
