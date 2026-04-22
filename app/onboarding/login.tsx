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

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      router.replace("/(tabs)/sos");
    } catch {
      setError(t("errors.authFailed"));
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
              {t("onboarding.login.title")}
            </Txt>
            <Txt variant="body" tone="muted" style={{ textAlign: "right" }}>
              {t("common.appName")} · {t("common.tagline")}
            </Txt>
          </View>

          <Input
            label={t("onboarding.login.emailLabel")}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            style={{ writingDirection: "ltr", textAlign: "left" }}
          />
          <Input
            label={t("onboarding.login.passwordLabel")}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
            style={{ writingDirection: "ltr", textAlign: "left" }}
          />

          {error ? (
            <Txt variant="caption" tone="danger" style={{ textAlign: "right" }}>
              {error}
            </Txt>
          ) : null}

          <Button
            label={t("onboarding.login.submit")}
            size="lg"
            fullWidth
            loading={loading}
            disabled={!email.trim() || !password}
            onPress={submit}
          />

          <View className="flex-row-reverse justify-center items-center gap-1 mt-3">
            <Txt variant="caption" tone="muted">{t("onboarding.login.noAccount")}</Txt>
            <Link href="/onboarding/register" asChild>
              <Touchable>
                <Txt variant="caption" tone="accent" style={{ fontFamily: "Rubik_500Medium" }}>
                  {t("onboarding.login.goRegister")}
                </Txt>
              </Touchable>
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
