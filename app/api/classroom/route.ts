import { handleClassroom } from "@/lib/classroom/api";

// Next.js development runtime. The static deployment uses the same handler in worker/index.ts.
export async function POST(request: Request) {
  return handleClassroom(request, {
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    AI_BASE_URL: process.env.AI_BASE_URL,
    AI_API_KEY: process.env.AI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
  });
}
