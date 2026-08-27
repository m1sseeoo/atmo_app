import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';

type RemoteConfigModalProps = {
  visible: boolean;
  onClose: () => void;
  onApply: () => void;
};

export function RemoteConfigModal({ visible, onClose, onApply }: RemoteConfigModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={styles.title}>Удалённое управление</Text>
          <Text style={styles.label}>Интервал обновления</Text>
          <Text style={styles.value}>10 мин</Text>
          <Text style={styles.label}>Режим питания</Text>
          <Text style={styles.value}>Обычный</Text>
          <Pressable style={styles.applyBtn} onPress={onApply} accessibilityRole="button">
            <Text style={styles.applyText}>Применить настройки</Text>
          </Pressable>
          <Pressable style={styles.cancelBtn} onPress={onClose} accessibilityRole="button">
            <Text style={styles.cancelText}>Отмена</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(20, 33, 61, 0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 8,
    ...shadows.soft,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textMain,
    lineHeight: 22,
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textMain,
    lineHeight: 20,
  },
  applyBtn: {
    marginTop: 10,
    backgroundColor: colors.primaryDark,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  applyText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.white,
    lineHeight: 18,
  },
  cancelBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    lineHeight: 18,
  },
});
