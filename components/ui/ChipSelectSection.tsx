import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors, radius, shadows, spacing, typography } from '../../constants/theme';
import { Chip } from './Chip';
import { DashedAddButton } from './DashedAddButton';

type ChipSelectSectionProps<T extends string> = {
  label: string;
  selected: T[];
  options: readonly T[];
  addLabel: string;
  onAdd: (value: T) => void;
  onRemove: (value: T) => void;
};

export function ChipSelectSection<T extends string>({
  label,
  selected,
  options,
  addLabel,
  onAdd,
  onRemove,
}: ChipSelectSectionProps<T>) {
  const [open, setOpen] = useState(false);
  const available = options.filter((option) => !selected.includes(option));

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chipWrap}>
        {selected.map((item) => (
          <Chip key={item} label={item} onRemove={() => onRemove(item)} />
        ))}
        {available.length > 0 ? (
          <DashedAddButton label={addLabel} onPress={() => setOpen(true)} />
        ) : null}
      </View>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <FlatList
              data={available as T[]}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onAdd(item);
                    setOpen(false);
                  }}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
    color: colors.textMain,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    rowGap: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(20, 33, 61, 0.35)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.xl,
    maxHeight: '60%',
    ...shadows.card,
  },
  sheetTitle: {
    ...typography.heading,
    color: colors.textMain,
    marginBottom: spacing.lg,
  },
  option: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  optionPressed: {
    backgroundColor: colors.primarySoft,
  },
  optionText: {
    ...typography.body,
    color: colors.textMain,
  },
});
