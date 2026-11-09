import type { BillingEnv } from "@/lib/billing/paddle";
import { paddleSecretNames } from "@/lib/billing/paddle-config";

// Next.js development runtime. The static deployment runs the same handlers in worker/index.ts.
export const billingEnv = (): BillingEnv => ({
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  PADDLE_TEST_MODE: process.env.PADDLE_TEST_MODE,
  ...Object.fromEntries(paddleSecretNames.map((name) => [name, process.env[name]])),
});
