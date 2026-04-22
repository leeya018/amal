import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Audio } from 'expo-av';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import type { Recording } from '../../types/app';

interface RecordingCardProps {
  recording: Recording;
  getPlaybackUrl: (path: string) => Promise<string | null>;
}

function truncate(str: string | null, n = 8): string {
  if (!str) return '—';
  if (str.length <= n * 2 + 3) return str;
  return str.slice(0, n) + '...' + str.slice(-n);
}

export function RecordingCard({ recording, getPlaybackUrl }: RecordingCardProps) {
  const { t } = useTranslation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const date = new Date(recording.created_at).toLocaleString();

  async function handlePlay() {
    if (playing && sound) {
      await sound.stopAsync();
      await sound.unloadAsync();
      setSound(null);
      setPlaying(false);
      return;
    }

    setLoadingAudio(true);
    try {
      const url = await getPlaybackUrl(recording.file_path);
      if (!url) return;
      const { sound: newSound } = await Audio.Sound.createAsync({ uri: url });
      setSound(newSound);
      setPlaying(true);
      await newSound.playAsync();
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          setPlaying(false);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } finally {
      setLoadingAudio(false);
    }
  }

  return (
    <Card className="gap-2 mb-3">
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-calm-text font-medium text-sm">{date}</Text>
          {recording.lat != null && (
            <Text className="text-gray-500 text-xs mt-0.5">
              {t('sos.location')}: {recording.lat.toFixed(4)}, {recording.long?.toFixed(4)}
            </Text>
          )}
          <Text className="text-gray-400 text-xs mt-0.5" numberOfLines={1}>
            {t('sos.blockHash')}: {truncate(recording.block_hash)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={handlePlay}
          className={`ml-3 px-4 py-2 rounded-xl ${playing ? 'bg-danger' : 'bg-primary-600'}`}
          disabled={loadingAudio}
        >
          {loadingAudio ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text className="text-white text-sm font-medium">
              {playing ? t('sos.stop') : t('sos.play')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}
