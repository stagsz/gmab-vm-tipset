import { sv } from "./sv";
import { it } from "./it";

export type Locale = "sv" | "it";
type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>;
};

export type Translations = DeepStringRecord<typeof sv>;

const translations: Record<Locale, Translations> = { sv, it };

export function getTranslations(locale: Locale): Translations {
  return translations[locale];
}

export const defaultLocale: Locale = "sv";
export const locales: Locale[] = ["sv", "it"];
export const localeNames: Record<Locale, string> = {
  sv: "Svenska",
  it: "Italiano",
};
