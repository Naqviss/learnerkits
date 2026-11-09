import { useSyncExternalStore } from "react";
import type { Session } from "@supabase/supabase-js";
import { authEnabled, authStorageKey, getAuthClient, hasStoredAuthState } from "./client";

// One shared sign-in state for every client component (header button, Premium dialog, AI tutor).
export type AuthState = { status: "loading" | "signedOut" | "signedIn"; session: Session | null; failed: boolean };

const serverState: AuthState = { status: "loading", session: null, failed: false };
let state = serverState;
const listeners = new Set<() => void>();
let started = false;
let connecting: Promise<void> | undefined;

function update(next: Partial<AuthState>) {
  state = { ...state, ...next };
  for (const listener of listeners) listener();
}

// Parameters Supabase adds when it sends the browser back from Google.
const oauthParams = ["code", "sb_flow_id", "error", "error_code", "error_description"];

/** Removes leftover OAuth parameters from the address bar. Returns true if any were present. */
function clearOAuthParams() {
  const url = new URL(window.location.href);
  const hash = new URLSearchParams(url.hash.slice(1));
  if (!oauthParams.some((name) => url.searchParams.has(name) || hash.has(name))) return false;
  for (const name of oauthParams) url.searchParams.delete(name);
  if (oauthParams.some((name) => hash.has(name))) url.hash = "";
  window.history.replaceState(window.history.state, "", url.toString());
  return true;
}

function connect() {
  connecting ??= getAuthClient().then((client) => {
    client.auth.onAuthStateChange((event, session) => {
      update({ status: session ? "signedIn" : "signedOut", session });
      // A cancelled or failed Google sign-in returns with error (or unusable code) parameters.
      if (event === "INITIAL_SESSION" && !session && clearOAuthParams()) update({ failed: true });
    });
  }).catch(() => {
    connecting = undefined;
    update({ status: "signedOut", session: null });
  });
  return connecting;
}

function start() {
  if (started || typeof window === "undefined") return;
  started = true;
  if (!authEnabled) { update({ status: "signedOut" }); return; }
  // Only download supabase-js when this browser has a session or a sign-in in progress.
  if (hasStoredAuthState()) void connect();
  else update({ status: "signedOut" });
  // Signing in or out in another tab.
  window.addEventListener("storage", (event) => { if (event.key?.startsWith(authStorageKey)) void connect(); });
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  start();
  return () => { listeners.delete(listener); };
}

export function useAuth(): AuthState {
  return useSyncExternalStore(subscribe, () => state, () => serverState);
}

export function clearAuthFailure() { update({ failed: false }); }

/** Sends the browser to Google. Resolves only if the redirect could not start. */
export async function signInWithGoogle() {
  update({ failed: false });
  try {
    const client = await getAuthClient();
    const returnTo = new URL(window.location.href);
    for (const name of oauthParams) returnTo.searchParams.delete(name);
    returnTo.hash = "";
    const { error } = await client.auth.signInWithOAuth({ provider: "google", options: { redirectTo: returnTo.toString() } });
    if (error) throw error;
  } catch {
    update({ failed: true });
    throw new Error("sign-in failed");
  }
}

export async function signOut() {
  const client = await getAuthClient();
  const { error } = await client.auth.signOut();
  // Offline or the server rejected the request: still forget the session on this device.
  if (error) await client.auth.signOut({ scope: "local" });
  update({ status: "signedOut", session: null });
}

/** A current access token for calling our own /api routes, refreshed by supabase-js if needed. */
export async function getAccessToken(): Promise<string | null> {
  if (state.status !== "signedIn") return null;
  const client = await getAuthClient();
  return (await client.auth.getSession()).data.session?.access_token ?? null;
}
