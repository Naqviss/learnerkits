import { NextResponse } from "next/server";
import { isLocale } from "@/lib/i18n/config";
import { siteName, siteUrl } from "@/lib/seo/metadata";

const MIN_CENTS = 100;
const MAX_CENTS = 1000000;

const donationProductNames = {
  en: `Support ${siteName}`,
  es: `Apoya ${siteName}`,
  zh: `支持 ${siteName}`,
  ar: `ادعم ${siteName}`,
  pt: `Apoie o ${siteName}`,
  fr: `Soutenez ${siteName}`,
  ru: `Поддержать ${siteName}`,
  ja: `${siteName} を支援`,
  de: `${siteName} unterstützen`,
} as const;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { amount?: number; locale?: string };
    const locale = body.locale && isLocale(body.locale) ? body.locale : "en";
    const amount = Math.round(Number(body.amount) * 100);
    if (!Number.isFinite(amount) || amount < MIN_CENTS || amount > MAX_CENTS) {
      return NextResponse.json({ error: "invalid_amount" }, { status: 400 });
    }

    const hostedDonationUrl = process.env.DONATION_HOSTED_URL;
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    const currency = (process.env.DONATION_CURRENCY ?? "usd").toLowerCase();

    if (!stripeSecret) {
      if (hostedDonationUrl) return NextResponse.json({ url: hostedDonationUrl });
      return NextResponse.json({ error: "donations_not_configured" }, { status: 503 });
    }

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("submit_type", "donate");
    params.set("success_url", `${siteUrl}/${locale}/donate/success?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${siteUrl}/${locale}/donate/cancel`);
    params.set("line_items[0][price_data][currency]", currency);
    params.set("line_items[0][price_data][unit_amount]", String(amount));
    params.set("line_items[0][price_data][product_data][name]", donationProductNames[locale]);
    params.set("line_items[0][quantity]", "1");
    params.set("payment_intent_data[metadata][purpose]", "donation");
    params.set("metadata[purpose]", "donation");
    params.set("locale", "auto");

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeSecret}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
      cache: "no-store",
    });
    const result = await response.json() as { url?: string; error?: { message?: string } };
    if (!response.ok || !result.url) {
      console.error("Donation checkout error", result.error?.message ?? response.statusText);
      return NextResponse.json({ error: "checkout_failed" }, { status: 502 });
    }
    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error("Donation route error", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
