import { paddleWebhook } from "@/lib/billing/paddle";
import { billingEnv } from "../env";

export async function POST(request: Request) {
  return paddleWebhook(request, billingEnv());
}
