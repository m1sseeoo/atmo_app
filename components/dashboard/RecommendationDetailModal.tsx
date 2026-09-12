import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { Recommendation } from '../../types/dashboard';
import { DashboardIcon } from './DashboardIcon';

type RecommendationDetailModalProps = {
  item: Recommendation | null;
  onClose: () => void;
};

export function RecommendationDetailModal({ item, onClose }: RecommendationDetailModalProps) {
  const values = item?.allValues?.length ? item.allValues : item ? [item.value] : [];

  return (
    <Modal visible={item !== null} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(event) => event.stopPropagation()}>
          {item ? (
            <>
              <View style={styles.header}>
                <DashboardIcon icon={item.icon} size={22} container />
                <Text style={styles.title}>{item.title}</Text>
              </View>
              <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
                {values.map((value, index) => (
                  <View key={`${value}-${index}`} style={styles.row}>
                    <View style={styles.bullet} />
                    <Text style={styles.value}>{value}</Text>
                  </View>
                ))}
              </ScrollView>
              <Pressable onPress={onClose} style={styles.closeBtn} accessibilityRole="button">
                <Text style={styles.closeText}>Закрыть</Text>
              </Pressable>
            </>
          ) : null}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20,33,61,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    maxHeight: '70%',
    ...shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
  },
  list: {
    maxHeight: 280,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  value: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMain,
  },
  closeBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.primarySoft,
  },
  closeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
