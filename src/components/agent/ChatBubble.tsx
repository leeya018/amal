import { View } from "react-native";
import { Txt } from "@/components/ui/Typography";
import type { Chat } from "@/types/app";

export const ChatBubble = ({ message }: { message: Chat }) => {
  const isUser = message.sender === "user";
  return (
    <View className={`flex-row ${isUser ? "justify-start" : "justify-end"} mb-2`}>
      <View
        className={`max-w-[82%] rounded-3xl px-4 py-3 ${
          isUser
            ? "bg-brand-700 rounded-ee-md"
            : "bg-white border border-brand-100 rounded-es-md"
        }`}
      >
        <Txt
          variant="body"
          className={isUser ? "text-cream" : "text-ink"}
          style={{ textAlign: "right", writingDirection: "rtl" }}
        >
          {message.message_text}
        </Txt>
      </View>
    </View>
  );
};
