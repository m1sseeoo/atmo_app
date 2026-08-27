import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { assistantIcons } from './assistantIcons';

type ChatInputBarProps = {
  onSend?: (text: string) => void;
};

export function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }
    onSend?.(trimmed);
    setText('');
  };

  return (
    <View style={styles.wrap}>
      <TextInput
        style={styles.input}
        placeholder="Задайте вопрос..."
        placeholderTextColor={colors.textMuted}
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSend}
        returnKeyType="send"
      />
      <Pressable
        onPress={handleSend}
        style={styles.sendBtn}
        accessibilityRole="button"
        accessibilityLabel="Отправить"
      >
        <DashboardIcon icon={assistantIcons.send} size={16} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    paddingLeft: 14,
    paddingRight: 6,
    minHeight: 56,
    gap: 8,
    ...shadows.soft,
  },
  input: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    color: colors.textMain,
    paddingVertical: 10,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
});
