"use server";
import { cookies } from "next/headers";
import { LangcookieName, locales } from "../../../middleware";

export async function ChangeLangCookie() {
  const cookieStore = cookies();
  const currentLang = cookieStore.get(LangcookieName);
  const changedLang = locales.find((o: string) => o != currentLang?.value) || 'ta';
  cookieStore.set(LangcookieName, changedLang, {
    maxAge: 365 * 24 * 60 * 60,
  });
}
