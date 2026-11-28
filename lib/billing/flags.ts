import { authEnabled } from "@/lib/auth/client";

/** Premium UI (30-second prompt, AI tutor, account-menu links) only appears once billing is configured. Server-safe: no React imports. */
export const premiumEnabled = authEnabled && process.env.NEXT_PUBLIC_PREMIUM_ENABLED === "true";
