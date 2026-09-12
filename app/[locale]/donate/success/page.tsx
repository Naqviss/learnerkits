import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { isLocale } from "@/lib/i18n/config";
import { getEducationCopy } from "@/lib/i18n/content";
import { localizedMetadata } from "@/lib/seo/metadata";
export async function generateMetadata({ params }: { params: Promise<{locale:string}> }):Promise<Metadata>{ const {locale}=await params;if(!isLocale(locale))return {};const c=getEducationCopy(locale);return localizedMetadata(locale,"/donate/success",c.donate.successTitle,c.donate.successBody,{noIndex:true}); }
export default async function DonateSuccess({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();const c=getEducationCopy(locale);return <main className="container donationState"><span className="stateIcon" aria-hidden="true">✓</span><h1>{c.donate.successTitle}</h1><p>{c.donate.successBody}</p><Link className="button primary" href={`/${locale}`}>{c.donate.back}</Link></main>}
