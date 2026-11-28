"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Loaded only in the signed-in view of /en/mock-exams, in the browser, so the question banks stay out
// of the exported HTML that visitors and crawlers receive.
const MockExamStudy = dynamic(() => import("./MockExamStudy"), { ssr: false, loading: () => <p role="status">Loading your mock exams…</p> });

export function MockExamStudyLoader() {
  return <Suspense fallback={<p role="status">Loading your mock exams…</p>}><MockExamStudy /></Suspense>;
}
