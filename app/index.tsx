import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { router } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function Index() {
  const { session, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (session) router.replace("/(tabs)/sos");
    else         router.replace("/onboarding/intro");
  }, [session, loading]);

  return (
    <View className="flex-1 bg-cream items-center justify-center">
      <ActivityIndicator size="large" color="#1C1C1E" />
    </View>
  );
}
