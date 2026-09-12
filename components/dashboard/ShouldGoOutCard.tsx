import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';

type ShouldGoOutCardProps = {
  title: string;
  subtitle: string;
  explanation: string;
};

export function ShouldGoOutCard({ title, subtitle, explanation }: ShouldGoOutCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Стоит ли выходить сейчас?</Text>

      <View style={styles.body}>
        <View style={styles.content}>
          <View style={styles.checkCircle}>
            <DashboardIcon icon={dashboardIcons.check} size={20} />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            <Text style={styles.explanation}>{explanation}</Text>
          </View>
        </View>

        <View style={styles.illustration} pointerEvents="none">
          <View style={styles.cityBlock} />
          <View style={styles.cityBlock2} />
          <View style={styles.walker} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 14,
  },
  body: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    minWidth: 0,
    paddingRight: 8,
  },
  checkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8F9EE',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 2,
  },
  textBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 20,
  },
  explanation: {
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
    marginTop: 4,
  },
  illustration: {
    width: 72,
    height: 80,
    position: 'relative',
    flexShrink: 0,
    backgroundColor: '#EAF7FF',
    borderRadius: 14,
    overflow: 'hidden',
  },
  cityBlock: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    width: 18,
    height: 36,
    backgroundColor: '#B8DFF5',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  cityBlock2: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    width: 22,
    height: 48,
    backgroundColor: '#9DD4FA',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  walker: {
    position: 'absolute',
    bottom: 10,
    left: 28,
    width: 14,
    height: 28,
    borderRadius: 7,
    backgroundColor: colors.primaryDark,
    opacity: 0.7,
  },
});
