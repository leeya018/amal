import { I18nManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Updates from 'expo-updates';
import { type AppLanguage, LANGUAGE_KEY, RTL_LANGUAGES } from '../i18n';

export function isRTL(lang: AppLanguage): boolean {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Apply language + RTL direction. If the direction changed, triggers an app
 * reload so I18nManager.forceRTL takes effect on the native layout engine.
 * Returns true if a reload was triggered.
 */
export async function applyLanguageWithRTL(lang: AppLanguage): Promise<boolean> {
  await AsyncStorage.setItem(LANGUAGE_KEY, lang);

  const shouldBeRTL = isRTL(lang);
  const currentlyRTL = I18nManager.isRTL;

  if (shouldBeRTL !== currentlyRTL) {
    I18nManager.allowRTL(shouldBeRTL);
    I18nManager.forceRTL(shouldBeRTL);
    await Updates.reloadAsync();
    return true;
  }

  return false;
}

/**
 * Returns the RTL class when RTL is active, otherwise the LTR class.
 * Use in className strings where NativeWind doesn't auto-flip layout.
 */
export function rtlClass(rtlCls: string, ltrCls: string): string {
  return I18nManager.isRTL ? rtlCls : ltrCls;
}

/** Direction-aware flex row */
export function rowDirection(): 'row' | 'row-reverse' {
  return I18nManager.isRTL ? 'row-reverse' : 'row';
}

/** Direction-aware text alignment */
export function textAlign(): 'right' | 'left' {
  return I18nManager.isRTL ? 'right' : 'left';
}
