import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import { SettingsClient } from "@/components/settings/SettingsClient";
import { localizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{locale:string}> }): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "en";
  const m = getMessages(locale);
  return localizedMetadata(locale, "/settings", m.settings.title, m.settings.subtitle, { noIndex: true });
}

export default async function SettingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SettingsClient m={getMessages(locale)} />;
}
