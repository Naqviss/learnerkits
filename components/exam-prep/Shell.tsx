import Link from "next/link";
import type { ReactNode } from "react";
import { breadcrumbJsonLd, jsonLd } from "@/lib/seo/metadata";
import styles from "./examPrep.module.css";

export type Crumb = { name: string; path: string };

/** Visible breadcrumb trail plus its BreadcrumbList JSON-LD. The last crumb is the current page. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd("en", all))} />
    <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
      {all.map((item, index) => index === all.length - 1
        ? <span key={item.path} aria-current="page">{item.name}</span>
        : <span key={item.path} style={{ display: "contents" }}><Link href={`/en${item.path === "/" ? "" : item.path}`}>{item.name}</Link><span aria-hidden="true">/</span></span>)}
    </nav>
  </>;
}

export function Notice({ children, warn }: { children: ReactNode; warn?: boolean }) {
  return <div className={`${styles.notice} ${warn ? styles.warn : ""}`} role="note"><span aria-hidden="true">ⓘ</span><div>{children}</div></div>;
}

export function IllustrativeNotice() {
  return <Notice warn><strong>Illustrative topic list.</strong> These topics are sample teaching topics matched to LearnerKits simulations, not a validated syllabus for this board and level. Check the official specification for your exam year.</Notice>;
}

export function IndependenceNotice() {
  return <Notice><strong>Independent study resource.</strong> LearnerKits is not affiliated with or endorsed by any exam board. Practice questions are original and are not taken from official papers. Always confirm requirements in the official specification for your exam year.</Notice>;
}
