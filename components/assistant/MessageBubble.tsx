import { StyleSheet, Text, View } from 'react-native';

import { colors, shadows } from '../../constants/theme';
import type { ChatMessage } from '../../types/assistant';
import { DashboardIcon } from '../dashboard/DashboardIcon';
import { AssistantAvatar } from './AssistantAvatar';
import { assistantIcons } from './assistantIcons';

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={styles.userBubble}>
          {message.lines.map((line, index) => (
            <Text key={`${message.id}-${index}`} style={styles.userText}>
              {line}
            </Text>
          ))}
          <View style={styles.userMeta}>
            <Text style={styles.userTime}>{message.time}</Text>
            <DashboardIcon icon={assistantIcons.read} size={14} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.assistantRow}>
      <AssistantAvatar />
      <View style={styles.assistantBubble}>
        {message.lines.map((line, index) => (
          <Text key={`${message.id}-${index}`} style={styles.assistantText}>
            {line}
          </Text>
        ))}
        <Text style={styles.assistantTime}>{message.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  userBubble: {
    maxWidth: '82%',
    backgroundColor: colors.primary,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 4,
  },
  userText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.white,
  },
  userMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 4,
  },
  userTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 14,
  },
  assistantRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 10,
    paddingRight: 20,
  },
  assistantBubble: {
    flex: 1,
    maxWidth: '78%',
    backgroundColor: colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 4,
    ...shadows.soft,
  },
  assistantText: {
    fontSize: 15,
    lineHeight: 21,
    color: colors.textMain,
  },
  assistantTime: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 14,
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});
