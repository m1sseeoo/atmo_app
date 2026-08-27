import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';

type QuickQuestionChipsProps = {
  questions: readonly string[];
  onSelect?: (question: string) => void;
};

export function QuickQuestionChips({ questions, onSelect }: QuickQuestionChipsProps) {
  return (
    <View style={styles.wrap}>
      {questions.map((question) => (
        <Pressable
          key={question}
          onPress={() => onSelect?.(question)}
          style={styles.chip}
          accessibilityRole="button"
        >
          <Text style={styles.label}>{question}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    backgroundColor: colors.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...shadows.soft,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primaryDark,
    lineHeight: 17,
    textAlign: 'center',
  },
});
