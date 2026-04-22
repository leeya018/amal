import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { config } from "@/constants/config";
import type { Recording } from "@/types/app";
import { useAuth } from "@/contexts/AuthContext";

export const useRecordings = () => {
  const { session } = useAuth();
  const [items, setItems] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from("recordings")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (err) setError(err.message);
    setItems(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => { void refresh(); }, [refresh]);

  const remove = useCallback(async (recording: Recording) => {
    await supabase.storage.from(config.storage.recordingsBucket).remove([recording.file_path]);
    await supabase.from("recordings").delete().eq("id", recording.id);
    setItems((prev) => prev.filter((r) => r.id !== recording.id));
  }, []);

  const getSignedUrl = useCallback(async (filePath: string): Promise<string | null> => {
    const { data, error: err } = await supabase.storage
      .from(config.storage.recordingsBucket)
      .createSignedUrl(filePath, 60 * 10);
    if (err) return null;
    return data.signedUrl;
  }, []);

  return { items, loading, error, refresh, remove, getSignedUrl };
};
