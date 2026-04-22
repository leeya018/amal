import { useFonts } from 'expo-font';

export const fontConfig = {
  'Rubik-Regular': require('../../assets/fonts/Rubik-Regular.ttf'),
  'Rubik-Medium': require('../../assets/fonts/Rubik-Medium.ttf'),
  'Rubik-Bold': require('../../assets/fonts/Rubik-Bold.ttf'),
  'Rubik-Light': require('../../assets/fonts/Rubik-Light.ttf'),
};

export function useAppFonts() {
  return useFonts(fontConfig);
}
