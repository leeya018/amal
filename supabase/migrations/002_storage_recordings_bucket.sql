-- ============================================
-- Storage bucket for audio recordings
-- Path convention: {user_id}/{uuid}.m4a
-- ============================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('recordings', 'recordings', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "recordings_storage_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "recordings_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "recordings_storage_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'recordings' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
