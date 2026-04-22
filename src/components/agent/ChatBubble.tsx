import React from 'react';
import { View, Text, I18nManager } from 'react-native';
import type { ChatMessage } from '../../types/app';

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.sender === 'user';
  const isRTL = I18nManager.isRTL;

  // In RTL: user messages align right (start), AI aligns left (end)
  // In LTR: user messages align right (end), AI aligns left (start)
  const alignSelf = isUser ? 'flex-end' : 'flex-start';

  return (
    <View style={{ alignSelf, maxWidth: '80%', marginVertical: 4, marginHorizontal: 16 }}>
      <View
        className={`rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary-600 rounded-br-sm'
            : 'bg-calm-surface border border-calm-border rounded-bl-sm'
        }`}
      >
        <Text
          className={`text-base leading-6 ${isUser ? 'text-white' : 'text-calm-text'}`}
          style={{ textAlign: isRTL ? 'right' : 'left' }}
        >
          {message.message_text}
        </Text>
      </View>
      <Text className="text-gray-400 text-xs mt-1 mx-1" style={{ textAlign: alignSelf === 'flex-end' ? 'right' : 'left' }}>
        {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}

export function TypingIndicator() {
  return (
    <View style={{ alignSelf: 'flex-start', maxWidth: '80%', marginVertical: 4, marginHorizontal: 16 }}>
      <View className="bg-calm-surface border border-calm-border rounded-2xl rounded-bl-sm px-4 py-3">
        <Text className="text-gray-400 text-base">...</Text>
      </View>
    </View>
  );
}
