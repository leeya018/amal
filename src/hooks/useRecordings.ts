import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { Recording } from '../types/app';

export function useRecordings() {
  const { user } = useAuth();
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('recordings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (data) setRecordings(data as Recording[]);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  async function getPlaybackUrl(filePath: string): Promise<string | null> {
    const { data } = await supabase.storage
      .from('recordings')
      .createSignedUrl(filePath, 3600);
    return data?.signedUrl ?? null;
  }

  return { recordings, loading, getPlaybackUrl, refetch: fetchRecordings };
}
