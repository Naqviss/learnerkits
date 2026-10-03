import { submitContact } from "@/lib/contact/submit";

// Next.js development/server runtime. The static deployment uses the same handler in worker/index.ts.
export async function POST(request: Request) {
  return submitContact(request, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}
