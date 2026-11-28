"use client";

import { useEffect, useState } from "react";
import { authEnabled } from "@/lib/auth/client";
import { signInWithGoogle } from "@/lib/auth/session";

/**
 * Sign-in call to action on the public Exam Prep page. Lessons open only for signed-in students, so
 * a visitor who followed an old lesson link (it now carries ?board=…&topic=…) is told why they see
 * this page and returns to the same lesson after signing in.
 */
export function StudySignIn({ label = "Sign in free to start revising", lessonLabel = "Sign in to open this lesson", lessonNote = "Exam-prep lessons are for signed-in students. Sign in with Google (free) and the lesson you followed opens here." }: { label?: string; lessonLabel?: string; lessonNote?: string }) {
  const [busy, setBusy] = useState(false);
  const [wantsLesson, setWantsLesson] = useState(false);
  useEffect(() => { setWantsLesson(/[?&](board|practical|exam)=/.test(window.location.search)); }, []);
  if (!authEnabled) return null;
  return <>
    <button type="button" className="button primary" disabled={busy} aria-busy={busy} onClick={() => { setBusy(true); void signInWithGoogle().finally(() => setBusy(false)); }}>
      {busy ? "Opening Google…" : wantsLesson ? lessonLabel : label}
    </button>
    {wantsLesson && <p role="status" style={{ flexBasis: "100%", margin: 0 }}>{lessonNote}</p>}
  </>;
}
