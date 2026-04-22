import { useCallback } from "react";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { RecordingCard } from "@/components/sos/RecordingCard";
import { useRecordings } from "@/hooks/useRecordings";

export default function RecordingsScreen() {
  const { t } = useTranslation();
  const { items, loading, remove, getSignedUrl, refresh } = useRecordings();

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row-reverse items-center justify-between px-6 pt-2 pb-4">
        <Txt variant="title" className="text-brand-700" style={{ textAlign: "right" }}>
          {t("sos.recordingsTitle")}
        </Txt>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          className="w-10 h-10 rounded-full items-center justify-center active:bg-brand-50"
        >
          <Ionicons name="chevron-forward" size={22} color="#2E1A2E" />
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-16 px-8">
              <View className="w-20 h-20 rounded-full bg-brand-50 items-center justify-center mb-4">
                <Ionicons name="mic-off-outline" size={36} color="#7C3E5F" />
              </View>
              <Txt variant="body" tone="muted" style={{ textAlign: "center" }}>
                {t("sos.empty")}
              </Txt>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <RecordingCard
            recording={item}
            onGetSignedUrl={getSignedUrl}
            onDelete={remove}
          />
        )}
      />
    </SafeAreaView>
  );
}
