"use client";

import dynamic from "next/dynamic";
import styles from "./MoleculeViewer.module.css";

// three.js is only fetched after hydration, so the reference text above and below the
// model is readable (and crawlable) immediately. The fixed-height shell prevents layout shift.
const MolecularScene = dynamic(() => import("@/components/subjects/chemistry/MolecularScene").then((module) => module.MolecularScene), {
  ssr: false,
  loading: () => <div className={styles.loading}>Loading 3D model…</div>,
});

export function MoleculeViewer({ index, label }: { index: number; label: string }) {
  return <figure className={styles.viewer} aria-label={label}>
    <MolecularScene molecule={index} paused={false} resetKey={0} />
  </figure>;
}
