import type { RefObject } from 'react';
import { ScrollView, StyleSheet } from 'react-native';

import type { ChatMessage } from '../../types/assistant';
import { MessageBubble } from './MessageBubble';

type ChatMessagesAreaProps = {
  messages: ChatMessage[];
  scrollRef: RefObject<ScrollView | null>;
  onContentSizeChange?: () => void;
};

export function ChatMessagesArea({
  messages,
  scrollRef,
  onContentSizeChange,
}: ChatMessagesAreaProps) {
  return (
    <ScrollView
      ref={scrollRef}
      style={styles.area}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onContentSizeChange={onContentSizeChange}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  area: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
