import { Platform, StyleSheet, View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RecordingProvider } from "@/contexts/RecordingContext";
import { useAuth } from "@/contexts/AuthContext";

// Translucent glass tab bar — the BlurView sits behind the tabs and the
// tabBarStyle is made transparent so the blur comes through. On Android the
// blur is approximate; the translucent white keeps the surface legible.
const GlassTabBarBackground = () => (
  <View style={StyleSheet.absoluteFill}>
    <BlurView
      intensity={Platform.OS === "ios" ? 90 : 100}
      tint="light"
      style={StyleSheet.absoluteFill}
    />
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: Platform.OS === "ios" ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.88)" },
      ]}
    />
  </View>
);

export default function TabsLayout() {
  const { t } = useTranslation();
  const { session, loading } = useAuth();

  // Sign-out only clears AuthContext.session — without this guard the user stays
  // stuck inside the tabs group after logout. Re-routing here unmounts the tabs
  // subtree and sends them back through the onboarding flow.
  if (loading) return null;
  if (!session) return <Redirect href="/onboarding/intro" />;

  return (
    <RecordingProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:   "#007AFF",
          tabBarInactiveTintColor: "#8E8E93",
          tabBarBackground: GlassTabBarBackground,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            elevation: 0,
            height: 84,
            paddingTop: 10,
            paddingBottom: 24,
          },
          tabBarLabelStyle: {
            fontFamily: "Rubik_500Medium",
            fontSize: 11,
          },
        }}
      >
        <Tabs.Screen
          name="todos/index"
          options={{
            title: t("tabs.todos"),
            tabBarIcon: ({ color, size }) => <Ionicons name="checkbox-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="agent/index"
          options={{
            title: t("tabs.agent"),
            tabBarIcon: ({ color, size }) => <Ionicons name="sparkles-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="sos/index"
          options={{
            title: t("tabs.sos"),
            tabBarIcon: ({ color, size }) => <Ionicons name="mic-circle" size={size + 4} color={color} />,
          }}
        />
        <Tabs.Screen
          name="sos/recordings"
          options={{ href: null }}
        />
      </Tabs>
    </RecordingProvider>
  );
}
