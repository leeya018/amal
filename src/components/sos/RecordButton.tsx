import { useEffect, useRef } from "react";
import { Animated, Easing, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Touchable } from "@/components/ui/Touchable";

type Props = {
  isRecording: boolean;
  disabled?:   boolean;
  onPress:     () => void;
};

// Two soft halos pulse while recording. The core button is a deep near-black
// pill (or danger-red when recording) with a heavy shadow — shadow defines the
// edge, not a border.
export const RecordButton = ({ isRecording, disabled, onPress }: Props) => {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isRecording) {
      pulse.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.18, duration: 1100, easing: Easing.out(Easing.ease), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1,    duration: 1100, easing: Easing.in(Easing.ease),  useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [isRecording, pulse]);

  return (
    <View className="items-center justify-center">
      <Animated.View
        style={{ transform: [{ scale: pulse }] }}
        className={`absolute w-[260px] h-[260px] rounded-full ${isRecording ? "bg-danger/15" : "bg-accent-500/12"}`}
      />
      <Animated.View
        style={{ transform: [{ scale: pulse }] }}
        className={`absolute w-[210px] h-[210px] rounded-full ${isRecording ? "bg-danger/25" : "bg-accent-500/20"}`}
      />
      <Touchable
        onPress={onPress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={isRecording ? "עצירת הקלטה" : "התחלת הקלטה"}
        className={`w-[170px] h-[170px] rounded-full items-center justify-center shadow-2xl ${
          isRecording
            ? "bg-danger shadow-danger/50"
            : "bg-brand-700 shadow-black/40"
        } ${disabled ? "opacity-60" : ""}`}
        scaleTo={0.94}
      >
        <Ionicons
          name={isRecording ? "square" : "mic"}
          size={isRecording ? 52 : 68}
          color="#FFFFFF"
        />
      </Touchable>
    </View>
  );
};
