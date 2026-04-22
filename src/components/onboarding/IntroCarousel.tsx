import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const SLIDES = [
  { key: 'slide1', emoji: '💜', titleKey: 'onboarding.intro.slide1.title', bodyKey: 'onboarding.intro.slide1.body' },
  { key: 'slide2', emoji: '🔒', titleKey: 'onboarding.intro.slide2.title', bodyKey: 'onboarding.intro.slide2.body' },
  { key: 'slide3', emoji: '🤝', titleKey: 'onboarding.intro.slide3.title', bodyKey: 'onboarding.intro.slide3.body' },
];

interface IntroCarouselProps {
  onDone: () => void;
}

export function IntroCarousel({ onDone }: IntroCarouselProps) {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  function handleNext() {
    if (currentIndex < SLIDES.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex });
      setCurrentIndex(nextIndex);
    } else {
      onDone();
    }
  }

  return (
    <View className="flex-1 bg-calm-bg">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        renderItem={({ item }) => (
          <View style={{ width }} className="flex-1 items-center justify-center px-8 gap-6">
            <Text className="text-7xl">{item.emoji}</Text>
            <Text className="text-2xl font-bold text-calm-text text-center">
              {t(item.titleKey)}
            </Text>
            <Text className="text-base text-gray-600 text-center leading-7">
              {t(item.bodyKey)}
            </Text>
          </View>
        )}
      />

      {/* Dots */}
      <View className="flex-row justify-center gap-2 mb-6">
        {SLIDES.map((_, i) => (
          <View
            key={i}
            className={`h-2 rounded-full transition-all ${
              i === currentIndex ? 'w-6 bg-primary-600' : 'w-2 bg-primary-200'
            }`}
          />
        ))}
      </View>

      {/* Next / Done */}
      <TouchableOpacity
        onPress={handleNext}
        className="mx-6 mb-10 bg-primary-600 py-4 rounded-2xl items-center"
        activeOpacity={0.8}
      >
        <Text className="text-white font-bold text-base">
          {currentIndex === SLIDES.length - 1
            ? t('onboarding.continue')
            : t('onboarding.continue')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
