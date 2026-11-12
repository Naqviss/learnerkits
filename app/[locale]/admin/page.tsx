import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/classroom/classroom.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/admin", "Admin", "LearnerKits administration.", { englishOnly: true, noIndex: true });
}

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <main className={`container ${styles.page}`}><AdminPanel /></main>;
}
