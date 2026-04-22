import {
  useFonts,
  Rubik_400Regular,
  Rubik_500Medium,
  Rubik_700Bold,
} from "@expo-google-fonts/rubik";

export const useAppFonts = () =>
  useFonts({
    Rubik_400Regular,
    Rubik_500Medium,
    Rubik_700Bold,
  });

export const fontFamily = {
  regular: "Rubik_400Regular",
  medium:  "Rubik_500Medium",
  bold:    "Rubik_700Bold",
} as const;
