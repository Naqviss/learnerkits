import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { siteName } from "@/lib/seo/metadata";

export function Nav({ locale, m }: { locale: string; m: Messages }) {
  return <nav className="nav"><div className="container navInner">
    <Link className="brand" href={`/${locale}`} aria-label={siteName}><img className="brandLogo" src="/learnerkits-logo.svg" alt={siteName}/></Link>
    <div className="navLinks"><Link href={`/${locale}`}>{m.navigation.explore}</Link><Link href={`/${locale}/subjects`}>{m.navigation.subjects}</Link><Link href={`/${locale}/simulations`}>{m.navigation.simulations}</Link><Link href={`/${locale}/missions`}>{m.navigation.missions}</Link><Link href={`/${locale}/learn`}>{m.navigation.learn}</Link><Link href={`/${locale}/progress`}>{m.navigation.progress}</Link></div>
    <div className="navActions"><ThemeToggle/><LanguageSelector locale={locale} label={m.common.languageLabel}/><Link className="settingsLink" href={`/${locale}/settings`}>{m.navigation.settings}</Link></div>
  </div></nav>;
}
