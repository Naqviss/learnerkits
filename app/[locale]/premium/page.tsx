import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PremiumCta } from "@/components/premium/PremiumCta";
import { isLocale } from "@/lib/i18n/config";
import { getPremiumCopy, premiumPrice } from "@/lib/premium/copy";
import { localizedMetadata } from "@/lib/seo/metadata";

// Public product and pricing page (also what Paddle's website review looks for).
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const copy = getPremiumCopy(locale).page;
  return localizedMetadata(locale, "/premium", copy.seoTitle, copy.seoDescription);
}

export default async function PremiumPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const all = getPremiumCopy(locale);
  const copy = all.page;
  return <main className="container premiumPage">
    <section className="premiumPageHero">
      <div>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h1>{copy.heading}</h1>
        <p className="premiumPageLead">{copy.lead}</p>
      </div>
      <div className="premiumPageCard">
        <p className="eyebrow">{all.launchOffer}</p>
        <p className="premiumPrice">
          <s><span className="srOnly">{all.regularLabel} </span>{premiumPrice.regular}</s>
          <strong>{premiumPrice.current}</strong><span>{all.perMonth}</span>
        </p>
        <p className="premiumDiscountTerms">{all.discountTerms}</p>
        <PremiumCta locale={locale}/>
        <p className="premiumFine">{copy.priceNote} {all.parentNote}</p>
        <p className="premiumFine"><Link href={`/${locale}/refunds`}>{copy.refundLink}</Link> · <Link href={`/${locale}/terms`}>{copy.termsLink}</Link></p>
      </div>
    </section>
    <section className="section">
      <h2>{copy.includedTitle}</h2>
      <div className="grid2 premiumPageFeatures">{copy.included.map(([title, text]) => <article className="card" key={title}><h3>{title}</h3><p className="muted">{text}</p></article>)}</div>
    </section>
    <section className="section">
      <h2>{copy.freeTitle}</h2>
      <ul className="premiumBenefits premiumPageFree">{copy.free.map((item) => <li key={item}>{item}</li>)}</ul>
    </section>
    <section className="section">
      <h2>{copy.faqTitle}</h2>
      <div className="premiumPageFaq">{copy.faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>
  </main>;
}
