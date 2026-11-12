import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TeacherDashboard } from "@/components/classroom/TeacherDashboard";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/classroom/classroom.module.css";

export function generateStaticParams() { return [{ locale: "en" }]; }
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/teacher-kit/dashboard", "Teacher dashboard", "Your LearnerKits Teacher Kit workspace: classes, lessons, question papers, assignments and marking.", { englishOnly: true, noIndex: true });
}

export default async function TeacherDashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <main className={`container ${styles.page}`}><TeacherDashboard /></main>;
}
