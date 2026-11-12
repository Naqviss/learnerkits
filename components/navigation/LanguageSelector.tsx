"use client";
import { usePathname, useRouter } from "next/navigation";
import { localeNames, locales } from "@/lib/i18n/config";

export function LanguageSelector({ locale, label }: { locale: string; label: string }) {
  const router = useRouter();
  const pathname = usePathname();
  if (locales.length < 2) return null;
  return <span className="langSelectWrap langIconOnly" title={label}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18Z"/></svg><select className="langSelect" aria-label={label} value={locale} onChange={(e) => {
    const next = e.target.value;
    const segments = pathname.split("/");
    segments[1] = next;
    localStorage.setItem("science-sim-locale", next);
    document.cookie = `science-sim-locale=${next}; path=/; max-age=31536000; samesite=lax`;
    // Editorial pages are English-only until a translated edition exists.
    const englishOnly = segments[2] === "articles" || segments[2] === "guides";
    router.push(englishOnly && next !== "en" ? `/${next}` : segments.join("/") || `/${next}`);
  }}>{locales.map((code) => <option value={code} key={code}>{localeNames[code]}</option>)}</select></span>;
}
