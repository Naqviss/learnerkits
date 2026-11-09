import type { SupabaseClient } from "@supabase/supabase-js";

// Google sign-in runs entirely in the browser through Supabase Auth, because production is a
// static export with no Next.js server. These two values are public by design (the publishable
// key only grants what row-level security allows). Never put a secret/service-role key here.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const authEnabled = Boolean(supabaseUrl && supabasePublishableKey);

// Fixed key so we can tell, without loading supabase-js, whether this browser has a session or
// an in-flight sign-in (the PKCE code verifier is stored under keys with this prefix).
export const authStorageKey = "learnerkits-auth";

let client: Promise<SupabaseClient> | undefined;

/** Loads supabase-js on first use so visitors who never sign in don't download it. */
export function getAuthClient(): Promise<SupabaseClient> {
  if (!supabaseUrl || !supabasePublishableKey) return Promise.reject(new Error("Google sign-in is not configured."));
  client ??= import("@supabase/supabase-js").then(({ createClient }) => createClient(supabaseUrl, supabasePublishableKey, {
    auth: { flowType: "pkce", storageKey: authStorageKey, persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  }));
  return client;
}

export function hasStoredAuthState(): boolean {
  try {
    for (let i = 0; i < localStorage.length; i++) if (localStorage.key(i)?.startsWith(authStorageKey)) return true;
  } catch { /* storage blocked: treat as signed out */ }
  return false;
}
