import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { ChatMessage } from '../types/app';

export function useChats() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('chats')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })
      .limit(100);
    if (data) setMessages(data as ChatMessage[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  async function addMessage(text: string, sender: 'user' | 'ai'): Promise<ChatMessage | null> {
    if (!user) return null;
    const optimistic: ChatMessage = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      message_text: text,
      sender,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);

    const { data } = await supabase
      .from('chats')
      .insert({ user_id: user.id, message_text: text, sender })
      .select()
      .single();

    if (data) {
      setMessages((prev) =>
        prev.map((m) => (m.id === optimistic.id ? (data as ChatMessage) : m))
      );
      return data as ChatMessage;
    }
    return null;
  }

  return { messages, loading, addMessage };
}
