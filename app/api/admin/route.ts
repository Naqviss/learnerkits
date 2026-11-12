import { handleAdmin } from "@/lib/admin/api";

// Next.js development runtime. The static deployment uses the same handler in worker/index.ts.
export async function POST(request: Request) {
  return handleAdmin(request, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    PADDLE_TEST_MODE: process.env.PADDLE_TEST_MODE,
    PADDLE_SANDBOX_API_KEY: process.env.PADDLE_SANDBOX_API_KEY,
    PADDLE_SANDBOX_CLIENT_TOKEN: process.env.PADDLE_SANDBOX_CLIENT_TOKEN,
    PADDLE_SANDBOX_PRICE_ID: process.env.PADDLE_SANDBOX_PRICE_ID,
    PADDLE_SANDBOX_DISCOUNT_ID: process.env.PADDLE_SANDBOX_DISCOUNT_ID,
    PADDLE_SANDBOX_WEBHOOK_SECRET: process.env.PADDLE_SANDBOX_WEBHOOK_SECRET,
    PADDLE_LIVE_API_KEY: process.env.PADDLE_LIVE_API_KEY,
    PADDLE_LIVE_CLIENT_TOKEN: process.env.PADDLE_LIVE_CLIENT_TOKEN,
    PADDLE_LIVE_PRICE_ID: process.env.PADDLE_LIVE_PRICE_ID,
    PADDLE_LIVE_DISCOUNT_ID: process.env.PADDLE_LIVE_DISCOUNT_ID,
    PADDLE_LIVE_WEBHOOK_SECRET: process.env.PADDLE_LIVE_WEBHOOK_SECRET,
  });
}
