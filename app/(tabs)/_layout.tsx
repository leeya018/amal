import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { RecordingProvider } from "@/contexts/RecordingContext";

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <RecordingProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor:   "#2E1A2E",
          tabBarInactiveTintColor: "#A89AA2",
          tabBarStyle: {
            backgroundColor: "#FFFCF9",
            borderTopColor:  "#E8D5E0",
            height: 72,
            paddingTop: 8,
            paddingBottom: 16,
          },
          tabBarLabelStyle: {
            fontFamily: "Rubik_500Medium",
            fontSize: 12,
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
