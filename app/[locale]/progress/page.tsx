import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { ProgressClient } from "@/components/progress/ProgressClient";
import { localizedMetadata } from "@/lib/seo/metadata";
import styles from "@/components/classroom/classroom.module.css";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/progress", m.progress.title, m.progress.subtitle, { noIndex: true });
}

export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale:raw}=await params;
  if(!isLocale(raw)) notFound();
  const m=getMessages(raw);
  return <main className={`container ${styles.page}`}><ProgressClient locale={raw} m={m}/></main>;
}
