import { useCallback } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Txt } from "@/components/ui/Typography";
import { Touchable } from "@/components/ui/Touchable";
import { RecordingCard } from "@/components/sos/RecordingCard";
import { useRecordings } from "@/hooks/useRecordings";

export default function RecordingsScreen() {
  const { t } = useTranslation();
  const { items, loading, remove, getSignedUrl, refresh } = useRecordings();

  useFocusEffect(useCallback(() => { void refresh(); }, [refresh]));

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-cream">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row-reverse items-center justify-between px-6 pt-2 pb-5">
        <Txt variant="title" className="text-ink" style={{ textAlign: "right" }}>
          {t("sos.recordingsTitle")}
        </Txt>
        <Touchable
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          className="w-11 h-11 rounded-full bg-white items-center justify-center shadow-md shadow-black/5"
        >
          <Ionicons name="chevron-forward" size={20} color="#1C1C1E" />
        </Touchable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(r) => r.id}
        refreshing={loading}
        onRefresh={refresh}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 112 }}
        ListEmptyComponent={
          !loading ? (
            <View className="items-center mt-20 px-8">
              <View className="w-24 h-24 rounded-full bg-white items-center justify-center mb-5 shadow-xl shadow-black/5">
                <Ionicons name="mic-off-outline" size={40} color="#8E8E93" />
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
