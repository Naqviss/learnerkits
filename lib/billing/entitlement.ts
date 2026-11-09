// Shared by the browser (to show Premium) and the server (to gate the AI tutor).
// Paddle keeps a subscription "active" until the end of a period the customer already paid for,
// even after they choose to cancel, and "past_due" while it retries a failed renewal payment.
const entitledStatuses = new Set(["active", "trialing", "past_due"]);

export function isEntitled(row: { status: string }) {
  return entitledStatuses.has(row.status);
}
