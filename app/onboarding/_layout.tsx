import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F2F2F7" },
        animation: "slide_from_left",
      }}
    >
      <Stack.Screen name="intro" />
      <Stack.Screen name="video" />
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
