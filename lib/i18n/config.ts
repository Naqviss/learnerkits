export const supportedLocales = ["en", "es", "zh", "ar", "pt", "fr", "ru", "ja", "de"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";

// Published languages. Keep dictionaries and locale types intact for the rest of
// supportedLocales so more translations can be restored by adding them here.
export const locales: readonly Locale[] = ["en", "es"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
  zh: "简体中文",
  ar: "العربية",
  pt: "Português",
  fr: "Français",
  ru: "Русский",
  ja: "日本語",
  de: "Deutsch",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function localeDirection(locale: Locale | string): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}
