import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { RecordingCard } from '../../../src/components/sos/RecordingCard';
import { useRecordings } from '../../../src/hooks/useRecordings';

export default function RecordingsScreen() {
  const { t } = useTranslation();
  const { recordings, loading, getPlaybackUrl } = useRecordings();

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      {/* Header */}
      <View className="flex-row items-center gap-3 px-5 py-4 border-b border-calm-border">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-primary-600 text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-xl font-bold text-calm-text">{t('sos.myRecordings')}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color="#7c3aed" className="mt-10" />
      ) : (
        <FlatList
          data={recordings}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-5 py-4"
          ListEmptyComponent={
            <Text className="text-gray-400 text-center mt-16">{t('sos.noRecordings')}</Text>
          }
          renderItem={({ item }) => (
            <RecordingCard recording={item} getPlaybackUrl={getPlaybackUrl} />
          )}
        />
      )}
    </SafeAreaView>
  );
}
