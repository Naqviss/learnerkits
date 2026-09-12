import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DonateClient } from "@/components/donate/DonateClient";
import { getEducationCopy } from "@/lib/i18n/content";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { hreflangCodes, jsonLd, localizedMetadata, localizedUrl, siteName } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getEducationCopy(locale);
  return localizedMetadata(locale, "/donate", copy.donate.seoTitle, copy.donate.seoDescription, {
    keywords: locale === "en" ? ["donate science education", "support free science simulations", "science education donation"] : undefined,
  });
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const safeLocale = locale as Locale;
  const copy = getEducationCopy(safeLocale);
  const currency = (process.env.DONATION_CURRENCY || "USD").toUpperCase();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: copy.donate.seoTitle,
    description: copy.donate.seoDescription,
    url: localizedUrl(safeLocale, "/donate"),
    inLanguage: hreflangCodes[safeLocale],
    isPartOf: { "@type": "WebSite", name: siteName, url: localizedUrl("en", "") },
  };
  return <main className="donatePage">
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(schema)}/>
    <section className="container donateHero">
      <div className="donateIntro"><span className="eyebrow">{copy.donate.eyebrow}</span><h1>{copy.donate.title}</h1><p>{copy.donate.intro}</p></div>
    </section>
    <section className="container donateGrid">
      <div className="donateWhy"><span className="eyebrow">{copy.donate.whyTitle}</span><h2>{copy.donate.whyTitle}</h2><p>{copy.donate.whyBody}</p><ul><li>{copy.donate.point1}</li><li>{copy.donate.point2}</li><li>{copy.donate.point3}</li></ul></div>
      <DonateClient locale={safeLocale} currency={currency} copy={copy.donate}/>
    </section>
  </main>;
}
