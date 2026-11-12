import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import { NavDropdown } from "./NavDropdown";
import type { Locale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubjectName } from "@/lib/i18n/content";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { siteName } from "@/lib/seo/metadata";

export function Nav({ locale, m }: { locale: string; m: Messages }) {
  const allSubjects = getEducationCopy(locale as Locale).library.allSubjects;
  return <nav className="nav"><div className="container navInner">
    <Link className="brand" href={`/${locale}`} aria-label={siteName}><img className="brandLogo" src="/learnerkits-logo.svg" width="300" height="64" alt={siteName}/></Link>
    <div className="navLinks"><NavDropdown label={m.navigation.simulations} items={[
        { href: `/${locale}/simulations`, label: allSubjects, subject: "" },
        ...visibleSubjectSlugs.map((slug) => ({ href: `/${locale}/simulations#${slug}`, label: getLocalizedSubjectName(locale as Locale, slug), subject: slug })),
        ...(locale === "en" ? [{ href: "/en/guides", label: "Guides", detail: "How each simulation works and what to try", divider: true }] : []),
      ]}/>{locale === "en" && <><Link href="/en/exam-prep">Exam Prep</Link><Link href="/en/mock-exams">Mock Exams</Link><Link href="/en/teacher-kit">Teacher Kit</Link><Link href="/en/articles">News &amp; Articles</Link></>}</div>
    <SearchBar locale={locale} search={m.search} id="nav-search-desktop"/>
    <div className="navActions"><ThemeToggle labels={{toLight:`${m.settings.theme}: ${m.settings.light}`,toDark:`${m.settings.theme}: ${m.settings.dark}`}}/><LanguageSelector locale={locale} label={m.common.languageLabel}/><AuthButton labels={m.auth} locale={locale} settingsLabel={m.navigation.settings}/></div>
    <details className="mobileNav"><summary aria-label="Open navigation"><span/><span/><span/></summary><div><SearchBar locale={locale} search={m.search} id="nav-search-mobile"/><Link href={`/${locale}/simulations`}>◉ {m.navigation.simulations}</Link>{locale === "en" && <Link className="mobileNavSub" href="/en/guides">↳ Simulation guides</Link>}{locale === "en" && <><Link href="/en/exam-prep">▣ Exam Prep</Link><Link href="/en/mock-exams">◷ Mock Exams</Link><Link href="/en/teacher-kit">✎ Teacher Kit</Link><Link href="/en/classroom">♙ My classroom</Link><Link href="/en/articles">▤ News &amp; Articles</Link></>}</div></details>
  </div></nav>;
}
