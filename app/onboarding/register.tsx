import { useState } from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import { useAuth } from "@/contexts/AuthContext";

export default function RegisterScreen() {
  const { t } = useTranslation();
  const { signUp } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      router.replace("/(tabs)/sos");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("errors.generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-cream">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-1 justify-center px-6 gap-4">
          <View className="mb-4">
            <Txt variant="display" className="text-ink mb-1.5" style={{ textAlign: "right" }}>
              {t("onboarding.register.title")}
            </Txt>
            <Txt variant="body" tone="muted" style={{ textAlign: "right" }}>
              {t("common.tagline")}
            </Txt>
          </View>

          <Input
            label={t("onboarding.register.emailLabel")}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={{ writingDirection: "ltr", textAlign: "left" }}
          />
          <Input
            label={t("onboarding.register.passwordLabel")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
            style={{ writingDirection: "ltr", textAlign: "left" }}
          />

          {error ? (
            <Txt variant="caption" tone="danger" style={{ textAlign: "right" }}>
              {error}
            </Txt>
          ) : null}

          <Button
            label={t("onboarding.register.submit")}
            size="lg"
            fullWidth
            loading={loading}
            disabled={!email.trim() || password.length < 6}
            onPress={submit}
          />

          <View className="flex-row-reverse justify-center items-center gap-1 mt-3">
            <Txt variant="caption" tone="muted">{t("onboarding.register.hasAccount")}</Txt>
            <Link href="/onboarding/login" asChild>
              <Touchable>
                <Txt variant="caption" tone="accent" style={{ fontFamily: "Rubik_500Medium" }}>
                  {t("onboarding.register.goLogin")}
                </Txt>
              </Touchable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
