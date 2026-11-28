"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MoleculeViewer } from "@/components/seo/MoleculeViewer";
import type { MoleculeDetails } from "@/lib/seo/molecule-details";
import styles from "./moleculeExplorer.module.css";

export type MoleculeRow = {
  index: number; slug: string; formula: string; asciiFormula: string; name: string; center: string; outer: string;
  bondingPairs: number; lonePairs: number; axe: string; shape: string; electronGeometry: string; bondAngle: string; angle: string;
  hybridization?: string; polarity: "Polar" | "Nonpolar" | "Ion"; core: boolean;
};

const host = (url: string) => new URL(url).hostname.replace(/^www\./, "");
const polarityLabel = (row: MoleculeRow) => (row.polarity === "Ion" ? "Ion (charged)" : row.polarity);

type Filters = { query: string; shape: string; polarity: string; lone: string; core: boolean };
const noFilters: Filters = { query: "", shape: "", polarity: "", lone: "", core: false };

/**
 * Every molecule and ion in one searchable, filterable table. "View 3D" opens it in a dialog with its
 * model and details, addressed as /en/molecules#<slug> so it can be shared (the old per-molecule URLs
 * 301 there). The table itself is server-rendered, so each molecule's key facts are in the page HTML;
 * the longer details load on first open.
 */
