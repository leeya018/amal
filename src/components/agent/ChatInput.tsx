import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { transcribeAudio } from "@/lib/whisper";

type Props = {
  onSend:       (text: string) => void | Promise<void>;
  disabled?:    boolean;
};

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

  const isBusy = disabled || transcribing;

  return (
    <View className="bg-cream border-t border-brand-100/70 px-3 py-2">
      {transcribing ? (
        <Txt variant="caption" tone="muted" className="mb-1 px-2" style={{ textAlign: "center" }}>
          {t("agent.transcribing")}
        </Txt>
      ) : null}
      <View className="flex-row-reverse items-end gap-2">
        <Pressable
          onPress={toggleVoice}
          disabled={isBusy}
          accessibilityRole="button"
          accessibilityLabel={t("agent.recordVoice")}
          className={`w-12 h-12 rounded-full items-center justify-center ${recording ? "bg-danger" : "bg-brand-700"} ${isBusy ? "opacity-60" : "active:opacity-80"}`}
        >
          <Ionicons name={recording ? "square" : "mic"} size={22} color="#FAF5F0" />
        </Pressable>

        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t("agent.inputPlaceholder")}
          placeholderTextColor="#A89AA2"
          multiline
          editable={!isBusy}
          className="flex-1 bg-white rounded-2xl px-4 py-3 border border-brand-100 text-ink font-sans"
          style={{ writingDirection: "rtl", textAlign: "right", fontSize: 16, maxHeight: 120 }}
        />

        <Pressable
          onPress={send}
          disabled={isBusy || !text.trim()}
          accessibilityRole="button"
          accessibilityLabel={t("agent.send")}
          className={`w-12 h-12 rounded-full items-center justify-center bg-accent-400 ${isBusy || !text.trim() ? "opacity-60" : "active:opacity-80"}`}
        >
          <Ionicons name="send" size={20} color="#FAF5F0" style={{ transform: [{ scaleX: -1 }] }} />
        </Pressable>
      </View>
    </View>
  );
};
