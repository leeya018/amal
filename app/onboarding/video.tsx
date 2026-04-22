import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Typography";

export default function VideoScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-cream">
      <View className="flex-1 items-center justify-center px-8">
        <View className="aspect-video w-full rounded-3xl bg-brand-700 items-center justify-center mb-8 overflow-hidden">
          <View className="w-20 h-20 rounded-full bg-accent-400 items-center justify-center">
            <Ionicons name="play" size={36} color="#FAF5F0" style={{ marginStart: 4 }} />
          </View>
        </View>
        <Txt variant="title" className="mb-2" style={{ textAlign: "center" }}>
          {t("onboarding.video.title")}
        </Txt>
        <Txt variant="body" tone="muted" style={{ textAlign: "center" }}>
          {t("onboarding.video.body")}
        </Txt>
      </View>

      <View className="px-6 pb-6 gap-2">
        <Button
          label={t("onboarding.video.cta")}
          size="lg"
          fullWidth
          onPress={() => router.replace("/onboarding/login")}
        />
      </View>
    </SafeAreaView>
  );
}
