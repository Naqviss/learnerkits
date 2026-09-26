"use client";
import { Children, useId, useMemo, useState, type ReactNode } from "react";
import { SearchIcon } from "@/components/navigation/SearchIcon";
import { matchesTerms, normalizeSearch, searchTerms } from "@/lib/search/normalize";

// `count` is a template with {shown} and {total}: functions can't cross the server/client boundary.
type Labels = { label: string; placeholder: string; count: string; empty: string; clear: string };

// Cards arrive already rendered by the server, so every lab stays in the initial HTML for
// crawlers; this only hides the ones that don't match. `searchText[i]` describes `children[i]`.
export function SubjectLabSearch({ searchText, labels, children }: { searchText: string[]; labels: Labels; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const id = useId();
  const cards = Children.toArray(children);
  const haystack = useMemo(() => searchText.map(normalizeSearch), [searchText]);
  const terms = searchTerms(query);
  const visible = cards.filter((_, index) => matchesTerms(haystack[index] ?? "", terms));

  return <>
    <div className="labSearch" role="search">
      <label className="labSearchLabel" htmlFor={id}>{labels.label}</label>
      <div className="labSearchField">
        <span className="labSearchInputWrap"><SearchIcon className="searchFieldIcon"/><input
          id={id}
          className="labSearchInput"
          type="search"
          placeholder={labels.placeholder}
          value={query}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}
        /></span>
        <span className="labSearchCount" aria-live="polite">{terms.length ? labels.count.replace("{shown}", String(visible.length)).replace("{total}", String(cards.length)) : ""}</span>
      </div>
    </div>
    {visible.length
      ? <div className="labCatalogGrid">{visible}</div>
      : <div className="labSearchEmpty"><p>{labels.empty}</p><button type="button" className="button" onClick={() => setQuery("")}>{labels.clear}</button></div>}
  </>;
}
