import React from 'react';
import { router } from 'expo-router';
import { IntroCarousel } from '../../src/components/onboarding/IntroCarousel';

export default function IntroScreen() {
  return (
    <IntroCarousel
      onDone={() => router.replace('/onboarding/video')}
    />
  );
}
