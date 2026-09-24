"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { getLocalizedSubject } from "@/lib/i18n/content";
import { visibleSubjectSlugs } from "@/lib/subjects/catalog";
import type { Messages } from "@/lib/i18n/getMessages";

import { articleSummaries } from "@/lib/articles/catalog";

type Result =
  | { type: "subject"; key: string; slug: string; title: string; detail: string }
  | { type: "article"; key: string; slug: string; title: string; detail: string }
  | { type: "simulation"; key: string; slug: string; title: string; detail: string };

const MAX_RESULTS = 8;

export function SearchBar({ locale, search, id }: { locale: string; search: Messages["search"]; id: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const index = useMemo<Result[]>(() => {
    const results: Result[] = [];
    for (const slug of visibleSubjectSlugs) {
      const subject = getLocalizedSubject(locale as Locale, slug);
      results.push({ type: "subject", key: `subject-${subject.slug}`, slug: subject.slug, title: subject.eyebrow, detail: subject.description });
      for (const sim of subject.simulations) {
        results.push({ type: "simulation", key: `sim-${sim.slug}`, slug: sim.slug, title: sim.title, detail: `${subject.eyebrow} · ${sim.concepts}` });
      }
    }
    if (locale === "en") {
      for (const article of articleSummaries) results.push({ type: "article", key: `article-${article.slug}`, slug: article.slug, title: article.title, detail: `Article · ${article.audience} · ${article.description}` });
    }
    return results;
  }, [locale]);

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((item) => item.title.toLowerCase().includes(q) || item.detail.toLowerCase().includes(q)).slice(0, MAX_RESULTS);
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
