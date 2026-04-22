import { I18nManager } from "react-native";

export const enforceRTL = (): void => {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
};
