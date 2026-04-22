import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Card } from '../ui/Card';
import type { RecordingResult } from '../../types/app';

interface VerificationPanelProps {
  result: RecordingResult;
}

function truncate(str: string, n = 12): string {
  if (str.length <= n * 2 + 3) return str;
  return str.slice(0, n) + '...' + str.slice(-n);
}

export function VerificationPanel({ result }: VerificationPanelProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-2 mb-1">
        <Text className="text-lg">✅</Text>
        <Text className="text-calm-text font-bold text-base">{t('sos.uploadSuccess')}</Text>
      </View>

      <Row label={t('sos.location')} value={`${result.lat?.toFixed(5)}, ${result.long?.toFixed(5)}`} />
      <Row label={t('sos.duration')} value={`${result.durationSec} ${t('sos.seconds')}`} />
      <Row label={t('sos.hash')} value={truncate(result.sha256Hash, 10)} />
      <Row label={t('sos.blockHash')} value={truncate(result.blockHash, 10)} />

      <TouchableOpacity onPress={() => setExpanded((e) => !e)} className="mt-1">
        <Text className="text-primary-600 text-sm font-medium">
          {expanded ? '▲ ' : '▼ '}{t('sos.details')}
        </Text>
      </TouchableOpacity>

      {expanded && (
        <ScrollView className="max-h-32">
          <Text className="text-gray-500 text-xs font-mono leading-5" selectable>
            {t('sos.hash')}: {result.sha256Hash}{'\n'}
            {t('sos.blockHash')}: {result.blockHash}
          </Text>
        </ScrollView>
      )}
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
