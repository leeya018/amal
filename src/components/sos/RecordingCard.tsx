import { useCallback, useState } from "react";
import { Pressable, View } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Card } from "@/components/ui/Card";
import type { Recording } from "@/types/app";

type Props = {
  recording: Recording;
  onGetSignedUrl: (filePath: string) => Promise<string | null>;
  onDelete:       (recording: Recording) => void;
};

export const RecordingCard = ({ recording, onGetSignedUrl, onDelete }: Props) => {
  const { t } = useTranslation();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = useCallback(async () => {
    if (sound && playing) {
      await sound.pauseAsync();
      setPlaying(false);
      return;
    }
    if (sound && !playing) {
      await sound.playAsync();
      setPlaying(true);
      return;
    }
    const url = await onGetSignedUrl(recording.file_path);
    if (!url) return;
    const { sound: s } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    s.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) setPlaying(false);
    });
    setSound(s);
    setPlaying(true);
  }, [sound, playing, onGetSignedUrl, recording.file_path]);

  const when = new Date(recording.created_at).toLocaleString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const hasLocation = recording.lat != null && recording.long != null;
  const hasSignature = !!recording.signature;

  return (
    <Card className="mb-3">
      <View className="flex-row-reverse items-center justify-between">
        <Pressable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={playing ? t("sos.stopPlayback") : t("sos.play")}
          className="w-12 h-12 rounded-full bg-accent-400 items-center justify-center active:opacity-80"
        >
          <Ionicons name={playing ? "pause" : "play"} size={22} color="#FAF5F0" />
        </Pressable>

        <View className="flex-1 ms-3">
          <Txt variant="label" className="text-ink">{when}</Txt>
          <View className="flex-row-reverse items-center gap-3 mt-1">
            {hasSignature ? (
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="shield-checkmark" size={14} color="#5F7F3A" />
                <Txt variant="caption" tone="muted">{t("sos.signatureVerified")}</Txt>
              </View>
            ) : null}
            {hasLocation ? (
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="location" size={14} color="#6B5C66" />
                <Txt variant="caption" tone="muted" style={{ writingDirection: "ltr" }}>
                  {recording.lat!.toFixed(3)}, {recording.long!.toFixed(3)}
                </Txt>
              </View>
            ) : (
              <Txt variant="caption" tone="faint">{t("sos.locationOff")}</Txt>
            )}
          </View>
        </View>

        <Pressable
          onPress={() => onDelete(recording)}
          accessibilityRole="button"
          accessibilityLabel={t("common.delete")}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-brand-50"
        >
          <Ionicons name="trash-outline" size={20} color="#B42F2F" />
        </Pressable>
      </View>
    </Card>
  );
};
