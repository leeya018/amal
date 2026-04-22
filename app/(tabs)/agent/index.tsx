import { useEffect, useRef, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { ChatBubble } from "@/components/agent/ChatBubble";
import { ChatInput } from "@/components/agent/ChatInput";
import { ActionItemsModal } from "@/components/agent/ActionItemsModal";
import { useChats } from "@/hooks/useChats";
import { useTodos } from "@/hooks/useTodos";
import { extractActionItems, type ActionItem } from "@/lib/gemini";
import type { Chat } from "@/types/app";

export default function AgentScreen() {
  const { t } = useTranslation();
  const { messages, thinking, send } = useChats();
  const { createMany } = useTodos();
  const listRef = useRef<FlatList>(null);
  const [actionItems,         setActionItems]         = useState<ActionItem[]>([]);
  const [modalVisible,        setModalVisible]        = useState(false);
  const [extractingMessageId, setExtractingMessageId] = useState<string | null>(null);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
    }
  }, [messages.length]);

  const handleSend = async (text: string) => {
    try {
      await send(text);
      const items = await extractActionItems(text);
      if (items.length > 0) {
        setActionItems(items);
        setModalVisible(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const key = /\[(429|503)\b/.test(msg) ? "errors.aiBusy" : "errors.generic";
      Alert.alert(t("agent.title"), t(key));
    }
  };

  const addAll = async () => {
    await createMany(actionItems.map((i) => ({
      title: i.title,
      description: i.description ?? null,
      due_date: null,
    })));
    setActionItems([]);
    setModalVisible(false);
  };

  const handleExtract = async (message: Chat) => {
    if (extractingMessageId) return;
    setExtractingMessageId(message.id);
    try {
      const items = await extractActionItems(message.message_text);
      if (items.length === 0) {
        Alert.alert(t("agent.title"), t("agent.noActionItems"));
        return;
      }
      setActionItems(items);
      setModalVisible(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const key = /\[(429|503)\b/.test(msg) ? "errors.aiBusy" : "errors.generic";
      Alert.alert(t("agent.title"), t(key));
    } finally {
      setExtractingMessageId(null);
    }
  };

  const showGreeting = messages.length === 0 && !thinking;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <View className="px-6 pt-2 pb-3 border-b border-brand-100/70">
        <Txt variant="title" className="text-brand-700" style={{ textAlign: "right" }}>
          {t("agent.title")}
        </Txt>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        className="flex-1"
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          ListHeaderComponent={
            showGreeting ? (
              <View className="bg-white border border-brand-100 rounded-3xl p-5 mb-4">
                <Txt variant="body" className="text-ink" style={{ textAlign: "right" }}>
                  {t("agent.greeting")}
                </Txt>
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <ChatBubble
              message={item}
              onExtract={handleExtract}
              extracting={extractingMessageId === item.id}
            />
          )}
          ListFooterComponent={
            thinking ? (
              <View className="flex-row justify-end mb-2">
                <View className="bg-white border border-brand-100 rounded-3xl rounded-es-md px-4 py-3">
                  <Txt variant="caption" tone="muted">{t("agent.thinking")}</Txt>
                </View>
              </View>
            ) : null
          }
        />

        <ChatInput onSend={handleSend} disabled={thinking} />
      </KeyboardAvoidingView>

      <ActionItemsModal
        visible={modalVisible}
        items={actionItems}
        onAddAll={addAll}
        onDismiss={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}
