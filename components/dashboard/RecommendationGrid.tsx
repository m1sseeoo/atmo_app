import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { Recommendation } from '../../types/dashboard';
import { DashboardIcon } from './DashboardIcon';

type RecommendationGridProps = {
  items: Recommendation[];
  onItemPress?: (item: Recommendation) => void;
};

export function RecommendationGrid({ items, onItemPress }: RecommendationGridProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Рекомендации</Text>
      <View style={styles.grid}>
        {items.map((item) => {
          const content = (
            <>
              <DashboardIcon icon={item.icon} size={20} container />
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardValue} numberOfLines={2}>
                {item.value}
              </Text>
              {item.extraCount ? (
                <Text style={styles.extra}>+{item.extraCount}</Text>
              ) : null}
            </>
          );

          if (onItemPress) {
            return (
              <Pressable
                key={item.title}
                onPress={() => onItemPress(item)}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                accessibilityRole="button"
              >
                {content}
              </Pressable>
            );
          }

          return (
            <View key={item.title} style={styles.card}>
              {content}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    flexBasis: '46%',
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
    minHeight: 104,
    ...shadows.soft,
  },
  cardPressed: {
    opacity: 0.92,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    lineHeight: 16,
  },
  cardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 18,
  },
  extra: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.primaryDark,
    alignSelf: 'flex-start',
    backgroundColor: colors.primarySoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
});
