import { useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AssistantHeader } from '../components/assistant/AssistantHeader';
import { ChatBackground } from '../components/assistant/ChatBackground';
import { ChatInputBar } from '../components/assistant/ChatInputBar';
import { ChatMessagesArea } from '../components/assistant/ChatMessagesArea';
import { QuickQuestionChips } from '../components/assistant/QuickQuestionChips';
import { BottomTabBar, type MainTab } from '../components/navigation/BottomTabBar';
import { useAppState } from '../context/AppStateContext';
import { useProfile } from '../context/ProfileContext';
import { generateAssistantReply } from '../services/assistantService';
import {
  assistantMessageToChatMessage,
  createAssistantMessage,
  INITIAL_ASSISTANT_GREETING,
  quickQuestions,
  type AssistantMessage,
  type ChatMessage,
} from '../types/assistant';

const MAX_MESSAGE_LENGTH = 300;

type AssistantScreenProps = {
  onBack?: () => void;
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
};

function toChatMessages(messages: AssistantMessage[]): ChatMessage[] {
  return messages.map(assistantMessageToChatMessage);
}

export function AssistantScreen({ onBack, activeTab, onTabChange }: AssistantScreenProps) {
  const scrollRef = useRef<ScrollView>(null);
  const { profile } = useProfile();
  const { selectedLocation, selectedDevice, latestReading, recommendation } = useAppState();
  const [messages, setMessages] = useState<AssistantMessage[]>(() => [
    createAssistantMessage('assistant', INITIAL_ASSISTANT_GREETING),
  ]);

  const chatMessages = useMemo(() => toChatMessages(messages), [messages]);

  const scrollToEnd = (animated = true) => {
    scrollRef.current?.scrollToEnd({ animated });
  };

  const appendExchange = async (rawText: string) => {
    const userText = rawText.trim().slice(0, MAX_MESSAGE_LENGTH);
    if (!userText) {
      return;
    }

    const userMessage = createAssistantMessage('user', userText);
    setMessages((prev) => [...prev, userMessage]);
    requestAnimationFrame(() => scrollToEnd(true));

    const reply = await generateAssistantReply({
      message: userText,
      profile,
      selectedLocation,
      selectedDevice,
      reading: latestReading,
      recommendation,
    });

    setMessages((prev) => [...prev, createAssistantMessage('assistant', reply)]);
    requestAnimationFrame(() => scrollToEnd(true));
  };

  return (
    <ChatBackground>
      <SafeAreaView style={styles.screen} edges={['top']}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.flex}>
            <AssistantHeader onBack={onBack} />

            <ChatMessagesArea
              messages={chatMessages}
              scrollRef={scrollRef}
              onContentSizeChange={() => scrollToEnd(false)}
            />

            <View style={styles.bottomArea}>
              <QuickQuestionChips questions={quickQuestions} onSelect={appendExchange} />
              <ChatInputBar onSend={appendExchange} />
              <BottomTabBar active={activeTab} onChange={onTabChange} embedded />
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ChatBackground>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  bottomArea: {
    paddingTop: 4,
    gap: 8,
    paddingHorizontal: 18,
  },
});
