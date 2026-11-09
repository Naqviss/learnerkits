"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { signInWithGoogle, useAuth } from "@/lib/auth/session";
import { getBillingConfig, postWithSession, premiumEnabled, premiumEvent, refreshPremium, usePremium, type PremiumReason } from "@/lib/billing/premium";
import { openPaddleCheckout } from "@/lib/billing/paddle-client";
import { getPremiumCopy, premiumPrice } from "@/lib/premium/copy";

// Survives the Google sign-in redirect so checkout continues where the student left off.
const checkoutIntentKey = "learnerkits-premium-checkout";
// When the dialog opens by itself on a simulation, "Maybe later" unlocks after this many visible seconds.
const waitSeconds = 30;

/** The single Premium dialog. Other components open it with openPremium(reason). */
export function PremiumHost({ locale }: { locale: string }) {
  const copy = getPremiumCopy(locale);
  const auth = useAuth();
  const premium = usePremium();
  const dialog = useRef<HTMLDialogElement>(null);
  const premiumRef = useRef(premium);
  premiumRef.current = premium;
  const [reason, setReason] = useState<PremiumReason>("menu");
  const [mode, setMode] = useState<"offer" | "welcome">("offer");
  const [welcome, setWelcome] = useState<"pending" | "done" | "delayed">("pending");
  const [awaitingPayment, setAwaitingPayment] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [waitLeft, setWaitLeft] = useState(0);
  const [testMode, setTestMode] = useState(false);

  const show = useCallback(() => {
    const element = dialog.current;
    if (element && !element.open) { element.showModal(); setIsOpen(true); }
    void getBillingConfig().then((config) => setTestMode(config?.mode === "sandbox"));
  }, []);
  const close = useCallback(() => { dialog.current?.close(); }, []);

  useEffect(() => {
    if (!premiumEnabled) return;
    const onOpen = (event: Event) => {
      if (premiumRef.current === "premium") return;
      const next = (event as CustomEvent<{ reason?: PremiumReason }>).detail?.reason ?? "menu";
      setReason(next);
      setMode("offer");
      setError("");
      // Only the automatic reminder makes the student wait; opening it themselves never does.
      setWaitLeft(next === "timer" ? waitSeconds : 0);
      show();
    };
    window.addEventListener(premiumEvent, onOpen);
    return () => window.removeEventListener(premiumEvent, onOpen);
  }, [show]);

  const startCheckout = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const { ok, status, data } = await postWithSession<{ transactionId?: string; successUrl?: string; clientToken?: string; sandbox?: boolean }>("/api/billing/checkout", { returnPath: window.location.pathname });
      if (ok && data.transactionId && data.successUrl && data.clientToken) {
        // Paddle's overlay is an ordinary page element, so our modal (top layer) must close first.
        await openPaddleCheckout({ transactionId: data.transactionId, successUrl: data.successUrl, locale, clientToken: data.clientToken, sandbox: data.sandbox === true });
        setBusy(false);
        dialog.current?.close();
        return;
      }
      if (status === 409 && auth.session) { await refreshPremium(auth.session.user.id); dialog.current?.close(); }
      setError(data.error || copy.checkoutError);
    } catch { setError(copy.checkoutError); }
    setBusy(false);
  }, [auth.session, copy.checkoutError, locale]);

  const subscribe = async () => {
    if (auth.status === "signedIn") return startCheckout();
    setBusy(true);
    try { sessionStorage.setItem(checkoutIntentKey, "1"); } catch { /* continue without resuming */ }
    try { await signInWithGoogle(); } catch { setBusy(false); setError(copy.checkoutError); }
  };

  // Back from Google sign-in after choosing to subscribe: continue to checkout.
  useEffect(() => {
    if (!premiumEnabled || auth.status !== "signedIn" || premium === "unknown") return;
    let intent: string | null = null;
    try { intent = sessionStorage.getItem(checkoutIntentKey); sessionStorage.removeItem(checkoutIntentKey); } catch { /* ignore */ }
    if (!intent || premium === "premium") return;
    setReason("menu");
    setWaitLeft(0);
    setMode("offer");
    show();
    void startCheckout();
  }, [auth.status, premium, show, startCheckout]);

  // Paddle links (default payment link, emails) add ?_ptxn=txn_… to a page on this site: open that checkout.
  useEffect(() => {
    if (!premiumEnabled) return;
    const url = new URL(window.location.href);
    const transactionId = url.searchParams.get("_ptxn");
    if (!transactionId || !/^txn_[a-z0-9]+$/i.test(transactionId)) return;
    url.searchParams.delete("_ptxn");
    window.history.replaceState(window.history.state, "", url.toString());
    const successUrl = new URL(url);
    successUrl.searchParams.set("premium", "welcome");
    getBillingConfig().then((config) => {
      if (!config?.clientToken) throw new Error("Paddle is not configured");
      return openPaddleCheckout({ transactionId, successUrl: successUrl.toString(), locale, clientToken: config.clientToken, sandbox: config.mode === "sandbox" });
    }).catch(() => { setReason("menu"); setWaitLeft(0); setMode("offer"); setError(copy.checkoutError); show(); });
  }, [copy.checkoutError, locale, show]);

  // Back from Paddle checkout (?premium=welcome): wait for the webhook to record the subscription.
  useEffect(() => {
    if (!premiumEnabled) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("premium") !== "welcome") return;
    url.searchParams.delete("premium");
    window.history.replaceState(window.history.state, "", url.toString());
    setMode("welcome");
    setWelcome("pending");
    setAwaitingPayment(true);
    show();
  }, [show]);

  const userId = auth.status === "signedIn" ? auth.session?.user.id : undefined;
  useEffect(() => {
    if (!awaitingPayment) return;
    if (auth.status === "signedOut") { setWelcome("delayed"); setAwaitingPayment(false); return; }
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      for (let attempt = 0; attempt < 15 && !cancelled; attempt++) {
        if (await refreshPremium(userId)) { if (!cancelled) { setWelcome("done"); setAwaitingPayment(false); } return; }
        await new Promise((resolve) => setTimeout(resolve, 2_000));
      }
      if (!cancelled) { setWelcome("delayed"); setAwaitingPayment(false); }
    })();
    return () => { cancelled = true; };
  }, [awaitingPayment, auth.status, userId]);

  // Count down only while the dialog is open and the page is visible.
  const counting = isOpen && mode === "offer" && waitLeft > 0;
  useEffect(() => {
    if (!counting) return;
    let last = performance.now();
    const timer = window.setInterval(() => {
      const now = performance.now();
      const elapsed = document.visibilityState === "visible" ? (now - last) / 1000 : 0;
      last = now;
      setWaitLeft((left) => Math.max(0, left - elapsed));
    }, 100);
    return () => window.clearInterval(timer);
  }, [counting]);

  if (!premiumEnabled) return null;
  const locked = mode === "offer" && waitLeft > 0;
  const intro = reason === "timer" ? copy.introTimer : reason === "tutor" ? copy.introTutor : copy.introMenu;

  // No close (×) button: the dialog is left with "Maybe later" (or "Close" after checkout). While the
  // reminder's wait is running, Escape and clicks outside are ignored too.
  return <dialog ref={dialog} className="premiumDialog" aria-labelledby="premium-title"
    onClose={() => { setBusy(false); setIsOpen(false); setWaitLeft(0); }}
    onCancel={(event) => { if (locked || busy) event.preventDefault(); }}
    onClick={(event) => { if (event.target === dialog.current && !busy && !locked) close(); }}>
    <div className="premiumDialogBody">
      {mode === "welcome" ? <>
        <h2 id="premium-title">{welcome === "done" ? copy.welcomeTitle : copy.title}</h2>
        <p role="status">{welcome === "done" ? copy.welcomeBody : welcome === "pending" ? copy.welcomePending : copy.welcomeDelayed}</p>
        <div className="premiumActions"><button type="button" className="button primary" onClick={close}>{copy.close}</button></div>
      </> : <>
        <p className="eyebrow">{copy.launchOffer}</p>
        <h2 id="premium-title">{copy.title}</h2>
        <p className="premiumIntro">{intro}</p>
        <p className="premiumPrice">
          <s><span className="srOnly">{copy.regularLabel} </span>{premiumPrice.regular}</s>
          <strong>{premiumPrice.current}</strong><span>{copy.perMonth}</span>
        </p>
        <p className="premiumDiscountTerms">{copy.discountTerms}</p>
        <ul className="premiumBenefits">{copy.benefits.map((benefit) => <li key={benefit}>{benefit}</li>)}</ul>
        <p className="premiumFree">{copy.freeNote}</p>
        {testMode && <p className="premiumTestMode">{copy.testMode}</p>}
        {error && <p role="alert" className="premiumError">{error}</p>}
        <div className="premiumActions">
          <button type="button" className="button primary" onClick={subscribe} disabled={busy}>
            {busy ? copy.working : auth.status === "signedIn" ? copy.subscribe : copy.signInToSubscribe}
          </button>
          <button type="button" className="button" onClick={close} disabled={busy || locked}>
            {locked ? copy.laterIn(Math.ceil(waitLeft)) : copy.later}
          </button>
        </div>
        {reason === "timer" && <div className="premiumWait" role="progressbar" aria-label={copy.waitLabel}
          aria-valuemin={0} aria-valuemax={waitSeconds} aria-valuenow={Math.round(waitSeconds - waitLeft)}>
          <span style={{ transform: `scaleX(${1 - waitLeft / waitSeconds})` }}/>
        </div>}
        <p className="premiumFine">{copy.parentNote} {copy.finePrint} <Link href={`/${locale}/terms`}>{copy.page.termsLink}</Link> · <Link href={`/${locale}/refunds`}>{copy.page.refundLink}</Link> · <Link href={`/${locale}/privacy`}>Privacy</Link></p>
      </>}
    </div>
  </dialog>;
}
