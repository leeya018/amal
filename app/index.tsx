import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { LANGUAGE_KEY } from '../src/i18n';

export default function Index() {
  const { session, loading } = useAuth();
  const [onboardingDone, setOnboardingDone] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LANGUAGE_KEY).then((val) => {
      setOnboardingDone(val !== null);
    });
  }, []);

  if (loading || onboardingDone === null) return null;

  if (!onboardingDone) return <Redirect href="/onboarding/language" />;
  if (!session) return <Redirect href="/onboarding/login" />;
  return <Redirect href="/(tabs)/sos" />;
}
