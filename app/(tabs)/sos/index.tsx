import { useEffect } from "react";
import { Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
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
          <Txt variant="heading" className="text-brand-700" style={{ textAlign: "right" }}>
            {t("common.appName")}
          </Txt>
          <Txt variant="caption" tone="muted" style={{ textAlign: "right" }}>
            {session?.user.email}
          </Txt>
        </View>
        <Pressable
          onPress={() => void signOut()}
          accessibilityRole="button"
          accessibilityLabel="התנתקות"
          className="w-10 h-10 rounded-full items-center justify-center active:bg-brand-50"
        >
          <Ionicons name="log-out-outline" size={22} color="#6B5C66" />
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center px-6">
        <View className="mb-12">
          <RecordButton
            isRecording={isRecording}
            disabled={isBusy}
            onPress={onPress}
          />
        </View>

        <View className="min-h-[60px] items-center">
          {status === "idle" ? (
            <>
              <Txt variant="heading" className="mb-2" style={{ textAlign: "center" }}>
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

      <View className="px-6 pb-4">
        <Pressable
          onPress={() => router.push("/(tabs)/sos/recordings")}
          className="bg-white border border-brand-100 rounded-2xl px-4 py-3 flex-row-reverse items-center justify-between active:opacity-80"
        >
          <Txt variant="label" className="text-brand-700">{t("sos.viewRecordings")}</Txt>
          <Ionicons name="chevron-back" size={20} color="#7C3E5F" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
