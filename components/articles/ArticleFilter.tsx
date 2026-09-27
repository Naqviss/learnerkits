"use client";
import { Children, useEffect, useState, type ReactNode } from "react";
import styles from "./articles.module.css";

type Category = { id: string; name: string };

// One mixed grid of article cards with category chips on top. Cards are rendered on the server
// (every article stays in the initial HTML); `categoryOf[i]` is the category id of `children[i]`.
export function ArticleFilter({ categories, categoryOf, allLabel, children }: { categories: Category[]; categoryOf: string[]; allLabel: string; children: ReactNode }) {
  const [active, setActive] = useState("");
  const cards = Children.toArray(children);
  // Older links such as /articles#ai-in-education open with that category selected.
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (categories.some((category) => category.id === hash)) setActive(hash);
  }, [categories]);
  const count = (id: string) => (id ? categoryOf.filter((value) => value === id).length : cards.length);
  const select = (id: string) => {
    setActive(id);
    history.replaceState(null, "", id ? `#${id}` : window.location.pathname);
  };
  return <>
    <div className={styles.categoryNav} role="group" aria-label="Article categories">
      {[{ id: "", name: allLabel }, ...categories].map((category) => <button type="button" key={category.id || "all"} aria-pressed={active === category.id} onClick={() => select(category.id)}>{category.name}<span>{count(category.id)}</span></button>)}
    </div>
    <div className={styles.grid}>{cards.filter((_, index) => !active || categoryOf[index] === active)}</div>
  </>;
}
