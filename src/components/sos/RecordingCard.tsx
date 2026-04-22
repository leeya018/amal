import { useCallback, useEffect, useRef, useState } from "react";
import { View } from "react-native";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import type { Recording } from "@/types/app";

type Props = {
  recording:       Recording;
  onGetSignedUrl:  (filePath: string) => Promise<string | null>;
  onDelete:        (recording: Recording) => void;
};

export const RecordingCard = ({ recording, onGetSignedUrl, onDelete }: Props) => {
  const { t } = useTranslation();
  const soundRef = useRef<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => {
    soundRef.current?.unloadAsync().catch(() => {});
    soundRef.current = null;
  }, []);

  const toggle = useCallback(async () => {
    const current = soundRef.current;

    if (current) {
      const status = await current.getStatusAsync();
      if (status.isLoaded) {
        if (playing) {
          await current.pauseAsync();
          setPlaying(false);
          return;
        }
        // Paused mid-track or ended — if ended, rewind before playing.
        const atEnd =
          status.didJustFinish ||
          (status.durationMillis != null && status.positionMillis >= status.durationMillis);
        if (atEnd) await current.setPositionAsync(0);
        await current.playAsync();
        setPlaying(true);
        return;
      }
      soundRef.current = null;
    }

    // Silent-mode on iOS blocks playback unless this is set explicitly.
    await Audio.setAudioModeAsync({ playsInSilentModeIOS: true, allowsRecordingIOS: false });
    const url = await onGetSignedUrl(recording.file_path);
    if (!url) return;
    const { sound } = await Audio.Sound.createAsync({ uri: url }, { shouldPlay: true });
    sound.setOnPlaybackStatusUpdate((st) => {
      if (st.isLoaded && st.didJustFinish) setPlaying(false);
    });
    soundRef.current = sound;
    setPlaying(true);
  }, [playing, onGetSignedUrl, recording.file_path]);

  const when = new Date(recording.created_at).toLocaleString("he-IL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
  const hasLocation  = recording.lat != null && recording.long != null;
  const hasSignature = !!recording.signature;

  return (
    <View className="bg-white rounded-[28px] p-4 mb-3 shadow-lg shadow-black/5">
      <View className="flex-row-reverse items-center justify-between">
        <Touchable
          onPress={toggle}
          accessibilityRole="button"
          accessibilityLabel={playing ? t("sos.stopPlayback") : t("sos.play")}
          className={`w-12 h-12 rounded-full items-center justify-center shadow-lg ${
            playing ? "bg-danger shadow-danger/40" : "bg-accent-500 shadow-accent-500/40"
          }`}
          scaleTo={0.92}
        >
          <Ionicons name={playing ? "pause" : "play"} size={20} color="#FFFFFF" style={!playing ? { marginStart: 2 } : undefined} />
        </Touchable>

        <View className="flex-1 ms-3">
          <Txt variant="label" className="text-ink">{when}</Txt>
          <View className="flex-row-reverse items-center gap-3 mt-1.5">
            {hasSignature ? (
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="shield-checkmark" size={13} color="#34C759" />
                <Txt variant="caption" tone="muted">{t("sos.signatureVerified")}</Txt>
              </View>
            ) : null}
            {hasLocation ? (
              <View className="flex-row-reverse items-center gap-1">
                <Ionicons name="location" size={13} color="#8E8E93" />
                <Txt variant="caption" tone="muted" style={{ writingDirection: "ltr" }}>
                  {recording.lat!.toFixed(3)}, {recording.long!.toFixed(3)}
                </Txt>
              </View>
            ) : (
              <Txt variant="caption" tone="faint">{t("sos.locationOff")}</Txt>
            )}
          </View>
        </View>

        <Touchable
          onPress={() => onDelete(recording)}
          accessibilityRole="button"
          accessibilityLabel={t("common.delete")}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
        </Touchable>
      </View>
    </View>
  );
};
