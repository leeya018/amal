import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Chat } from "@/types/app";
import { useAuth } from "@/contexts/AuthContext";
import { askGemini, type ChatTurn } from "@/lib/gemini";

export const useChats = () => {
  const { session } = useAuth();
  const [messages, setMessages] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [thinking, setThinking] = useState(false);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: true });
    setMessages(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { void refresh(); }, [refresh]);

  const send = useCallback(async (text: string): Promise<string> => {
    if (!session || !text.trim()) return "";
    const userRow = {
      user_id:      session.user.id,
      message_text: text.trim(),
      sender:       "user" as const,
    };
    const { data: userInserted } = await supabase.from("chats").insert(userRow).select().single();
    if (userInserted) setMessages((p) => [...p, userInserted]);

    setThinking(true);
    try {
      const history: ChatTurn[] = messages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.message_text,
      }));
      const reply = await askGemini(history, text.trim());
      const aiRow = {
        user_id:      session.user.id,
        message_text: reply,
        sender:       "ai" as const,
      };
      const { data: aiInserted } = await supabase.from("chats").insert(aiRow).select().single();
      if (aiInserted) setMessages((p) => [...p, aiInserted]);
      return reply;
    } finally {
      setThinking(false);
    }
  }, [session, messages]);

  return { messages, loading, thinking, send, refresh };
};
