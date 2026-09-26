"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedSubject } from "@/lib/i18n/content";
import { subjectsCatalog, visibleSubjectSlugs } from "@/lib/subjects/catalog";
import { matchesTerms, normalizeSearch, searchTerms } from "@/lib/search/normalize";
import { SearchIcon } from "./SearchIcon";
import type { Messages } from "@/lib/i18n/getMessages";

import { articleSummaries } from "@/lib/articles/catalog";

// `text` is the normalized search haystack. It also carries the English wording on translated
// sites, so a student can type either "gravedad" or "gravity" on /es.
type Result = { type: "subject" | "article" | "simulation"; key: string; slug: string; title: string; detail: string; text: string };

const MAX_RESULTS = 8;

export function SearchBar({ locale, search, id }: { locale: string; search: Messages["search"]; id: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const index = useMemo<Result[]>(() => {
    const results: Result[] = [];
    const text = (...parts: (string | string[] | undefined)[]) => normalizeSearch(parts.flat().filter(Boolean).join(" "));
    for (const slug of visibleSubjectSlugs) {
      const subject = getLocalizedSubject(locale as Locale, slug);
      const english = subjectsCatalog[slug];
      results.push({ type: "subject", key: `subject-${subject.slug}`, slug: subject.slug, title: subject.eyebrow, detail: subject.description, text: text(subject.eyebrow, subject.description, subject.concepts, english.eyebrow, english.concepts) });
      subject.simulations.forEach((sim, index) => {
        const base = english.simulations[index];
        results.push({ type: "simulation", key: `sim-${sim.slug}`, slug: sim.slug, title: sim.title, detail: `${subject.eyebrow} · ${sim.concepts}`, text: text(sim.title, sim.concepts, sim.kind, subject.eyebrow, base.title, base.concepts, sim.slug.replace(/-/g, " ")) });
      });
    }
    if (locale === "en") {
      for (const article of articleSummaries) results.push({ type: "article", key: `article-${article.slug}`, slug: article.slug, title: article.title, detail: `Article · ${article.audience} · ${article.description}`, text: text(article.title, article.audience, article.description) });
    }
    return results;
  }, [locale]);

  const matches = useMemo(() => {
    const terms = searchTerms(query);
    if (!terms.length) return [];
    return index.filter((item) => matchesTerms(item.text, terms)).slice(0, MAX_RESULTS);
  }, [index, query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function close() { setQuery(""); setOpen(false); }

  return <div className="navSearch" ref={rootRef}>
    <SearchIcon className="searchFieldIcon"/>
    <input
      className="navSearchInput"
      type="search"
      aria-label={search.ariaLabel}
      placeholder={search.placeholder}
      value={query}
      onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
      onFocus={() => setOpen(true)}
      onKeyDown={(e) => { if (e.key === "Escape") close(); }}
    />
    {open && query.trim() && <ul className="navSearchResults" id={id}>
      {matches.length === 0
        ? <li className="navSearchEmpty">{search.noResults}</li>
        : matches.map((item) => <li key={item.key}>
            <Link href={`/${locale}/${item.type === "subject" ? "subjects" : item.type === "article" ? "articles" : "simulations"}/${item.slug}`} onClick={close}>
              <span className="navSearchResultTitle">{item.title}</span>
              <span className="navSearchResultDetail">{item.detail}</span>
            </Link>
          </li>)}
    </ul>}
  </div>;
}
