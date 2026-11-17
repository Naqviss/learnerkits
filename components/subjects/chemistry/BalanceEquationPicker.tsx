"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { reactions } from "@/lib/simulations/chemistry/model";
import styles from "./chemistry.module.css";

const superscripts: Record<string, string> = { "⁰":"0", "¹":"1", "²":"2", "³":"3", "⁴":"4", "⁵":"5", "⁶":"6", "⁷":"7", "⁸":"8", "⁹":"9", "⁺":"+", "⁻":"-" };
const plain = (text: string) => text.toLowerCase()
  .replace(/[₀-₉]/g, d => String("₀₁₂₃₄₅₆₇₈₉".indexOf(d)))
  .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]/g, d => superscripts[d] ?? d)
  .replace(/\s+/g, " ");

export function BalanceEquationPicker({ label, options, value, onChange }: {
  label: string;
  options: string[];
  value: number;
  onChange: (index: number) => void;
}) {
  const [query, setQuery] = useState("");
  const list = useRef<HTMLDivElement>(null);
  const items = useMemo(() => reactions.map((reaction, index) => ({
    index,
    name: options[index] ?? `Equation ${index + 1}`,
    formula: `${reaction.formula.slice(0, reaction.split).join(" + ")} → ${reaction.formula.slice(reaction.split).join(" + ")}`,
  })), [options]);
  const needle = plain(query.trim());
  const shown = needle ? items.filter(item => plain(item.name).includes(needle) || plain(item.formula).includes(needle)) : items;

  useEffect(() => {
    const box = list.current;
    const chosen = box?.querySelector<HTMLElement>('[aria-pressed="true"]');
    if (!box || !chosen) return;
    if (chosen.offsetTop < box.scrollTop || chosen.offsetTop + chosen.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTop = chosen.offsetTop - box.clientHeight / 2;
    }
  }, [value]);

  return <div className={`${styles.picker} ${styles.equationPicker}`}>
    <div className={styles.pickerHead}><b>{label}</b><span>{items.length} equations</span></div>
    <input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Search equation name or formula" aria-label="Search equations" />
    <div className={styles.pickerList} ref={list} role="group" aria-label={label}>
      {shown.map(item => <button key={item.index} type="button" aria-pressed={item.index === value} onClick={() => onChange(item.index)}>
        <span>{item.name}</span><b>{item.formula}</b>
      </button>)}
      {shown.length === 0 && <p>No equation matches “{query}”.</p>}
    </div>
  </div>;
}
