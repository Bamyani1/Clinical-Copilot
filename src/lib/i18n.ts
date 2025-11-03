import i18next, { type i18n } from "i18next";
import { initReactI18next } from "react-i18next";

import common from "@/locales/en/common.json";
import visitComplete from "@/locales/en/visitComplete.json";
import index from "@/locales/en/index.json";
import consent from "@/locales/en/consent.json";
import visit from "@/locales/en/visit.json";
import about from "@/locales/en/about.json";
import notFound from "@/locales/en/notFound.json";

const DEFAULT_NAMESPACE = "common";

const resources = {
  en: {
    common,
    visitComplete,
    index,
    consent,
    visit,
    about,
    notFound,
  },
} as const;

let initialized = false;

export const ensureI18n = (locale: string): i18n => {
  if (!initialized) {
    i18next.use(initReactI18next).init({
      resources,
      lng: locale,
      fallbackLng: "en",
      defaultNS: DEFAULT_NAMESPACE,
      ns: Object.keys(resources.en),
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });
    initialized = true;
  } else if (i18next.language !== locale) {
    void i18next.changeLanguage(locale);
  }

  return i18next;
};
