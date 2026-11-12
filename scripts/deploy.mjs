// `npm run deploy`: checks the Paddle configuration, builds the static site, and deploys the Worker
// with the server secrets from .env.local and PADDLE_TEST_MODE as a plain variable.
// .env.local is the single place to configure payments:
//   PADDLE_TEST_MODE=true  → sandbox (test cards), PADDLE_SANDBOX_* values
//   PADDLE_TEST_MODE=false → live (real payments), PADDLE_LIVE_* values
// Values already set in the shell win over .env.local (e.g. `PADDLE_TEST_MODE=false npm run deploy`).
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { paddleSecretNames, resolvePaddle } from "../lib/billing/paddle-config.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const env = process.env;

const run = (command, args) => {
  const result = spawnSync(command, args, { stdio: "inherit", env });
  if (result.status !== 0) process.exit(result.status ?? 1);
};

const flag = env.PADDLE_TEST_MODE?.trim().toLowerCase();
const premium = env.NEXT_PUBLIC_PREMIUM_ENABLED === "true";
const paddle = resolvePaddle(env);

console.log("\n──────── Deploy check ────────");
console.log(`Premium UI:   ${premium ? "ON  (students see Premium)" : "off (NEXT_PUBLIC_PREMIUM_ENABLED is not true)"}`);
console.log(`Paddle mode:  ${paddle.mode === "sandbox" ? "SANDBOX — test cards only, no real money" : "LIVE — real payments"}  (PADDLE_TEST_MODE=${env.PADDLE_TEST_MODE ?? "unset"})`);
for (const problem of paddle.problems) console.log(`  ✗ ${problem}`);
if (!paddle.problems.length) console.log("  ✓ all required Paddle values are set for this mode");

if (flag !== "true" && flag !== "false") {
  console.error('\nSet PADDLE_TEST_MODE=true (sandbox) or PADDLE_TEST_MODE=false (live) in .env.local before deploying.\n');
  process.exit(1);
}
if (premium && paddle.problems.length) {
  console.error("\nPremium is ON but the Paddle configuration above is incomplete; fix .env.local or set NEXT_PUBLIC_PREMIUM_ENABLED=false.\n");
  process.exit(1);
}
if (!env.SUPABASE_URL || !env.SUPABASE_SECRET_KEY) console.warn("  ! SUPABASE_URL / SUPABASE_SECRET_KEY not in .env.local; the Worker keeps its existing values.");
console.log("──────────────────────────────\n");

run("npm", ["run", "build"]);

// Upload server-only secrets with this version. Both Paddle sets go up, so switching mode later only
// needs PADDLE_TEST_MODE. Omitted names keep their existing Worker values.
const secretNames = ["SUPABASE_URL", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY", "ADMIN_USERNAME", "ADMIN_PASSWORD", "ADMIN_SESSION_SECRET", ...paddleSecretNames];
const secrets = Object.fromEntries(secretNames.filter((name) => env[name]?.trim()).map((name) => [name, env[name].trim()]));
const dir = mkdtempSync(join(tmpdir(), "learnerkits-deploy-"));
const secretsFile = join(dir, "secrets.json");
try {
  writeFileSync(secretsFile, JSON.stringify(secrets), { mode: 0o600 });
  run("npx", ["wrangler", "deploy", "--secrets-file", secretsFile, "--var", `PADDLE_TEST_MODE:${flag}`]);
} finally {
  rmSync(dir, { recursive: true, force: true });
}
console.log(`\nDeployed with Paddle in ${paddle.mode.toUpperCase()} mode.`);
