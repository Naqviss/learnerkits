"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import { openPremium, premiumEnabled, usePremium } from "@/lib/billing/premium";
import styles from "./examPrep.module.css";

// Soft lock: Premium subscribers see the children; everyone else sees an unlock card.
export function PremiumGate({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  const status = usePremium();
  if (status === "premium") return <>{children}</>;
  return <section className={styles.gate} aria-label="Premium content">
    <div className={styles.gateIcon} aria-hidden="true">✦</div>
    <span className="eyebrow">LearnerKits Premium</span>
    <h2>{title}</h2>
    <p>{status === "unknown" ? "Checking your account…" : description}</p>
    <div className={styles.gateActions}>
      {premiumEnabled && <button type="button" className="button primary" onClick={() => openPremium("menu")}>Unlock with Premium</button>}
      <Link className={premiumEnabled ? "button" : "button primary"} href="/en/premium">See what Premium includes →</Link>
    </div>
  </section>;
}
