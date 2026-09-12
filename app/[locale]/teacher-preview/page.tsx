import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { localizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/teacher-preview", m.teacher.title, m.teacher.subtitle, { noIndex: true });
}

export default async function Page({params}:{params:Promise<{locale:string}>}) {
  const {locale:raw}=await params;
  if(!isLocale(raw)) notFound();
  const m=getMessages(raw);
  return <main className="container"><header className="pageHeader"><h1 className="pageTitle">{m.teacher.title}</h1><p className="lede">{m.teacher.subtitle}</p></header><section className="grid4">{[m.teacher.classes,m.teacher.completion,m.teacher.mistakes,m.teacher.objectives].map((x,i)=><article className="card" key={x}><span className="muted">{m.teacher.preview} {i+1}</span><h3>{x}</h3><div className="formula">{i===0?`3 ${m.teacher.active}`:i===1?'78%':i===2?m.teacher.highDescentVelocity:'4 / 6'}</div></article>)}</section></main>;
}
