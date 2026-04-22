import React, { useEffect, useRef } from 'react';
import { Animated, TouchableOpacity, View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface RecordButtonProps {
  isRecording: boolean;
  duration: number;
  onPress: () => void;
  disabled?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function RecordButton({
  isRecording,
  duration,
  onPress,
  disabled,
}: RecordButtonProps) {
  const { t } = useTranslation();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1.18,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 0.6,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
            Animated.timing(opacityAnim, {
              toValue: 1,
              duration: 700,
              useNativeDriver: true,
            }),
          ]),
        ])
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
      opacityAnim.setValue(1);
    }
  }, [isRecording]);

  return (
    <View className="items-center gap-4">
      {/* Outer ring */}
      <Animated.View
        style={{ transform: [{ scale: pulseAnim }], opacity: opacityAnim }}
        className={`rounded-full p-3 ${isRecording ? 'bg-red-100' : 'bg-primary-100'}`}
      >
        {/* Inner ring */}
        <View
          className={`rounded-full p-3 ${isRecording ? 'bg-red-200' : 'bg-primary-200'}`}
        >
          {/* Button core */}
          <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.85}
            className={`w-40 h-40 rounded-full items-center justify-center shadow-lg ${
              isRecording ? 'bg-danger' : 'bg-primary-600'
            }`}
          >
            {isRecording ? (
              <View className="w-10 h-10 bg-white rounded-md" />
            ) : (
              <View className="w-8 h-8 rounded-full bg-white/30 items-center justify-center">
                <View className="w-5 h-5 rounded-full bg-white" />
              </View>
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Label */}
      <Text className="text-calm-text font-medium text-base text-center">
        {isRecording
          ? formatDuration(duration)
          : t('sos.recordStart')}
      </Text>
      {isRecording && (
        <Text className="text-gray-500 text-sm text-center">{t('sos.recording')}</Text>
      )}
    </View>
  );
}
