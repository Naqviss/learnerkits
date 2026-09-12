import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
export const siteName = "LearnerKits";
export const defaultOgImage = `${siteUrl}/og-default.png`;

const ogLocales: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  zh: "zh_CN",
  ar: "ar_SA",
  pt: "pt_BR",
  fr: "fr_FR",
  ru: "ru_RU",
  ja: "ja_JP",
  de: "de_DE",
};

export const hreflangCodes: Record<Locale, string> = {
  en: "en", es: "es", zh: "zh-Hans", ar: "ar", pt: "pt", fr: "fr", ru: "ru", ja: "ja", de: "de",
};

export type SeoOptions = {
  keywords?: string[];
  type?: "website" | "article";
  noIndex?: boolean;
};

export function localizedUrl(locale: Locale | string, path: string) {
  const cleanPath = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `${siteUrl}/${locale}${cleanPath}`;
}

export function localizedMetadata(
  locale: Locale | string,
  path: string,
  title: string,
  description: string,
  options: SeoOptions = {},
): Metadata {
  const safeLocale = (locales as readonly string[]).includes(locale) ? (locale as Locale) : defaultLocale;
  const canonical = localizedUrl(safeLocale, path);
  const languages = Object.fromEntries([
    ...locales.map((code) => [hreflangCodes[code], localizedUrl(code, path)] as const),
    ["x-default", localizedUrl(defaultLocale, path)] as const,
  ]);
  const alternateLocale = locales.filter((code) => code !== safeLocale).map((code) => ogLocales[code]);

  return {
    title,
    description,
    applicationName: siteName,
    category: "education",
    keywords: options.keywords,
    alternates: { canonical, languages },
    robots: options.noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      title,
      description,
      url: canonical,
      type: options.type ?? "website",
      siteName,
      locale: ogLocales[safeLocale],
      alternateLocale,
      images: [{ url: defaultOgImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: { card: "summary_large_image", title, description, images: [defaultOgImage] },
    other: { "content-language": hreflangCodes[safeLocale] },
  };
}

export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function websiteJsonLd(locale: Locale, title: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: title,
    url: localizedUrl(locale, "/"),
    description,
    inLanguage: hreflangCodes[locale],
    publisher: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

export function simulationJsonLd(args: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  subject: string;
  concepts: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: args.title,
    description: args.description,
    url: localizedUrl(args.locale, args.path),
    inLanguage: hreflangCodes[args.locale],
    isAccessibleForFree: true,
    learningResourceType: "Interactive simulation",
    educationalUse: ["instruction", "practice", "assessment"],
    about: [args.subject, ...args.concepts],
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

export function breadcrumbJsonLd(locale: Locale, items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: localizedUrl(locale, item.path),
    })),
  };
}

export function faqJsonLd(locale: Locale, items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: hreflangCodes[locale],
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
