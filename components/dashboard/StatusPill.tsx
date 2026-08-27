import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../constants/theme';

type StatusPillProps = {
  label: string;
  variant?: 'success' | 'warning' | 'neutral';
};

export function StatusPill({ label, variant = 'success' }: StatusPillProps) {
  const palette = VARIANTS[variant];

  return (
    <View style={[styles.pill, { backgroundColor: palette.bg }]}>
      <View style={[styles.dot, { backgroundColor: palette.dot }]} />
      <Text style={[styles.label, { color: palette.text }]}>{label}</Text>
    </View>
  );
}

const VARIANTS = {
  success: { bg: '#E8F9EE', dot: '#22C55E', text: '#15803D' },
  warning: { bg: '#FFF7E6', dot: '#F59E0B', text: '#B45309' },
  neutral: { bg: colors.primarySoft, dot: colors.primary, text: colors.primaryDark },
} as const;

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
});
