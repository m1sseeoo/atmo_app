export type AssistantMessageRole = 'user' | 'assistant';

export type AssistantMessage = {
  id: string;
  role: AssistantMessageRole;
  text: string;
  createdAt: string;
};

export type AssistantIntent =
  | 'should_go_out'
  | 'what_to_wear'
  | 'comfort'
  | 'when_better'
  | 'weather_summary'
  | 'air_quality'
  | 'uv'
  | 'rain'
  | 'device'
  | 'unknown';

/** UI chat bubble shape derived from {@link AssistantMessage}. */
export type ChatMessage = {
  id: string;
  role: AssistantMessageRole;
  lines: string[];
  time: string;
};

export const INITIAL_ASSISTANT_GREETING =
  'Привет! Я помогу понять, стоит ли выходить сейчас, что надеть и как долго лучше быть на улице.';

export const quickQuestions = [
  'Стоит ли идти гулять?',
  'Что лучше надеть?',
  'Насколько комфортно сейчас?',
  'Когда лучше вернуться?',
] as const;

export function formatChatTime(dateString: string): string {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function createAssistantMessage(
  role: AssistantMessageRole,
  text: string,
): AssistantMessage {
  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  };
}

export function assistantMessageToChatMessage(message: AssistantMessage): ChatMessage {
  return {
    id: message.id,
    role: message.role,
    lines: message.text.split('\n').filter((line) => line.length > 0),
    time: formatChatTime(message.createdAt),
  };
}