export function MoleculeExplorer({ rows }: { rows: MoleculeRow[] }) {
  const [filters, setFilters] = useState<Filters>(noFilters);
  const [slug, setSlug] = useState<string | null>(null);
  const [details, setDetails] = useState<Record<string, MoleculeDetails | null>>({});
  const dialog = useRef<HTMLDialogElement>(null);
  const bySlug = useMemo(() => new Map(rows.map((row) => [row.slug, row])), [rows]);
  const selected = slug ? bySlug.get(slug) : undefined;
  const shapes = useMemo(() => [...new Map(rows.map((row) => [`${row.shape}|${row.axe}`, row])).values()], [rows]);
  const loneCounts = useMemo(() => [...new Set(rows.map((row) => row.lonePairs))].sort((a, b) => a - b), [rows]);

  // The address bar hash is the source of truth, so back/forward and shared links work.
  useEffect(() => {
    const read = () => { const hash = decodeURIComponent(window.location.hash.slice(1)); setSlug(bySlug.has(hash) ? hash : null); };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, [bySlug]);

  useEffect(() => {
    const element = dialog.current;
    if (!element) return;
    if (selected && !element.open) element.showModal();
    if (!selected && element.open) element.close();
    if (selected && !(selected.slug in details)) {
      void import("@/lib/seo/molecule-details").then(({ moleculeDetails }) => setDetails((current) => ({ ...current, [selected.slug]: moleculeDetails(selected.slug) ?? null })));
    }
  }, [selected, details]);

  const close = useCallback(() => {
    if (window.location.hash) history.replaceState(history.state, "", window.location.pathname + window.location.search);
    setSlug(null);
  }, []);

  const set = (patch: Partial<Filters>) => setFilters((current) => ({ ...current, ...patch }));
  const needle = filters.query.trim().toLowerCase();
  const visible = rows.filter((row) =>
    (!needle || [row.formula, row.asciiFormula, row.name, row.shape, row.axe, row.center].some((value) => value.toLowerCase().includes(needle))) &&
    (!filters.shape || `${row.shape}|${row.axe}` === filters.shape) &&
    (!filters.polarity || row.polarity === filters.polarity) &&
    (filters.lone === "" || row.lonePairs === Number(filters.lone)) &&
    (!filters.core || row.core));
  const filtered = visible.length !== rows.length;
  const info = selected ? details[selected.slug] : undefined;

  return <>
    <form className={styles.filters} role="search" aria-label="Filter molecules" onSubmit={(event) => event.preventDefault()}>
      <label className={styles.search}><span>Search</span>
        <input type="search" value={filters.query} onChange={(event) => set({ query: event.target.value })} placeholder="Formula, name or shape: H2O, ammonia, seesaw" />
      </label>
      <label><span>Molecular shape</span>
        <select value={filters.shape} onChange={(event) => set({ shape: event.target.value })}>
          <option value="">All 13 shapes</option>
          {shapes.map((row) => <option key={`${row.shape}|${row.axe}`} value={`${row.shape}|${row.axe}`}>{row.shape} ({row.axe})</option>)}
        </select>
      </label>
      <label><span>Polarity</span>
        <select value={filters.polarity} onChange={(event) => set({ polarity: event.target.value })}>
          <option value="">Polar, nonpolar and ions</option><option value="Polar">Polar molecules</option><option value="Nonpolar">Nonpolar molecules</option><option value="Ion">Polyatomic ions</option>
        </select>
      </label>
      <label><span>Lone pairs on the central atom</span>
        <select value={filters.lone} onChange={(event) => set({ lone: event.target.value })}>
          <option value="">Any number</option>{loneCounts.map((count) => <option key={count} value={count}>{count === 0 ? "None (shape = electron geometry)" : `${count} lone pair${count > 1 ? "s" : ""}`}</option>)}
        </select>
      </label>
      <label className={styles.toggle}><input type="checkbox" checked={filters.core} onChange={(event) => set({ core: event.target.checked })} /><span>Textbook examples only</span></label>
    </form>
    <div className={styles.countRow}>
      <p className={styles.count} aria-live="polite">{filtered ? `${visible.length} of ${rows.length} match` : `${rows.length} molecules and ions`}</p>
      {filtered && <button type="button" className={styles.reset} onClick={() => setFilters(noFilters)}>Clear filters</button>}
    </div>
    <div className="vseprTableWrap">
      <table className={`vseprTable ${styles.table}`}>
        <caption className={styles.caption}>Molecular geometry, bond angle, hybridization and polarity of each molecule and ion</caption>
        <thead><tr><th scope="col">Formula</th><th scope="col">Name</th><th scope="col">Molecular shape</th><th scope="col">Electron geometry</th><th scope="col">Bond angle</th><th scope="col">Polarity</th><th scope="col"><span className={styles.srOnly}>3D model</span></th></tr></thead>
        <tbody>{visible.map((row) => <tr key={row.slug} id={row.slug}>
          <th scope="row"><a href={`#${row.slug}`}>{row.formula}</a></th>
          <td>{row.name}<small className={styles.ascii}>{row.asciiFormula}</small></td>
          <td>{row.shape}<small className={styles.ascii}>{row.axe} · {row.lonePairs === 0 ? "no lone pairs" : `${row.lonePairs} lone pair${row.lonePairs > 1 ? "s" : ""}`}</small></td>
          <td>{row.electronGeometry}{row.hybridization && <small className={styles.ascii}>{row.hybridization} hybridized</small>}</td>
          <td>{row.angle}</td>
          <td>{polarityLabel(row)}</td>
          <td><a className={styles.view} href={`#${row.slug}`} aria-label={`View ${row.name} (${row.asciiFormula}) in 3D`}>View 3D</a></td>
        </tr>)}</tbody>
      </table>
      {!visible.length && <p className={styles.empty}>No molecule matches these filters. <button type="button" className={styles.reset} onClick={() => setFilters(noFilters)}>Clear filters</button></p>}
    </div>

    <dialog ref={dialog} className={styles.dialog} aria-labelledby="molecule-dialog-title" onClose={close} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      {selected && <article>
        <header className={styles.dialogHead}>
          <div><span className="eyebrow">{selected.axe} · {selected.shape}</span><h2 id="molecule-dialog-title">{selected.name} ({selected.formula})</h2></div>
          <button type="button" className={styles.close} onClick={close} aria-label="Close">×</button>
        </header>
        <MoleculeViewer key={selected.slug} index={selected.index} label={`Interactive 3D model of ${selected.name} (${selected.formula})`} />
        <dl className="moleculeFacts">
          <div><dt>Molecular geometry</dt><dd>{selected.shape}</dd></div>
          <div><dt>Electron geometry</dt><dd>{selected.electronGeometry}</dd></div>
          <div><dt>Bond angle</dt><dd>{selected.bondAngle}</dd></div>
          {info?.bondLength && <div><dt>{selected.center}–{selected.outer} bond length</dt><dd>{info.bondLength.text}</dd></div>}
          <div><dt>Bonding domains</dt><dd>{selected.bondingPairs}</dd></div>
          <div><dt>Lone pairs on {selected.center}</dt><dd>{selected.lonePairs}</dd></div>
          {selected.hybridization && <div><dt>Hybridization</dt><dd>{selected.hybridization}</dd></div>}
          <div><dt>Polarity</dt><dd>{selected.polarity === "Ion" ? "Polyatomic ion (net charge)" : selected.polarity}</dd></div>
        </dl>
        {info === undefined ? <p role="status">Loading details…</p> : info && <>
          <p>{info.lead}</p>
          <h3>Why is {selected.formula} {selected.shape.toLowerCase()}?</h3><p>{info.why}</p>
          {info.lewis && <><h3>Lewis structure, step by step</h3><ol>{info.lewis.steps.map((step) => <li key={step}>{step}</li>)}</ol>{info.lewis.resonance && <p>{info.lewis.resonance}</p>}</>}
          <h3>Polar or nonpolar?</h3><p>{info.polarity}</p>
          {info.about && <><h3>About {selected.name.toLowerCase()}</h3><p>{info.about.text}</p><p className="moleculeSource">{info.about.state} Source: <a href={info.about.source} rel="noopener">{host(info.about.source)}</a></p></>}
          {info.bondLength && <p className="moleculeSource">Bond length source: <a href={info.bondLength.source} rel="noopener">{host(info.bondLength.source)}</a></p>}
        </>}
        <div className={styles.actions}>
          <Link className="button primary" href={`/en/simulations/molecular-geometry-3d#molecule=${selected.slug}`}>Test yourself in the 3D lab</Link>
          <button type="button" className="button" onClick={close}>Back to the chart</button>
        </div>
      </article>}
    </dialog>
  </>;
}
