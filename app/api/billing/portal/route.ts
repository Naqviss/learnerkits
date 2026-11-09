import { customerPortal } from "@/lib/billing/paddle";
import { billingEnv } from "../env";

export async function POST(request: Request) {
  return customerPortal(request, billingEnv());
}
