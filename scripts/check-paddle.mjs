// `npm run check:paddle`: verifies the Paddle values in .env.local against Paddle itself for the
// mode selected by PADDLE_TEST_MODE (or pass "sandbox" / "live" to check the other set).
// Read-only: it only lists/fetches, never creates or changes anything in Paddle.
import { existsSync } from "node:fs";
import { resolvePaddle } from "../lib/billing/paddle-config.ts";
import { premiumPrice } from "../lib/premium/copy.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const requested = process.argv[2];
const env = { ...process.env };
if (requested === "sandbox" || requested === "live") env.PADDLE_TEST_MODE = requested === "sandbox" ? "true" : "false";
const paddle = resolvePaddle(env);
const webhookUrl = `${(env.NEXT_PUBLIC_SITE_URL && !/localhost/.test(env.NEXT_PUBLIC_SITE_URL) ? env.NEXT_PUBLIC_SITE_URL : "https://www.learnerkits.com").replace(/\/$/, "")}/api/billing/webhook`;
let failures = 0;
const ok = (message) => console.log(`  ✓ ${message}`);
const fail = (message) => { failures++; console.log(`  ✗ ${message}`); };
const warn = (message) => console.log(`  ! ${message}`);

console.log(`\nPaddle ${paddle.mode.toUpperCase()} configuration (${paddle.mode === "sandbox" ? "test cards" : "real payments"})`);
for (const problem of paddle.problems) fail(problem);

const api = async (path) => {
  const response = await fetch(`${paddle.apiBase}${path}`, { headers: { Authorization: `Bearer ${paddle.apiKey}`, "Paddle-Version": "1" } });
  const body = await response.json().catch(() => ({}));
  return response.ok ? body.data : Promise.reject(new Error(body.error?.detail || `HTTP ${response.status}`));
};

if (paddle.apiKey) {
  if (paddle.priceId) {
    try {
      const price = await api(`/prices/${paddle.priceId}`);
      const amount = `${(Number(price.unit_price.amount) / 100).toFixed(2)} ${price.unit_price.currency_code}`;
      const cycle = price.billing_cycle ? `every ${price.billing_cycle.frequency} ${price.billing_cycle.interval}` : "one-time";
      (price.status === "active" ? ok : fail)(`price ${paddle.priceId}: ${amount} ${cycle} (${price.status})`);
      if (price.trial_period) warn(`price has a trial (${price.trial_period.frequency} ${price.trial_period.interval}); the site doesn't advertise one`);
    } catch (error) { fail(`price ${paddle.priceId}: ${error.message}`); }
  }
  if (paddle.discountId) {
    try {
      const discount = await api(`/discounts/${paddle.discountId}`);
      const length = discount.recur ? (discount.maximum_recurring_intervals ? `${discount.maximum_recurring_intervals} billing periods` : "forever") : "first payment only";
      (discount.status === "active" ? ok : fail)(`discount ${paddle.discountId}: ${discount.amount}${discount.type === "percentage" ? "%" : ""} off, ${length} (${discount.status})`);
      if (discount.restrict_to?.length && paddle.priceId && !discount.restrict_to.includes(paddle.priceId)) fail("discount is restricted to other prices/products than PADDLE_*_PRICE_ID");
      // The site advertises the discount for premiumPrice.discountMonths payments (lib/premium/copy.ts).
      if (!discount.recur || discount.maximum_recurring_intervals !== premiumPrice.discountMonths) {
        fail(`the site says the discount lasts ${premiumPrice.discountMonths} months, but in Paddle it lasts ${length}; edit the discount (Recurring on, ${premiumPrice.discountMonths} billing periods)`);
      }
    } catch (error) { fail(`discount ${paddle.discountId}: ${error.message}`); }
  }
  try {
    const destinations = await api("/notification-settings");
    const destination = destinations.find((item) => item.destination === webhookUrl);
    if (!destination) fail(`no notification destination for ${webhookUrl}`);
    else {
      const events = new Set(destination.subscribed_events.map((event) => event.name));
      const missing = ["subscription.created", "subscription.updated", "subscription.canceled", "transaction.completed"].filter((name) => !events.has(name));
      (destination.active ? ok : fail)(`webhook ${webhookUrl} (${destination.active ? "active" : "inactive"})`);
      if (destination.traffic_source === "simulation") fail("webhook usage type is Simulation only; set it to Platform so real events arrive");
      if (missing.length) fail(`webhook is missing events: ${missing.join(", ")}`);
      if (paddle.webhookSecret && !paddle.webhookSecret.startsWith(`pdl_${destination.id}_`)) warn("webhook secret doesn't look like this destination's secret key");
    }
  } catch (error) { warn(`could not read webhooks (${error.message}); check Events → Notifications manually`); }
}
warn("the API key also needs Transactions: write and Customer portal sessions: write (not checkable without creating data)");

console.log(failures ? `\n${failures} problem(s) found.\n` : "\nAll checks passed.\n");
process.exit(failures ? 1 : 0);
