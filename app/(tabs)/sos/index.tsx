import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import { GlassCard } from "@/components/ui/GlassCard";
import { RecordButton } from "@/components/sos/RecordButton";
import { RecordingStatusIndicator } from "@/components/sos/RecordingStatus";
import { useRecording } from "@/contexts/RecordingContext";
import { useAuth } from "@/contexts/AuthContext";

export default function SOSScreen() {
  const { t } = useTranslation();
  const { session, signOut } = useAuth();
  const { status, errorMessage, elapsedMs, start, stop, reset } = useRecording();

  useEffect(() => {
    if (status === "saved") {
      const timer = setTimeout(reset, 2500);
      return () => clearTimeout(timer);
    }
  }, [status, reset]);

  const isRecording = status === "recording";
  const isBusy      = status === "saving" || status === "requesting";

  const onPress = () => {
    if (isRecording) void stop();
    else if (status === "idle" || status === "error" || status === "saved") void start();
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <View className="flex-row-reverse items-center justify-between px-6 pt-2 pb-4">
        <View>
          <Txt variant="title" className="text-ink" style={{ textAlign: "right" }}>
            {t("common.appName")}
          </Txt>
          <Txt variant="caption" tone="muted" style={{ textAlign: "right" }}>
            {session?.user.email}
          </Txt>
        </View>
        <Touchable
          onPress={() => void signOut()}
          accessibilityRole="button"
          accessibilityLabel="התנתקות"
          className="w-11 h-11 rounded-full bg-white items-center justify-center shadow-md shadow-black/5"
        >
          <Ionicons name="log-out-outline" size={20} color="#636366" />
        </Touchable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-14">
          <RecordButton
            isRecording={isRecording}
            disabled={isBusy}
            onPress={onPress}
          />
        </View>

        <View className="min-h-[72px] items-center">
          {status === "idle" ? (
            <>
              <Txt variant="heading" className="mb-2 text-ink" style={{ textAlign: "center" }}>
                {t("sos.idleTitle")}
              </Txt>
              <Txt variant="caption" tone="muted" style={{ textAlign: "center" }}>
                {t("sos.idleHint")}
              </Txt>
            </>
          ) : (
            <RecordingStatusIndicator
              status={status}
              elapsedMs={elapsedMs}
              errorMessage={errorMessage}
            />
          )}
        </View>
      </View>

      <View className="px-6 pb-28">
        <GlassCard
          innerClassName="px-5 py-4"
          radius="md"
        >
          <Touchable
            onPress={() => router.push("/(tabs)/sos/recordings")}
            className="flex-row-reverse items-center justify-between"
          >
            <View className="flex-row-reverse items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-accent-500/10 items-center justify-center">
                <Ionicons name="folder-open-outline" size={18} color="#007AFF" />
              </View>
              <Txt variant="heading" className="text-ink">{t("sos.viewRecordings")}</Txt>
            </View>
            <Ionicons name="chevron-back" size={20} color="#AEAEB2" />
          </Touchable>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
