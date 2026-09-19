import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

// Keep production URLs canonical even when the deployment has not supplied the env var yet.
// Local development can still override this with NEXT_PUBLIC_SITE_URL=http://localhost:3000.
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.learnerkits.com")).replace(/\/$/, "");
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
  englishOnly?: boolean;
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
  const languages = options.englishOnly
    ? { en: localizedUrl(defaultLocale, path), "x-default": localizedUrl(defaultLocale, path) }
    : Object.fromEntries([
        ...locales.map((code) => [hreflangCodes[code], localizedUrl(code, path)] as const),
        ["x-default", localizedUrl(defaultLocale, path)] as const,
      ]);
  const alternateLocale = options.englishOnly ? [] : locales.filter((code) => code !== safeLocale).map((code) => ogLocales[code]);

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
    "@type": ["LearningResource", "SoftwareApplication"],
    name: args.title,
    description: args.description,
    url: localizedUrl(args.locale, args.path),
    inLanguage: hreflangCodes[args.locale],
    isAccessibleForFree: true,
    learningResourceType: "Interactive simulation",
    educationalUse: ["instruction", "practice", "assessment"],
    educationalLevel: "Grades 6–12",
    teaches: args.concepts,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser with JavaScript enabled.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    about: [args.subject, ...args.concepts],
    audience: { "@type": "EducationalAudience", educationalRole: ["student", "teacher"] },
    provider: { "@type": "Organization", name: siteName, url: siteUrl },
  };
}

export function subjectCollectionJsonLd(args: {
  locale: Locale;
  path: string;
  name: string;
  description: string;
  simulations: { name: string; path: string; description: string }[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: args.name,
    description: args.description,
    url: localizedUrl(args.locale, args.path),
    inLanguage: hreflangCodes[args.locale],
    isPartOf: { "@type": "WebSite", name: siteName, url: siteUrl },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: args.simulations.length,
      itemListElement: args.simulations.map((simulation, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "LearningResource",
          name: simulation.name,
          description: simulation.description,
          url: localizedUrl(args.locale, simulation.path),
        },
      })),
    },
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
