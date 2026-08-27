import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';

function PersonIcon() {
  return (
    <View style={styles.iconWrap}>
      <View style={styles.head} />
      <View style={styles.shoulders} />
      <View style={styles.badge}>
        <View style={styles.badgeDot} />
      </View>
    </View>
  );
}

type Props = { text: string };

export function DisclaimerCard({ text }: Props) {
  return (
    <View style={styles.card}>
      <PersonIcon />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    ...shadows.soft,
  },
  iconWrap: {
    width: 34,
    height: 34,
    position: 'relative',
    marginTop: 1,
    flexShrink: 0,
  },
  head: {
    position: 'absolute',
    top: 2,
    left: 7,
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: colors.primaryDark,
    backgroundColor: colors.white,
  },
  shoulders: {
    position: 'absolute',
    top: 12,
    left: 3,
    width: 18,
    height: 9,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
    borderWidth: 1.5,
    borderBottomWidth: 0,
    borderColor: colors.primaryDark,
    backgroundColor: colors.white,
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 16,
    borderRadius: 4,
    backgroundColor: colors.primarySoft,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    width: 3,
    height: 5,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  text: {
    fontSize: 12,
    lineHeight: 17,
    color: colors.textMuted,
    flex: 1,
  },
});
