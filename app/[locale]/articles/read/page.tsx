import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ManagedArticleReader } from "@/components/articles/ManagedArticleContent";
import { localizedMetadata } from "@/lib/seo/metadata";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  if ((await params).locale !== "en") return {};
  return localizedMetadata("en", "/articles/read", "LearnerKits Article", "Read the latest science learning article from LearnerKits.", { englishOnly: true, noIndex: true });
}

export default async function ManagedArticlePage({ params }: { params: Promise<{ locale: string }> }) {
  if ((await params).locale !== "en") notFound();
  return <ManagedArticleReader />;
}
