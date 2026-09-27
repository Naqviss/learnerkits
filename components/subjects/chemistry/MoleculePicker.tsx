"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { moleculeName, molecules } from "@/lib/simulations/chemistry/model";
import styles from "./chemistry.module.css";

// Plain-text form of a formula so "h2o", "so4" or "water" all match while searching.
const plain = (text: string) => text.toLowerCase().replace(/[₀-₉]/g, (d) => String("₀₁₂₃₄₅₆₇₈₉".indexOf(d))).replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, "");

// Searchable list of every lab molecule by name and formula. Shapes are deliberately not shown,
// because identifying the shape is the student's task.
export function MoleculePicker({ label, value, onChange }: { label: string; value: number; onChange: (index: number) => void }) {
  const [query, setQuery] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const items = useMemo(() => molecules.map((m, index) => ({ index, formula: m.formula, name: moleculeName(m.formula) })).sort((a, b) => a.name.localeCompare(b.name)), []);
  const needle = plain(query.trim());
  const shown = needle ? items.filter((item) => plain(item.name).includes(needle) || plain(item.formula).includes(needle)) : items;
  // Keep the chosen molecule in view inside the list (not the page), e.g. after a reference-page link.
  useEffect(() => {
    const box = list.current, chosen = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!box || !chosen) return;
    if (chosen.offsetTop < box.scrollTop || chosen.offsetTop + chosen.offsetHeight > box.scrollTop + box.clientHeight) box.scrollTop = chosen.offsetTop - box.clientHeight / 2;
  }, [value]);
  return <div className={styles.picker}>
    <div className={styles.pickerHead}><b>{label}</b><span>{items.length} molecules</span></div>
    <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name or formula (e.g. water, SF6)" aria-label="Search molecules" />
    <div className={styles.pickerList} ref={list} role="group" aria-label={label}>
      {shown.map((item) => <button type="button" key={item.index} aria-pressed={item.index === value} onClick={() => onChange(item.index)}><span>{item.name}</span><b>{item.formula}</b></button>)}
      {shown.length === 0 && <p>No molecule matches “{query}”.</p>}
    </div>
  </div>;
}
