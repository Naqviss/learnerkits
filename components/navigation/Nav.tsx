import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { siteName } from "@/lib/seo/metadata";

export function Nav({ locale, m }: { locale: string; m: Messages }) {
  return <nav className="nav"><div className="container navInner">
    <Link className="brand" href={`/${locale}`} aria-label={siteName}><img className="brandLogo" src="/learnerkits-logo.svg" width="300" height="64" alt={siteName}/></Link>
    <div className="navLinks"><Link href={`/${locale}/subjects`}><span>✦</span>{m.navigation.subjects}</Link><Link href={`/${locale}/simulations`}><span>◉</span>{m.navigation.simulations}</Link>{locale === "en" && <Link href="/en/guides"><span>↗</span>Guides</Link>}{locale === "en" && <Link href="/en/articles"><span>▤</span>Articles</Link>}</div>
    <SearchBar locale={locale} search={m.search} id="nav-search-desktop"/>
    <div className="navActions"><ThemeToggle labels={{toLight:`${m.settings.theme}: ${m.settings.light}`,toDark:`${m.settings.theme}: ${m.settings.dark}`}}/><LanguageSelector locale={locale} label={m.common.languageLabel}/><Link className="settingsLink" href={`/${locale}/settings`} aria-label={m.navigation.settings} title={m.navigation.settings}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z"/></svg></Link></div>
    <details className="mobileNav"><summary aria-label="Open navigation"><span/><span/><span/></summary><div><SearchBar locale={locale} search={m.search} id="nav-search-mobile"/><Link href={`/${locale}/subjects`}>✦ {m.navigation.subjects}</Link><Link href={`/${locale}/simulations`}>◉ {m.navigation.simulations}</Link>{locale === "en" && <Link href="/en/guides">↗ Guides</Link>}{locale === "en" && <Link href="/en/articles">▤ Articles</Link>}<Link href={`/${locale}/settings`}>⚙ {m.navigation.settings}</Link></div></details>
  </div></nav>;
}
