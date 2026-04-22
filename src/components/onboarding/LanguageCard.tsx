import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import type { AppLanguage } from '../../types/app';

interface LanguageCardProps {
  lang: AppLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
  selected: boolean;
  onPress: () => void;
}

export function LanguageCard({
  label,
  nativeLabel,
  flag,
  selected,
  onPress,
}: LanguageCardProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      className={`flex-row items-center gap-4 px-5 py-4 rounded-2xl border-2 mb-3 ${
        selected
          ? 'border-primary-600 bg-primary-50'
          : 'border-calm-border bg-calm-surface'
      }`}
    >
      <Text className="text-4xl">{flag}</Text>
      <View className="flex-1">
        <Text className={`font-bold text-lg ${selected ? 'text-primary-700' : 'text-calm-text'}`}>
          {nativeLabel}
        </Text>
        <Text className="text-gray-500 text-sm">{label}</Text>
      </View>
      {selected && (
        <View className="w-6 h-6 rounded-full bg-primary-600 items-center justify-center">
          <Text className="text-white text-xs font-bold">✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
