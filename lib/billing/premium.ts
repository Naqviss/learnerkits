import { useEffect, useSyncExternalStore } from "react";
import { authEnabled, getAuthClient } from "@/lib/auth/client";
import { getAccessToken, useAuth } from "@/lib/auth/session";
import { isEntitled } from "./entitlement";

/** Premium UI (30-second prompt, AI tutor, account-menu links) only appears once billing is configured. */
export const premiumEnabled = authEnabled && process.env.NEXT_PUBLIC_PREMIUM_ENABLED === "true";

export type BillingConfig = { mode: "sandbox" | "live"; clientToken: string | null; ready: boolean };
let billingConfig: Promise<BillingConfig | null> | undefined;

/** Active Paddle environment (sandbox = test cards) from the server; fetched once per page. */
export function getBillingConfig(): Promise<BillingConfig | null> {
  billingConfig ??= fetch("/api/billing/config", { method: "POST", cache: "no-store" })
    .then((response) => response.ok ? response.json() as Promise<BillingConfig> : null)
    .catch(() => null)
    .then((config) => { if (!config) billingConfig = undefined; return config; });
  return billingConfig;
}

export type PremiumStatus = "unknown" | "free" | "premium";

// Cached per user so the header, dialog, tutor and ad loader share one lookup.
let current: { userId: string | null; status: PremiumStatus } = { userId: null, status: "unknown" };
const serverCurrent = current;
const listeners = new Set<() => void>();
let inflight: string | null = null;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Reads the signed-in user's subscription rows (row-level security limits them to their own). */
export async function refreshPremium(userId: string): Promise<boolean> {
  inflight = userId;
  let premium = false;
  try {
    // Only subscriptions from the active Paddle environment count (sandbox purchases never unlock live).
    const config = await getBillingConfig();
    if (!config) throw new Error("billing config unavailable");
    const client = await getAuthClient();
    const { data, error } = await client.from("subscriptions").select("status").eq("user_id", userId).eq("environment", config.mode);
    if (error) throw error;
    premium = (data ?? []).some((row) => isEntitled(row));
  } catch { /* table missing or offline: treat as free */ }
  if (inflight === userId) {
    current = { userId, status: premium ? "premium" : "free" };
    for (const listener of listeners) listener();
  }
  return premium;
}

export function usePremium(): PremiumStatus {
  const auth = useAuth();
  const cached = useSyncExternalStore(subscribe, () => current, () => serverCurrent);
  const userId = auth.session?.user.id ?? null;
  useEffect(() => {
    if (auth.status === "signedIn" && userId && current.userId !== userId && inflight !== userId) void refreshPremium(userId);
  }, [auth.status, userId]);
  if (auth.status === "loading") return "unknown";
  if (auth.status === "signedOut") return "free";
  return cached.userId === userId ? cached.status : "unknown";
}

// Any component can ask the layout's Premium dialog to open.
export const premiumEvent = "learnerkits:premium";
export type PremiumReason = "timer" | "tutor" | "menu";
export function openPremium(reason: PremiumReason) {
  window.dispatchEvent(new CustomEvent(premiumEvent, { detail: { reason } }));
}

/** POSTs to one of our authenticated API routes and returns the parsed JSON. */
export async function postWithSession<T extends Record<string, unknown>>(path: string, body: unknown): Promise<{ ok: boolean; status: number; data: T & { error?: string } }> {
  const token = await getAccessToken();
  if (!token) return { ok: false, status: 401, data: {} as T & { error?: string } };
  const response = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({})) as T & { error?: string };
  return { ok: response.ok, status: response.status, data };
}
