import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import * as FileSystem from 'expo-file-system';

import { RecordButton } from '../../../src/components/sos/RecordButton';
import { RecordingStatus } from '../../../src/components/sos/RecordingStatus';
import { VerificationPanel } from '../../../src/components/sos/VerificationPanel';
import { useRecordingContext } from '../../../src/contexts/RecordingContext';
import { useAuth } from '../../../src/contexts/AuthContext';
import { supabase } from '../../../src/lib/supabase';
import { signRecording } from '../../../src/lib/tsa';
import type { RecordingResult } from '../../../src/types/app';

export default function SOSScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isRecording, duration, location, startRecording, stopRecording } =
    useRecordingContext();
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<RecordingResult | null>(null);

  async function handlePress() {
    if (isRecording) {
      await handleStop();
    } else {
      await handleStart();
    }
  }

  async function handleStart() {
    try {
      setResult(null);
      await startRecording();
    } catch (e: unknown) {
      const msg =
        e instanceof Error && e.message === 'audio_permission_denied'
          ? t('sos.permissionAudio')
          : t('sos.uploadError');
      Alert.alert(t('common.error'), msg);
    }
  }

  async function handleStop() {
    const stopped = await stopRecording();
    if (!stopped || !user) return;

    const { uri, durationSec } = stopped;
    setUploading(true);

    try {
      // Read file as base64 once — reuse for both TSA and upload
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // TSA: SHA-256 → RSA sign → simulated block hash
      const { sha256Hash, rsaSignature, blockHash } = await signRecording(base64);

      // Convert base64 → Uint8Array for Supabase Storage upload
      const binaryStr = atob(base64);
      const fileBytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        fileBytes[i] = binaryStr.charCodeAt(i);
      }

      const recordingPath = `${user.id}/${Date.now()}.m4a`;

      const { error: storageError } = await supabase.storage
        .from('recordings')
        .upload(recordingPath, fileBytes, { contentType: 'audio/m4a' });

      if (storageError) throw storageError;

      // Capture GPS from context (taken during recording)
      const lat = location?.coords.latitude ?? null;
      const lng = location?.coords.longitude ?? null;

      const { error: dbError } = await supabase.from('recordings').insert({
        user_id: user.id,
        file_path: recordingPath,
        lat,
        long: lng,
        rsa_signature: rsaSignature,
        block_hash: blockHash,
        duration_sec: durationSec,
        file_size_bytes: fileBytes.length,
      });

      if (dbError) throw dbError;

      setResult({
        recordingId: recordingPath,
        sha256Hash,
        rsaSignature,
        blockHash,
        lat,
        long: lng,
        durationSec,
      });
    } catch (e) {
      console.error('SOS upload error:', e);
      Alert.alert(t('common.error'), t('sos.uploadError'));
    } finally {
      setUploading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingVertical: 32, gap: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-calm-text">{t('sos.tabTitle')}</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/sos/recordings')}>
            <Text className="text-primary-600 text-sm font-medium">
              {t('sos.myRecordings')} →
            </Text>
          </TouchableOpacity>
        </View>

        {/* Record Button */}
        <View className="items-center py-6">
          <RecordButton
            isRecording={isRecording}
            duration={duration}
            onPress={handlePress}
            disabled={uploading}
          />
        </View>

        {/* Live GPS status during recording */}
        <RecordingStatus location={location} isRecording={isRecording} />

        {/* Upload progress */}
        {uploading && (
          <View className="items-center gap-2 py-4">
            <ActivityIndicator color="#7c3aed" size="large" />
            <Text className="text-calm-muted text-sm">{t('sos.uploading')}</Text>
          </View>
        )}

        {/* Post-upload verification panel */}
        {result && !uploading && <VerificationPanel result={result} />}
      </ScrollView>
    </SafeAreaView>
  );
}
