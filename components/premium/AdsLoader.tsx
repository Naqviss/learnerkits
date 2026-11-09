"use client";
import { useEffect } from "react";
import { usePremium } from "@/lib/billing/premium";

/** Loads AdSense only once we know the visitor is not a Premium subscriber. */
export function AdsLoader({ client }: { client: string }) {
  const premium = usePremium();
  useEffect(() => {
    if (premium !== "free" || document.querySelector("script[data-learnerkits-ads]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.dataset.learnerkitsAds = "true";
    document.head.appendChild(script);
  }, [client, premium]);
  return null;
}
