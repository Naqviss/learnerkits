export const supportedLocales = ["en", "es", "zh", "ar", "pt", "fr", "ru", "ja", "de"] as const;
export type Locale = (typeof supportedLocales)[number];
export const defaultLocale: Locale = "en";

// Published languages. Keep dictionaries and locale types intact for the rest of
// supportedLocales so more translations can be restored by adding them here.
// Spanish ("es") is unpublished for now (2026-11-28): its pages still carry the old generic
// translated copy, which reads as thin content, so it is held back until AdSense approves the site.
// Add "es" back here to restore it; the header language picker reappears on its own (it only shows
// when more than one language is published), and the Worker stops redirecting /es/ URLs.
export const locales: readonly Locale[] = ["en"];

// Languages search engines may index. A published language that is not listed here stays
// available to visitors but is `noindex` and left out of the sitemap and hreflang. Add a
// language only when every page in it is fully translated (including simulation controls and
// the information pages) and a fluent speaker has reviewed it: partly translated copies of the
// English pages are what Google's September 2026 spam update demoted this site for.
export const indexedLocales: readonly Locale[] = ["en"];

export function isIndexedLocale(value: string): boolean {
  return (indexedLocales as readonly string[]).includes(value);
}

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
