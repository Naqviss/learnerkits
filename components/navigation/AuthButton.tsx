"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { authEnabled } from "@/lib/auth/client";
import { clearAuthFailure, signInWithGoogle, signOut, useAuth } from "@/lib/auth/session";
import { openPremium, postWithSession, premiumEnabled, usePremium } from "@/lib/billing/premium";
import { getPremiumCopy } from "@/lib/premium/copy";

type Labels = { signIn: string; signInWithGoogle: string; signOut: string; account: string; failed: string };

export function AuthButton({ labels, locale = "en", settingsLabel }: { labels: Labels; locale?: string; settingsLabel?: string }) {
  const { status, session, failed } = useAuth();
  const premium = usePremium();
  const premiumCopy = getPremiumCopy(locale);
  const [busy, setBusy] = useState(false);
  const [menuError, setMenuError] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const menu = useRef<HTMLDetailsElement>(null);
  const user = status === "signedIn" ? session?.user : undefined;

  useEffect(() => {
    // Returning with the Back button from Google's page restores this page from the bfcache.
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) setBusy(false); };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  useEffect(() => {
    if (!failed) return;
    const timer = window.setTimeout(clearAuthFailure, 8000);
    return () => window.clearTimeout(timer);
  }, [failed]);

  // Close the account menu on outside click or Escape.
  useEffect(() => {
    if (!user) return;
    const close = (event: Event) => {
      const details = menu.current;
      if (!details?.open) return;
      if (event instanceof KeyboardEvent) {
        if (event.key !== "Escape") return;
        details.open = false;
        details.querySelector("summary")?.focus();
      } else if (!details.contains(event.target as Node)) details.open = false;
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", close); };
  }, [user]);

  if (!authEnabled) return null;

  const signIn = async () => {
    setBusy(true);
    // Navigates to Google; Supabase sends the browser back to this page afterwards.
    try { await signInWithGoogle(); } catch { setBusy(false); }
  };

  const leave = async () => {
    setBusy(true);
    try { await signOut(); } finally { setBusy(false); }
  };

  const manageSubscription = async () => {
    setBusy(true);
    setMenuError("");
    try {
      const { ok, data } = await postWithSession<{ url?: string }>("/api/billing/portal", {});
      if (ok && data.url) { window.location.assign(data.url); return; }
      setMenuError(data.error || premiumCopy.manageError);
    } catch { setMenuError(premiumCopy.manageError); }
    setBusy(false);
  };

  if (user) {
    const meta = user.user_metadata ?? {};
    const name = String(meta.full_name || meta.name || user.email || "");
    const avatar = typeof meta.avatar_url === "string" ? meta.avatar_url : typeof meta.picture === "string" ? meta.picture : "";
    return <details className="authMenu" ref={menu} data-clarity-mask="true">
      <summary className={`authAvatar${premium === "premium" ? " isPremium" : ""}`} aria-label={`${labels.account}: ${name}`} title={name}>
        {avatar && !avatarFailed
          ? <img src={avatar} alt="" width={36} height={36} referrerPolicy="no-referrer" onError={() => setAvatarFailed(true)}/>
          : <span aria-hidden="true">{name.trim().charAt(0).toUpperCase() || "?"}</span>}
      </summary>
      <div className="authMenuPanel">
        <p><strong>{name}{premiumEnabled && premium === "premium" && <span className="premiumBadge">{premiumCopy.badge}</span>}</strong>{user.email && user.email !== name && <span>{user.email}</span>}</p>
        {premiumEnabled && premium === "premium" && <button type="button" className="authMenuAction" onClick={manageSubscription} disabled={busy}>{premiumCopy.manage}</button>}
        {premiumEnabled && premium === "free" && <button type="button" className="authMenuAction isUpgrade" onClick={() => { if (menu.current) menu.current.open = false; openPremium("menu"); }}>{premiumCopy.goPremium}</button>}
        {settingsLabel && <Link className="authMenuAction authMenuLink" href={`/${locale}/settings`} onClick={() => { if (menu.current) menu.current.open = false; }}>{settingsLabel}</Link>}
        {menuError && <p role="alert" className="authMenuError">{menuError}</p>}
        <button type="button" className="authSignOut" onClick={leave} disabled={busy}>{labels.signOut}</button>
      </div>
    </details>;
  }

  return <span className="authWrap">
    <button type="button" className="authButton" onClick={signIn} disabled={busy} aria-label={labels.signInWithGoogle} title={labels.signInWithGoogle}>
      <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
      <span className="authButtonText">{labels.signIn}</span>
    </button>
    {failed && <span role="alert" className="authError">{labels.failed}</span>}
  </span>;
}
