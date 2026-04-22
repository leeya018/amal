import { useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { Audio } from "expo-av";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import { transcribeAudio } from "@/lib/whisper";

type Props = {
  onSend:    (text: string) => void | Promise<void>;
  disabled?: boolean;
};

// Glass chat input — sits over the tab bar blur, same language. Mic and send
// buttons are floating iOS circles.
export const ChatInput = ({ onSend, disabled }: Props) => {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [transcribing, setTranscribing] = useState(false);

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    await onSend(trimmed);
  };

  const toggleVoice = async () => {
    if (recording) {
      setTranscribing(true);
      try {
        await recording.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
        const uri = recording.getURI();
        setRecording(null);
        if (uri) {
          const transcript = await transcribeAudio(uri);
          if (transcript.trim()) await onSend(transcript.trim());
        }
      } finally {
        setTranscribing(false);
      }
      return;
    }
    const perm = await Audio.requestPermissionsAsync();
    if (!perm.granted) return;
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    const rec = new Audio.Recording();
    await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await rec.startAsync();
    setRecording(rec);
  };

  const isBusy  = disabled || transcribing;
  const canSend = !isBusy && !!text.trim();

  return (
    <View className="relative">
      <BlurView intensity={60} tint="light" style={StyleSheet.absoluteFill} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(255,255,255,0.6)" }]} />
      <View className="px-3 py-2">
        {transcribing ? (
          <Txt variant="caption" tone="muted" className="mb-1 px-2" style={{ textAlign: "center" }}>
            {t("agent.transcribing")}
          </Txt>
        ) : null}
        <View className="flex-row-reverse items-end gap-2">
          <Touchable
            onPress={toggleVoice}
            disabled={isBusy}
            accessibilityRole="button"
            accessibilityLabel={t("agent.recordVoice")}
            className={`w-11 h-11 rounded-full items-center justify-center shadow-lg ${
              recording ? "bg-danger shadow-danger/40" : "bg-brand-700 shadow-black/30"
            } ${isBusy ? "opacity-60" : ""}`}
            scaleTo={0.92}
          >
            <Ionicons name={recording ? "square" : "mic"} size={20} color="#FFFFFF" />
          </Touchable>

          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t("agent.inputPlaceholder")}
            placeholderTextColor="#AEAEB2"
            multiline
            editable={!isBusy}
            className="flex-1 bg-white rounded-[22px] px-4 py-3 text-ink font-sans shadow-md shadow-black/5"
            style={{ writingDirection: "rtl", textAlign: "right", fontSize: 16, maxHeight: 120, minHeight: 44 }}
          />

          <Touchable
            onPress={send}
            disabled={!canSend}
            accessibilityRole="button"
            accessibilityLabel={t("agent.send")}
            className={`w-11 h-11 rounded-full items-center justify-center shadow-lg ${
              canSend ? "bg-accent-500 shadow-accent-500/40" : "bg-ink-faint"
            }`}
            scaleTo={0.92}
          >
            <Ionicons name="arrow-up" size={22} color="#FFFFFF" />
          </Touchable>
        </View>
      </View>
    </View>
  );
};
