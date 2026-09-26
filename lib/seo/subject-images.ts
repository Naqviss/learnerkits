import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n/config";
import type { SubjectSlug } from "@/lib/subjects/catalog";
import { subjectImages, subjectImageCaptions } from "@/lib/subjects/images";
import { localizedUrl, siteName, siteUrl } from "./metadata";

export function withSubjectImage(metadata: Metadata, locale: Locale, subject: SubjectSlug): Metadata {
  const image = subjectImages[subject];
  if (!image) return metadata;
  const url = `${siteUrl}${image.src}`;
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [{ url, width: image.width, height: image.height, type: "image/webp", alt: image.alt[locale] }] },
    twitter: { ...metadata.twitter, card: "summary_large_image", images: [{ url, alt: image.alt[locale] }] },
  };
}

export function subjectImageJsonLd(locale: Locale, subject: SubjectSlug) {
  const image = subjectImages[subject];
  if (!image) return undefined;
  return {
    "@type": "ImageObject",
    "@id": `${localizedUrl(locale, `/subjects/${subject}`)}#image`,
    url: `${siteUrl}${image.src}`,
    contentUrl: `${siteUrl}${image.src}`,
    width: image.width,
    height: image.height,
    encodingFormat: "image/webp",
    description: image.alt[locale],
    caption: subjectImageCaptions[locale],
    creditText: siteName,
  };
}
