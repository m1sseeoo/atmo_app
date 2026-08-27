import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from './DashboardIcon';
import { dashboardIcons } from './dashboardIcons';
import { StatusPill } from './StatusPill';

type ComfortIndexCardProps = {
  score: number;
  status: string;
  conclusion: string;
};

export function ComfortIndexCard({ score, status, conclusion }: ComfortIndexCardProps) {
  const progress = score / 100;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>Индекс комфорта</Text>
        <View style={styles.infoBtn}>
          <DashboardIcon icon={dashboardIcons.info} size={12} />
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.gaugeWrap}>
          <View style={styles.gaugeTrack} />
          <View style={[styles.gaugeArc, { transform: [{ rotate: `${-90 + progress * 360}deg` }] }]} />
          <View style={styles.gaugeInner}>
            <Text style={styles.score}>{score}</Text>
            <Text style={styles.scoreMax}>/100</Text>
          </View>
        </View>

        <View style={styles.info}>
          <StatusPill label={status} />
          <Text style={styles.conclusion}>{conclusion}</Text>
        </View>

        <View style={styles.deco} pointerEvents="none">
          <View style={styles.sun} />
          <View style={styles.cloudDeco} />
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
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
  },
  infoBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    position: 'relative',
  },
  gaugeWrap: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  gaugeTrack: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 9,
    borderColor: '#EAF7FF',
  },
  gaugeArc: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 9,
    borderColor: colors.primary,
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
  },
  gaugeInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  score: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 32,
  },
  scoreMax: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: -2,
  },
  info: {
    flex: 1,
    gap: 8,
    minWidth: 0,
  },
  conclusion: {
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  deco: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 70,
    height: 60,
  },
  sun: {
    position: 'absolute',
    top: 4,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFE9A8',
    borderWidth: 2,
    borderColor: '#FFD666',
  },
  cloudDeco: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
