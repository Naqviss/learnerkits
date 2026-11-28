"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Loaded only in the signed-in view of /en/exam-prep, in the browser. The lessons, question banks
// and syllabus lists stay out of the exported HTML that visitors and crawlers receive.
const ExamStudy = dynamic(() => import("./ExamStudy"), { ssr: false, loading: () => <p role="status">Loading your exam prep…</p> });

export function ExamStudyLoader() {
  return <Suspense fallback={<p role="status">Loading your exam prep…</p>}><ExamStudy /></Suspense>;
}
