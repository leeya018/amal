import { Pressable, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import type { Chat } from "@/types/app";

type Props = {
  message:     Chat;
  onExtract?:  (message: Chat) => void;
  extracting?: boolean;
};

export const ChatBubble = ({ message, onExtract, extracting }: Props) => {
  const { t } = useTranslation();
  const isUser = message.sender === "user";
  const showExtract = !isUser && !!onExtract;

  return (
    <View className={`flex-row ${isUser ? "justify-start" : "justify-end"} mb-2`}>
      <View className="max-w-[82%]">
        <View
          className={`rounded-3xl px-4 py-3 ${
            isUser
              ? "bg-brand-700 rounded-ee-md"
              : "bg-white border border-brand-100 rounded-es-md"
          }`}
        >
          <Txt
            variant="body"
            tone={isUser ? "inverse" : "default"}
            style={{ textAlign: "right", writingDirection: "rtl" }}
          >
            {message.message_text}
          </Txt>
        </View>

        {showExtract ? (
          <View className="flex-row justify-end mt-1.5">
            <Pressable
              onPress={() => onExtract!(message)}
              disabled={extracting}
              className={`px-3 py-1.5 rounded-full border border-brand-200 bg-cream-50 ${extracting ? "opacity-60" : "active:opacity-80"}`}
            >
              <Txt variant="caption" style={{ color: "#2E1A2E" }}>
                {extracting ? t("agent.extracting") : t("agent.extractToTasks")}
              </Txt>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
};
