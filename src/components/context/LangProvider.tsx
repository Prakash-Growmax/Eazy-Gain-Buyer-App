"use client";
import i18n from "../../lib/i18n";
import { ReactNode, useEffect } from "react";
import { I18nextProvider } from "react-i18next";

export default function LangProvider({
  children,
  currentLang = "ta",
}: {
  children: ReactNode;
  currentLang: string | undefined;
}) {
  useEffect(() => {
    if (currentLang != i18n.language) {
      i18n.changeLanguage(currentLang);
    }
  }, [currentLang]);
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
