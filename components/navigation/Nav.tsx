import Link from "next/link";
import type { Messages } from "@/lib/i18n/getMessages";
import { LanguageSelector } from "./LanguageSelector";
import { ThemeToggle } from "./ThemeToggle";
import { SearchBar } from "./SearchBar";
import { AuthButton } from "./AuthButton";
import { MobileNav } from "./MobileNav";
import { NavDropdown } from "./NavDropdown";
import type { Locale } from "@/lib/i18n/config";
import { getEducationCopy, getLocalizedSubjectName } from "@/lib/i18n/content";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { boards } from "@/lib/exam-prep/catalog";
import { siteName } from "@/lib/seo/metadata";

export function Nav({ locale, m }: { locale: string; m: Messages }) {
  const allSubjects = getEducationCopy(locale as Locale).library.allSubjects;
  const subjectLinks = [
    { href: `/${locale}/simulations`, label: allSubjects, subject: "" },
    ...visibleSubjectSlugs.map((slug) => ({ href: `/${locale}/simulations#${slug}`, label: getLocalizedSubjectName(locale as Locale, slug), subject: slug }))
  ];
  return <nav className="nav"><div className="container navInner">
    <Link className="brand" href={locale === "en" ? "/" : `/${locale}`} aria-label={siteName}><img className="brandLogo" src="/learnerkits-logo.svg" width="300" height="64" alt={siteName}/></Link>
    <div className="navLinks"><NavDropdown label={m.navigation.simulations} items={[
        ...subjectLinks,
        ...(locale === "en" ? [{ href: "/en/guides", label: "Guides", detail: "How each simulation works and what to try", divider: true }] : []),
      ]}/>{locale === "en" && <><NavDropdown label="Exam Preparation" items={[
        { href: "/en/exam-prep", label: "Preparation", detail: "Choose your exam board, explore syllabus topics, and practise with interactive lessons.", children: [
          ...boards.map((board) => ({ href: `/en/exam-prep/${board.id}`, label: board.name, detail: board.sub })),
          { href: "/en/exam-prep/any-board", label: "Another exam board", detail: "Explore resources for any syllabus." },
        ] },
        { href: "/en/mock-exams", label: "Mock Exams", detail: "Try a timed paper and review your results." },
      ]}/><Link href="/en/teacher-kit">Teacher Kit</Link><Link href="/en/pricing">Pricing</Link><Link href="/en/articles">News &amp; Articles</Link></>}</div>
    <SearchBar locale={locale} search={m.search} id="nav-search-desktop"/>
    <div className="navActions"><ThemeToggle labels={{toLight:`${m.settings.theme}: ${m.settings.light}`,toDark:`${m.settings.theme}: ${m.settings.dark}`}}/><LanguageSelector locale={locale} label={m.common.languageLabel}/><AuthButton labels={m.auth}/></div>
    <MobileNav>
      <SearchBar locale={locale} search={m.search} id="nav-search-mobile"/>
      <NavDropdown label={m.navigation.simulations} items={subjectLinks}/>
      {locale === "en" && <Link className="mobileNavSub" href="/en/guides">↳ Simulation guides</Link>}{locale === "en" && <><Link href="/en/exam-prep">▣ Exam Preparation</Link><Link href="/en/mock-exams">◷ Mock Exams</Link><Link href="/en/teacher-kit">✎ Teacher Kit</Link><Link href="/en/pricing">$ Pricing</Link><Link href="/en/classroom">♙ My classroom</Link><Link href="/en/articles">▤ News &amp; Articles</Link></>}
    </MobileNav>
  </div></nav>;
}
