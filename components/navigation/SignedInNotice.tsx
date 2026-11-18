"use client";

import { useAuth } from "@/lib/auth/session";

export function SignedInNotice({ message }: { message: string }) {
  const { status } = useAuth();

  if (status !== "signedIn") return null;

  return <aside className="signedInNotice" role="status" aria-live="polite">
    <div className="container signedInNoticeInner">
      <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
        <path d="M7 3v3M17 3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"/>
        <path d="m9 14 2 2 4-4"/>
      </svg>
      <p>{message}</p>
    </div>
  </aside>;
}
