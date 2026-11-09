import { createCheckout } from "@/lib/billing/paddle";
import { billingEnv } from "../env";

export async function POST(request: Request) {
  return createCheckout(request, billingEnv());
}
