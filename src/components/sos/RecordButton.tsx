import { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  isRecording: boolean;
  disabled?: boolean;
  onPress:   () => void;
};

export const RecordButton = ({ isRecording, disabled, onPress }: Props) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.15, duration: 900, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 900, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={{ transform: [{ scale: pulse }] }}
        className={`absolute w-[240px] h-[240px] rounded-full ${isRecording ? "bg-danger/20" : "bg-accent-200/40"}`}
      />
      <Animated.View
        style={{ transform: [{ scale: pulse }] }}
        className={`absolute w-[200px] h-[200px] rounded-full ${isRecording ? "bg-danger/30" : "bg-accent-300/40"}`}
      />
      <Pressable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={isRecording ? "עצירת הקלטה" : "התחלת הקלטה"}
        className={`w-[160px] h-[160px] rounded-full items-center justify-center ${isRecording ? "bg-danger" : "bg-brand-700"} ${disabled ? "opacity-60" : "active:opacity-90"}`}
      >
        <Ionicons
          name={isRecording ? "square" : "mic"}
          size={isRecording ? 52 : 64}
          color="#FAF5F0"
        />
      </Pressable>
    </View>
  );
};
