"use client";

import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { signOut } from "@/lib/auth/session";
import type { WorkspaceMode } from "@/lib/auth/workspace";
import { openPremium, postWithSession, premiumEnabled, usePremium } from "@/lib/billing/premium";
import { getPremiumCopy } from "@/lib/premium/copy";
import styles from "./workspace.module.css";

export function WorkspaceProfile({ user, mode, setMode, locale, signOutLabel }: {
  user: User;
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  locale: string;
  signOutLabel: string;
}) {
  const premium = usePremium();
  const copy = getPremiumCopy(locale);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const metadata = user.user_metadata;
  const name = [metadata?.full_name, metadata?.name].find((value): value is string => typeof value === "string" && Boolean(value.trim()));
  const avatar = [metadata?.avatar_url, metadata?.picture].find((value): value is string => typeof value === "string" && value.startsWith("https://"));
  const initial = (name || user.email || "?").trim().charAt(0).toUpperCase();

  async function manageSubscription() {
    setBusy(true);
    setError("");
    try {
      const { ok, data } = await postWithSession<{ url?: string }>("/api/billing/portal", {});
      if (ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      setError(data.error || copy.manageError);
    } catch {
      setError(copy.manageError);
    }
    setBusy(false);
  }

  return <section className={styles.profile} aria-label="Profile" data-clarity-mask="true">
    <div className={styles.identity}>
      <span className={styles.avatar} aria-hidden="true">
        {avatar && !avatarFailed ? <img src={avatar} alt="" width={36} height={36} referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)} /> : initial}
      </span>
      <div>
        {name && <strong>{name}</strong>}
        {user.email && <span>{user.email}</span>}
      </div>
    </div>
    <fieldset className={styles.mode}>
      <legend>Workspace mode</legend>
      {(["student", "teacher"] as const).map((option) => <label key={option}>
        <input type="radio" name="workspace-mode" checked={option === mode} onChange={() => setMode(option)} />
        <span>{option === "student" ? "Student" : "Teacher"}</span>
      </label>)}
    </fieldset>
    <div className={styles.accountActions}>
      <button type="button" className={styles.accountAction} disabled={busy} onClick={async () => {
        setBusy(true);
        try { await signOut(); } finally { setBusy(false); }
      }}>{signOutLabel}</button>
      {premiumEnabled && premium === "premium" && <button type="button" className={styles.accountAction} disabled={busy} onClick={() => void manageSubscription()}>{copy.manage}</button>}
      {premiumEnabled && premium === "free" && <button type="button" className={styles.accountAction} onClick={() => openPremium("menu")}>{copy.goPremium}</button>}
    </div>
    {error && <p className={styles.error} role="alert">{error}</p>}
  </section>;
}
