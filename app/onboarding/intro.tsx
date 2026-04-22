import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { IntroCarousel } from "@/components/onboarding/IntroCarousel";
import { Button } from "@/components/ui/Button";
import { Txt } from "@/components/ui/Typography";

export default function IntroScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-cream">
      <View className="px-6 pt-4 pb-2">
        <Txt variant="title" className="text-brand-700" style={{ textAlign: "right" }}>
          {t("common.appName")}
        </Txt>
        <Txt variant="caption" tone="muted" style={{ textAlign: "right" }}>
          {t("common.tagline")}
        </Txt>
      </View>

      <View className="flex-1">
        <IntroCarousel />
      </View>

      <View className="px-6 pb-4 gap-2">
        <Button
          label={t("common.continue")}
          size="lg"
          fullWidth
          onPress={() => router.push("/onboarding/video")}
        />
        <Button
          label={t("common.skip")}
          variant="ghost"
          fullWidth
          onPress={() => router.replace("/onboarding/login")}
        />
      </View>
    </SafeAreaView>
  );
}
