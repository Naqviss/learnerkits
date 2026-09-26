import type { Locale } from "@/lib/i18n/config";
import type { SubjectSlug } from "@/lib/subjects/catalog";
import { SubjectImage } from "./SubjectImage";

// Decorative brand stamp over subject artwork; the card title already names the subject.
export function Watermark() {
  return <span className="subjectWatermark" aria-hidden="true"><img src="/learnerkits-mark.svg" alt="" width="16" height="16"/>LearnerKits</span>;
}

// Upcoming subjects keep their artwork visible beneath the status badge.
export function SubjectCardMedia({ subject, locale, comingSoon, priority = false }: { subject: SubjectSlug; locale: Locale; comingSoon?: string; priority?: boolean }) {
  return <div className={`subjectCardMedia${comingSoon ? " subjectCardMediaSoon" : ""}`}><SubjectImage subject={subject} locale={locale} thumbnail priority={priority}/>{comingSoon && <span className="comingSoonBadge">{comingSoon}</span>}<Watermark/></div>;
}
