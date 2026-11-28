import Link from "next/link";
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
        : <span key={item.path} style={{ display: "contents" }}><Link href={item.path === "/" ? "/" : `/en${item.path}`}>{item.name}</Link><span aria-hidden="true">/</span></span>)}
    </nav>
  </>;
}

export { IllustrativeNotice, IndependenceNotice, Notice } from "./Notices";
