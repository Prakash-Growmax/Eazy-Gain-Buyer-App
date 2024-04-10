"use client";
import { initReactI18next } from "react-i18next";
import i18next from "i18next";

import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { get } from "lodash";
const isProduction = process.env.NODE_ENV === "production";

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(async (language: string, namespace: string) => {
      const modules = await import(`../messages/${language}.json`);
      return modules.default[namespace]
    })
  )
  .init({
    lng: undefined,
    fallbackLng: "ta",
    saveMissing: !isProduction,
    defaultNS: undefined,
    interpolation: {
      escapeValue: false,
    },
  });
export default i18next;
