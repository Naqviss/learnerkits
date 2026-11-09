// Chooses Paddle sandbox (test cards) or live (real payments) credentials from one switch:
//   PADDLE_TEST_MODE=true  → PADDLE_SANDBOX_* values and Paddle's sandbox API
//   PADDLE_TEST_MODE=false → PADDLE_LIVE_* values and Paddle's live API
// Used by the Worker, the Next.js dev routes, and scripts/deploy.mjs (Node runs this file directly,
// so it must stay dependency-free and use only erasable TypeScript syntax).

export type PaddleMode = "sandbox" | "live";

export type PaddleEnv = {
  PADDLE_TEST_MODE?: string;
  PADDLE_SANDBOX_API_KEY?: string;
  PADDLE_SANDBOX_CLIENT_TOKEN?: string;
  PADDLE_SANDBOX_PRICE_ID?: string;
  PADDLE_SANDBOX_DISCOUNT_ID?: string;
  PADDLE_SANDBOX_WEBHOOK_SECRET?: string;
  PADDLE_LIVE_API_KEY?: string;
  PADDLE_LIVE_CLIENT_TOKEN?: string;
  PADDLE_LIVE_PRICE_ID?: string;
  PADDLE_LIVE_DISCOUNT_ID?: string;
  PADDLE_LIVE_WEBHOOK_SECRET?: string;
};

export type PaddleSettings = {
  mode: PaddleMode;
  apiBase: string;
  apiKey?: string;
  clientToken?: string;
  priceId?: string;
  discountId?: string;
  webhookSecret?: string;
  /** Human-readable configuration problems; values with the wrong prefix are dropped, never used. */
  problems: string[];
};

export const paddleSecretNames = [
  "API_KEY", "CLIENT_TOKEN", "PRICE_ID", "DISCOUNT_ID", "WEBHOOK_SECRET",
].flatMap((suffix) => [`PADDLE_SANDBOX_${suffix}`, `PADDLE_LIVE_${suffix}`]);

export function resolvePaddle(env: PaddleEnv): PaddleSettings {
  const flag = env.PADDLE_TEST_MODE?.trim().toLowerCase();
  const mode: PaddleMode = flag === "true" ? "sandbox" : "live";
  const problems: string[] = [];
  if (flag !== "true" && flag !== "false") problems.push(`PADDLE_TEST_MODE must be "true" (sandbox) or "false" (live); using live`);
  const values = env as Record<string, string | undefined>;
  const prefix = mode === "sandbox" ? "PADDLE_SANDBOX_" : "PADDLE_LIVE_";
  const read = (suffix: string, expected: string, required: boolean) => {
    const name = prefix + suffix;
    const value = values[name]?.trim();
    if (!value) {
      if (required) problems.push(`${name} is not set`);
      return undefined;
    }
    if (!value.startsWith(expected)) {
      problems.push(`${name} should start with "${expected}" in ${mode} mode`);
      return undefined;
    }
    return value;
  };
  return {
    mode,
    apiBase: mode === "sandbox" ? "https://sandbox-api.paddle.com" : "https://api.paddle.com",
    apiKey: read("API_KEY", mode === "sandbox" ? "pdl_sdbx_apikey_" : "pdl_live_apikey_", true),
    clientToken: read("CLIENT_TOKEN", mode === "sandbox" ? "test_" : "live_", true),
    priceId: read("PRICE_ID", "pri_", true),
    discountId: read("DISCOUNT_ID", "dsc_", false),
    webhookSecret: read("WEBHOOK_SECRET", "pdl_ntfset_", true),
    problems,
  };
}
