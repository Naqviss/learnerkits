"use client";
import { Children, useEffect, useState, type ReactNode } from "react";
import styles from "./articles.module.css";

type Category = { id: string; name: string };
type View = "cards" | "list";
const viewKey = "articles-view";

const views: { id: View; label: string; icon: ReactNode }[] = [
  { id: "cards", label: "Cards", icon: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" /><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" /><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" /><rect x="9" y="9" width="5.5" height="5.5" rx="1.2" /></svg> },
  { id: "list", label: "List", icon: <svg viewBox="0 0 16 16" aria-hidden="true"><rect x="1.5" y="2" width="4" height="3" rx="1" /><rect x="7" y="2.75" width="7.5" height="1.5" rx=".75" /><rect x="1.5" y="6.5" width="4" height="3" rx="1" /><rect x="7" y="7.25" width="7.5" height="1.5" rx=".75" /><rect x="1.5" y="11" width="4" height="3" rx="1" /><rect x="7" y="11.75" width="7.5" height="1.5" rx=".75" /></svg> },
];

// One mixed grid of article cards with category chips on top. Cards are rendered on the server
// (every article stays in the initial HTML); `categoryOf[i]` is the category id of `children[i]`.
export function ArticleFilter({ categories, categoryOf, allLabel, children }: { categories: Category[]; categoryOf: string[]; allLabel: string; children: ReactNode }) {
  const [active, setActive] = useState("");
  const [view, setView] = useState<View>("list");
  const cards = Children.toArray(children);
  // Older links such as /articles#ai-in-education open with that category selected.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (categories.some((category) => category.id === hash)) setActive(hash);
  }, [categories]);
  // The chosen layout is a per-browser convenience; the server always renders the list.
  useEffect(() => {
    try { if (localStorage.getItem(viewKey) === "cards") setView("cards"); } catch {}
  }, []);
  const count = (id: string) => (id ? categoryOf.filter((value) => value === id).length : cards.length);
  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
  };
  const choose = (next: View) => {
    setView(next);
    try { localStorage.setItem(viewKey, next); } catch {}
  };
  return <>
    <div className={styles.toolbar}>
      <div className={styles.categoryNav} role="group" aria-label="Article categories">
        {[{ id: "", name: allLabel }, ...categories].map((category) => <button type="button" key={category.id || "all"} aria-pressed={active === category.id} onClick={() => select(category.id)}>{category.name}<span>{count(category.id)}</span></button>)}
      </div>
      <div className={styles.viewToggle} role="group" aria-label="Article layout">
        {views.map((option) => <button type="button" key={option.id} aria-pressed={view === option.id} title={`${option.label} view`} onClick={() => choose(option.id)}>{option.icon}<span>{option.label}</span></button>)}
      </div>
    </div>
    <div className={`${styles.grid} ${view === "list" ? styles.list : ""}`}>{cards.filter((_, index) => !active || categoryOf[index] === active)}</div>
  </>;
}
