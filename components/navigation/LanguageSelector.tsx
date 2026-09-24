"use client";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales } from "@/lib/i18n/config";

export function LanguageSelector({ locale, label }: { locale: string; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  return <select className="langSelect" aria-label={label} value={locale} onChange={(e) => {
    const next = e.target.value;
    const segments = pathname.split("/");
    segments[1] = next;
    localStorage.setItem("science-sim-locale", next);
    document.cookie = `science-sim-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    // Editorial pages are English-only until a translated edition exists.
    const englishOnly = segments[2] === "articles" || segments[2] === "guides";
    router.push(englishOnly && next !== "en" ? `/${next}` : segments.join("/") || `/${next}`);
  }}>{locales.map((code) => <option value={code} key={code}>{localeNames[code]}</option>)}</select>;
}
