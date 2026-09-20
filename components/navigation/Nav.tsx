import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { siteName } from "@/lib/seo/metadata";

export function Nav({ locale, m }: { locale: string; m: Messages }) {
  return <nav className="nav"><div className="container navInner">
    <Link className="brand" href={`/${locale}`} aria-label={siteName}><img className="brandLogo" src="/learnerkits-logo.svg" width="300" height="64" alt={siteName}/></Link>
    <div className="navLinks"><Link href={`/${locale}/subjects`}><span>✦</span>{m.navigation.subjects}</Link><Link href={`/${locale}/simulations`}><span>◉</span>{m.navigation.simulations}</Link>{locale === "en" && <Link href="/en/guides"><span>↗</span>Guides</Link>}</div>
    <SearchBar locale={locale} search={m.search} id="nav-search-desktop"/>
    <div className="navActions"><ThemeToggle/><LanguageSelector locale={locale} label={m.common.languageLabel}/><Link className="settingsLink" href={`/${locale}/settings`} aria-label={m.navigation.settings} title={m.navigation.settings}>⚙</Link></div>
    <details className="mobileNav"><summary aria-label="Open navigation"><span/><span/><span/></summary><div><SearchBar locale={locale} search={m.search} id="nav-search-mobile"/><Link href={`/${locale}/subjects`}>✦ {m.navigation.subjects}</Link><Link href={`/${locale}/simulations`}>◉ {m.navigation.simulations}</Link>{locale === "en" && <Link href="/en/guides">↗ Guides</Link>}<Link href={`/${locale}/settings`}>⚙ {m.navigation.settings}</Link></div></details>
  </div></nav>;
}
