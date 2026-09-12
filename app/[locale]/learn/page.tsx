import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { localizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/learn", m.learn.title, m.learn.subtitle);
}

export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale:raw}=await params;
  if(!isLocale(raw)) notFound();
  const m=getMessages(raw);
  const topics=[[m.learn.gravity,m.learn.gravityBody,"gMoon ≈ 1.62 m/s²"],[m.learn.thrust,m.learn.thrustBody,"a = F / m"],[m.learn.orbit,m.learn.orbitBody,"v = √(GM/r)"],[m.learn.rocket,m.learn.rocketBody,"Δv = Isp × g0 × ln(m0/mf)"]];
  return <main className="container"><header className="pageHeader"><div className="eyebrow">{m.navigation.learn}</div><h1 className="pageTitle">{m.learn.title}</h1><p className="lede">{m.learn.subtitle}</p></header><section className="grid2">{topics.map(([title,body,formula])=><article className="card" key={title}><h3>{title}</h3><p className="muted">{body}</p><div className="formula">{formula}</div></article>)}</section></main>;
}
