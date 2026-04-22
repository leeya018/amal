import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Todo } from "@/types/app";
import { useAuth } from "@/contexts/AuthContext";

type TodoInput = {
  title: string;
  description?: string | null;
  due_date?: string | null;
};

export const useTodos = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false });
    setItems(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { void refresh(); }, [refresh]);

  const create = useCallback(async (input: TodoInput) => {
    if (!session) return;
    const { data } = await supabase
      .from("todos")
      .insert({ ...input, user_id: session.user.id })
      .select()
      .single();
    if (data) setItems((p) => [data, ...p]);
  }, [session]);

  const createMany = useCallback(async (inputs: TodoInput[]) => {
    if (!session || inputs.length === 0) return;
    const rows = inputs.map((i) => ({ ...i, user_id: session.user.id }));
    const { data } = await supabase.from("todos").insert(rows).select();
    if (data) setItems((p) => [...data, ...p]);
  }, [session]);

  const toggle = useCallback(async (todo: Todo) => {
    const next = !todo.completed;
    setItems((p) => p.map((t) => (t.id === todo.id ? { ...t, completed: next } : t)));
    await supabase.from("todos").update({ completed: next }).eq("id", todo.id);
  }, []);

  const remove = useCallback(async (id: string) => {
    setItems((p) => p.filter((t) => t.id !== id));
    await supabase.from("todos").delete().eq("id", id);
  }, []);

  const update = useCallback(async (id: string, patch: Partial<TodoInput>) => {
    const { data } = await supabase.from("todos").update(patch).eq("id", id).select().single();
    if (data) setItems((p) => p.map((t) => (t.id === id ? data : t)));
  }, []);

  return { items, loading, create, createMany, toggle, remove, update, refresh };
};
