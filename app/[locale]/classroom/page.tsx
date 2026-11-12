import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StudentClassroom } from "@/components/classroom/StudentClassroom";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/classroom/classroom.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/classroom", "My classroom", "Join your teacher's LearnerKits class, complete assignments and see your results.", { englishOnly: true, noIndex: true });
}

export default async function ClassroomPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <main className={`container ${styles.page}`}><StudentClassroom /></main>;
}
