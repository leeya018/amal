import React from 'react';
import { TextInput, View, Text, type TextInputProps, I18nManager } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', style, ...rest }: InputProps) {
  return (
    <View className="gap-1">
      {label ? <Text className="text-calm-text text-sm font-medium mb-1">{label}</Text> : null}
      <TextInput
        className={`bg-white border ${error ? 'border-danger' : 'border-calm-border'} rounded-xl px-4 py-3 text-gray-800 text-base ${className}`}
        placeholderTextColor="#9ca3af"
        textAlign={I18nManager.isRTL ? 'right' : 'left'}
        {...rest}
      />
      {error ? <Text className="text-danger text-xs mt-1">{error}</Text> : null}
    </View>
  );
}
