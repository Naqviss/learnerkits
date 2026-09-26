"use client";
import Link from "next/link";
import { Children, useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { SearchIcon } from "@/components/navigation/SearchIcon";
import { matchesTerms, normalizeSearch, searchTerms } from "@/lib/search/normalize";

type Group = { slug: string; name: string; meta: string; href: string; viewLabel: string };
type Item = { subject: string; level: string; text: string };
type Option = { value: string; label: string };
type Labels = { comingSoon: string; comingSoonBody: string; search: string; placeholder: string; allSubjects: string; allLevels: string; subjectFilter: string; levelFilter: string; count: string; empty: string; clear: string };

// Cards are rendered on the server (children, flat, in group order) so every lab is in the
// initial HTML for crawlers; this component only filters and groups them. `items[i]` describes
// `children[i]`. `labels.count` uses {shown}/{total} because functions can't cross to the client.
// `upcoming` subjects are listed as disabled chips and cards so students can see what is next.
export function SimulationLibrary({ groups, upcoming = [], items, levels, labels, children }: { groups: Group[]; upcoming?: { slug: string; name: string }[]; items: Item[]; levels: Option[]; labels: Labels; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");
  const id = useId();
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [scrollToToolbar, setScrollToToolbar] = useState(false);
  const cards = Children.toArray(children);
  const haystack = useMemo(() => items.map((item) => normalizeSearch(item.text)), [items]);
  const terms = searchTerms(query);

  // Links such as /simulations#chemistry open the library filtered to that subject. Filtering
  // shortens the page under the browser's anchor jump, so bring the toolbar back into view.
  useEffect(() => {
    const hash = decodeURIComponent(window.location.hash.slice(1));
    if (groups.some((group) => group.slug === hash)) { setSubject(hash); setScrollToToolbar(true); }
  }, [groups]);
  useEffect(() => {
    if (!scrollToToolbar) return;
    toolbarRef.current?.scrollIntoView({ block: "start" });
    setScrollToToolbar(false);
  }, [scrollToToolbar]);

  const matchesText = (index: number) => matchesTerms(haystack[index], terms);
  const matchesLevel = (index: number) => !level || items[index].level === level;
  const visible = items.map((item, index) => matchesText(index) && matchesLevel(index) && (!subject || item.subject === subject));
  const shown = visible.filter(Boolean).length;
  // Chip counts reflect the other active filters, so a chip never promises results it can't show.
  const subjectCount = (slug: string) => items.filter((item, index) => (!slug || item.subject === slug) && matchesText(index) && matchesLevel(index)).length;
  const levelCount = (value: string) => items.filter((item, index) => (!value || item.level === value) && matchesText(index) && (!subject || item.subject === subject)).length;
  const filtering = terms.length > 0 || subject !== "" || level !== "";
  const reset = () => { setQuery(""); setSubject(""); setLevel(""); };

  const chip = (active: boolean, onClick: () => void, label: string, count: number, className = "") =>
    <button type="button" className={`libChip ${className}`} aria-pressed={active} onClick={onClick} disabled={!active && count === 0}>{label}<span>{count}</span></button>;

  return <>
    <div className="libToolbar" role="search" ref={toolbarRef}>
      <label className="srOnly" htmlFor={id}>{labels.search}</label>
      <div className="libSearch"><SearchIcon className="searchFieldIcon"/><input id={id} className="libSearchInput" type="search" autoComplete="off" placeholder={labels.placeholder} value={query} onChange={(event) => setQuery(event.target.value)} onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}/></div>
      <div className="libFilterRow" role="group" aria-label={labels.subjectFilter}>
        {chip(subject === "", () => setSubject(""), labels.allSubjects, subjectCount(""))}
        {groups.map((group) => <span key={group.slug} className={`subject-${group.slug}`}>{chip(subject === group.slug, () => setSubject(subject === group.slug ? "" : group.slug), group.name, subjectCount(group.slug), "libChipSubject")}</span>)}
        {upcoming.map((group) => <span key={group.slug} className={`subject-${group.slug}`}><button type="button" className="libChip libChipSubject libChipSoon" disabled>{group.name}<span>{labels.comingSoon}</span></button></span>)}
      </div>
      <div className="libFilterRow libFilterRowSecondary" role="group" aria-label={labels.levelFilter}>
        {chip(level === "", () => setLevel(""), labels.allLevels, levelCount(""))}
        {levels.map((option) => <span key={option.value}>{chip(level === option.value, () => setLevel(level === option.value ? "" : option.value), option.label, levelCount(option.value))}</span>)}
        <span className="libCount" aria-live="polite">{filtering ? labels.count.replace("{shown}", String(shown)).replace("{total}", String(items.length)) : ""}</span>
        {filtering && <button type="button" className="libClear" onClick={reset}>{labels.clear}</button>}
      </div>
    </div>
    {shown === 0 && <div className="labSearchEmpty"><p>{labels.empty}</p><button type="button" className="button" onClick={reset}>{labels.clear}</button></div>}
    {groups.map((group) => {
      const groupCards = cards.filter((_, index) => items[index].subject === group.slug && visible[index]);
      if (!groupCards.length) return null;
      return <section id={group.slug} className={`libGroup subject-${group.slug}`} key={group.slug} aria-labelledby={`${id}-${group.slug}`}>
        <header className="libGroupHeader"><div><h2 id={`${id}-${group.slug}`}>{group.name}</h2><span>{group.meta}</span></div><Link href={group.href}>{group.viewLabel} →</Link></header>
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
