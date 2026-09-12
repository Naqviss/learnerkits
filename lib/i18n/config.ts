export const locales = ["en", "es", "zh", "ar", "pt", "fr", "ru", "ja", "de"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

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
