import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Todo } from '../types/app';

export function useTodos() {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setTodos(data as Todo[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function addTodo(
    title: string,
    description?: string,
    dueDate?: string
  ): Promise<Todo | null> {
    if (!user) return null;
    const optimistic: Todo = {
      id: `temp-${Date.now()}`,
      user_id: user.id,
      title,
      description: description ?? null,
      due_date: dueDate ?? null,
      completed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setTodos((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from('todos')
      .insert({ user_id: user.id, title, description, due_date: dueDate })
      .select()
      .single();

    if (error) {
      setTodos((prev) => prev.filter((t) => t.id !== optimistic.id));
      throw error;
    }
    setTodos((prev) =>
      prev.map((t) => (t.id === optimistic.id ? (data as Todo) : t))
    );
    return data as Todo;
  }

  async function toggleTodo(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const newCompleted = !todo.completed;
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: newCompleted } : t))
    );
    await supabase.from('todos').update({ completed: newCompleted }).eq('id', id);
  }

  async function deleteTodo(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await supabase.from('todos').delete().eq('id', id);
  }

  async function addBulkTodos(
    items: { title: string; description?: string }[]
  ): Promise<void> {
    if (!user || items.length === 0) return;
    const rows = items.map((item) => ({
      user_id: user.id,
      title: item.title,
      description: item.description ?? null,
    }));
    const { data } = await supabase.from('todos').insert(rows).select();
    if (data) setTodos((prev) => [...(data as Todo[]), ...prev]);
  }

  return { todos, loading, addTodo, toggleTodo, deleteTodo, addBulkTodos, refetch: fetchTodos };
}
