import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import he from "./locales/he.json";

void i18n.use(initReactI18next).init({
  resources: { he: { translation: he } },
  lng: "he",
  fallbackLng: "he",
  compatibilityJSON: "v3",
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
