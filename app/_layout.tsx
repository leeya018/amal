import 'react-native-url-polyfill/auto';
import '../global.css';
import React, { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppFonts } from '../src/constants/fonts';
import { initI18n, LANGUAGE_KEY, type AppLanguage } from '../src/i18n';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { LanguageProvider } from '../src/contexts/LanguageContext';
import { RecordingProvider } from '../src/contexts/RecordingContext';
import { registerForPushNotifications, savePushToken } from '../src/lib/notifications';

SplashScreen.preventAutoHideAsync();

function PushTokenRegistrar() {
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;
    registerForPushNotifications().then((token) => {
      if (token) savePushToken(user.id, token);
    });
  }, [user?.id]);
  return null;
}

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();
  const [i18nReady, setI18nReady] = useState(false);
  const [initialLang, setInitialLang] = useState<AppLanguage>('he');

  useEffect(() => {
    async function prepare() {
      try {
        const storedLang = (await AsyncStorage.getItem(LANGUAGE_KEY)) as AppLanguage | null;
        const lang: AppLanguage = storedLang ?? 'he';

        const shouldBeRTL = lang === 'he' || lang === 'ar';
        if (I18nManager.isRTL !== shouldBeRTL) {
          I18nManager.allowRTL(shouldBeRTL);
          I18nManager.forceRTL(shouldBeRTL);
        }

        const resolvedLang = await initI18n();
        setInitialLang(resolvedLang);
        setI18nReady(true);
      } catch {
        setI18nReady(true);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded && i18nReady) SplashScreen.hideAsync();
  }, [fontsLoaded, i18nReady]);

  if (!fontsLoaded || !i18nReady) return null;

  return (
    <LanguageProvider initialLang={initialLang}>
      <AuthProvider>
        <RecordingProvider>
          <PushTokenRegistrar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="onboarding" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </RecordingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
