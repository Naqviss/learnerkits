import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { missions } from "@/lib/missions/catalog";
import { t } from "@/lib/i18n/t";
import { localizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/missions", m.missions.title, m.missions.subtitle);
}

export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale:raw}=await params;
  if(!isLocale(raw)) notFound();
  const m=getMessages(raw);
  return <main className="container"><header className="pageHeader"><div className="eyebrow">{m.navigation.progress}</div><h1 className="pageTitle">{m.missions.title}</h1><p className="lede">{m.missions.subtitle}</p></header><section className="grid3">{missions.map(x=><article className="card" key={x.id}><span className="pill">{x.difficulty==="Beginner"?m.difficulty.beginner:x.difficulty==="Intermediate"?m.difficulty.intermediate:m.difficulty.advanced}</span><span className="pill">+{x.xp} {m.missions.xp}</span><h3>{t(m,x.titleKey)}</h3><p className="muted">{t(m,x.descriptionKey)}</p><Link className="button" href={`/${raw}/simulations/${x.simulation==='moonLanding'?'moon-landing':'orbital-rescue'}?mission=${x.id}`}>{m.simulations.launch}</Link></article>)}</section></main>;
}
