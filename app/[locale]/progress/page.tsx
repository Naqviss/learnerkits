import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { ProgressClient } from "@/components/progress/ProgressClient";
import { localizedMetadata } from "@/lib/seo/metadata";
import { progressPageEnabled } from "@/lib/progression/storage";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  if (!progressPageEnabled) notFound();
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/progress", m.progress.title, m.progress.subtitle, { noIndex: true });
}

export default async function Page({params}:{params:Promise<{locale:string}>}) {
  if (!progressPageEnabled) notFound();
  const {locale:raw}=await params;
  if(!isLocale(raw)) notFound();
  const m=getMessages(raw);
  return <main className="container"><header className="pageHeader"><h1 className="pageTitle">{m.progress.title}</h1><p className="lede">{m.progress.subtitle}</p></header><ProgressClient m={m}/><p className="muted">{m.progress.local}</p></main>;
}
