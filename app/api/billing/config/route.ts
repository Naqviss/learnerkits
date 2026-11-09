import { billingConfig } from "@/lib/billing/paddle";
import { billingEnv } from "../env";

export async function POST(request: Request) {
  return billingConfig(request, billingEnv());
}
