"use client";
import Link from "next/link";
import { Children, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { SearchIcon } from "@/components/navigation/SearchIcon";
import { matchesTerms, normalizeSearch, searchTerms } from "@/lib/search/normalize";

type Group = { slug: string; name: string; href: string; viewLabel: string };
type Item = { subject: string; text: string };
type Labels = { comingSoon: string; comingSoonBody: string; search: string; placeholder: string; allSubjects: string; subjectFilter: string; count: string; empty: string; clear: string };

// Cards are rendered on the server (children, flat, in group order) so every lab is in the
// initial HTML for crawlers; this component only filters and groups them. `items[i]` describes
// `children[i]`. `labels.count` uses {shown}/{total} because functions can't cross to the client;
// it is announced to screen readers only, as the page shows no lab counts.
// `upcoming` subjects are listed as disabled chips and cards so students can see what is next.
export function SimulationLibrary({ groups, upcoming = [], items, labels, children }: { groups: Group[]; upcoming?: { slug: string; name: string }[]; items: Item[]; labels: Labels; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const id = useId();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [scrollToToolbar, setScrollToToolbar] = useState(false);
  const cards = Children.toArray(children);
  const haystack = useMemo(() => items.map((item) => normalizeSearch(item.text)), [items]);
  const terms = searchTerms(query);

  // Links such as /simulations#chemistry open the library filtered to that subject. Filtering
  // shortens the page under the browser's anchor jump, so bring the toolbar back into view.
  // The header's Simulations menu sends the same choice as an event when this page is already open.
  useEffect(() => {
    const apply = (slug: string) => {
      if (slug === "") setSubject("");
      else if (groups.some((group) => group.slug === slug)) { setSubject(slug); setScrollToToolbar(true); }
    };
    const fromHash = () => { const hash = decodeURIComponent(window.location.hash.slice(1)); if (hash) apply(hash); };
    const fromMenu = (event: Event) => apply(String((event as CustomEvent).detail ?? ""));
    fromHash();
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("sim-library-subject", fromMenu);
    return () => { window.removeEventListener("hashchange", fromHash); window.removeEventListener("sim-library-subject", fromMenu); };
  }, [groups]);
  useEffect(() => {
    if (!scrollToToolbar) return;
    toolbarRef.current?.scrollIntoView({ block: "start" });
    setScrollToToolbar(false);
  }, [scrollToToolbar]);

  const matchesText = (index: number) => matchesTerms(haystack[index], terms);
  const visible = items.map((item, index) => matchesText(index) && (!subject || item.subject === subject));
  const shown = visible.filter(Boolean).length;
  // A subject the search has emptied is disabled, so a chip never promises results it can't show.
  const subjectHasMatches = (slug: string) => items.some((item, index) => (!slug || item.subject === slug) && matchesText(index));
  const filtering = terms.length > 0 || subject !== "";
  const reset = () => { setQuery(""); setSubject(""); };

  const chip = (slug: string, label: string, className = "") => {
    const active = subject === slug;
    return <button type="button" className={`libChip ${className}`} aria-pressed={active} onClick={() => setSubject(active ? "" : slug)} disabled={!active && !subjectHasMatches(slug)}>{label}</button>;
  };

  return <>
    <div className="libToolbar" role="search" ref={toolbarRef}>
      <label className="srOnly" htmlFor={id}>{labels.search}</label>
      <div className="libSearch"><SearchIcon className="searchFieldIcon"/><input id={id} className="libSearchInput" type="search" autoComplete="off" placeholder={labels.placeholder} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}/></div>
      <div className="libFilterRow" role="group" aria-label={labels.subjectFilter}>
        <span className="libFilterLabel" aria-hidden="true">{labels.subjectFilter}</span>
        {/* Two wrappers: the outer one clips the divider that would otherwise start each wrapped line. */}
        <div className="libChipList"><div>
          <span>{chip("", labels.allSubjects)}</span>
          {groups.map((group) => <span key={group.slug} className={`subject-${group.slug}`}>{chip(group.slug, group.name, "libChipSubject")}</span>)}
          {upcoming.map((group) => <span key={group.slug} className={`subject-${group.slug}`}><button type="button" className="libChip libChipSubject libChipSoon" disabled>{group.name}<span>{labels.comingSoon}</span></button></span>)}
        </div></div>
        {filtering && <button type="button" className="libClear" onClick={reset}>{labels.clear}</button>}
      </div>
      <span className="srOnly" aria-live="polite">{filtering ? labels.count.replace("{shown}", String(shown)).replace("{total}", String(items.length)) : ""}</span>
    </div>
    {shown === 0 && <div className="labSearchEmpty"><p>{labels.empty}</p><button type="button" className="button" onClick={reset}>{labels.clear}</button></div>}
    {groups.map((group) => {
      const groupCards = cards.filter((_, index) => items[index].subject === group.slug && visible[index]);
      if (!groupCards.length) return null;
      return <section id={group.slug} className={`libGroup subject-${group.slug}`} key={group.slug} aria-labelledby={`${id}-${group.slug}`}>
        <header className="libGroupHeader"><div><h2 id={`${id}-${group.slug}`}>{group.name}</h2></div><Link href={group.href}>{group.viewLabel} →</Link></header>
        <div className="libGrid">{groupCards}</div>
      </section>;
    })}
    {!filtering && upcoming.length > 0 && <section className="libGroup libUpcoming" aria-labelledby={`${id}-upcoming`}>
      <header className="libGroupHeader"><div><h2 id={`${id}-upcoming`}>{labels.comingSoon}</h2></div></header>
      <div className="libGrid">{upcoming.map((group) => <div className={`libCard libCardSoon subject-${group.slug}`} key={group.slug} aria-disabled="true">
        <div className="libCardTop"><span className="libKind">{labels.comingSoon}</span></div>
        <h3>{group.name}</h3>
        <p>{labels.comingSoonBody}</p>
      </div>)}</div>
    </section>}
  </>;
}
