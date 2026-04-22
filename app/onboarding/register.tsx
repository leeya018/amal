import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useAuth } from '../../src/contexts/AuthContext';
import { useLanguage } from '../../src/contexts/LanguageContext';

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!email.trim() || !password.trim()) {
      setError(t('auth.errorGeneral'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email.trim(), password, language);
      router.replace('/(tabs)/sos');
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t('auth.errorGeneral'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-calm-bg">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-1 justify-center px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold text-calm-text mb-2">
            {t('auth.registerTitle')}
          </Text>
          <Text className="text-gray-500 mb-8">{t('onboarding.intro.slide1.body')}</Text>

          <View className="gap-4">
            <Input
              label={t('auth.email')}
              placeholder={t('auth.emailPlaceholder')}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <Input
              label={t('auth.password')}
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {error ? (
              <Text className="text-danger text-sm text-center">{error}</Text>
            ) : null}

            <Button
              title={t('auth.register')}
              onPress={handleRegister}
              loading={loading}
              fullWidth
              className="mt-2"
            />
          </View>

          <TouchableOpacity
            onPress={() => router.replace('/onboarding/login')}
            className="mt-6 items-center"
          >
            <Text className="text-primary-600 text-sm">{t('auth.haveAccount')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
