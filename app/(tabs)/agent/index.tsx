import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { Audio } from 'expo-av';

import { ChatBubble, TypingIndicator } from '../../../src/components/agent/ChatBubble';
import { ChatInput } from '../../../src/components/agent/ChatInput';
import { ActionItemsModal } from '../../../src/components/agent/ActionItemsModal';
import { useChats } from '../../../src/hooks/useChats';
import { useTodos } from '../../../src/hooks/useTodos';
import { useLanguage } from '../../../src/contexts/LanguageContext';
import { sendMessageToGemini, extractActionItems, type ChatMessage as GeminiMsg } from '../../../src/lib/gemini';
import { transcribeAudio } from '../../../src/lib/whisper';
import type { ChatMessage } from '../../../src/types/app';

export default function AgentScreen() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { messages, addMessage } = useChats();
  const { addBulkTodos } = useTodos();

  const [isSending, setIsSending] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [actionItems, setActionItems] = useState<{ title: string; description: string }[]>([]);
  const [actionItemsLoading, setActionItemsLoading] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [lastAiMsg, setLastAiMsg] = useState<ChatMessage | null>(null);

  const voiceRecordingRef = useRef<Audio.Recording | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Convert stored chat messages to Gemini history format
  function buildHistory(): GeminiMsg[] {
    return messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.message_text }],
    }));
  }

  async function sendText(text: string) {
    setIsSending(true);
    try {
      await addMessage(text, 'user');
      const history = buildHistory();
      const response = await sendMessageToGemini(text, history, language);
      const aiMsg = await addMessage(response, 'ai');
      if (aiMsg) setLastAiMsg(aiMsg);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      Alert.alert(t('common.error'), t('agent.errorGemini'));
    } finally {
      setIsSending(false);
    }
  }

  async function handleVoiceStart() {
    try {
      const { granted } = await Audio.requestPermissionsAsync();
      if (!granted) return;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync({
        ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
        android: {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY.android,
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
        },
      });
      voiceRecordingRef.current = recording;
      setIsRecordingVoice(true);
    } catch {
      Alert.alert(t('common.error'), t('agent.errorWhisper'));
    }
  }

  async function handleVoiceStop() {
    if (!voiceRecordingRef.current) return;
    setIsRecordingVoice(false);
    setIsSending(true);
    try {
      await voiceRecordingRef.current.stopAndUnloadAsync();
      const uri = voiceRecordingRef.current.getURI();
      voiceRecordingRef.current = null;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      if (!uri) return;
      const transcript = await transcribeAudio(uri, language);
      if (transcript) await sendText(transcript);
    } catch {
      Alert.alert(t('common.error'), t('agent.errorWhisper'));
    } finally {
      setIsSending(false);
    }
  }

  async function handleExtractTasks() {
    if (!lastAiMsg) return;
    setActionItemsLoading(true);
    setShowActionModal(true);
    try {
      const items = await extractActionItems(lastAiMsg.message_text, language);
      setActionItems(items);
    } finally {
      setActionItemsLoading(false);
    }
  }

  async function handleAddTodos(items: { title: string; description: string }[]) {
    await addBulkTodos(items);
    Alert.alert('', t('agent.addedToTodos'));
  }

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 border-b border-calm-border bg-white">
        <View>
          <Text className="text-xl font-bold text-calm-text">{t('agent.tabTitle')}</Text>
          <Text className="text-gray-400 text-xs">Amal AI</Text>
        </View>
        {lastAiMsg && (
          <TouchableOpacity
            onPress={handleExtractTasks}
            className="bg-primary-100 px-3 py-1.5 rounded-xl"
          >
            <Text className="text-primary-700 text-xs font-medium">
              {t('agent.extractTodos')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerClassName="py-4"
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-8">
            <Text className="text-5xl mb-4">💜</Text>
            <Text className="text-calm-text text-center text-base leading-7">
              {language === 'he'
                ? 'שלום, אני אמל. אני כאן בשבילך. מה עובר עלייך?'
                : language === 'ar'
                ? 'مرحباً، أنا أمل. أنا هنا من أجلك. ما الذي تمرين به؟'
                : 'Hi, I'm Amal. I'm here for you. How are you feeling?'}
            </Text>
          </View>
        }
        renderItem={({ item }) => <ChatBubble message={item} />}
        ListFooterComponent={isSending ? <TypingIndicator /> : null}
      />

      {/* Input */}
      <ChatInput
        onSend={sendText}
        onVoiceStart={handleVoiceStart}
        onVoiceStop={handleVoiceStop}
        isRecordingVoice={isRecordingVoice}
        isSending={isSending}
      />

      {/* Action items modal */}
      <ActionItemsModal
        visible={showActionModal}
        items={actionItems}
        loading={actionItemsLoading}
        onAdd={handleAddTodos}
        onClose={() => setShowActionModal(false)}
      />
    </SafeAreaView>
  );
}
