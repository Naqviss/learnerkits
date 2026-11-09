"use client";
import { openPremium, premiumEnabled, usePremium } from "@/lib/billing/premium";
import { getPremiumCopy } from "@/lib/premium/copy";

/** The /premium page's button: opens the shared Premium dialog (sign-in, then Paddle checkout). */
export function PremiumCta({ locale }: { locale: string }) {
  const copy = getPremiumCopy(locale).page;
  const premium = usePremium();
  if (!premiumEnabled) return <p className="premiumPageStatus">{copy.unavailable}</p>;
  if (premium === "premium") return <p className="premiumPageStatus">{copy.alreadyPremium}</p>;
  return <button type="button" className="button primary premiumPageCta" onClick={() => openPremium("menu")}>{copy.subscribe}</button>;
}
