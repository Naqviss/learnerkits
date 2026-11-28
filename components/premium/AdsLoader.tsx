"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { pageShowsAds } from "@/lib/adsense/config";
import { usePremium } from "@/lib/billing/premium";

/** Loads AdSense only once we know the visitor is not a Premium subscriber, and only on pages with content. */
export function AdsLoader({ client }: { client: string }) {
  const premium = usePremium();
  const pathname = usePathname();
  const allowed = pageShowsAds(pathname ?? "");
  useEffect(() => {
    if (!allowed || premium !== "free" || document.querySelector("script[data-learnerkits-ads]")) return;
    const script = document.createElement("script");
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(client)}`;
    script.dataset.learnerkitsAds = "true";
    document.head.appendChild(script);
  }, [allowed, client, premium]);
  return null;
}
