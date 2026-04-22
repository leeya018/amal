import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  I18nManager,
  ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface ChatInputProps {
  onSend: (text: string) => void;
  onVoiceStart: () => void;
  onVoiceStop: () => void;
  isRecordingVoice: boolean;
  isSending: boolean;
  disabled?: boolean;
}

export function ChatInput({
  onSend,
  onVoiceStart,
  onVoiceStop,
  isRecordingVoice,
  isSending,
  disabled,
}: ChatInputProps) {
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const isRTL = I18nManager.isRTL;

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText('');
  }

  return (
    <View className="flex-row items-end gap-2 px-3 py-3 bg-white border-t border-calm-border">
      {/* Voice button */}
      <TouchableOpacity
        onPressIn={onVoiceStart}
        onPressOut={onVoiceStop}
        disabled={disabled || isSending}
        className={`w-11 h-11 rounded-full items-center justify-center flex-shrink-0 ${
          isRecordingVoice ? 'bg-danger' : 'bg-calm-surface'
        }`}
      >
        <Text className="text-lg">{isRecordingVoice ? '⏹' : '🎤'}</Text>
      </TouchableOpacity>

      {/* Text input */}
      <TextInput
        className="flex-1 bg-calm-surface rounded-2xl px-4 py-2.5 text-gray-800 text-base min-h-[44px] max-h-28"
        placeholder={t('agent.placeholder')}
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        multiline
        textAlign={isRTL ? 'right' : 'left'}
        editable={!disabled && !isSending}
      />

      {/* Send button */}
      <TouchableOpacity
        onPress={handleSend}
        disabled={disabled || isSending || !text.trim()}
        className={`w-11 h-11 rounded-full items-center justify-center flex-shrink-0 ${
          text.trim() && !isSending ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        {isSending ? (
          <ActivityIndicator size="small" color="#7c3aed" />
        ) : (
          <Text className="text-white text-lg">{isRTL ? '←' : '→'}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
