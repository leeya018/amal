import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function VideoScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      <View className="flex-1 items-center justify-center px-6 gap-6">
        {/* Placeholder for video */}
        <View className="w-full aspect-video bg-primary-100 rounded-3xl items-center justify-center">
          <Text className="text-6xl">▶️</Text>
          <Text className="text-calm-muted mt-3 font-medium">
            {t('onboarding.video.title')}
          </Text>
        </View>

        <Text className="text-calm-text text-center text-base leading-7 px-4">
          {t('onboarding.intro.slide1.body')}
        </Text>
      </View>

      <View className="px-6 pb-8 gap-3">
        <TouchableOpacity
          onPress={() => router.replace('/onboarding/register')}
          className="bg-primary-600 py-4 rounded-2xl items-center"
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">
            {t('onboarding.continue')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/onboarding/register')}
          className="py-3 items-center"
        >
          <Text className="text-calm-muted text-sm">{t('onboarding.video.skip')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
