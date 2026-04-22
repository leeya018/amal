import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { LocationObject } from 'expo-location';
import { Card } from '../ui/Card';

interface RecordingStatusProps {
  location: LocationObject | null;
  isRecording: boolean;
}

export function RecordingStatus({ location, isRecording }: RecordingStatusProps) {
  const { t } = useTranslation();
  if (!isRecording) return null;

  const lat = location?.coords.latitude.toFixed(5) ?? '—';
  const lng = location?.coords.longitude.toFixed(5) ?? '—';
  const time = new Date().toLocaleTimeString();

  return (
    <Card className="gap-2">
      <View className="flex-row items-center gap-2 mb-1">
        <View className="w-2 h-2 rounded-full bg-danger animate-pulse" />
        <Text className="text-danger font-medium text-sm">{t('sos.recording')}</Text>
      </View>
      <Row label={t('sos.location')} value={`${lat}, ${lng}`} />
      <Row label={t('sos.timestamp')} value={time} />
    </Card>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-row justify-between gap-2">
      <Text className="text-gray-500 text-xs flex-shrink-0">{label}</Text>
      <Text className="text-calm-text text-xs font-medium flex-1 text-right" numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}
