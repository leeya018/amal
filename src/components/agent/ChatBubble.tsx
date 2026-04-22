import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import type { Chat } from "@/types/app";

type Props = {
  message:     Chat;
  onExtract?:  (message: Chat) => void;
  extracting?: boolean;
};

// iMessage-style bubbles. User = blue, right-aligned (RTL start).
// AI = white glass-tinted surface with soft shadow — no border.
export const ChatBubble = ({ message, onExtract, extracting }: Props) => {
  const { t } = useTranslation();
  const isUser = message.sender === "user";
  const showExtract = !isUser && !!onExtract;

  return (
    <View className={`flex-row ${isUser ? "justify-start" : "justify-end"} mb-2`}>
      <View className="max-w-[82%]">
        <View
          className={`rounded-[22px] px-4 py-2.5 ${
            isUser
              ? "bg-accent-500 rounded-ee-md shadow-md shadow-accent-500/30"
              : "bg-white rounded-es-md shadow-md shadow-black/5"
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
          <View className="flex-row justify-end mt-2">
            <Touchable
              onPress={() => onExtract!(message)}
              disabled={extracting}
              className={`px-3.5 py-1.5 rounded-full bg-white shadow-md shadow-black/5 ${extracting ? "opacity-60" : ""}`}
            >
              <Txt variant="caption" tone="accent" style={{ fontFamily: "Rubik_500Medium" }}>
                {extracting ? t("agent.extracting") : t("agent.extractToTasks")}
              </Txt>
            </Touchable>
          </View>
        ) : null}
      </View>
    </View>
  );
};
