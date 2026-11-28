import type { ReactNode } from "react";
import styles from "./examPrep.module.css";

// Plain notices with no server-only imports, so the signed-in study view (a client component) can use them.

export function Notice({ children, warn }: { children: ReactNode; warn?: boolean }) {
  return <div className={`${styles.notice} ${warn ? styles.warn : ""}`} role="note"><span aria-hidden="true">ⓘ</span><div>{children}</div></div>;
}

export function IllustrativeNotice() {
  return <Notice warn><strong>Illustrative topic list.</strong> These topics are sample teaching topics matched to LearnerKits simulations, not a validated syllabus for this board and level. Check the official specification for your exam year.</Notice>;
}

export function IndependenceNotice() {
  return <Notice><strong>Independent study resource.</strong> LearnerKits is not affiliated with or endorsed by any exam board. Practice questions are original and are not taken from official papers. Always confirm requirements in the official specification for your exam year.</Notice>;
}
