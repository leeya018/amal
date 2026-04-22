import React, { useState } from 'react';
import { View, Text, SafeAreaView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { LanguageCard } from '../../src/components/onboarding/LanguageCard';
import { Button } from '../../src/components/ui/Button';
import { useLanguage } from '../../src/contexts/LanguageContext';
import type { AppLanguage } from '../../src/types/app';

const LANGUAGES: Array<{
  lang: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}> = [
  { lang: 'he', label: 'Hebrew', nativeLabel: 'עברית', flag: '🇮🇱' },
  { lang: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦' },
  { lang: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧' },
];

export default function LanguageScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const [selected, setSelected] = useState<AppLanguage>(language);
  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    setLoading(true);
    try {
      // setLanguage may trigger app reload for RTL
      await setLanguage(selected);
      // If we reach here, direction didn't change — navigate manually
      router.replace('/onboarding/intro');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      <View className="flex-1 px-6 pt-10">
        <Text className="text-4xl font-bold text-calm-text mb-2">אמל</Text>
        <Text className="text-4xl font-bold text-calm-text mb-2">أمل</Text>
        <Text className="text-4xl font-bold text-calm-text mb-8">Amal</Text>

        <Text className="text-xl font-medium text-calm-muted mb-6">
          {t('onboarding.selectLanguage')}
        </Text>

        {LANGUAGES.map((item) => (
          <LanguageCard
            key={item.lang}
            {...item}
            selected={selected === item.lang}
            onPress={() => setSelected(item.lang)}
          />
        ))}

        <View className="mt-auto pb-6">
          <Button
            title={loading ? '...' : t('onboarding.continue')}
            onPress={handleContinue}
            loading={loading}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
